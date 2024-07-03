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
from wordcloud import WordCloud, STOPWORDS


if __name__ == "__main__":
    # Define stopwords
    stopwords = set(STOPWORDS)

    print(len(stopwords))
    
    additional_stopwords_files = [
        'tagalog_stop_words.txt',
        'english_stop_words.txt',
    ]
    
    for s in additional_stopwords_files:    
        # Load additional tagalog stopwords
        with open(f"assets/data/{s}", "r") as f:
            additional_stopwords = f.read().splitlines()
            
            stopwords.update(additional_stopwords)
            
            print(len(stopwords))
    

    pass
