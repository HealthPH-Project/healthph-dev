def check_unique_location(x, y):
    return (
        x["PH_code"] == y["PH_code"] and x["lat"] == y["lat"] and x["long"] == y["long"]
    )


def sort_regions(data):
    order_index = {
        "PH-00": 0,
        "PH-01": 1,
        "PH-02": 2,
        "PH-03": 3,
        "PH-15": 4,
        "PH-40": 5,
        "PH-41": 6,
        "PH-05": 7,
        "PH-06": 8,
        "PH-07": 9,
        "PH-08": 10,
        "PH-09": 11,
        "PH-10": 12,
        "PH-11": 13,
        "PH-12": 14,
        "PH-13": 15,
        "PH-14": 16,
    }

    return sorted(data, key=lambda x: order_index.get(x["PH_code"], 17))
