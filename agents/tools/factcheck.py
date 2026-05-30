import os
import requests

GOOGLE_FACTCHECK_API_KEY = os.getenv("GOOGLE_FACTCHECK_API_KEY")


def google_factcheck_search(query: str) -> list[dict]:
    """Query Google Fact Check Tools API."""
    url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
    params = {
        "query": query,
        "key": GOOGLE_FACTCHECK_API_KEY,
        "languageCode": "en",
        "pageSize": 5,
    }
    try:
        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        results = []
        for claim in data.get("claims", []):
            for review in claim.get("claimReview", []):
                results.append({
                    "claim_text": claim.get("text", ""),
                    "claimant": claim.get("claimant", ""),
                    "review_url": review.get("url", ""),
                    "publisher": review.get("publisher", {}).get("name", ""),
                    "verdict": review.get("textualRating", "").lower(),
                    "source": "google_factcheck_api",
                })
        return results
    except Exception as e:
        return [{"error": str(e), "source": "google_factcheck_api"}]


def check_domain_breach(domain: str) -> dict:
    """Check if domain has known breach via HaveIBeenPwned."""
    url = f"https://haveibeenpwned.com/api/v3/breacheddomain/{domain}"
    headers = {"User-Agent": "VerifiedNews-FactChecker/1.0"}
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            emails = resp.json()
            return {"domain": domain, "breached": True, "email_count": len(emails), "source": "hibp"}
        elif resp.status_code == 404:
            return {"domain": domain, "breached": False, "source": "hibp"}
        else:
            return {"domain": domain, "error": f"HTTP {resp.status_code}", "source": "hibp"}
    except Exception as e:
        return {"domain": domain, "error": str(e), "source": "hibp"}
