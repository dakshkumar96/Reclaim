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

    # Database
    DB_NAME = os.getenv("DB_NAME", "reclaim")
    DB_USER = os.getenv("DB_USER", "reclaim_app")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_HOST = os.getenv("DB_HOST", "localhost")

    # JWT settings
    JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
    JWT_ALG = "HS256"
    JWT_EXPIRES_MIN = int(os.getenv("JWT_EXPIRES_MIN", "1440"))

    @staticmethod
    def db_dsn():
        """Return a dict that psycopg2.connect understands."""
        return {
            "dbname": Config.DB_NAME,
            "user": Config.DB_USER,
            "password": Config.DB_PASSWORD,
            "host": Config.DB_HOST,
        }


