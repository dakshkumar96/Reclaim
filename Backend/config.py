import os
from dotenv import load_dotenv


# Load variables from Backend/database.env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, 'database.env'))
