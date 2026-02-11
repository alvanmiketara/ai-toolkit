from playwright.sync_api import sync_playwright
import time
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1920, "height": 1080})

    # 1. Navigate to New Job
    print("Navigating to New Job page...")
    try:
        page.goto("http://localhost:8675/jobs/new", timeout=60000)
        page.wait_for_load_state("networkidle")
    except Exception as e:
        print(f"Error navigating: {e}")
        page.screenshot(path="/home/jules/verification/error_job.png")
        browser.close()
        return

    # Take screenshot of default view
    os.makedirs("/home/jules/verification", exist_ok=True)
    page.screenshot(path="/home/jules/verification/new_job_default.png", full_page=True)

    # 2. Select Full Fine-Tune
    print("Selecting Full Fine-Tune...")
    # react-select creates inputs, we can search by text
    # The label is "Target Type", the input has "LoRA" selected by default
    # We need to open the menu and select "Full Fine-Tune"

    # Click on the Target Type select. It has "LoRA" text.
    target_type_section = page.locator("text=Target Type").first
    # The select is likely following the label.
    # Let's try to find the select by text "LoRA" inside the Target card
    # Assuming "LoRA" is visible.

    try:
        # Click the dropdown
        page.get_by_text("LoRA", exact=True).click()
        # Click "Full Fine-Tune" option
        page.get_by_text("Full Fine-Tune", exact=True).click()
        time.sleep(1) # wait for render
        page.screenshot(path="/home/jules/verification/new_job_full_finetune.png", full_page=True)
    except Exception as e:
        print(f"Error selecting Full Fine-Tune: {e}")

    browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
