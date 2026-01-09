import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, 'database.env'))

# Initialize OpenAI client
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables. Please add it to database.env")

client = OpenAI(api_key=OPENAI_API_KEY)

def get_openai_client():
    """Get OpenAI client instance"""
    return client

