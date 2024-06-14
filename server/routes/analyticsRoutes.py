from fastapi import APIRouter
from controllers.analyticsController import (
    fetch_wordcloud,
    generate_frequent_words,
    generate_percentage,
    generate_wordcloud,
)

router = APIRouter()

router.add_api_route(
    "/frequent-words", methods=["GET"], endpoint=generate_frequent_words
)

router.add_api_route("/percentage", methods=["GET"], endpoint=generate_percentage)

router.add_api_route("/wordcloud", methods=["GET"], endpoint=generate_wordcloud)

router.add_api_route("/wordcloud/{filters}", methods=["GET"], endpoint=fetch_wordcloud)


import time
from selenium import webdriver
import base64
import os

def generate_map_image(url):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')  # Disable GPU for efficiency

    driver = webdriver.Chrome(options=options)
    
    driver.set_window_size(1400, 1700)
    driver.get(url)

    # Wait for map to load (adjust timeout as needed)
    driver.implicitly_wait(10000)
    time.sleep(5)

    # Capture the entire page or a specific map container element
    # (adjust selector based on your map's structure)
    screenshot = driver.get_screenshot_as_png()

    driver.quit()
    return screenshot


async def fetch_full_map():
    # Replace with your React app's URL rendering the map
    map_url = os.getenv('CLIENT_URL') + "/full-map"
    image_data = generate_map_image(map_url)

    encoded_data = base64.b64encode(image_data).decode()

    # Save the image (adjust filename and format)
    # with open("map_image.png", "wb") as f:
    #     f.write(image_data)

    return {"message": encoded_data}
    
    
router.add_api_route("/fetch-full-map", methods=["GET"], endpoint=fetch_full_map)