from pathlib import Path
import pandas as pd
import re
import nltk

from helpers.miscHelpers import region_to_iso3166_2

nltk.download("wordnet")
from nltk.stem import WordNetLemmatizer
from wordcloud import WordCloud, STOPWORDS
from collections import Counter
import random

annotated_datasets_folder = Path("public/annotated_datasets")

# Load stopwords
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


def filters_datasets_by_region(region: str, datasets: list):
    all_posts = ""
    
    # Iterate over each datasets filenames
    for dataset in datasets:
        # Read dataset csv file
        dataset_df = pd.read_csv(annotated_datasets_folder / dataset)

        # If selected region is "All Regions", then
        if region == "all":
            # Join all posts into a single string
            dataset_posts = " ".join(post for post in dataset_df["posts"])
        else:
            # Filter posts by region before joining into a single string
            ph_code = region_to_iso3166_2(region)
            regional_posts = dataset_df[dataset_df["PH_code"] == ph_code]
            dataset_posts = " ".join(post for post in regional_posts["posts"])

        # Append every each joined strings
        all_posts = " ".join([all_posts, dataset_posts])

    # Remove all characters that are not letters and whitespaces
    all_posts = re.sub(r"[^a-zA-Z\s]", "", all_posts)

    return all_posts


def frequent_words(data):    
    # Define stopwords
    stopwords = get_stopwords()

    # Split the data into words and filter out stopwords
    words = [word for word in str.split(data, sep=" ") if word not in stopwords]

    # Count the frequency of each word
    word_counts = Counter(words)

    # Find the ten most common words
    most_common_words = word_counts.most_common(n=10)

    # Create dataframe of the most common words 
    frequent_words_df = pd.DataFrame(most_common_words, columns=["word", "frequency"])

    # Convert dataframe to dictionary
    frequent_words_dict = frequent_words_df.to_dict(orient="records")

    return frequent_words_dict


def word_cloud(data, full_path: str):
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
    ).generate(data)

    wordcloud.to_file(full_path)

    return wordcloud


def wordcloud_color_func(
    word, font_size, position, orientation, random_state=None, **kwargs
):
    colors = ["#171E26", "#007AFF", "#35CA3B", "#DBB324", "#D82727"]

    return random.choice(colors)
