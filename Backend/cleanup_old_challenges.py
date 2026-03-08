"""Script to deactivate old challenges not in the new curated list"""
import os
import sys
from dotenv import load_dotenv
import psycopg2

# Load environment variables
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, 'database.env'))

# Database configuration
DB_NAME = os.getenv("DB_NAME", "reclaim")
DB_USER = "postgres"
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")

# List of all new challenge titles (the ones we want to keep)
NEW_CHALLENGE_TITLES = [
    'No Phone First Hour',
    'Social Media Detox',
    '2-Hour Screen Limit',
    'Phone-Free Meals',
    'Notification Silence',
    'No Phone in Bed',
    'Delete Time-Wasting App',
    'Grayscale Challenge',
    '30-Min Social Limit',
    'Earn Your Scroll',
    'Fixed Sleep Schedule',
    '8 Hours of Sleep',
    'Wake Up at 6 AM',
    'No Screens After 10 PM',
    'Bedtime Routine',
    'No All-Nighters',
    'No Caffeine After 2 PM',
    'No Snooze',
    '10K Steps Daily',
    'Morning Stretch',
    '50 Push-Ups Daily',
    '30-Minute Walk',
    'Plank Every Day',
    'Always Take Stairs',
    '100 Squats Daily',
    'Morning Run',
    'Home Workout',
    'Couch to 5K',
    'Gratitude Journal',
    '5-Minute Meditation',
    'Stop Overthinking',
    'Positive Self-Talk',
    'Daily Journaling',
    'Deep Breathing',
    'Evening Reflection',
    'Learn to Say No',
    'Comparison Detox',
    'Anxiety Tracker',
    'Pomodoro Technique',
    'Phone-Free Study',
    'Beat Procrastination',
    '2-Hour Deep Work',
    'Review Notes Same Day',
    'Work Before Play',
    'Single-Tasking',
    'Morning Study Hour',
    'Distraction-Free Zone',
    'Drink 8 Glasses of Water',
    'No Junk Food',
    'Eat Breakfast Daily',
    'No Soda Challenge',
    'Cook Your Own Meals',
    'No Late Night Eating',
    'Meal Prep Sunday',
    'Eat Fruit Daily',
    'No Energy Drinks',
    'Eat Your Vegetables',
    'Read 20 Minutes Daily',
    'Finish One Book',
    'Learn Something New',
    'Read Before Bed',
    'Books Over Social Media',
    'Talk to Someone New',
    'Daily Friend Check-In',
    'Eye Contact Practice',
    'Give Genuine Compliments',
    'Call Instead of Text',
    'Ask for Help',
    'Speak Up Daily',
    'Have Deep Conversations',
    'Morning Routine',
    'Make Your Bed',
    'Plan Tomorrow Tonight',
    '3 Daily Priorities',
    'Clean Your Space',
    'Weekly Review',
    '2-Minute Rule',
    'Track Every Purchase',
    'No Impulse Buying',
    'No Eating Out',
    'Save 10 Percent',
    'Cancel Unused Subscriptions',
    '75 Soft',
    'Dopamine Detox',
    'Monk Mode',
    'Cold Shower Challenge',
    'No PMO',
    'Digital Minimalism',
    'Early Bird Challenge',
]

def cleanup_challenges():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
        )
        
        cur = conn.cursor()
        
        # Get all challenge titles that are NOT in our new list
        placeholders = ','.join(['%s'] * len(NEW_CHALLENGE_TITLES))
        cur.execute(f"""
            SELECT id, title FROM challenges 
            WHERE title NOT IN ({placeholders}) AND is_active = true;
        """, NEW_CHALLENGE_TITLES)
        
        old_challenges = cur.fetchall()
        
        if not old_challenges:
            print("No old challenges to deactivate.")
            return True
        
        print(f"Found {len(old_challenges)} old challenges to deactivate:")
        for challenge_id, title in old_challenges:
            print(f"  - {title} (ID: {challenge_id})")
        
        # Deactivate them
        cur.execute(f"""
            UPDATE challenges 
            SET is_active = false 
            WHERE title NOT IN ({placeholders});
        """, NEW_CHALLENGE_TITLES)
        
        conn.commit()
        
        # Verify
        cur.execute("SELECT COUNT(*) FROM challenges WHERE is_active = true;")
        active_count = cur.fetchone()[0]
        
        print(f"\nDeactivated {len(old_challenges)} old challenges")
        print(f"Total active challenges now: {active_count}")
        
        cur.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("="*50)
    print("Cleaning up old challenges...")
    print("="*50)
    success = cleanup_challenges()
    sys.exit(0 if success else 1)
