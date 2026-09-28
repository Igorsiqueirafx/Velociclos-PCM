from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Go to AI agents page
    page.goto("https://refero.design/ai-agents", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(3000)
    
    content = page.content()
    print("=== AI AGENTS PAGE ===")
    print(content[:5000])
    
    # Look for MCP config
    if "mcp" in content.lower():
        print("\n=== MCP FOUND ===")
        # Extract relevant parts
        import re
        mcp_sections = re.findall(r'.{0,200}mcp.{0,200}', content, re.IGNORECASE)
        for s in mcp_sections[:10]:
            print(s)
    
    # Also try design-md-examples
    page.goto("https://refero.design/ai-agents/design-md-examples", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(3000)
    
    content2 = page.content()
    print("\n=== DESIGN.MD EXAMPLES ===")
    print(content2[:5000])
    
    browser.close()