from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import dotenv_values
import os
import certifi

# Get configuration values from .env file
config = dotenv_values()

# MONGODB URI CONNECTION
uri = os.getenv("MONGO_URI")

# Create a new client and connect to the server
# client = MongoClient(uri, server_api=ServerApi("1"), tlsCAFile=ca)
client = MongoClient(uri, server_api=ServerApi("1"))

# Send a ping to confirm a successful connection
try:
    client.admin.command("ping")
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Database Name
db = client[os.getenv("DB_NAME")]

# Tables / Collections
user_collection = db['users']
activity_logs_collection = db['activity_logs']