def check_unique_location(x, y):
    return (
        x["PH_code"] == y["PH_code"] and x["lat"] == y["lat"] and x["long"] == y["long"]
    )
