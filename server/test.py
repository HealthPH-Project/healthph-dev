import json
import pandas as pd

# from config.database import sample_collection
import pandas as pd


def individual_sample(data) -> dict:
    return {
        "id": str(data["_id"]),
        "PH_code": data["PH_code"],
        "lat": data["lat"],
        "long": data["long"],
        "annotations": data["annotations"],
        "keywords": data["keywords"],
    }


def list_sample(data) -> dict:
    return [individual_sample(d) for d in data]


def check_unique(x, y):
    return (
        x["PH_code"] == y["PH_code"] and x["lat"] == y["lat"] and x["long"] == y["long"]
    )


def create_sample(annotated_filename):
    test_path = f"assets/data/{annotated_filename}.csv"

    test_df = pd.read_csv(test_path)

    print(test_df)

    test_dict: dict = test_df.to_dict("records")
    print(test_dict)

    to_encode_dict = []

    for td in test_dict:
        PH_code = td["PH_code"]
        lat = td["lat"]
        long = td["long"]
        annotations = str.split(td["annotations"], sep=",")
        e_k = td["extracted_words"]

        index = next(
            (i for (i, d) in enumerate(to_encode_dict) if check_unique(d, td)), -1
        )

        if index >= 0:
            print(f"{PH_code} exists")

            ted_annotations = to_encode_dict[index]["annotations"]
            merged_annotations = list(set(annotations).union(set(ted_annotations)))
            to_encode_dict[index]["annotations"] = merged_annotations

            ted_keywords: list = to_encode_dict[index]["keywords"]

            print(f"Keywords : {ted_keywords}")

            newIndex = next(
                (i for (i, tk) in enumerate(ted_keywords) if tk["key"] == e_k), -1
            )

            if newIndex >= 0:
                ted_keyword = ted_keywords[newIndex]
                ted_keyword["count"] = ted_keyword["count"] + 1
                ted_keyword_annotations = ted_keyword["annotation"]
                merged_ted_keyword_annotations = list(
                    set(annotations).union(set(ted_keyword_annotations))
                )
                ted_keyword["annotation"] = merged_ted_keyword_annotations

                ted_keywords[newIndex] = ted_keyword
            else:
                print(f"E_K: {e_k}")
                ted_keywords.append({"key": e_k, "count": 1, "annotation": annotations})
            to_encode_dict[index]["keywords"] = ted_keywords

        else:
            to_encode_dict.append(
                {
                    "PH_code": td["PH_code"],
                    "lat": td["lat"],
                    "long": td["long"],
                    "annotations": annotations,
                    "keywords": [{"key": e_k, "count": 1, "annotation": annotations}],
                }
            )
            print(f"{PH_code} not exists")

    # print(json.dumps(to_encode_dict, indent=4))

    with open(f"assets/data/{annotated_filename}.json", "w") as f:
        f.write(json.dumps(to_encode_dict, indent=2))
    # inserted_documents = sample_collection.insert_many(to_encode_dict)

    # print(inserted_documents)
    pass


def fetch_sample():
    print("fetching")

    pass


if __name__ == "__main__":
    create_sample("dummy_annotated2")
    # fetch_sample()

    pass
