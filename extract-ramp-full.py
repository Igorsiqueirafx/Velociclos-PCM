from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Go to Ramp style page and wait for content
    page.goto("https://refero.design/style/b38702a0-75ab-474c-9106-00b624535825", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(8000)
    
    content = page.content()
    print("=== RAMP STYLE PAGE ===")
    print(content[:15000])
    
    # Save full HTML
    with open("ramp-full.html", "w", encoding="utf-8") as f:
        f.write(content)
    
    browser.close()