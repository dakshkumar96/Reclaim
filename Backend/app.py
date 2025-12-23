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

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", "dev-flask-secret-change-me")

# Enable CORS for frontend - allow all localhost origins for development
CORS(app, 
     origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
     supports_credentials=True, 
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

def get_db_connection():
    """Get a database connection"""
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
    )

def create_token(user_id, username):
    """Create JWT token for authenticated user"""
    exp = datetime.utcnow() + timedelta(minutes=JWT_EXPIRES_MIN)
    payload = {"user_id": user_id, "username": username, "exp": exp}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def token_required(f):
    """Decorator to protect routes that require authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({"success": False, "message": "Token is missing"}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
            g.user_id = data['user_id']
            g.username = data['username']
            
        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "message": "Token is invalid"}), 401
        
        return f(*args, **kwargs)
    return decorated

def bad_request(message):
    """Helper function for 400 errors"""
    return jsonify({"success": False, "message": message}), 400

@app.route("/api/health", methods=["GET"])
def health_check():
    """Check if app and database are working"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1;")
                cur.fetchone()
        return jsonify({"status": "healthy", "database": "connected"}), 200
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({"status": "unhealthy", "database": "disconnected"}), 500

@app.route("/api/signup", methods=["POST"])
def signup():
    """Register a new user"""
    if not request.is_json:
        return bad_request("Expected JSON data")
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if not data.get(field):
            return bad_request(f"{field} is required")
    
    username = data['username'].strip()
    email = data['email'].strip().lower()
    password = data['password']
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    
    # Basic validation
    if len(username) < 3:
        return bad_request("Username must be at least 3 characters")
    
    if len(password) < 6:
        return bad_request("Password must be at least 6 characters")
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Check if username or email already exists
                cur.execute(
                    "SELECT id FROM users WHERE username = %s OR email = %s;",
                    (username, email)
                )
                if cur.fetchone():
                    return jsonify({
                        "success": False, 
                        "message": "Username or email already exists"
                    }), 409
                
                # Hash password
                hashed_password = bcrypt.hashpw(
                    password.encode('utf-8'), 
                    bcrypt.gensalt()
                ).decode('utf-8')
                
                # Create user using database function
                cur.execute(
                    """SELECT create_user(%s, %s, %s, %s, %s) as result;""",
                    (username, hashed_password, email, first_name, last_name)
                )
                result = cur.fetchone()[0]
                
                # The function returns JSON, so we need to parse it
                import json
                if isinstance(result, dict):
                    result_data = result
                elif isinstance(result, str):
                    result_data = json.loads(result)
                else:
                    # PostgreSQL returns JSON as a string, parse it
                    result_data = json.loads(str(result))
                
                    user_id = result_data['user_id']
                
                conn.commit()
                
                # Create JWT token
                token = create_token(user_id, username)
                
                return jsonify({
                    "success": True,
                    "message": "User created successfully",
                    "user_id": user_id,
                    "username": username,
                    "token": token
                }), 201
                
    except Exception as e:
        logger.error(f"Signup error: {e}", exc_info=True)
        error_message = str(e)
        return jsonify({
            "success": False, 
            "message": f"Signup failed: {error_message}"
        }), 500

@app.route("/api/login", methods=["POST"])
def login():
    """Authenticate user and return JWT token"""
    if not request.is_json:
        return bad_request("Expected JSON data")
    
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    if not username or not password:
        return bad_request("Username and password are required")
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Get user by username
                cur.execute(
                    """SELECT id, username, password_hash, email 
                       FROM users WHERE username = %s;""",
                    (username,)
                )
                user = cur.fetchone()
                
                if not user:
                    return jsonify({
                        "success": False, 
                        "message": "Invalid credentials"
                    }), 401
                
                user_id, db_username, db_password_hash, email = user
                
                # Verify password
                if not bcrypt.checkpw(password.encode('utf-8'), db_password_hash.encode('utf-8')):
                    return jsonify({
                        "success": False, 
                        "message": "Invalid credentials"
                    }), 401
                
                # Create JWT token
                token = create_token(user_id, username)
                
                return jsonify({
                    "success": True,
                    "message": "Login successful",
                    "user_id": user_id,
                    "username": username,
                    "email": email,
                    "token": token
                }), 200
                
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({
            "success": False, 
            "message": "Internal server error during login"
        }), 500

@app.route("/api/challenges", methods=["GET"])
def get_challenges():
    """Get all active challenges from database"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT id, title, description, difficulty, xp_reward, 
                           duration_days, category 
                    FROM challenges 
                    WHERE is_active = true
                    ORDER BY difficulty, title;
                """)
                
                challenges = []
                for row in cur.fetchall():
                    challenges.append({
                        "id": row[0],
                        "title": row[1],
                        "description": row[2],
                        "difficulty": row[3],
                        "xp_reward": row[4],
                        "duration_days": row[5],
                        "category": row[6]
                    })
                
                return jsonify({
                    "success": True,
                    "challenges": challenges
                }), 200
                
    except Exception as e:
        logger.error(f"Error fetching challenges: {e}")
        return jsonify({
            "success": False, 
            "message": "Error fetching challenges"
        }), 500

@app.route("/api/challenges/active", methods=["GET"])
@token_required
def get_active_user_challenges():
    """Get challenges that the current user is actively participating in"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Set user context for RLS
                cur.execute("SELECT set_user_context(%s);", (g.user_id,))
                
                cur.execute("""
                    SELECT uc.id, c.title, c.description, c.difficulty, 
                           c.xp_reward, uc.progress_days, c.duration_days,
                           uc.started_at
                    FROM user_challenges uc
                    JOIN challenges c ON uc.challenge_id = c.id
                    WHERE uc.user_id = %s AND uc.status = 'active'
                    ORDER BY uc.started_at DESC;
                """, (g.user_id,))
                
                active_challenges = []
                for row in cur.fetchall():
                    progress_percentage = (row[5] / row[6]) * 100 if row[6] > 0 else 0
                    
                    active_challenges.append({
                        "user_challenge_id": row[0],
                        "title": row[1],
                        "description": row[2],
                        "difficulty": row[3],
                        "xp_reward": row[4],
                        "progress_days": row[5],
                        "total_days": row[6],
                        "progress_percentage": round(progress_percentage, 1),
                        "started_at": row[7].isoformat() if row[7] else None
                    })
                
                return jsonify({
                    "success": True,
                    "active_challenges": active_challenges
                }), 200
                
    except Exception as e:
        logger.error(f"Error fetching active challenges: {e}")
        return jsonify({
            "success": False, 
            "message": "Error fetching active challenges"
        }), 500

@app.route("/api/challenges/start", methods=["POST"])
@token_required
def start_challenge():
    """Start a new challenge"""
    if not request.is_json:
        return bad_request("Expected JSON data")
    
    data = request.get_json()
    challenge_id = data.get('challenge_id')
    
    if not challenge_id:
        return bad_request("challenge_id is required")
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Set user context for RLS
                cur.execute("SELECT set_user_context(%s);", (g.user_id,))
                
                # Check if user is already participating
                cur.execute("""
                    SELECT id FROM user_challenges 
                    WHERE user_id = %s AND challenge_id = %s;
                """, (g.user_id, challenge_id))
                
                if cur.fetchone():
                    return jsonify({
                        "success": False, 
                        "message": "You are already participating in this challenge"
                    }), 409
                
                # Start the challenge
                cur.execute("""
                    INSERT INTO user_challenges (user_id, challenge_id, status, started_at)
                    VALUES (%s, %s, 'active', CURRENT_TIMESTAMP)
                    RETURNING id;
                """, (g.user_id, challenge_id))
                
                user_challenge_id = cur.fetchone()[0]
                conn.commit()
                
                return jsonify({
                    "success": True,
                    "message": "Challenge started successfully",
                    "user_challenge_id": user_challenge_id
                }), 201
                
    except Exception as e:
        logger.error(f"Error starting challenge: {e}")
        return jsonify({
            "success": False, 
            "message": "Error starting challenge"
        }), 500

@app.route("/api/challenges/complete", methods=["POST"])
@token_required
def complete_challenge():
    """Mark a challenge as completed"""
    if not request.is_json:
        return bad_request("Expected JSON data")
    
    data = request.get_json()
    challenge_id = data.get('challenge_id')
    
    if not challenge_id:
        return bad_request("challenge_id is required")
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Set user context for RLS
                cur.execute("SELECT set_user_context(%s);", (g.user_id,))
                
                # Use the database function to complete the challenge
                cur.execute("SELECT complete_challenge(%s, %s);", (g.user_id, challenge_id))
                result = cur.fetchone()[0]
                
                conn.commit()
                
                return jsonify({
                    "success": True,
                    "message": "Challenge completed successfully!",
                    "data": result
                }), 200
                
    except Exception as e:
        logger.error(f"Error completing challenge: {e}")
        error_msg = str(e)
        if "already completed" in error_msg.lower():
            return jsonify({
                "success": False, 
                "message": "Challenge already completed"
            }), 409
        elif "not actively participating" in error_msg.lower():
            return jsonify({
                "success": False, 
                "message": "You are not participating in this challenge"
            }), 404
        else:
            return jsonify({
                "success": False, 
                "message": "Error completing challenge"
            }), 500

@app.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    """Get the current leaderboard"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT username, xp, level, rank, completed_challenges, badges_earned
                    FROM leaderboard_view
                    ORDER BY rank
                    LIMIT 50;
                """)
                
                leaderboard = []
                for row in cur.fetchall():
                    leaderboard.append({
                        "username": row[0],
                        "xp": row[1],
                        "level": row[2],
                        "rank": row[3],
                        "completed_challenges": row[4],
                        "badges_earned": row[5]
                    })
                
                return jsonify({
                    "success": True,
                    "leaderboard": leaderboard
                }), 200
                
    except Exception as e:
        logger.error(f"Error fetching leaderboard: {e}")
        return jsonify({
            "success": False, 
            "message": "Error fetching leaderboard"
        }), 500

@app.route("/api/profile", methods=["GET"])
@token_required
def get_profile():
    """Get current user's profile and stats"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Set user context for RLS
                cur.execute("SELECT set_user_context(%s);", (g.user_id,))
                
                # Get user stats using database function
                cur.execute("SELECT get_user_stats(%s);", (g.user_id,))
                result = cur.fetchone()[0]
                
                return jsonify({
                    "success": True,
                    "profile": result
                }), 200
                
    except Exception as e:
        logger.error(f"Error fetching profile: {e}")
        return jsonify({
            "success": False, 
            "message": "Error fetching profile"
        }), 500

@app.route("/api/logout", methods=["POST"])
@token_required
def logout():
    """Clear user context (optional server-side cleanup)"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT clear_user_context();")
                conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Logged out successfully"
        }), 200
        
    except Exception as e:
        logger.error(f"Error during logout: {e}")
        return jsonify({
            "success": False, 
            "message": "Error during logout"
        }), 500
