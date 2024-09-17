from fastapi import APIRouter
from controllers.analyticsController import (
    fetch_wordcloud,
    generate_frequent_words,
    generate_percentage,
    generate_suspected_symptom,
    generate_wordcloud,
)

router = APIRouter()

# GET       /suspected-symptom
router.add_api_route(
    "/suspected-symptom", methods=["GET"], endpoint=generate_suspected_symptom
)

# GET       /frequent-words
router.add_api_route(
    "/frequent-words/", methods=["GET"], endpoint=generate_frequent_words
)

# GET       /percentage
router.add_api_route("/percentage", methods=["GET"], endpoint=generate_percentage)

# GET       /wordcloud
router.add_api_route("/wordcloud", methods=["GET"], endpoint=generate_wordcloud)

# GET       /wordcloud/{filters}
router.add_api_route("/wordcloud/{filters}", methods=["GET"], endpoint=fetch_wordcloud)
