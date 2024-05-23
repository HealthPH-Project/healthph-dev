from fastapi import APIRouter
from controllers.analyticsController import (
    generate_frequent_words,
    generate_percentage,
    generate_wordcloud,
)

router = APIRouter()

router.add_api_route(
    "/frequent-words", methods=["GET"], endpoint=generate_frequent_words
)

router.add_api_route("/percentage", methods=["GET"], endpoint=generate_percentage)

router.add_api_route("/wordcloud", methods=["GET"], endpoint=generate_wordcloud)