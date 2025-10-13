import os
import logging
from datetime import datetime, timedelta

from flask import Flask, request, jsonify
from dotenv import load_dotenv
import psycopg2
import bcrypt
import jwt

# Load environment variables from Backend/database.env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, 'database.env'))

# Basic config pulled from env with safe defaults
DB_NAME = os.getenv("DB_NAME", "reclaim")
DB_USER = os.getenv("DB_USER", "reclaim_app")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALG = "HS256"
JWT_EXPIRES_MIN = int(os.getenv("JWT_EXPIRES_MIN", "1440"))  # 24h default

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", "dev-flask-secret-change-me")


def get_conn():
    """Open a new database connection. Keep it simple and explicit."""
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
    )


def create_token(user_id, username):
    """Create a short-lived JWT for the user."""
    exp = datetime.utcnow() + timedelta(minutes=JWT_EXPIRES_MIN)
    payload = {"sub": user_id, "username": username, "exp": exp}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def bad_request(message):
    return jsonify({"success": False, "message": message}), 400


@app.route("/api/healthz", methods=["GET"])
def healthz():
    """Basic health check for app and database."""
    try:
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT 1;")
            cur.fetchone()
        return jsonify({"ok": True}), 200
    except Exception:
        return jsonify({"ok": False}), 500


@app.route("/api/signup", methods=["POST"])
def signup():
    if not request.is_json:
        return bad_request("Expected JSON body")

    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "")

    if not username or not password:
        return bad_request("Username and password are required")

    try:
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT 1 FROM users WHERE username = %s;", (username,))
            if cur.fetchone():
                return jsonify({"success": False, "message": "Username already taken"}), 409

            hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            cur.execute(
                "INSERT INTO users (username, password) VALUES (%s, %s) RETURNING id;",
                (username, hashed),
            )
            user_id = cur.fetchone()[0]
            conn.commit()

        token = create_token(user_id, username)
        return jsonify({
            "success": True,
            "message": "User created successfully",
            "user_id": user_id,
            "token": token,
        }), 201
    except Exception as e:
        logger.exception("Signup failed")
        return jsonify({"success": False, "message": "Internal server error"}), 500


@app.route("/api/login", methods=["POST"])
def login():
    if not request.is_json:
        return bad_request("Expected JSON body")

    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "")

    if not username or not password:
        return bad_request("Username and password are required")

    try:
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute(
                "SELECT id, username, password FROM users WHERE username = %s;",
                (username,),
            )
            row = cur.fetchone()

        if not row:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        user_id, db_username, db_password_hash = row
        if not bcrypt.checkpw(password.encode("utf-8"), db_password_hash.encode("utf-8")):
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        token = create_token(user_id, db_username)
        return jsonify({"success": True, "message": "Login successful", "token": token}), 200
    except Exception:
        logger.exception("Login failed")
        return jsonify({"success": False, "message": "Internal server error"}), 500


@app.route("/api/challenges", methods=["GET"])
def challenges():
    """Static list for now; can move to DB later."""
    return jsonify([
        {"id": 1, "title": "No Instagram for 1 day", "xp": 10},
        {"id": 2, "title": "Drink 8 glasses of water", "xp": 5},
    ]), 200


@app.route("/api/complete_challenge", methods=["POST"])
def complete_challenge():
    if not request.is_json:
        return bad_request("Expected JSON body")

    data = request.get_json(silent=True) or {}
    challenge_id = data.get("challenge_id")
    if challenge_id is None:
        return bad_request("challenge_id is required")

    # Here you could record completion in DB. We'll keep it simple for now.
    return jsonify({"success": True, "message": "Challenge completed!"}), 200


@app.route("/api/leaderboard", methods=["GET"])
def leaderboard():
    """Static leaderboard for now."""
    return jsonify([
        {"username": "john", "xp": 120},
        {"username": "alice", "xp": 110},
        {"username": "bob", "xp": 90},
    ]), 200


if __name__ == "__main__":
    logger.info("Starting Flask app...")
    app.run(debug=True, host='0.0.0.0', port=5000)
