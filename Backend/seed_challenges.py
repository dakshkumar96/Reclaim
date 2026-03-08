"""Script to seed all challenges to the database"""
import os
import sys
from dotenv import load_dotenv
import psycopg2

# Load environment variables
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, 'database.env'))

# Database configuration - use postgres superuser for seeding
DB_NAME = os.getenv("DB_NAME", "reclaim")
DB_USER = "postgres"  # Use superuser for seeding
DB_PASSWORD = os.getenv("DB_PASSWORD", "")  # Use same password or update if different
DB_HOST = os.getenv("DB_HOST", "localhost")

# All challenges: (title, description, difficulty, xp_reward, duration_days, category)
ALL_CHALLENGES = [
    # ============== PHONE & SOCIAL MEDIA ==============
    (
        'No Phone First Hour',
        'Start your day with intention, not distraction. Don\'t touch your phone for the first hour after waking up. Use this time for yourself - stretch, think, or just be present.',
        'hard',
        300,
        21,
        'Digital Wellness'
    ),
    (
        'Social Media Detox',
        'Take a complete break from all social media platforms for 7 days. No Instagram, TikTok, Twitter, or Snapchat. Rediscover life without the scroll.',
        'hard',
        275,
        7,
        'Digital Wellness'
    ),
    (
        '2-Hour Screen Limit',
        'Limit your recreational screen time (social media, YouTube, gaming) to just 2 hours per day. Track your usage and stay accountable.',
        'hard',
        350,
        30,
        'Digital Wellness'
    ),
    (
        'Phone-Free Meals',
        'Put your phone away during every meal. Be present with your food and the people around you. No scrolling while eating.',
        'easy',
        100,
        14,
        'Digital Wellness'
    ),
    (
        'Notification Silence',
        'Turn off all non-essential notifications on your phone. Keep only calls and important messages. Reclaim your attention.',
        'medium',
        200,
        21,
        'Digital Wellness'
    ),
    (
        'No Phone in Bed',
        'Keep your phone outside your bedroom at night. Use a real alarm clock. This single change will transform your sleep and mornings.',
        'hard',
        325,
        30,
        'Digital Wellness'
    ),
    (
        'Delete Time-Wasting App',
        'Identify your most time-wasting app and delete it for 14 days. Notice how much time and mental energy you get back.',
        'medium',
        175,
        14,
        'Digital Wellness'
    ),
    (
        'Grayscale Challenge',
        'Set your phone to grayscale mode. Without colorful icons and images, your phone becomes less addictive and more of a tool.',
        'medium',
        150,
        14,
        'Digital Wellness'
    ),
    (
        '30-Min Social Limit',
        'Limit your total social media usage to 30 minutes per day. Use built-in screen time tools to enforce this limit.',
        'medium',
        225,
        21,
        'Digital Wellness'
    ),
    (
        'Earn Your Scroll',
        'No social media or entertainment until you\'ve completed something productive. Work first, scroll later.',
        'medium',
        200,
        21,
        'Digital Wellness'
    ),

    # ============== SLEEP ==============
    (
        'Fixed Sleep Schedule',
        'Go to bed and wake up at the same time every single day - yes, including weekends. Your body craves consistency.',
        'hard',
        350,
        30,
        'Sleep'
    ),
    (
        '8 Hours of Sleep',
        'Get a full 8 hours of sleep every night. No excuses, no exceptions. Your body and mind will thank you.',
        'hard',
        325,
        30,
        'Sleep'
    ),
    (
        'Wake Up at 6 AM',
        'Rise at 6 AM every single day. Join the early risers and discover the power of quiet morning hours.',
        'hard',
        350,
        30,
        'Sleep'
    ),
    (
        'No Screens After 10 PM',
        'Put all screens away by 10 PM. Read a book, journal, or just relax. The blue light is ruining your sleep.',
        'medium',
        225,
        21,
        'Sleep'
    ),
    (
        'Bedtime Routine',
        'Create and follow a consistent wind-down routine before bed. Dim lights, no screens, same activities every night.',
        'medium',
        200,
        21,
        'Sleep'
    ),
    (
        'No All-Nighters',
        'Never stay up all night, no matter what. Plan better, work smarter. All-nighters destroy your health and productivity.',
        'hard',
        300,
        30,
        'Sleep'
    ),
    (
        'No Caffeine After 2 PM',
        'Cut off all caffeine after 2 PM. No coffee, energy drinks, or tea. Let your body wind down naturally.',
        'medium',
        175,
        21,
        'Sleep'
    ),
    (
        'No Snooze',
        'When your alarm goes off, get up immediately. No snooze button, no "5 more minutes." Train yourself to rise.',
        'hard',
        275,
        21,
        'Sleep'
    ),

    # ============== FITNESS ==============
    (
        '10K Steps Daily',
        'Walk 10,000 steps every single day. It\'s the foundation of an active lifestyle. Track with your phone or watch.',
        'medium',
        250,
        30,
        'Fitness'
    ),
    (
        'Morning Stretch',
        'Start every morning with a 10-minute stretch routine. Wake up your body, improve flexibility, and feel energized.',
        'easy',
        100,
        14,
        'Fitness'
    ),
    (
        '50 Push-Ups Daily',
        'Complete 50 push-ups every day. Break them into sets throughout the day. Build real upper body strength.',
        'medium',
        225,
        30,
        'Fitness'
    ),
    (
        '30-Minute Walk',
        'Take a 30-minute walk every day. Rain or shine, morning or evening. Walking is the most underrated exercise.',
        'easy',
        125,
        21,
        'Fitness'
    ),
    (
        'Plank Every Day',
        'Hold a plank every single day. Start where you are and build up. Core strength changes everything.',
        'medium',
        175,
        21,
        'Fitness'
    ),
    (
        'Always Take Stairs',
        'Take the stairs instead of the elevator, every single time. Small choices add up to big changes.',
        'easy',
        125,
        21,
        'Fitness'
    ),
    (
        '100 Squats Daily',
        'Complete 100 squats every day. Break them into sets. Build leg strength and endurance.',
        'medium',
        225,
        30,
        'Fitness'
    ),
    (
        'Morning Run',
        'Run for 20 minutes every morning before starting your day. Fresh air, endorphins, and energy.',
        'hard',
        325,
        30,
        'Fitness'
    ),
    (
        'Home Workout',
        'Complete a 30-minute home workout at least 5 days per week. No gym required, no excuses accepted.',
        'hard',
        300,
        30,
        'Fitness'
    ),
    (
        'Couch to 5K',
        'Train yourself to run 5 kilometers. Follow a gradual program from walking to running. Cross that finish line.',
        'hard',
        400,
        60,
        'Fitness'
    ),

    # ============== MENTAL HEALTH ==============
    (
        'Gratitude Journal',
        'Write down 3 things you\'re grateful for every single day. Rewire your brain to notice the good in life.',
        'easy',
        125,
        21,
        'Mental Health'
    ),
    (
        '5-Minute Meditation',
        'Meditate for just 5 minutes every day. Sit still, focus on your breath, let thoughts pass. Start small, stay consistent.',
        'medium',
        175,
        21,
        'Mental Health'
    ),
    (
        'Stop Overthinking',
        'When you catch yourself spiraling into negative thoughts, use grounding techniques. Name 5 things you can see, 4 you can touch...',
        'hard',
        275,
        14,
        'Mental Health'
    ),
    (
        'Positive Self-Talk',
        'Catch negative self-talk and replace it with neutral or positive statements. You are not your worst thoughts.',
        'medium',
        200,
        21,
        'Mental Health'
    ),
    (
        'Daily Journaling',
        'Write about your thoughts, feelings, and experiences every day. Get the chaos out of your head and onto paper.',
        'medium',
        200,
        30,
        'Mental Health'
    ),
    (
        'Deep Breathing',
        'Practice the 4-7-8 breathing technique whenever you feel stressed. Inhale 4 seconds, hold 7, exhale 8.',
        'easy',
        100,
        14,
        'Mental Health'
    ),
    (
        'Evening Reflection',
        'Spend 5 minutes before bed reflecting on your day. What went well? What could be better? Learn and grow.',
        'easy',
        125,
        21,
        'Mental Health'
    ),
    (
        'Learn to Say No',
        'Practice setting boundaries and saying no when you need to. Your time and energy are precious resources.',
        'hard',
        275,
        21,
        'Mental Health'
    ),
    (
        'Comparison Detox',
        'Stop comparing yourself to others, especially on social media. Unfollow accounts that make you feel inadequate.',
        'hard',
        300,
        21,
        'Mental Health'
    ),
    (
        'Anxiety Tracker',
        'Track your anxiety triggers and what helps you cope. Understanding your patterns is the first step to managing them.',
        'medium',
        200,
        21,
        'Mental Health'
    ),

    # ============== FOCUS & STUDYING ==============
    (
        'Pomodoro Technique',
        'Study or work in 25-minute focused blocks with 5-minute breaks. Use a timer and stay disciplined.',
        'medium',
        200,
        21,
        'Productivity'
    ),
    (
        'Phone-Free Study',
        'Put your phone in another room while studying or working. Out of sight, out of mind, fully focused.',
        'medium',
        175,
        14,
        'Productivity'
    ),
    (
        'Beat Procrastination',
        'When you think of a task, start it within 2 minutes. Don\'t let procrastination win. Action beats motivation.',
        'hard',
        350,
        30,
        'Productivity'
    ),
    (
        '2-Hour Deep Work',
        'Complete one 2-hour session of uninterrupted, focused work every day. No distractions, no multitasking.',
        'hard',
        325,
        30,
        'Productivity'
    ),
    (
        'Review Notes Same Day',
        'Review your class or meeting notes within 24 hours. Information sticks better with immediate review.',
        'medium',
        175,
        21,
        'Productivity'
    ),
    (
        'Work Before Play',
        'No entertainment or social media until your work or studying is done. Delayed gratification builds success.',
        'medium',
        200,
        21,
        'Productivity'
    ),
    (
        'Single-Tasking',
        'Focus on one task at a time. No multitasking. Close extra tabs, ignore notifications, do one thing well.',
        'medium',
        175,
        21,
        'Productivity'
    ),
    (
        'Morning Study Hour',
        'Study or work on important projects for 1 hour every morning before classes or your job starts.',
        'hard',
        300,
        30,
        'Productivity'
    ),
    (
        'Distraction-Free Zone',
        'Create a dedicated workspace free from distractions. When you\'re there, you work. Train your brain.',
        'medium',
        200,
        21,
        'Productivity'
    ),

    # ============== EATING & HYDRATION ==============
    (
        'Drink 8 Glasses of Water',
        'Drink at least 8 glasses of water every day. Carry a water bottle everywhere. Stay hydrated, stay sharp.',
        'easy',
        125,
        21,
        'Health'
    ),
    (
        'No Junk Food',
        'Cut out chips, candy, cookies, and processed snacks for 30 days. Your body is not a trash can.',
        'hard',
        325,
        30,
        'Health'
    ),
    (
        'Eat Breakfast Daily',
        'Eat a proper, nutritious breakfast every morning. Not just coffee. Real food to fuel your day.',
        'medium',
        175,
        21,
        'Health'
    ),
    (
        'No Soda Challenge',
        'Cut out all soda and sugary drinks. Drink water, tea, or black coffee instead. Your body doesn\'t need liquid sugar.',
        'medium',
        225,
        30,
        'Health'
    ),
    (
        'Cook Your Own Meals',
        'Cook dinner at home instead of ordering takeout or eating fast food. Save money, eat healthier.',
        'medium',
        250,
        21,
        'Health'
    ),
    (
        'No Late Night Eating',
        'Stop eating after 9 PM. Give your body time to digest before sleep. Better sleep, better digestion.',
        'medium',
        200,
        21,
        'Health'
    ),
    (
        'Meal Prep Sunday',
        'Prepare your meals for the week every Sunday. Save time, eat healthier, stop making excuses.',
        'medium',
        225,
        21,
        'Health'
    ),
    (
        'Eat Fruit Daily',
        'Eat at least one serving of fruit every single day. It\'s nature\'s candy, and your body needs it.',
        'easy',
        100,
        21,
        'Health'
    ),
    (
        'No Energy Drinks',
        'Cut out all energy drinks - Monster, Red Bull, all of them. They\'re wrecking your heart and sleep.',
        'medium',
        175,
        21,
        'Health'
    ),
    (
        'Eat Your Vegetables',
        'Include vegetables in at least 2 meals every day. Greens, colors, nutrients. Eat like you care about yourself.',
        'medium',
        175,
        21,
        'Health'
    ),

    # ============== READING & LEARNING ==============
    (
        'Read 20 Minutes Daily',
        'Read a book for at least 20 minutes every day. Fiction, non-fiction, whatever interests you. Just read.',
        'medium',
        200,
        30,
        'Learning'
    ),
    (
        'Finish One Book',
        'Read and finish one complete book this month. Start to finish. Prove to yourself you can do it.',
        'medium',
        250,
        30,
        'Learning'
    ),
    (
        'Learn Something New',
        'Learn one new thing every single day. A word, a fact, a skill. Never stop growing.',
        'medium',
        200,
        21,
        'Learning'
    ),
    (
        'Read Before Bed',
        'Replace late-night scrolling with reading. Pick up a book instead of your phone before sleep.',
        'easy',
        125,
        21,
        'Learning'
    ),
    (
        'Books Over Social Media',
        'Replace your social media time with reading. Every time you want to scroll, pick up a book instead.',
        'hard',
        275,
        14,
        'Learning'
    ),

    # ============== SOCIAL & CONFIDENCE ==============
    (
        'Talk to Someone New',
        'Start a conversation with someone new every day. A classmate, coworker, or stranger. Build your social muscle.',
        'hard',
        300,
        21,
        'Social'
    ),
    (
        'Daily Friend Check-In',
        'Reach out to one friend every day. Send a text, ask how they\'re doing. Maintain your relationships.',
        'easy',
        100,
        21,
        'Social'
    ),
    (
        'Eye Contact Practice',
        'Maintain comfortable eye contact during conversations. It shows confidence and builds connection.',
        'medium',
        150,
        14,
        'Social'
    ),
    (
        'Give Genuine Compliments',
        'Give one genuine, thoughtful compliment to someone every day. Spread positivity and brighten days.',
        'easy',
        100,
        14,
        'Social'
    ),
    (
        'Call Instead of Text',
        'Call your friends instead of just texting. Voice conversations build deeper connections.',
        'medium',
        150,
        14,
        'Social'
    ),
    (
        'Ask for Help',
        'Practice asking for help when you need it. It\'s not weakness, it\'s wisdom. You don\'t have to do everything alone.',
        'hard',
        275,
        14,
        'Social'
    ),
    (
        'Speak Up Daily',
        'Voice your opinion at least once every day. In class, at work, with friends. Your voice matters.',
        'hard',
        300,
        21,
        'Social'
    ),
    (
        'Have Deep Conversations',
        'Have at least one meaningful, deep conversation every day. Go beyond small talk. Really connect.',
        'medium',
        175,
        14,
        'Social'
    ),

    # ============== PRODUCTIVITY & HABITS ==============
    (
        'Morning Routine',
        'Create and follow a consistent morning routine every day. How you start your morning sets the tone for everything.',
        'hard',
        350,
        30,
        'Productivity'
    ),
    (
        'Make Your Bed',
        'Make your bed first thing every morning. It takes 2 minutes and starts your day with a win.',
        'easy',
        100,
        21,
        'Productivity'
    ),
    (
        'Plan Tomorrow Tonight',
        'Before bed, write down your tasks and priorities for tomorrow. Wake up with a clear plan.',
        'medium',
        175,
        21,
        'Productivity'
    ),
    (
        '3 Daily Priorities',
        'Identify your 3 most important tasks every day and complete them. Focus on what actually matters.',
        'medium',
        225,
        30,
        'Productivity'
    ),
    (
        'Clean Your Space',
        'Tidy your workspace or room every single day. A clean environment means a clear mind.',
        'medium',
        175,
        21,
        'Productivity'
    ),
    (
        'Weekly Review',
        'Every Sunday, review your week. What did you accomplish? What needs to change? Plan for the week ahead.',
        'medium',
        175,
        21,
        'Productivity'
    ),
    (
        '2-Minute Rule',
        'If a task takes less than 2 minutes, do it immediately. Stop letting small things pile up.',
        'easy',
        125,
        21,
        'Productivity'
    ),

    # ============== MONEY ==============
    (
        'Track Every Purchase',
        'Log every single thing you spend money on for 30 days. Awareness is the first step to control.',
        'medium',
        200,
        30,
        'Finance'
    ),
    (
        'No Impulse Buying',
        'Wait 48 hours before any non-essential purchase. If you still want it after 2 days, consider buying it.',
        'hard',
        275,
        21,
        'Finance'
    ),
    (
        'No Eating Out',
        'Don\'t spend money on restaurants, takeout, or delivery for 21 days. Cook at home, save money.',
        'hard',
        275,
        21,
        'Finance'
    ),
    (
        'Save 10 Percent',
        'Save 10% of every dollar you receive. Pay yourself first. Build the saving habit.',
        'medium',
        225,
        30,
        'Finance'
    ),
    (
        'Cancel Unused Subscriptions',
        'Audit all your subscriptions and cancel everything you don\'t actively use. Stop bleeding money.',
        'easy',
        75,
        7,
        'Finance'
    ),

    # ============== TRENDING CHALLENGES ==============
    (
        '75 Soft',
        'The flexible version of 75 Hard. Daily workout, drink water, read 10 pages, follow a diet with one cheat meal per week.',
        'hard',
        400,
        75,
        'Lifestyle'
    ),
    (
        'Dopamine Detox',
        'Reset your brain\'s reward system. No social media, gaming, junk food, or artificial stimulation for 7 days.',
        'hard',
        275,
        7,
        'Lifestyle'
    ),
    (
        'Monk Mode',
        'Extreme focus mode. Cut all distractions, no social media, no entertainment. Only work, exercise, and self-improvement.',
        'hard',
        400,
        30,
        'Lifestyle'
    ),
    (
        'Cold Shower Challenge',
        'Take a cold shower every single day. Build mental toughness, improve circulation, wake up alert.',
        'hard',
        325,
        30,
        'Lifestyle'
    ),
    (
        'No PMO',
        'Abstain from adult content and self-pleasure. Reclaim your focus, energy, and self-control.',
        'hard',
        300,
        30,
        'Lifestyle'
    ),
    (
        'Digital Minimalism',
        'Use your phone only for calls, texts, maps, and essential tools. Delete all social media and entertainment apps.',
        'hard',
        300,
        21,
        'Lifestyle'
    ),
    (
        'Early Bird Challenge',
        'Wake up at 5 AM every single day. Join the 5 AM club and discover the power of early mornings.',
        'hard',
        325,
        30,
        'Lifestyle'
    ),
]

def seed_challenges():
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
        
        # Add all challenges (skip existing ones by title)
        added_count = 0
        skipped_count = 0
        
        for challenge in ALL_CHALLENGES:
            title, description, difficulty, xp_reward, duration_days, category = challenge
            
            # Check if challenge already exists by title
            cur.execute("SELECT id FROM challenges WHERE title = %s;", (title,))
            existing = cur.fetchone()
            
            if existing:
                skipped_count += 1
                print(f"[SKIP] Already exists: {title}")
            else:
                # Insert new challenge
                cur.execute("""
                    INSERT INTO challenges (title, description, difficulty, xp_reward, duration_days, category, is_active)
                    VALUES (%s, %s, %s, %s, %s, %s, true);
                """, (title, description, difficulty, xp_reward, duration_days, category))
                added_count += 1
                print(f"[ADD] {title}")
        
        conn.commit()
        
        # Check final count of active challenges
        cur.execute("SELECT COUNT(*) FROM challenges WHERE is_active = true;")
        final_count = cur.fetchone()[0]
        
        print(f"\n{'='*50}")
        print(f"Added {added_count} new challenges")
        print(f"Skipped {skipped_count} existing challenges")
        print(f"Total active challenges: {final_count}")
        print(f"{'='*50}")
        
        cur.close()
        conn.close()
        
        print("\nSuccessfully seeded all challenges!")
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("="*50)
    print("RECLAIM - Challenge Seeder")
    print("="*50)
    print(f"\nThis will add/update {len(ALL_CHALLENGES)} challenges.\n")
    
    success = seed_challenges()
    sys.exit(0 if success else 1)
