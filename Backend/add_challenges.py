"""Script to add 6 new challenges to the database"""
import os
import sys
from dotenv import load_dotenv
import psycopg2

# Load environment variables
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, 'database.env'))

# Database configuration
DB_NAME = os.getenv("DB_NAME", "reclaim")
DB_USER = os.getenv("DB_USER", "reclaim_app")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")

# New challenges to add
NEW_CHALLENGES = [
    (
        'Daily Exercise',
        'Exercise for at least 30 minutes every day. This can include walking, running, yoga, or any physical activity you enjoy.',
        'easy',
        75,
        14,
        'health'
    ),
    (
        'Reading Habit',
        'Read for 30 minutes every day. Build a consistent reading habit and expand your knowledge one page at a time.',
        'medium',
        180,
        21,
        'education'
    ),
    (
        'Early Bird',
        'Wake up at the same time every day (including weekends) to regulate your sleep schedule and boost productivity.',
        'medium',
        120,
        14,
        'productivity'
    ),
    (
        'Gratitude Journal',
        'Write down 3 things you are grateful for every day. Cultivate positivity and mindfulness in your daily routine.',
        'easy',
        60,
        30,
        'mindfulness'
    ),
    (
        'No Junk Food',
        'Avoid processed and junk food for a month. Focus on whole, nutritious foods to improve your health.',
        'hard',
        300,
        30,
        'health'
    ),
    (
        'Meditation Master',
        'Meditate for 10 minutes every day. Reduce stress, improve focus, and find inner peace through regular practice.',
        'easy',
        70,
        21,
        'mindfulness'
    )
]

def add_challenges():
    try:
        # Connect to database
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
        )
        
        cur = conn.cursor()
        
        # Check current count
        cur.execute("SELECT COUNT(*) FROM challenges;")
        current_count = cur.fetchone()[0]
        print(f"Current challenges in database: {current_count}")
        
        # Add new challenges (only if they don't exist by title)
        added_count = 0
        for challenge in NEW_CHALLENGES:
            title, description, difficulty, xp_reward, duration_days, category = challenge
            
            # Check if challenge already exists
            cur.execute("SELECT id FROM challenges WHERE title = %s;", (title,))
            if cur.fetchone():
                print(f"Challenge '{title}' already exists, skipping...")
                continue
            
            # Insert new challenge
            cur.execute("""
                INSERT INTO challenges (title, description, difficulty, xp_reward, duration_days, category)
                VALUES (%s, %s, %s, %s, %s, %s);
            """, challenge)
            added_count += 1
            print(f"Added challenge: {title}")
        
        conn.commit()
        
        # Check final count
        cur.execute("SELECT COUNT(*) FROM challenges;")
        final_count = cur.fetchone()[0]
        print(f"\nAdded {added_count} new challenges")
        print(f"Total challenges now: {final_count}")
        
        cur.close()
        conn.close()
        
        print("\nSuccessfully added challenges to database!")
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    success = add_challenges()
    sys.exit(0 if success else 1)

