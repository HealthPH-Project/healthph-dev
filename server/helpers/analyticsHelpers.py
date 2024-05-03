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


def get_stopwords():
    # Define stopwords
    stopwords = set(STOPWORDS)

    # Load additional tagalog stopwords
    with open("assets/data/tagalog_stop_words.txt", "r") as f:
        additional_stopwords_tl = f.read().splitlines()

    # Load additional tagalog stopwords
    with open("assets/data/tagalog_stop_words_2.txt", "r") as f:
        additional_stopwords_tl_2 = f.read().splitlines()

    # Load additional english stopwords
    with open("assets/data/english_stop_words.txt", "r") as f:
        additional_stopwords_en = f.read().splitlines()

    # Load additional cebuano stopwords
    with open("assets/data/cebuano_stop_words.txt", "r") as f:
        additional_stopwords_cb = f.read().splitlines()

    stopwords.update(additional_stopwords_tl)
    stopwords.update(additional_stopwords_tl_2)
    stopwords.update(additional_stopwords_en)
    stopwords.update(additional_stopwords_cb)

    stopwords.update(
        [
            "wala",
            "akong",
            "ba",
            "nung",
            "talaga",
            "pag",
            "nang",
            "de",
            "amp",
            "gym",
            "coach",
            "lang",
            "yung",
            "kasi",
            "naman",
            "mo",
            "di",
            "si",
            "nya",
            "yun",
            "im",
            "will",
            "sya",
            "nga",
            "daw",
            "eh",
            "que",
            "ug",
            "e",
            "man",
            "jud",
            "gi",
            "oy",
            "ba",
            "talaga",
            "day",
            "one",
            "parang",
            "know",
            "wala",
            "alam",
            "tapos",
            "pag",
            "tao",
            "kayo",
            "nung",
            "us",
            "now",
            "natin",
            "nasa",
            "even",
            "niyo",
            "teaser",
        ]
    )
    
    return stopwords


def clean_text(text):
    if pd.notna(text):
        text = text.lower()
        text = re.sub(r"see\s+more", "", text, flags=re.IGNORECASE)
        text = re.sub(r"http\S+", "", text)
        text = re.sub(r"#\w+", "", text)
        text = text.encode("ascii", "ignore").decode("ascii")
        text = re.sub(r"[^\w\s]", "", text)
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


def frequent_words(data):
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


def word_cloud(data):
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

    # return wordcloud
    image_buffer = BytesIO()
    wordcloud.to_image().save(image_buffer, format="PNG")
    image_buffer.seek(0)
    return image_buffer.getvalue()

    # # Display the generated image:
    buffer = BytesIO()
    plt.figure(figsize=(8, 4), dpi=100)
    plt.imshow(wordcloud, interpolation="bilinear", aspect="equal")
    plt.axis("off")
    plt.savefig(buffer, format="png")
    buffer.seek(0)

    return buffer.getvalue()


def wordcloud_color_func(
    word, font_size, position, orientation, random_state=None, **kwargs
):
    colors = ["#171E26", "#007AFF", "#35CA3B", "#DBB324", "#D82727"]

    return random.choice(colors)
