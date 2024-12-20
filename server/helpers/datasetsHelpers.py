import re
import os
from pathlib import Path
import pandas as pd
from nltk.stem import WordNetLemmatizer
from wordcloud import STOPWORDS
from tqdm import tqdm

from geopy.extra.rate_limiter import RateLimiter
from geopy.geocoders import Nominatim
from geopy.location import Location

from transformers import (
    ElectraTokenizer,
    ElectraForSequenceClassification,
    BatchEncoding,
)
from transformers.modeling_outputs import SequenceClassifierOutput
import torch
from fuzzywuzzy import process


# Folder to store annotated_datasets
annotated_datasets_folder = Path("public/annotated_datasets")

# Folder for public datasets
datasets_folder = Path("public/datasets")


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
    cleaned_df["cleaned_posts"] = cleaned_df["posts"].apply(clean_text)
    cleaned_df = cleaned_df.dropna(subset=["cleaned_posts"])
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
        return "NA"
    else:
        address = get_geopy_reverse(latlong)

        if "ISO3166-2-lvl3" not in address.keys():
            return "NA"

        return address["ISO3166-2-lvl3"]


cache_ph_code = {}


# Get the PH-Code for region tagging
def get_PH_code_with_cache(latlong: str):
    global cache_ph_code

    unique_key = latlong

    if unique_key in cache_ph_code:
        return cache_ph_code[unique_key]

    if latlong == "-999, -999":
        return "NA"
    else:
        address = get_geopy_reverse(latlong)

        if "ISO3166-2-lvl3" not in address.keys():
            return "NA"

        cache_ph_code[unique_key] = address["ISO3166-2-lvl3"]

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
def filter_location(province, region: str):
    if "region" not in region.lower():
        region = f"Region {region}"

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


cache_longlat = {}


# Get latitude abd longitude given the province and region while cross-checking in cache
def filter_location_with_cache(province, region: str):
    global cache_longlat

    unique_key = (province, region)

    if unique_key in cache_longlat:
        return cache_longlat[unique_key]

    if "region" not in region.lower():
        region = f"Region {region}"

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
            result = is_latlong_within_ph(latlong_region)

            if result != "-999, -999":
                cache_longlat[unique_key] = result

            return result
    else:
        # Check if latitude and longitude is within the Philippines
        result = is_latlong_within_ph(latlong)

        if result != "-999, -999":
            cache_longlat[unique_key] = result

        return result


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


# def annotate_posts(vectorizer: TfidfVectorizer, mlknn_c: MLkNN, post):
#     post_tfidf = vectorizer.transform([str(post)])

#     predicted_post_array = mlknn_c.predict(post_tfidf).toarray()

#     predicted_post = predicted_post_array[0]

#     annotate = []

#     annotations = ["AURI", "PN", "TB", "COVID"]

#     for i, a in enumerate(predicted_post):
#         if a == 1:
#             annotate.append(annotations[i])

#     return ",".join(annotate) if len(annotate) > 0 else "X"


def annotate_posts_by_electra(
    tokenizer: ElectraTokenizer, model: ElectraForSequenceClassification, post
):
    inputs: BatchEncoding = tokenizer(
        str(post), return_tensors="pt", truncation=True, padding=True, max_length=128
    )

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model.to(device)

    with torch.no_grad():
        outputs: SequenceClassifierOutput = model(**inputs)
        logits = outputs.logits

    probabilities = torch.sigmoid(logits).cpu().numpy()

    predictions = (probabilities >= 0.5).astype(int)

    annotate = []

    annotations = ["AURI", "PN", "TB", "COVID"]

    for i, a in enumerate(predictions[0]):
        if a == 1:
            annotate.append(annotations[i])

    return ",".join(annotate) if len(annotate) > 0 else "X"


def exact_match_scorer(s1, s2):
    if re.search(rf"(?<!\S){s2}(?!\S)", s1):
        return 100
    else:
        return 0


def extract_symptom_by_fuzzywuzzy(post: str, symptom_list: list, threshold: int):
    post = post.lower()
    post = re.sub(r"[^a-z\s]", "", post)
    post = post.strip()

    input_string = post

    best_match = process.extractBests(
        input_string, symptom_list, scorer=exact_match_scorer, score_cutoff=threshold
    )

    return best_match[-1][0] if len(best_match) > 0 else ""


def annotation(raw_dataset_filename: str, result_filename: str):
    electra_model = ElectraForSequenceClassification.from_pretrained(
        "./annotation_model/electra_model"
    )

    electra_tokenizer = ElectraTokenizer.from_pretrained(
        "./annotation_model/electra_save_tokenizer"
    )

    electra_model.eval()

    """
        ANNOTATION
    """

    tqdm.pandas()

    raw_dataset_path = datasets_folder / raw_dataset_filename

    # Read raw dataset
    raw_dataset = pd.read_csv(raw_dataset_path)

    # Raw dataset dataframe columns: [region, province, posts]
    raw_dataset_df = pd.DataFrame(raw_dataset, columns=["region", "province", "posts"])

    # # Get latitude and longitude using Geopy based on province and region
    # raw_dataset_df["filtered_location"] = raw_dataset_df.progress_apply(
    #     lambda x: filter_location(x["province"], x["region"]), axis=1
    # )

    # Get latitude and longitude using Geopy based on province and region with cache
    raw_dataset_df["filtered_location"] = raw_dataset_df.progress_apply(
        lambda x: filter_location_with_cache(x["province"], x["region"]), axis=1
    )

    # # Get PH_Code / ISO3166-2-lvl3 code using Geopy based on retrieved latitude and longitude
    # raw_dataset_df["PH_code"] = raw_dataset_df.progress_apply(
    #     lambda x: get_PH_code(x["filtered_location"]), axis=1
    # )

    # Get PH_Code / ISO3166-2-lvl3 code using Geopy based on retrieved latitude and longitude
    raw_dataset_df["PH_code"] = raw_dataset_df.progress_apply(
        lambda x: get_PH_code_with_cache(x["filtered_location"]), axis=1
    )

    # Extract latitude from retrived filtered_location
    raw_dataset_df["lat"] = raw_dataset_df.apply(
        lambda x: str.split(x["filtered_location"], sep=", ")[0], axis=1
    )

    # Extract longitude from retrived filtered_location
    raw_dataset_df["long"] = raw_dataset_df.apply(
        lambda x: str.split(x["filtered_location"], sep=", ")[1], axis=1
    )

    # Predict annotation (AURI, PN, TB, COVID) based on post
    raw_dataset_df["annotations"] = raw_dataset_df.progress_apply(
        lambda x: annotate_posts_by_electra(
            electra_tokenizer, electra_model, x["posts"]
        ),
        axis=1,
    )

    print("ANNOTATIONS finished")

    annotated_df = clean_dataframe(raw_dataset_df)

    symptom_list_df = pd.DataFrame(
        pd.read_csv("./assets/data/symptoms_dictionary.csv"), columns=["symptom"]
    )

    symptom_list = symptom_list_df["symptom"].tolist()
    
    # Extract symptom word from posts using fuzzywuzzy
    annotated_df["extracted_words"] = annotated_df.progress_apply(
        lambda x: extract_symptom_by_fuzzywuzzy(x["posts"], symptom_list, 99), axis=1
    )

    # Create annotated datasets destination folder if it not exists
    os.makedirs(annotated_datasets_folder, exist_ok=True)

    annotated_datasets_path = annotated_datasets_folder / result_filename

    annotated_df.to_csv(annotated_datasets_path, index=False)

    print("==== DATASET ANNOTATED ====")

    return annotated_datasets_path
