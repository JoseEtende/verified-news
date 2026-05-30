from crewai import Task
from agents import (
    get_discovery_agent, get_extraction_agent,
    get_cross_reference_agent, get_verdict_agent
)


def make_tasks(claim_text: str):
    discovery_agent = get_discovery_agent()
    extraction_agent = get_extraction_agent()
    cross_reference_agent = get_cross_reference_agent()
    verdict_agent = get_verdict_agent()

    discovery_task = Task(
        description=f"""
Claim to investigate: "{claim_text}"

Steps:
1. Run 3-5 distinct SERP queries using the serp_search tool. Vary queries:
   - Direct quote fragment
   - "{claim_text[:60]}..." + "fact check"
   - Entity names + recent news
   - Official source names if identifiable
2. For X/Twitter or social media URLs in results, use scraping_browser tool.
3. Return a JSON array of 8-12 source objects.

Each source object must have:
  url, title, domain, source_type (news/official/fact_check/social/academic/regulatory/competitor),
  snippet (100 chars), relevance_score (0-1), bright_data_tool_used
""",
        expected_output='JSON array of source objects',
        agent=discovery_agent,
    )

    extraction_task = Task(
        description="""
For each source URL from the Discovery Agent:
1. Try web_scraper tool first. If it returns an error, try web_unlocker. If still blocked, skip.
2. Extract: title, author, publication_date, text (max 3000 chars), credibility_tier.
   Credibility tiers: high=(Reuters,AP,BBC,NPR,*.gov,SEC.gov,nature.com,pubmed),
   medium=(established regional/national outlets), low=(blogs,forums,opinion sites),
   unverified=(anything else)
3. Check for these flags: missing_context (true if claim is date-sensitive with no date),
   misleading_framing (true if headline contradicts body text)
4. Return enriched source objects as JSON array.
""",
        expected_output='JSON array of enriched source objects with credibility and flags',
        agent=extraction_agent,
        context=[discovery_task],
    )

    cross_reference_task = Task(
        description=f"""
Using the extracted sources and original claim: "{claim_text}"

1. Call google_factcheck tool with the claim text.
2. If claim mentions data breach or leaked data: call breach_check with the relevant domain.
3. Search for "site:twitter.com community notes" + claim fragment via serp_search.
4. Count: fact_checks_found, contradictions_found, primary_sources_count,
   secondary_sources_count, community_notes_count.
5. List all contradictions with source URL and summary.
6. Return a JSON object (not array).
""",
        expected_output="""JSON object: {
  "fact_checks_found": int,
  "contradictions_found": int,
  "primary_sources_count": int,
  "secondary_sources_count": int,
  "community_notes_count": int,
  "breach_check_result": object_or_null,
  "fact_check_details": [{"claim": str, "verdict": str, "publisher": str, "url": str}],
  "contradiction_details": [{"claim": str, "source_url": str, "summary": str}],
  "missing_context_flags": [str],
  "misleading_framing_flags": [str]
}""",
        agent=cross_reference_agent,
        context=[extraction_task],
    )

    verdict_task = Task(
        description=f"""
Original claim: "{claim_text}"

Review all evidence from previous agents. Apply badge criteria strictly.
Calculate confidence_score using this formula:
  base = 0.5
  + min(high_credibility_source_count * 0.10, 0.30)
  + min(unique_domains_count * 0.05, 0.20)
  + min(fact_checks_found * 0.10, 0.20)
  - min(contradictions_found * 0.15, 0.30)
  clamp to [0.0, 1.0]

Return ONLY valid JSON. No text before or after. No markdown code blocks.
""",
        expected_output="""ONLY this JSON object, nothing else:
{
  "badge": "blue|green|yellow|orange|red|gray",
  "confidence_score": 0.00,
  "verdict_summary": "One or two sentences explaining the verdict.",
  "detailed_analysis": "3-5 sentences with inline source citations [Source: domain.com].",
  "primary_sources_count": 0,
  "secondary_sources_count": 0,
  "contradictions_found": 0,
  "fact_checks_found": 0,
  "model_used": "google/gemma-4-31b-it"
}""",
        agent=verdict_agent,
        context=[cross_reference_task],
    )

    return [discovery_task, extraction_task, cross_reference_task, verdict_task]
