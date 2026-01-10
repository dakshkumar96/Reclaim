import os
import logging
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, request, jsonify, g
from flask_cors import CORS
import psycopg2
import bcrypt
import jwt

from config import Config

# Validate required environment variables in production
is_production = os.getenv("FLASK_ENV") == "production" or os.getenv("ENVIRONMENT") == "production"

if is_production:
    required_vars = ["DB_NAME", "DB_USER", "DB_PASSWORD", "JWT_SECRET", "FLASK_SECRET_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        raise ValueError(f"Missing required environment variables in production: {', '.join(missing_vars)}")

# Use Config class for all configuration
DB_NAME = Config.DB_NAME
DB_USER = Config.DB_USER
DB_PASSWORD = Config.DB_PASSWORD
DB_HOST = Config.DB_HOST
JWT_SECRET = Config.JWT_SECRET
JWT_ALG = Config.JWT_ALG
JWT_EXPIRES_MIN = Config.JWT_EXPIRES_MIN

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config["SECRET_KEY"] = Config.SECRET_KEY

# Store conversation history per user (in production, use Redis or database)
# Format: {user_id: [{"role": "user/assistant", "content": "message"}, ...]}
user_conversations = {}

# Enable CORS for frontend - configurable for production
FRONTEND_URLS = os.getenv("FRONTEND_URLS", "http://localhost:5173,http://localhost:3000").split(",")
FRONTEND_URLS = [url.strip() for url in FRONTEND_URLS]  # Clean whitespace
CORS(app, 
     origins=FRONTEND_URLS,
     supports_credentials=True, 
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

def get_db_connection():
    """Get a database connection"""
    return psycopg2.connect(**Config.db_dsn())

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
                # Hash password
                hashed_password = bcrypt.hashpw(
                    password.encode('utf-8'), 
                    bcrypt.gensalt()
                ).decode('utf-8')
                
                # Create user using database function
                # The function will handle duplicate checking and RLS properly
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
                
                # Check if function returned an error
                if not result_data.get('success', True):
                    error_msg = result_data.get('message', 'Signup failed')
                    return jsonify({
                        "success": False,
                        "message": error_msg
                    }), 409
                
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
        
        # Handle specific database errors
        if "already exists" in error_message.lower() or "username already" in error_message.lower():
            return jsonify({
                "success": False,
                "message": "Username or email already exists"
            }), 409
        elif "email already" in error_message.lower():
            return jsonify({
                "success": False,
                "message": "Email already exists"
            }), 409
        
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
        logger.error(f"Login error: {e}", exc_info=True)
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
                    SELECT uc.id, c.id, c.title, c.description, c.difficulty, 
                           c.xp_reward, uc.progress_days, c.duration_days,
                           uc.started_at
                    FROM user_challenges uc
                    JOIN challenges c ON uc.challenge_id = c.id
                    WHERE uc.user_id = %s AND uc.status = 'active'
                    ORDER BY uc.started_at DESC;
                """, (g.user_id,))
                
                challenge_rows = cur.fetchall()
                active_challenges = []
                
                for row in challenge_rows:
                    user_challenge_id = row[0]
                    challenge_id = row[1]
                    progress_percentage = (row[6] / row[7]) * 100 if row[7] > 0 else 0
                    
                    # Check if checked in today
                    cur.execute("""
                        SELECT id FROM daily_logs 
                        WHERE user_id = %s AND challenge_id = %s AND log_date = CURRENT_DATE;
                    """, (g.user_id, challenge_id))
                    checked_in_today = cur.fetchone() is not None
                    
                    # Get streak info
                    cur.execute("""
                        SELECT current_streak, longest_streak 
                        FROM streaks 
                        WHERE user_id = %s AND challenge_id = %s;
                    """, (g.user_id, challenge_id))
                    streak_row = cur.fetchone()
                    current_streak = streak_row[0] if streak_row else 0
                    longest_streak = streak_row[1] if streak_row else 0
                    
                    active_challenges.append({
                        "user_challenge_id": user_challenge_id,
                        "challenge_id": challenge_id,
                        "title": row[2],
                        "description": row[3],
                        "difficulty": row[4],
                        "xp_reward": row[5],
                        "progress_days": row[6],
                        "total_days": row[7],
                        "progress_percentage": round(progress_percentage, 1),
                        "started_at": row[8].isoformat() if row[8] else None,
                        "checked_in_today": checked_in_today,
                        "current_streak": current_streak,
                        "longest_streak": longest_streak
                    })
                
                return jsonify({
                    "success": True,
                    "active_challenges": active_challenges
                }), 200
                
    except Exception as e:
        logger.error(f"Error fetching active challenges: {e}", exc_info=True)
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
        logger.error(f"Error starting challenge: {e}", exc_info=True)
        error_msg = str(e)
        if "foreign key" in error_msg.lower() or "does not exist" in error_msg.lower():
            return jsonify({
                "success": False, 
                "message": "Challenge not found"
            }), 404
        return jsonify({
            "success": False, 
            "message": "Error starting challenge. Please try again."
        }), 500

@app.route("/api/challenges/checkin", methods=["POST"])
@token_required
def checkin_challenge():
    """Check in for a challenge (daily check-in)"""
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
                
                # Check if user is participating in this challenge
                cur.execute("""
                    SELECT id, progress_days 
                    FROM user_challenges 
                    WHERE user_id = %s AND challenge_id = %s AND status = 'active';
                """, (g.user_id, challenge_id))
                
                user_challenge = cur.fetchone()
                if not user_challenge:
                    return jsonify({
                        "success": False, 
                        "message": "You are not participating in this challenge or it's not active"
                    }), 404
                
                user_challenge_id, current_progress = user_challenge
                
                # Check if already checked in today
                cur.execute("""
                    SELECT id FROM daily_logs 
                    WHERE user_id = %s AND challenge_id = %s AND log_date = CURRENT_DATE;
                """, (g.user_id, challenge_id))
                
                if cur.fetchone():
                    return jsonify({
                        "success": False, 
                        "message": "You have already checked in for this challenge today"
                    }), 409
                
                # Insert daily log
                cur.execute("""
                    INSERT INTO daily_logs (user_id, challenge_id, log_date, completed)
                    VALUES (%s, %s, CURRENT_DATE, TRUE)
                    RETURNING id;
                """, (g.user_id, challenge_id))
                
                log_id = cur.fetchone()[0]
                
                # Update progress_days
                new_progress = current_progress + 1
                cur.execute("""
                    UPDATE user_challenges 
                    SET progress_days = %s
                    WHERE id = %s;
                """, (new_progress, user_challenge_id))
                
                # Handle streak logic
                cur.execute("""
                    SELECT id, current_streak, longest_streak, last_active
                    FROM streaks
                    WHERE user_id = %s AND challenge_id = %s;
                """, (g.user_id, challenge_id))
                
                streak_record = cur.fetchone()
                
                if streak_record:
                    streak_id, current_streak, longest_streak, last_active = streak_record
                    # Check if last_active was yesterday (consecutive day)
                    cur.execute("""
                        SELECT last_active = CURRENT_DATE - INTERVAL '1 day' as is_consecutive
                        FROM streaks
                        WHERE id = %s;
                    """, (streak_id,))
                    is_consecutive = cur.fetchone()[0]
                    
                    if is_consecutive:
                        # Consecutive day - increment streak
                        new_streak = current_streak + 1
                    else:
                        # Not consecutive - reset to 1
                        new_streak = 1
                    
                    new_longest = max(longest_streak, new_streak)
                    
                    cur.execute("""
                        UPDATE streaks
                        SET current_streak = %s,
                            longest_streak = %s,
                            last_active = CURRENT_DATE
                        WHERE id = %s;
                    """, (new_streak, new_longest, streak_id))
                else:
                    # Create new streak record
                    new_streak = 1
                    cur.execute("""
                        INSERT INTO streaks (user_id, challenge_id, current_streak, longest_streak, last_active)
                        VALUES (%s, %s, %s, %s, CURRENT_DATE);
                    """, (g.user_id, challenge_id, new_streak, new_streak))
                
                conn.commit()
                
                return jsonify({
                    "success": True,
                    "message": "Check-in successful!",
                    "progress_days": new_progress,
                    "current_streak": new_streak
                }), 200
                
    except Exception as e:
        logger.error(f"Error during check-in: {e}", exc_info=True)
        error_msg = str(e)
        if "unique" in error_msg.lower() and "daily_logs" in error_msg.lower():
            return jsonify({
                "success": False, 
                "message": "You have already checked in for this challenge today"
            }), 409
        return jsonify({
            "success": False, 
            "message": "Error during check-in. Please try again."
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
                
                # Check and award badges after challenge completion
                new_badges = check_and_award_badges(g.user_id)
                
                return jsonify({
                    "success": True,
                    "message": "Challenge completed successfully!",
                    "data": result,
                    "new_badges": new_badges
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
    """Get the current leaderboard. Optionally returns user rank if authenticated."""
    try:
        # Try to get authenticated user (optional)
        user_id = None
        token = request.headers.get('Authorization')
        if token:
            try:
                if token.startswith('Bearer '):
                    token = token[7:]
                data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
                user_id = data['user_id']
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                # Token invalid/expired, but continue without auth (public leaderboard)
                pass
        
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Get leaderboard
                cur.execute("""
                    SELECT username, xp, level, rank, completed_challenges, badges_earned
                    FROM leaderboard_view
                    ORDER BY rank
                    LIMIT 50;
                """)
                
                leaderboard = []
                for row in cur.fetchall():
                    leaderboard.append({
                        "username": row[0] or "",
                        "xp": row[1] or 0,
                        "level": row[2] or 1,
                        "rank": row[3] or 0,
                        "completed_challenges": row[4] or 0,
                        "badges_earned": row[5] or 0
                    })
                
                # Get user rank if authenticated
                user_rank = None
                if user_id:
                    try:
                        cur.execute("SELECT get_user_rank(%s);", (user_id,))
                        rank_result = cur.fetchone()
                        if rank_result and rank_result[0]:
                            user_rank = rank_result[0]
                    except Exception as rank_error:
                        logger.warning(f"Could not fetch user rank: {rank_error}")
                
                response = {
                    "success": True,
                    "leaderboard": leaderboard
                }
                
                if user_rank is not None:
                    response["user_rank"] = user_rank
                
                return jsonify(response), 200
                
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

def check_and_award_badges(user_id):
    """Check if user qualifies for any badges and award them"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Get user stats
                cur.execute("""
                    SELECT xp, level FROM users WHERE id = %s;
                """, (user_id,))
                user_row = cur.fetchone()
                if not user_row:
                    return []
                
                user_xp, user_level = user_row
                
                # Get user's longest streak
                cur.execute("""
                    SELECT COALESCE(MAX(longest_streak), 0) 
                    FROM streaks WHERE user_id = %s;
                """, (user_id,))
                longest_streak = cur.fetchone()[0] or 0
                
                # Get completed challenges count
                cur.execute("""
                    SELECT COUNT(*) FROM user_challenges 
                    WHERE user_id = %s AND status = 'completed';
                """, (user_id,))
                completed_challenges = cur.fetchone()[0] or 0
                
                # Get completed challenges by category
                cur.execute("""
                    SELECT c.category, COUNT(*) 
                    FROM user_challenges uc
                    JOIN challenges c ON uc.challenge_id = c.id
                    WHERE uc.user_id = %s AND uc.status = 'completed'
                    GROUP BY c.category;
                """, (user_id,))
                category_counts = {row[0]: row[1] for row in cur.fetchall()}
                
                # Find badges user qualifies for but hasn't earned
                cur.execute("""
                    SELECT b.id, b.name, b.description, b.icon, b.category
                    FROM badges b
                    WHERE b.is_active = true
                    AND NOT EXISTS (
                        SELECT 1 FROM user_badges ub 
                        WHERE ub.user_id = %s AND ub.badge_id = b.id
                    )
                    AND (
                        (b.xp_requirement > 0 AND %s >= b.xp_requirement)
                        OR (b.streak_requirement > 0 AND %s >= b.streak_requirement)
                        OR (b.xp_requirement = 0 AND b.streak_requirement = 0 
                            AND b.category = 'challenge' AND %s >= 1)
                        OR (b.category IN ('health', 'productivity', 'mindfulness', 'education')
                            AND COALESCE((SELECT COUNT(*) FROM user_challenges uc
                            JOIN challenges c ON uc.challenge_id = c.id
                            WHERE uc.user_id = %s AND uc.status = 'completed' 
                            AND c.category = b.category), 0) >= 3)
                    );
                """, (user_id, user_xp, longest_streak, completed_challenges, user_id))
                
                new_badges = []
                for badge_row in cur.fetchall():
                    badge_id, badge_name, badge_desc, badge_icon, badge_category = badge_row
                    
                    # Award the badge
                    cur.execute("""
                        INSERT INTO user_badges (user_id, badge_id, earned_at)
                        VALUES (%s, %s, CURRENT_TIMESTAMP)
                        ON CONFLICT (user_id, badge_id) DO NOTHING
                        RETURNING id;
                    """, (user_id, badge_id))
                    
                    if cur.fetchone():
                        new_badges.append({
                            "id": badge_id,
                            "name": badge_name,
                            "description": badge_desc,
                            "icon": badge_icon,
                            "category": badge_category
                        })
                
                conn.commit()
                return new_badges
                
    except Exception as e:
        logger.error(f"Error checking badges: {e}")
        return []

@app.route("/api/badges", methods=["GET"])
def get_all_badges():
    """Get all available badges"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT id, name, description, icon, xp_requirement, 
                           streak_requirement, category
                    FROM badges
                    WHERE is_active = true
                    ORDER BY category, xp_requirement, streak_requirement;
                """)
                
                badges = []
                for row in cur.fetchall():
                    badges.append({
                        "id": row[0],
                        "name": row[1],
                        "description": row[2],
                        "icon": row[3],
                        "xp_requirement": row[4],
                        "streak_requirement": row[5],
                        "category": row[6]
                    })
                
                return jsonify({
                    "success": True,
                    "badges": badges
                }), 200
                
    except Exception as e:
        logger.error(f"Error fetching badges: {e}")
        return jsonify({
            "success": False, 
            "message": "Error fetching badges"
        }), 500

@app.route("/api/badges/user", methods=["GET"])
@token_required
def get_user_badges():
    """Get badges earned by the current user"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT b.id, b.name, b.description, b.icon, b.category, ub.earned_at
                    FROM user_badges ub
                    JOIN badges b ON ub.badge_id = b.id
                    WHERE ub.user_id = %s
                    ORDER BY ub.earned_at DESC;
                """, (g.user_id,))
                
                badges = []
                for row in cur.fetchall():
                    badges.append({
                        "id": row[0],
                        "name": row[1],
                        "description": row[2],
                        "icon": row[3],
                        "category": row[4],
                        "earned_at": row[5].isoformat() if row[5] else None
                    })
                
                return jsonify({
                    "success": True,
                    "badges": badges
                }), 200
                
    except Exception as e:
        logger.error(f"Error fetching user badges: {e}")
        return jsonify({
            "success": False, 
            "message": "Error fetching user badges"
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"success": False, "message": "Endpoint not found"}), 404

@app.route("/api/ai/chat", methods=["POST"])
@token_required
def ai_chat():
    """AI coach chat endpoint with OpenAI integration"""
    if not request.is_json:
        return bad_request("Expected JSON data")
    
    data = request.get_json()
    message = data.get('message', '').strip()
    
    if not message:
        return bad_request("Message is required")
    
    try:
        # Optional: Get user context for personalized responses
        user_context = None
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    # Get user stats for context
                    cur.execute("""
                        SELECT level, xp, 
                               (SELECT COUNT(*) FROM user_challenges 
                                WHERE user_id = %s AND completed = false) as active_challenges,
                               (SELECT MAX(current_streak) FROM streaks 
                                WHERE user_id = %s) as current_streak
                        FROM users 
                        WHERE id = %s;
                    """, (g.user_id, g.user_id, g.user_id))
                    
                    result = cur.fetchone()
                    if result:
                        user_context = {
                            'level': result[0],
                            'xp': result[1],
                            'active_challenges': result[2] or 0,
                            'current_streak': result[3] or 0
                        }
        except Exception as db_error:
            logger.warning(f"Could not fetch user context: {db_error}")
            # Continue without context
        
        # Import AI coach function
        from AI.ai_coach import get_ai_response
        
        # Get conversation history for this user (keep last 10 messages)
        # Create a copy to avoid modifying the original list directly
        conversation_history = user_conversations.get(g.user_id, [])[:]
        
        # Get AI response with conversation history
        ai_response = get_ai_response(message, user_context, conversation_history)
        
        # Update conversation history
        conversation_history.append({"role": "user", "content": message})
        conversation_history.append({"role": "assistant", "content": ai_response})
        
        # Keep only last 10 messages (5 exchanges) to manage token usage
        user_conversations[g.user_id] = conversation_history[-10:]
        
        return jsonify({
            "success": True,
            "message": ai_response,
            "response": ai_response
        }), 200
        
    except Exception as e:
        logger.error(f"AI chat error: {e}", exc_info=True)
        # Check if it's an OpenAI API error
        error_message = str(e)
        if "quota" in error_message.lower() or "rate limit" in error_message.lower() or "429" in error_message:
            return jsonify({
                "success": False,
                "message": "OpenAI API quota exceeded. Please check your API key and billing."
            }), 503
        elif "authentication" in error_message.lower() or "401" in error_message or "invalid" in error_message.lower():
            return jsonify({
                "success": False,
                "message": "OpenAI API authentication failed. Please check your API key."
            }), 503
        else:
            return jsonify({
                "success": False,
                "message": "Sorry, I encountered an error connecting to OpenAI. Please try again."
            }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"success": False, "message": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "message": "Internal server error"}), 500

if __name__ == "__main__":
    logger.info("Starting Reclaim Habit Tracker API...")
    app.run(debug=True, host='0.0.0.0', port=5000)
