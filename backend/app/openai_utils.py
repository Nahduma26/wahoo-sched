from flask_openai import OpenAI
from flask import current_app
from dotenv import load_dotenv
import os
load_dotenv()
client = OpenAI()
client.api_key = os.getenv('OPENAI_API_KEY')
def get_openai_client():
    """
    Get the OpenAI client from the current Flask app context.
    """
    return client