"""
Pure Python badge assignment — used as a sanity check against the LLM verdict.
If the LLM returns an inconsistent badge, this function overrides it.
"""

def calculate_confidence(sources: list, fact_checks: list, contradictions: int) -> float:
    high_cred = sum(1 for s in sources if s.get('credibility_tier') == 'high')
    unique_domains = len(set(s.get('domain', '') for s in sources))
    score = 0.5
    score += min(high_cred * 0.10, 0.30)
    score += min(unique_domains * 0.05, 0.20)
    score += min(len(fact_checks) * 0.10, 0.20)
    score -= min(contradictions * 0.15, 0.30)
    return round(max(min(score, 1.0), 0.0), 2)


def determine_badge(sources: list, fact_checks: list, contradictions: int, confidence: float) -> str:
    high_cred = [s for s in sources if s.get('credibility_tier') == 'high']
    independent_high = len(set(s.get('domain', '') for s in high_cred))
    has_official = any(s.get('source_type') == 'official' for s in sources)
    has_missing_context = any(s.get('missing_context') for s in sources)
    has_misleading = any(s.get('misleading_framing') for s in sources)
    has_false_verdict = any(fc.get('verdict', '') in ['false', 'incorrect', 'pants on fire']
                            for fc in fact_checks)

    if independent_high >= 3 and contradictions == 0 and len(fact_checks) >= 1 and confidence >= 0.90:
        return 'blue'
    if has_official and contradictions == 0 and confidence >= 0.85:
        return 'green'
    if independent_high >= 2 and contradictions <= 1 and has_missing_context and confidence >= 0.60:
        return 'yellow'
    if contradictions >= 1 or has_misleading or (independent_high == 0 and confidence < 0.60):
        return 'orange'
    if contradictions >= 2 and len(fact_checks) >= 1 and confidence >= 0.80 and has_false_verdict:
        return 'red'
    return 'gray'
