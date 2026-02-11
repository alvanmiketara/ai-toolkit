from playwright.sync_api import sync_playwright
import time
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1920, "height": 1080})

    # 1. Navigate to Dashboard
    print("Navigating to dashboard...")
    try:
        page.goto("http://localhost:8675/dashboard", timeout=60000)
        page.wait_for_load_state("networkidle")
    except Exception as e:
        print(f"Error navigating: {e}")
        # Take screenshot anyway
        page.screenshot(path="/home/jules/verification/error.png")
        browser.close()
        return

    # Take screenshot of full dashboard
    print("Taking dashboard screenshot...")
    os.makedirs("/home/jules/verification", exist_ok=True)
    page.screenshot(path="/home/jules/verification/dashboard.png", full_page=True)

    browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
