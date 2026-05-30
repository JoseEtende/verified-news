import os
from crewai import Agent
from crewai.tools import tool

_llm_kwargs = dict(
    api_key=os.getenv("AIMLAPI_API_KEY"),
    base_url="https://api.aimlapi.com/v1",
    model=os.getenv("AIMLAPI_MODEL_ID", "google/gemma-4-31b-it"),
    max_tokens=4096,
)


def _get_llm(temperature=0.2, max_tokens=4096):
    from langchain_openai import ChatOpenAI
    return ChatOpenAI(**_llm_kwargs, temperature=temperature, max_tokens=max_tokens)


from tools.brightdata import serp_search, web_unlocker_fetch, web_scraper_api, scraping_browser_fetch
from tools.factcheck import google_factcheck_search, check_domain_breach


@tool("serp_search")
def tool_serp(query: str) -> str:
    """Search the web via Bright Data SERP API. Input: search query string."""
    import json
    return json.dumps(serp_search(query, num_results=8))

@tool("web_unlocker")
def tool_unlocker(url: str) -> str:
    """Fetch URL bypassing bot detection via Bright Data Web Unlocker."""
    import json
    return json.dumps(web_unlocker_fetch(url))

@tool("web_scraper")
def tool_scraper(url: str) -> str:
    """Extract structured article data via Bright Data Web Scraper API."""
    import json
    return json.dumps(web_scraper_api(url))

@tool("scraping_browser")
def tool_browser(url: str) -> str:
    """Render JS-heavy pages via Bright Data Scraping Browser (Playwright)."""
    import json
    return json.dumps(scraping_browser_fetch(url))

@tool("google_factcheck")
def tool_factcheck(query: str) -> str:
    """Search Google Fact Check Tools API for existing fact-checks on a claim."""
    import json
    return json.dumps(google_factcheck_search(query))

@tool("breach_check")
def tool_breach(domain: str) -> str:
    """Check if a domain has known data breaches via HaveIBeenPwned."""
    import json
    return json.dumps(check_domain_breach(domain))


def get_discovery_agent():
    return Agent(
        role="Narrative Discovery Specialist",
        goal="Find 8-12 relevant web sources for the given claim in under 60 seconds",
        backstory=(
            "You are an elite OSINT researcher. You use Bright Data's SERP API to find "
            "primary sources, official records, fact-checker coverage, and social discussion. "
            "You always try at least 3 distinct search queries. You log every tool call."
        ),
        tools=[tool_serp, tool_browser, tool_unlocker],
        llm=_get_llm(temperature=0.2),
        verbose=True, max_iter=5, memory=True,
    )

def get_extraction_agent():
    return Agent(
        role="Structured Data Extraction Specialist",
        goal="Extract clean text, publication date, author, and credibility data from each source",
        backstory=(
            "You parse unstructured web content using Bright Data Web Scraper API and Web Unlocker. "
            "You assign credibility tiers: high (Reuters, AP, BBC, SEC.gov, .gov), "
            "medium (established news outlets, academic), low (blogs, forums), unverified (unknown). "
            "You truncate extracted text to 3000 characters per source to manage tokens."
        ),
        tools=[tool_scraper, tool_unlocker, tool_browser],
        llm=_get_llm(temperature=0.2),
        verbose=True, max_iter=5, memory=True,
    )

def get_cross_reference_agent():
    return Agent(
        role="Fact-Check and Regulatory Analyst",
        goal="Cross-reference the claim against fact-check databases, community notes, and primary records",
        backstory=(
            "You query Google Fact Check Tools API for existing verdicts. "
            "For breach-related claims, you check HaveIBeenPwned. "
            "You count contradictions, identify misleading framing, and flag missing context. "
            "You note when no fact-checks exist (this informs the Gray badge)."
        ),
        tools=[tool_factcheck, tool_breach, tool_serp, tool_scraper],
        llm=_get_llm(temperature=0.2),
        verbose=True, max_iter=5, memory=True,
    )

def get_verdict_agent():
    return Agent(
        role="Verification Verdict Synthesizer",
        goal=(
            "Synthesise all evidence into a color-coded badge with confidence score and "
            "a clear, defensible explanation. Return ONLY valid JSON — no prose outside the JSON."
        ),
        backstory=(
            "You are a senior editorial analyst. You weigh source credibility, corroboration, "
            "and contradictions to render the final verdict. Your output must be valid JSON "
            "matching the exact schema specified in your task. "
            "Badge criteria: "
            "blue=3+independent high-cred sources, 0 contradictions, >=1 fact-check, confidence>=0.90; "
            "green=official primary source confirms, 0 contradictions, confidence>=0.85; "
            "yellow=core fact true but outdated/missing context, <=1 contradiction, confidence>=0.60; "
            "orange=misleading framing OR unverified sources OR confidence<0.60; "
            "red=2+ contradictions AND existing false verdict AND confidence>=0.80; "
            "gray=insufficient data."
        ),
        tools=[],
        llm=_get_llm(temperature=0.1, max_tokens=2048),
        verbose=True, max_iter=3, memory=True,
    )
