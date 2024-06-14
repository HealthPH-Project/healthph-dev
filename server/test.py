import json
import shutil
import geopandas as gpd
import pandas as pd
import os

from playwright.async_api import async_playwright
import asyncio
from pyppeteer import launch
from playwright.sync_api import sync_playwright
import time
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

import base64
async def render_map(url, output_path):
    browser = await launch(headless=True)
    page = await browser.newPage()
    await page.goto(url, waitUntil="networkidle0")  # Wait for page to fully load
    await page.screenshot(path=output_path)
    await browser.close()
    
def generate_map_image(url):
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless')  
    # options.add_argument('--disable-gpu')  # Disable GPU for efficiency

    driver = webdriver.Chrome(options=options)
    
    driver
    driver.set_window_size(1033, 1800)
    driver.get(url)


    # Wait for map to load (adjust timeout as needed)
    driver.implicitly_wait(10000)
    time.sleep(5)

    # Capture the entire page or a specific map container element
    # (adjust selector based on your map's structure)
    screenshot = driver.get_screenshot_as_png()

    driver.quit()
    return screenshot

if __name__ == "__main__":
    
    # Replace with your React app's URL rendering the map
    map_url = 'http://localhost:5173/full-map'
    
    image_data = generate_map_image(map_url)
    
    print(image_data)
    
    encoded_data = base64.b64encode(image_data).decode()
    
    print(encoded_data)

    # Save the image (adjust filename and format)
    with open('map_image.png', 'wb') as f:
        f.write(image_data)

    # with sync_playwright() as p:
    #     browser = p.chromium.launch(headless=False)  # Or Firefox, WebKit
    #     page = browser.new_page()
    #     page.goto("http://localhost:5173/full-map")
    #     page.set_viewport_size({"width": 1033, "height": 1500})

    #     # Wait for element to load
    #     # page.wait_for_selector("#trends-map-container")  # Uses CSS selectors by default
    #     time.sleep(5)
    #     # Interact with the element (optional)
    #     # page.click("#your-element-id")

    #     # Capture screenshot
    #     page.screenshot(path="screenshot.png")

    #     browser.close()

    pass
