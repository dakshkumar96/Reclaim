from datetime import datetime, timedelta

import bcrypt
import jwt
from flask import Blueprint, jsonify, request

from config import Config
from models import user_by_username, username_exists, create_user


api = Blueprint("api", __name__, url_prefix="/api")


def create_token(user_id: int, username: str) -> str:
    """Create a JWT with an expiration time."""
    exp = datetime.utcnow() + timedelta(minutes=Config.JWT_EXPIRES_MIN)
    payload = {"sub": user_id, "username": username, "exp": exp}
    return jwt.encode(payload, Config.JWT_SECRET, algorithm=Config.JWT_ALG)


def bad_request(message: str):
    return jsonify({"success": False, "message": message}), 400


@api.get("/healthz")
def healthz():
    # Simple check: if the app is running, this returns ok.
    return jsonify({"ok": True}), 200


@api.post("/signup")
def signup():
    if not request.is_json:
        return bad_request("Expected JSON body")

    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "")

    if not username or not password:
        return bad_request("Username and password are required")

    if username_exists(username):
        return jsonify({"success": False, "message": "Username already taken"}), 409

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user_id = create_user(username, hashed)
    token = create_token(user_id, username)
    return jsonify({
        "success": True,
        "message": "User created successfully",
        "user_id": user_id,
        "token": token,
    }), 201


@api.post("/login")
def login():
    if not request.is_json:
        return bad_request("Expected JSON body")

    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "")

    if not username or not password:
        return bad_request("Username and password are required")

    row = user_by_username(username)
    if not row:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    user_id, db_username, db_password_hash = row
    if not bcrypt.checkpw(password.encode("utf-8"), db_password_hash.encode("utf-8")):
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    token = create_token(user_id, db_username)
    return jsonify({"success": True, "message": "Login successful", "token": token}), 200


@api.get("/challenges")
def challenges():
    # Hard-coded list for now. Later, you can move this to the database.
    return jsonify([
        {"id": 1, "title": "No Instagram for 1 day", "xp": 10},
        {"id": 2, "title": "Drink 8 glasses of water", "xp": 5},
    ]), 200


@api.post("/complete_challenge")
def complete_challenge():
    if not request.is_json:
        return bad_request("Expected JSON body")

    data = request.get_json(silent=True) or {}
    if data.get("challenge_id") is None:
        return bad_request("challenge_id is required")

    # You could save completion in DB here.
    return jsonify({"success": True, "message": "Challenge completed!"}), 200


@api.get("/leaderboard")
def leaderboard():
    # Hard-coded leaderboard for now.
    return jsonify([
        {"username": "john", "xp": 120},
        {"username": "alice", "xp": 110},
        {"username": "bob", "xp": 90},
    ]), 200


