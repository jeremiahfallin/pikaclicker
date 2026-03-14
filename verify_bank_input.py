from playwright.sync_api import sync_playwright, expect

def verify_feature():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/home/jules/verification/video")
        page = context.new_page()

        try:
            # Navigate to the app
            page.goto("http://localhost:3000")
            page.wait_for_timeout(1000)

            # Find the bank section and check the input field
            # Look for the input that has our new placeholder
            search_input = page.get_by_placeholder("Search Pokemon...")

            # Verify it's visible
            expect(search_input).to_be_visible()

            # Verify it has the correct aria-label
            expect(search_input).to_have_attribute("aria-label", "Search bank for Pokemon")

            # Interact with it to show it works
            search_input.click()
            search_input.fill("Pikachu")
            page.wait_for_timeout(1000)

            # Take a screenshot
            import os
            os.makedirs("/home/jules/verification", exist_ok=True)
            page.screenshot(path="/home/jules/verification/verification.png")
            page.wait_for_timeout(1000)

        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    verify_feature()
