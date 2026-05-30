import os
import json
import requests
from typing import Optional

BRIGHTDATA_API_KEY = os.getenv("BRIGHTDATA_API_KEY")
BRIGHTDATA_PROXY_URL = os.getenv("BRIGHTDATA_PROXY_URL")
BRIGHTDATA_BROWSER_WSS = os.getenv("BRIGHTDATA_BROWSER_WSS")
BRIGHTDATA_SERP_ZONE = os.getenv("BRIGHTDATA_SERP_ZONE", "serp_zone")


def serp_search(query: str, num_results: int = 10) -> list[dict]:
    """Search via Bright Data SERP API."""
    url = "https://api.brightdata.com/request"
    payload = {
        "zone": BRIGHTDATA_SERP_ZONE,
        "url": f"https://www.google.com/search?q={requests.utils.quote(query)}&num={num_results}",
        "format": "json",
    }
    headers = {
        "Authorization": f"Bearer {BRIGHTDATA_API_KEY}",
        "Content-Type": "application/json",
    }
    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        results = []
        for item in data.get("organic", []):
            results.append({
                "url": item.get("link", ""),
                "title": item.get("title", ""),
                "snippet": item.get("snippet", ""),
                "domain": extract_domain(item.get("link", "")),
                "tool_used": "serp_api",
            })
        return results
    except Exception as e:
        return [{"error": str(e), "tool_used": "serp_api"}]


def web_unlocker_fetch(url: str) -> dict:
    """Fetch URL via Bright Data Web Unlocker proxy."""
    proxies = {
        "http": BRIGHTDATA_PROXY_URL,
        "https": BRIGHTDATA_PROXY_URL,
    }
    try:
        resp = requests.get(url, proxies=proxies, timeout=30, verify=False)
        return {
            "url": url,
            "status_code": resp.status_code,
            "text": resp.text[:8000],
            "tool_used": "web_unlocker",
        }
    except Exception as e:
        return {"url": url, "error": str(e), "tool_used": "web_unlocker"}


def scraping_browser_fetch(url: str) -> dict:
    """Fetch JS-rendered page via Bright Data Scraping Browser."""
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.connect_over_cdp(BRIGHTDATA_BROWSER_WSS)
            page = browser.new_page()
            page.goto(url, timeout=30000)
            page.wait_for_load_state("networkidle")
            content = page.content()[:8000]
            title = page.title()
            browser.close()
        return {"url": url, "title": title, "text": content, "tool_used": "scraping_browser"}
    except Exception as e:
        return web_unlocker_fetch(url)


def web_scraper_api(url: str) -> dict:
    """Use Bright Data Web Scraper API for structured extraction."""
    endpoint = "https://api.brightdata.com/dca/trigger"
    headers = {
        "Authorization": f"Bearer {BRIGHTDATA_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "collector": "news_article",
        "url": url,
    }
    try:
        resp = requests.post(endpoint, json=payload, headers=headers, timeout=30)
        resp.raise_for_status()
        snapshot_id = resp.json().get("snapshot_id")
        if not snapshot_id:
            return web_unlocker_fetch(url)

        result_url = f"https://api.brightdata.com/dca/dataset?snapshot_id={snapshot_id}"
        for _ in range(10):
            import time; time.sleep(3)
            r = requests.get(result_url, headers=headers, timeout=10)
            if r.status_code == 200:
                data = r.json()
                if data:
                    article = data[0] if isinstance(data, list) else data
                    return {
                        "url": url,
                        "title": article.get("title", ""),
                        "text": str(article.get("article", article.get("text", "")))[:8000],
                        "author": article.get("author", ""),
                        "date": article.get("date", ""),
                        "tool_used": "web_scraper_api",
                    }
        return web_unlocker_fetch(url)
    except Exception as e:
        return web_unlocker_fetch(url)


def extract_domain(url: str) -> str:
    try:
        from urllib.parse import urlparse
        return urlparse(url).netloc.replace("www.", "")
    except Exception:
        return url
