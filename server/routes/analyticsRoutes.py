from fastapi import APIRouter
from controllers.analyticsController import upload_dataset, generate_frequent_words, generate_wordcloud

router = APIRouter()

router.add_api_route("/upload", methods=["POST"], endpoint=upload_dataset)

router.add_api_route("/frequent-words", methods=["GET"], endpoint=generate_frequent_words)

router.add_api_route("/wordcloud", methods=["GET"], endpoint=generate_wordcloud)