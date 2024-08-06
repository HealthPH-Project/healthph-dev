import pandas as pd
import re
import nltk

nltk.download("wordnet")
from nltk.stem import WordNetLemmatizer
from wordcloud import WordCloud, STOPWORDS
import matplotlib.pyplot as plt
from collections import Counter
from io import BytesIO
import random
from geopy.extra.rate_limiter import RateLimiter
from geopy.geocoders import Nominatim
from geopy.location import Location


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


#
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


def frequent_words(data):
    print(data.post[1])
    # Prepare the post data: concatenate all rows in the post column into a single string
    post = " ".join(review for review in data.post).lower()
    # Remove punctuation and numbers
    post = re.sub(r"[^a-zA-Z\s]", "", post)

    # Define stopwords
    stopwords = get_stopwords()

    # Split the post into words and filter out stopwords
    words = [word for word in post.split() if word not in stopwords]

    # Count the frequency of each word
    word_counts = Counter(words)

    # Get the most common words and their counts
    most_common_words = word_counts.most_common(
        10
    )  # Adjust the number to display more or fewer words

    # Convert the most common words to a DataFrame for visualization
    df_frequent_words = pd.DataFrame(most_common_words, columns=["Word", "Frequency"])

    return df_frequent_words


def word_cloud(data, full_path: str):
    # Combine all posts into a single string
    post = " ".join(review for review in data.post)

    # Define stopwords
    stopwords = get_stopwords()

    # Generate a word cloud image considering stopwords, with higher resolution
    wordcloud = WordCloud(
        stopwords=stopwords,
        background_color="#F8F9FA",
        font_path="helpers/inter-font.ttf",
        color_func=wordcloud_color_func,
        prefer_horizontal=1,
        max_words=30,
        random_state=1,
        width=800,
        height=400,
        max_font_size=50,
        margin=50,
    ).generate(post)

    wordcloud.to_file(full_path)

    return wordcloud

    # return wordcloud
    image_buffer = BytesIO()
    wordcloud.to_image().save(image_buffer, format="PNG")
    image_buffer.seek(0)
    return image_buffer.getvalue()


def wordcloud_color_func(
    word, font_size, position, orientation, random_state=None, **kwargs
):
    colors = ["#171E26", "#007AFF", "#35CA3B", "#DBB324", "#D82727"]

    return random.choice(colors)
