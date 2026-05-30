import os
import json
import time
import logging
from crewai import Crew, Process
from supabase import create_client

from tasks import make_tasks
from badge_logic import calculate_confidence, determine_badge

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")


def get_db():
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def update_progress(db, claim_id: str, progress: str, status: str = "processing"):
    db.table("claims").update({
        "status": status,
        "agent_progress": progress,
    }).eq("id", claim_id).execute()


def run_verification_crew(claim_id: str, claim_text: str, track_context: str = "consumer"):
    db = get_db()
    start_time = time.time()

    try:
        tasks = make_tasks(claim_text)

        # Stage 1: Discovery
        update_progress(db, claim_id, "Discovery agent scanning the web...")
        discovery_crew = Crew(
            agents=[tasks[0].agent], tasks=[tasks[0]],
            process=Process.sequential, verbose=True
        )
        discovery_result = discovery_crew.kickoff(inputs={"claim_text": claim_text})
        db.table("agent_logs").insert({
            "claim_id": claim_id, "agent_name": "discovery_agent",
            "action": "source_discovery", "tool_used": "brightdata_serp",
            "status": "success",
        }).execute()

        # Stage 2: Extraction
        update_progress(db, claim_id, "Extraction agent reading sources...")
        extraction_crew = Crew(
            agents=[tasks[1].agent], tasks=[tasks[1]],
            process=Process.sequential, verbose=True
        )
        extraction_result = extraction_crew.kickoff(inputs={"claim_text": claim_text})
        db.table("agent_logs").insert({
            "claim_id": claim_id, "agent_name": "extraction_agent",
            "action": "content_extraction", "tool_used": "brightdata_web_scraper",
            "status": "success",
        }).execute()

        # Stage 3: Cross-reference
        update_progress(db, claim_id, "Cross-reference agent fact-checking...")
        xref_crew = Crew(
            agents=[tasks[2].agent], tasks=[tasks[2]],
            process=Process.sequential, verbose=True
        )
        xref_result = xref_crew.kickoff(inputs={"claim_text": claim_text})
        db.table("agent_logs").insert({
            "claim_id": claim_id, "agent_name": "cross_reference_agent",
            "action": "fact_checking", "tool_used": "google_factcheck_api",
            "status": "success",
        }).execute()

        # Stage 4: Verdict
        update_progress(db, claim_id, "Verdict agent synthesising result...")
        verdict_crew = Crew(
            agents=[tasks[3].agent], tasks=[tasks[3]],
            process=Process.sequential, verbose=True
        )
        verdict_raw = verdict_crew.kickoff(inputs={"claim_text": claim_text})

        # Parse verdict JSON
        verdict_text = str(verdict_raw).strip()
        if verdict_text.startswith("```"):
            verdict_text = verdict_text.split("```")[1]
            if verdict_text.startswith("json"):
                verdict_text = verdict_text[4:]
        verdict = json.loads(verdict_text)

        processing_time_ms = int((time.time() - start_time) * 1000)

        # Write verification to DB
        ver_resp = db.table("verifications").insert({
            "claim_id": claim_id,
            "badge": verdict["badge"],
            "confidence_score": verdict["confidence_score"],
            "verdict_summary": verdict["verdict_summary"],
            "detailed_analysis": verdict["detailed_analysis"],
            "primary_sources_count": verdict.get("primary_sources_count", 0),
            "secondary_sources_count": verdict.get("secondary_sources_count", 0),
            "contradictions_found": verdict.get("contradictions_found", 0),
            "fact_checks_found": verdict.get("fact_checks_found", 0),
            "processing_time_ms": processing_time_ms,
            "model_used": verdict.get("model_used", os.getenv("AIMLAPI_MODEL_ID")),
        }).execute()

        # Write sources (from discovery result)
        try:
            sources_raw = json.loads(str(discovery_result))
            if isinstance(sources_raw, list):
                ver_id = ver_resp.data[0]["id"]
                for src in sources_raw[:12]:
                    db.table("sources").insert({
                        "verification_id": ver_id,
                        "url": src.get("url", ""),
                        "title": src.get("title", ""),
                        "domain": src.get("domain", ""),
                        "source_type": src.get("source_type", "news"),
                        "credibility_tier": src.get("credibility_tier", "unverified"),
                        "extracted_snippet": src.get("snippet", "")[:500],
                        "relevance_score": src.get("relevance_score", 0.5),
                        "bright_data_tool_used": src.get("tool_used", "serp_api"),
                    }).execute()
        except Exception as src_err:
            logger.warning(f"Could not write sources: {src_err}")

        # Mark claim completed
        update_progress(db, claim_id, "Verification complete", status="completed")
        logger.info(f"Claim {claim_id} completed: badge={verdict['badge']}")

    except Exception as e:
        logger.error(f"Verification failed for {claim_id}: {e}", exc_info=True)
        db.table("claims").update({
            "status": "failed",
            "agent_progress": f"Verification failed: {str(e)[:200]}",
        }).eq("id", claim_id).execute()
