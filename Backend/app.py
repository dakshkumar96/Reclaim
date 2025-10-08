from flask import Flask, render_template, request, jsonify
import logging
import os
import psycopg2

conn = psycopg2.connect(
    dbname="reclaim",
    user="reclaim_app",
    password="your_password",
    host="localhost"
)


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)


@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = %s;", (username,))
    existing = cur.fetchone()

    if existing:
        return jsonify({"success": False, "message": "Username already taken"})

    cur.execute(
        "INSERT INTO users (username, password) VALUES (%s, %s) RETURNING id;",
        (username, password)
    )
    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()

    return jsonify({"success": True, "message": "User created successfully", "user_id": user_id})



@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = %s;", (username,))
    existing = cur.fetchone()
    cur.close()

    if not existing:
        return jsonify({"success": False, "message": "Username does not exist"})

    # Here you should also verify the password
    if existing[1] != password:  # assuming password is the second column
        return jsonify({"success": False, "message": "Incorrect password"})

    return jsonify({"success": True, "message": "Login successful"})




@app.route("/api/challenges", methods=["GET"])
def challenges():
    return [
  { "id": 1, "title": "No Instagram for 1 day", "xp": 10 },
  { "id": 2, "title": "Drink 8 glasses of water", "xp": 5 }
]




@app.route("/api/complete_challenge", methods=["POST"])
def complete_challenge():
    { "success": True, "message": "Challenge completed!" }



@app.route("/api/leaderboard", methods=["GET"])
def leaderboard():
    [
  { "username": "john", "xp": 120 },
  { "username": "alice", "xp": 110 },
  { "username": "bob", "xp": 90 }
]


