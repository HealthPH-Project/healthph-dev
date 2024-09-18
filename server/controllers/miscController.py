import os
import re
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from models.misc import ContactUsRequest
from helpers.sendMail import mail_contact_us


async def contact_us(data: ContactUsRequest):
    errors = []

    # Check fields if empty
    if not data.name or not data.email or not data.subject or not data.message:
        if not data.name:
            errors.append({"field": "name", "error": "Must provide name"})

        if not data.email:
            errors.append({"field": "email", "error": "Must provide email address"})

        if not data.subject:
            errors.append({"field": "subject", "error": "Must provide subject"})

        if not data.message:
            errors.append({"field": "message", "error": "Must provide message"})

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    # Check if email address is valid
    email_regex = r"^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$"
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"

    if not re.match(email_regex, data.email):
        errors.append({"field": "email", "error": "Must provide valid email address"})

    if len(errors) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    # Send mail to HealthPH email address
    result = mail_contact_us(
        os.getenv("SMTP_SENDER_EMAIL"),
        {
            "name": data.name,
            "email": data.email,
            "subject": data.subject,
            "message_body": data.message,
        },
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=[
                {
                    "field": "error",
                    "error": "Failed to send message. Please try again later.",
                }
            ],
        )

    if result:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Message sent successfully"},
        )


from nltk import bigrams

import spacy.cli
from tqdm import tqdm
import pandas as pd

import time
import memory_profiler
import itertools
import collections
import networkx as nx
import matplotlib.pyplot as plt

from helpers.analyticsHelpers import get_stopwords

stopwords = get_stopwords()


def preprocess(post, nlp):
    # Remove punctuation and numbers
    post = re.sub(r"[^a-zA-Z\s]", "", post)
    # Lemmatize and remove stopwords
    doc = nlp(post)
    result = [
        token.lemma_.lower() for token in doc if token.text.lower() not in stopwords
    ]
    return result


def analyze_data_in_chunks(data, increment, nlp):
    # Initialize lists to store performance metrics
    metrics = []
    data_size = len(data)

    for i in tqdm(range(increment, data_size + increment, increment)):
        # Select chunk of data
        texts = data[:i]

        # Measure time and memory before processing
        start_time = time.time()
        mem_before = memory_profiler.memory_usage()[0]

        # Data processing
        texts = [preprocess(post, nlp) for post in texts]
        terms_bigrams = [list(bigrams(post)) for post in texts]  # Use nltk bigrams
        all_bigrams = list(itertools.chain(*terms_bigrams))
        bigrams_counts = collections.Counter(all_bigrams)

        word_pairs = 15  # Adjust for word pairs sequences
        bigram_df = pd.DataFrame(
            bigrams_counts.most_common(word_pairs), columns=["bigram", "count"]
        )
        d = bigram_df.set_index("bigram").T.to_dict("records")

        G = nx.Graph()

        # Create connections between nodes
        for k, v in d[0].items():
            G.add_edge(k[0], k[1], weight=(v * 10))

        # Measure time and memory after processing
        end_time = time.time()
        mem_after = memory_profiler.memory_usage()[0]

        # Calculate time taken and memory used
        time_taken = end_time - start_time
        memory_used = mem_after - mem_before

        # Append results to metrics list
        metrics.append(
            {
                "Data Processed": i,
                "Time (seconds)": time_taken,
                "Memory (MB)": memory_used,
            }
        )

        # Plot the graph for the last chunk
        if i >= data_size:  # Plot only for the final chunk
            plt.figure(figsize=(15, 10))
            pos = nx.spring_layout(G, k=2)

            # Plot networks
            nx.draw_networkx(
                G,
                pos,
                font_size=16,
                width=3,
                edge_color="grey",
                node_color="purple",
                with_labels=False,
            )

            # Create offset labels
            for key, value in pos.items():
                x, y = value[0] + 0.135, value[1] + 0.045
                plt.text(
                    x,
                    y,
                    s=key,
                    bbox=dict(facecolor="red", alpha=0.25),
                    horizontalalignment="center",
                    fontsize=13,
                )

            plt.title("Bigram Network Graph for Last Chunk")
            plt.savefig("bigram.png")

    # Create a DataFrame to display metrics
    metrics_df = pd.DataFrame(metrics)
    return metrics_df


async def test_bigram():
    # stopwordss = set(stopwords.words("english"))
    nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

    test_df = pd.read_csv("./assets/data/data_in.csv")
    test_df = pd.DataFrame(test_df, columns=["region", "province", "posts"])

    # Define increment
    increment = 3000

    # Run the analysis with the existing data in the dataframe
    metrics_df = analyze_data_in_chunks(test_df["posts"], increment, nlp)

    print(metrics_df)

    return JSONResponse(content=metrics_df.to_dict(orient="dict"))
