import re

import pandas as pd
from nltk.stem import WordNetLemmatizer
from wordcloud import WordCloud, STOPWORDS

from geopy.extra.rate_limiter import RateLimiter
from geopy.geocoders import Nominatim
from geopy.location import Location

from sklearn.feature_extraction.text import TfidfVectorizer
from packages.skmultilearn.adapt import MLkNN


def get_stopwords():
    # Define stopwords
    stopwords = set(STOPWORDS)

    additional_stopwords_files = [
        "tagalog_stop_words.txt",
        "english_stop_words.txt",
        "cebuano_stop_words.txt",
    ]

    for s in additional_stopwords_files:
        # Load additional stopwords
        with open(f"assets/data/{s}", "r") as f:
            additional_stopwords = f.read().splitlines()

            stopwords.update(additional_stopwords)

    return stopwords


def clean_text(text):
    if pd.notna(text):
        text = text.lower()
        text = re.sub(r"see\s+more", "", text, flags=re.IGNORECASE)
        text = re.sub(r"http\S+", "", text)
        text = re.sub(r"#\w+", "", text)
        text = text.encode("ascii", "ignore").decode("ascii")
        text = re.sub(r"[^\w\s]", "", text)
        text = re.sub(r"([a-z])\1{1,}", r"\1", text)
        text = re.sub(r"\d+", "", text)
        text = re.sub(r"\b\w\b", "", text)
        text = re.sub(r"\s+", " ", text).strip()

        tokens = text.split()

        lemmatizer = WordNetLemmatizer()

        filtered_tokens = [
            lemmatizer.lemmatize(word) for word in tokens if word not in STOPWORDS
        ]
        text = " ".join(filtered_tokens)

        return text

    return text


def clean_dataframe(df):
    cleaned_df = df.copy()
    cleaned_df["post"] = cleaned_df["post"].apply(clean_text)
    cleaned_df = cleaned_df.dropna(subset=["post"])
    return cleaned_df


# Get the latitude and longitude given the address string
def get_geopy_latlong(address: str):
    if not address:
        return "-999, -999"

    geolocator = Nominatim(user_agent="https")

    try:
        location: Location = geolocator.geocode(address)

        return (location.latitude, location.longitude)
    except:
        return "-999, -999"


# Get the address details given the latitude and longitude
def get_geopy_reverse(latlong: str):
    if latlong == "-999, -999":
        return {}

    geolocator = Nominatim(user_agent="https")

    try:
        reverse = RateLimiter(geolocator.reverse, min_delay_seconds=1)

        location: Location = reverse(latlong, language="en", exactly_one=True)

        return location.raw["address"]
    except:
        return {}


# Get the PH-Code for region tagging
def get_PH_code(latlong: str):
    if latlong == "-999, -999":
        return "N/A"
    else:
        address = get_geopy_reverse(latlong)

        if "ISO3166-2-lvl3" not in address.keys():
            return "N/A"

        return address["ISO3166-2-lvl3"]


# Check if latitude and longitude coordinates are within in Philippine boundaries
def is_latlong_within_ph(latlong):
    # Check if latitude is within PH bounds
    if latlong[0] < 4.6666667 or latlong[0] > 21.16666667:
        return "-999, -999"

    # Check if longitude is within PH bounds
    if latlong[1] < 116.666666667 or latlong[1] > 126.5666666666:
        return "-999, -999"

    return f"{latlong[0]}, {latlong[1]}"


# Get latitude abd longitude given the province and region
def filter_location(province, region):
    # Combine province and region for location
    location_str = str(province) + ", " + str(region)

    # Get latitude and longitude of location
    latlong = get_geopy_latlong(location_str)

    # Check if latitude and longitude is valid
    if latlong == "-999, -999":
        # If not, try getting latitude and longitude for region only
        region_str = str(region)
        latlong_region = get_geopy_latlong(region_str)

        if latlong_region == "-999, -999":
            return "-999, -999"
        else:
            # Check if latitude and longitude is within the Philippines
            return is_latlong_within_ph(latlong_region)
    else:
        # Check if latitude and longitude is within the Philippines
        return is_latlong_within_ph(latlong)


"""
    BINARY MATRIX
"""


def get_disease(annotation, disease_code: str):
    annotation = str(annotation)

    if annotation == "X" or annotation == "x":
        return 0
    else:
        annotation_splits = str.split(annotation, sep=",")

        flag = 0

        for annotate in annotation_splits:
            if annotate == disease_code or annotate == f"{disease_code},":
                flag = 1
            else:
                flag = 0 + flag

        return flag


"""
    ANNOTATION
"""


def annotate_posts(vectorizer: TfidfVectorizer, mlknn_c: MLkNN, post: str):
    post_tfidf = vectorizer.transform(post)

    predicted_post_array = mlknn_c.predict(post_tfidf).toarray()

    predicted_post = predicted_post_array[0]

    annotate = []

    annotations = ["AURI", "PN", "TB", "COVID"]

    for i, a in enumerate(predicted_post):
        if a == 1:
            annotate.append(annotations[i])

    return annotate if len(annotate) > 0 else "X"


