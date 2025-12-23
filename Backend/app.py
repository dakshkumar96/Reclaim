import os
import logging
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, request, jsonify, g
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
import bcrypt
import jwt

# Load environment variables
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, 'database.env'))

# Configuration
DB_NAME = os.getenv("DB_NAME", "reclaim")
DB_USER = os.getenv("DB_USER", "reclaim_app")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALG = "HS256"
JWT_EXPIRES_MIN = int(os.getenv("JWT_EXPIRES_MIN", "1440"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
