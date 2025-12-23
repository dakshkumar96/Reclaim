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
