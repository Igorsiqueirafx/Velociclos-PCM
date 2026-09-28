from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Go to MCP page
    page.goto("https://refero.design/mcp", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(5000)
    
    content = page.content()
    print("=== MCP PAGE ===")
    print(content[:10000])
    
    # Try to find the MCP server URL/config
    import re
    # Look for code blocks or config
    code_blocks = re.findall(r'<code[^>]*>(.*?)</code>', content, re.DOTALL)
    for block in code_blocks:
        print(f"\n--- CODE BLOCK ---\n{block[:500]}")
    
    # Look for pre tags
    pre_blocks = re.findall(r'<pre[^>]*>(.*?)</pre>', content, re.DOTALL)
    for block in pre_blocks:
        print(f"\n--- PRE BLOCK ---\n{block[:500]}")
    
    # Take screenshot
    page.screenshot(path="refero-mcp-page.png", full_page=True)
    print("\nScreenshot saved: refero-mcp-page.png")
    
    browser.close()