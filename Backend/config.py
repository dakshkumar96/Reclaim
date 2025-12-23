import os
from dotenv import load_dotenv


# Load variables from Backend/database.env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, 'database.env'))


class Config:
    """Simple config class that reads from environment variables.

    Keeping this minimal so it's easy to understand and change later.
    """

    # Flask app
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-flask-secret-change-me")

