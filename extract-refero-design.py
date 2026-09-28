from playwright.sync_api import sync_playwright
import re

styles_to_fetch = [
    ("ramp", "https://refero.design/style/b38702a0-75ab-474c-9106-00b624535825"),
    ("mercury", "https://refero.design/style/3172cd4d-118a-4a16-a259-6b634d32322e"),
    ("superhuman", "https://refero.design/style/418b374a-be64-44f0-b17e-1d45308c7e62"),
    ("wise", "https://refero.design/style/367c0c6e-73a7-441c-a8ff-91d139ac60dc"),
    ("notion", "https://refero.design/style/2bf4c61f-de10-4614-ba1b-20c0453bd2a9"),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    for name, url in styles_to_fetch:
        print(f"\n{'='*60}")
        print(f"Fetching {name}: {url}")
        print(f"{'='*60}")
        
        try:
            page.goto(url, wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(3000)
            
            # Try to find DESIGN.md link or content
            content = page.content()
            
            # Look for design.md links
            md_links = re.findall(r'href="([^"]*design[^"]*\.md)"', content)
            if md_links:
                for link in md_links:
                    print(f"  Found DESIGN.md link: {link}")
                    # Try to fetch it
                    page.goto(link, wait_until="networkidle")
                    md_content = page.content()
                    print(f"  Content preview: {md_content[:2000]}")
            
            # Also try to extract any visible design specs
            page.screenshot(path=f"refero-{name}.png", full_page=True)
            print(f"  Screenshot saved: refero-{name}.png")
            
        except Exception as e:
            print(f"  Error: {e}")
    
    browser.close()