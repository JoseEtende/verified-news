import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '../.env.local' })

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DEMO_STORIES = [
  // Consumer stories
  {
    claim: { input_type: 'text', input_content: "NASA's Perseverance rover landed on Mars on February 18, 2021.", track_context: 'consumer', status: 'completed', agent_progress: 'Verification complete' },
    verification: { badge: 'blue', confidence_score: 0.97, verdict_summary: 'Verified. Multiple independent credible sources including NASA.gov, Reuters, and AP confirm this date.', detailed_analysis: 'NASA official website [nasa.gov] confirms the landing at 3:55 PM EST on February 18, 2021. Reuters and AP both covered the event live. Zero contradictions found. Two fact-checks confirm.', primary_sources_count: 3, secondary_sources_count: 7, contradictions_found: 0, fact_checks_found: 2, processing_time_ms: 47200, model_used: 'google/gemma-4-31b-it' },
    sources: [
      { url: 'https://nasa.gov', title: 'NASA Perseverance Landing', domain: 'nasa.gov', source_type: 'official', credibility_tier: 'high', relevance_score: 0.99, bright_data_tool_used: 'serp_api', extracted_snippet: 'Perseverance touched down at 3:55 p.m. EST on Feb. 18, 2021' },
      { url: 'https://reuters.com', title: 'NASA rover lands on Mars', domain: 'reuters.com', source_type: 'news', credibility_tier: 'high', relevance_score: 0.95, bright_data_tool_used: 'web_scraper_api', extracted_snippet: 'NASA confirmed the landing in Jezero Crater' },
    ]
  },
  {
    claim: { input_type: 'text', input_content: 'US unemployment is at 3.9% — the lowest in decades.', track_context: 'consumer', status: 'completed', agent_progress: 'Verification complete' },
    verification: { badge: 'yellow', confidence_score: 0.67, verdict_summary: 'Partially true. The 3.9% figure is real but from Q1 2024 — current data may differ and demographic nuance is missing.', detailed_analysis: 'BLS data [bls.gov] confirms 3.9% for January 2024. However no date was specified in the claim. Current figures require checking BLS.gov directly. Missing context: this rate excludes underemployed workers.', primary_sources_count: 1, secondary_sources_count: 3, contradictions_found: 1, fact_checks_found: 0, processing_time_ms: 38500, model_used: 'google/gemma-4-31b-it' },
    sources: []
  },
  {
    claim: { input_type: 'text', input_content: 'A new study shows drinking coffee every day causes cancer.', track_context: 'consumer', status: 'completed', agent_progress: 'Verification complete' },
    verification: { badge: 'orange', confidence_score: 0.31, verdict_summary: 'Misleading. The cited study shows correlation in a single cohort, contradicted by major peer-reviewed meta-analyses.', detailed_analysis: 'The claim misrepresents a 2023 blog post citing a small observational study. WHO and NCI [cancer.gov] both state moderate coffee consumption is not causally linked to cancer. Source lacks scientific credibility.', primary_sources_count: 0, secondary_sources_count: 4, contradictions_found: 3, fact_checks_found: 1, processing_time_ms: 52100, model_used: 'google/gemma-4-31b-it' },
    sources: []
  },
  {
    claim: { input_type: 'text', input_content: 'Elon Musk died in a helicopter crash this morning.', track_context: 'consumer', status: 'completed', agent_progress: 'Verification complete' },
    verification: { badge: 'red', confidence_score: 0.96, verdict_summary: 'False. No credible sources report this event. Musk posted on X 2 hours ago. This is a recurring false claim pattern.', detailed_analysis: 'Reuters, AP, and BBC report no such incident [reuters.com]. Musk\'s official X account posted actively this morning. Snopes fact-check flags this as a recurring hoax format. Zero primary sources support the claim.', primary_sources_count: 0, secondary_sources_count: 5, contradictions_found: 5, fact_checks_found: 2, processing_time_ms: 44800, model_used: 'google/gemma-4-31b-it' },
    sources: []
  },
  // Track 3 — Threat Monitor
  {
    claim: { input_type: 'url', input_content: 'Acme Corp has issued a voluntary recall of its Model X battery packs due to fire hazards — per Reddit r/technology.', track_context: 'track3_security', status: 'completed', agent_progress: 'Verification complete' },
    verification: { badge: 'red', confidence_score: 0.91, verdict_summary: 'False. No recall notice exists on CPSC.gov or Acme Corp\'s official newsroom. The Reddit post has no primary source.', detailed_analysis: 'CPSC recall database [cpsc.gov] shows no active recall for Acme Corp Model X. Acme Corp official newsroom [acmecorp.com/news] contains no recall announcement. The Reddit post links to no primary source and uses anonymous sourcing. Reuters and AP show no coverage.', primary_sources_count: 0, secondary_sources_count: 2, contradictions_found: 3, fact_checks_found: 0, processing_time_ms: 61200, model_used: 'google/gemma-4-31b-it' },
    sources: [
      { url: 'https://cpsc.gov', title: 'CPSC Recall Database', domain: 'cpsc.gov', source_type: 'regulatory', credibility_tier: 'high', relevance_score: 0.99, bright_data_tool_used: 'web_scraper_api', extracted_snippet: 'No recall found for Acme Corp Model X battery packs' },
    ]
  },
  {
    claim: { input_type: 'text', input_content: 'CEO stated in a leaked email that Q3 earnings will miss by 40%.', track_context: 'track3_security', status: 'completed', agent_progress: 'Verification complete' },
    verification: { badge: 'red', confidence_score: 0.88, verdict_summary: 'False. No matching SEC filing, no verified source of the email, and the claim contradicts the company\'s last 10-Q.', detailed_analysis: 'SEC EDGAR full-text search [efts.sec.gov] shows no 8-K or material announcement matching this claim. The company\'s most recent 10-Q projects in-line results. The "leaked email" has no verifiable origin or chain of custody.', primary_sources_count: 0, secondary_sources_count: 1, contradictions_found: 2, fact_checks_found: 0, processing_time_ms: 55300, model_used: 'google/gemma-4-31b-it' },
    sources: []
  },
  // Track 1 — Brand Intel
  {
    claim: { input_type: 'url', input_content: 'Competitor X claims to be the only SOC 2 Type II certified vendor in the AI security space.', track_context: 'track1_gtm', status: 'completed', agent_progress: 'Verification complete' },
    verification: { badge: 'red', confidence_score: 0.93, verdict_summary: 'False. The AICPA SOC 2 registry lists at least 7 vendors in the AI security space with Type II certification including Verified News\'s client.', detailed_analysis: 'AICPA registry search [aicpa-cima.com] returns multiple vendors in the AI security category with SOC 2 Type II reports dated within 12 months. Competitor X\'s own trust page does not make this claim in its legal terms. The marketing blog post making the claim contains no supporting citation.', primary_sources_count: 1, secondary_sources_count: 3, contradictions_found: 2, fact_checks_found: 0, processing_time_ms: 43700, model_used: 'google/gemma-4-31b-it' },
    sources: [
      { url: 'https://aicpa-cima.com', title: 'AICPA SOC 2 Registry', domain: 'aicpa-cima.com', source_type: 'regulatory', credibility_tier: 'high', relevance_score: 0.97, bright_data_tool_used: 'web_scraper_api', extracted_snippet: 'Multiple vendors listed with SOC 2 Type II certification in AI security' },
    ]
  },
  {
    claim: { input_type: 'text', input_content: 'Acme Corp is in advanced talks to acquire Startup Y for $500M, deal expected this quarter.', track_context: 'track1_gtm', status: 'completed', agent_progress: 'Verification complete' },
    verification: { badge: 'gray', confidence_score: 0.32, verdict_summary: 'Unverifiable. No SEC filing, no named sources, and no corroboration from financial press. Treat as speculation.', detailed_analysis: 'SEC EDGAR search [efts.sec.gov] returns no 8-K or merger announcement for Acme Corp within the past 90 days. The story cites only "people familiar with the matter" with no names. Neither Reuters nor Bloomberg has published corroborating coverage.', primary_sources_count: 0, secondary_sources_count: 2, contradictions_found: 0, fact_checks_found: 0, processing_time_ms: 38900, model_used: 'google/gemma-4-31b-it' },
    sources: []
  },
]

async function seed() {
  console.log('Seeding demo stories...')

  for (const story of DEMO_STORIES) {
    const { data: claim, error: claimErr } = await db
      .from('claims')
      .insert(story.claim)
      .select('id')
      .single()

    if (claimErr) { console.error('Claim insert error:', claimErr); continue }
    console.log(`  Created claim ${claim.id}`)

    const { data: ver, error: verErr } = await db
      .from('verifications')
      .insert({ ...story.verification, claim_id: claim.id })
      .select('id')
      .single()

    if (verErr) { console.error('Verification insert error:', verErr); continue }

    for (const src of story.sources) {
      await db.from('sources').insert({ ...src, verification_id: ver.id })
    }

    console.log(`  Seeded: ${story.claim.input_content.slice(0, 60)}...`)
  }

  console.log('Done. All demo stories seeded.')
}

seed().catch(console.error)
