-- =====================================================
-- RECLAIM HABIT APP - SEED DATA
-- =====================================================
-- This file contains sample data for the Reclaim habit tracking app.
-- It includes 3 users, 4 challenges, and related data to get started.
--
-- Contents:
-- - 3 sample users with different XP levels
-- - 4 diverse challenges across different categories
-- - User challenge participations
-- - Sample daily logs and streaks
-- - Achievement badges
-- - User badge awards
--
-- Run this file after schema.sql, functions.sql, and views_and_indexes.sql
-- =====================================================

-- =====================================================
-- SAMPLE USERS
-- =====================================================

-- Insert 3 sample users with different experience levels
-- Note: In production, passwords should be properly hashed using bcrypt or similar
-- These are example hashes - replace with real hashed passwords
-- =====================================================

INSERT INTO users (username, email, password_hash, first_name, last_name, xp, level, timezone) VALUES
(
    'alex_habit_master',
    'alex@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2G', -- hashed "password123"
    'Alex',
    'Johnson',
    1250,  -- High XP user
    13,    -- Level 13
    'America/New_York'
),
(
    'sarah_wellness',
    'sarah@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2G', -- hashed "password123"
    'Sarah',
    'Chen',
    680,   -- Medium XP user
    7,     -- Level 7
    'America/Los_Angeles'
),
(
    'mike_beginner',
    'mike@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2G', -- hashed "password123"
    'Mike',
    'Rodriguez',
    150,   -- Low XP user
    2,     -- Level 2
    'America/Chicago'
);

-- =====================================================
-- SAMPLE CHALLENGES
-- =====================================================

-- Insert 4 diverse challenges covering different habit categories
-- =====================================================

INSERT INTO challenges (title, description, difficulty, xp_reward, duration_days, category) VALUES
(
    'Hydration Hero',
    'Drink 8 glasses of water every day for a week. Stay hydrated and feel the difference in your energy levels and overall health.',
    'easy',
    50,
    7,
    'health'
),
(
    'Morning Warrior',
    'Wake up at 6 AM and complete a 30-minute morning routine including exercise, meditation, and planning your day.',
    'medium',
    150,
    14,
    'productivity'
),
(
    'Digital Detox',
    'Spend no more than 2 hours on social media per day. Focus on real-world connections and meaningful activities.',
    'medium',
    200,
    21,
    'mindfulness'
),
(
    'Study Marathon',
    'Study for 2 hours every day for a month. Perfect for students or professionals learning new skills.',
    'hard',
    500,
    30,
    'education'
),
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
);

-- =====================================================
-- USER CHALLENGE PARTICIPATIONS
-- =====================================================

-- Alex (high XP user) - has completed some challenges and is active in others
-- =====================================================

INSERT INTO user_challenges (user_id, challenge_id, status, started_at, completed_at, progress_days) VALUES
-- Alex completed the hydration challenge
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM challenges WHERE title = 'Hydration Hero'), 'completed', '2024-01-01 08:00:00+00', '2024-01-08 08:00:00+00', 7),
-- Alex is currently working on morning warrior
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM challenges WHERE title = 'Morning Warrior'), 'active', '2024-01-15 06:00:00+00', NULL, 5),
-- Alex completed digital detox
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM challenges WHERE title = 'Digital Detox'), 'completed', '2023-12-01 09:00:00+00', '2023-12-22 09:00:00+00', 21);

-- Sarah (medium XP user) - active in multiple challenges
-- =====================================================

INSERT INTO user_challenges (user_id, challenge_id, status, started_at, completed_at, progress_days) VALUES
-- Sarah is working on hydration challenge
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM challenges WHERE title = 'Hydration Hero'), 'active', '2024-01-20 07:00:00+00', NULL, 3),
-- Sarah completed morning warrior
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM challenges WHERE title = 'Morning Warrior'), 'completed', '2023-12-15 06:00:00+00', '2023-12-29 06:00:00+00', 14),
-- Sarah is working on digital detox
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM challenges WHERE title = 'Digital Detox'), 'active', '2024-01-10 10:00:00+00', NULL, 8);

-- Mike (beginner user) - just starting out
-- =====================================================

INSERT INTO user_challenges (user_id, challenge_id, status, started_at, completed_at, progress_days) VALUES
-- Mike is working on hydration challenge
((SELECT id FROM users WHERE username = 'mike_beginner'), (SELECT id FROM challenges WHERE title = 'Hydration Hero'), 'active', '2024-01-25 08:00:00+00', NULL, 1),
-- Mike is working on morning warrior
((SELECT id FROM users WHERE username = 'mike_beginner'), (SELECT id FROM challenges WHERE title = 'Morning Warrior'), 'active', '2024-01-22 06:00:00+00', NULL, 2);

-- =====================================================
-- SAMPLE DAILY LOGS
-- =====================================================

-- Recent daily logs showing user activity patterns
-- =====================================================

INSERT INTO daily_logs (user_id, challenge_id, log_date, completed, mood, notes) VALUES
-- Alex's recent logs
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM challenges WHERE title = 'Hydration Hero'), '2024-01-08', true, 'excellent', 'Completed the hydration challenge! Feeling great.'),
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM challenges WHERE title = 'Morning Warrior'), '2024-01-20', true, 'good', 'Great morning routine today.'),
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM challenges WHERE title = 'Morning Warrior'), '2024-01-19', true, 'okay', 'Tired but pushed through.'),
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM challenges WHERE title = 'Morning Warrior'), '2024-01-18', false, 'bad', 'Overslept, need to reset alarm.'),

-- Sarah's recent logs
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM challenges WHERE title = 'Hydration Hero'), '2024-01-23', true, 'good', 'Staying hydrated!'),
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM challenges WHERE title = 'Hydration Hero'), '2024-01-22', true, 'excellent', 'Perfect water intake today.'),
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM challenges WHERE title = 'Hydration Hero'), '2024-01-21', false, 'okay', 'Forgot to track water intake.'),
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM challenges WHERE title = 'Digital Detox'), '2024-01-18', true, 'good', 'Limited social media successfully.'),

-- Mike's recent logs
((SELECT id FROM users WHERE username = 'mike_beginner'), (SELECT id FROM challenges WHERE title = 'Hydration Hero'), '2024-01-26', true, 'good', 'First day of hydration challenge!'),
((SELECT id FROM users WHERE username = 'mike_beginner'), (SELECT id FROM challenges WHERE title = 'Morning Warrior'), '2024-01-24', true, 'okay', 'Early morning is tough but doable.'),
((SELECT id FROM users WHERE username = 'mike_beginner'), (SELECT id FROM challenges WHERE title = 'Morning Warrior'), '2024-01-23', false, 'bad', 'Could not wake up early.');

-- =====================================================
-- STREAK DATA
-- =====================================================

-- Streak information for users' challenges
-- =====================================================

INSERT INTO streaks (user_id, challenge_id, current_streak, longest_streak, last_active) VALUES
-- Alex's streaks
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM challenges WHERE title = 'Hydration Hero'), 0, 7, '2024-01-08'),  -- Completed hydration challenge with 7-day streak
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM challenges WHERE title = 'Morning Warrior'), 3, 3, '2024-01-20'),  -- Currently on 3-day streak for morning warrior
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM challenges WHERE title = 'Digital Detox'), 0, 21, '2023-12-22'), -- Completed digital detox with 21-day streak

-- Sarah's streaks
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM challenges WHERE title = 'Hydration Hero'), 3, 3, '2024-01-23'),  -- Currently on 3-day streak for hydration
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM challenges WHERE title = 'Morning Warrior'), 0, 14, '2023-12-29'), -- Completed morning warrior with 14-day streak
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM challenges WHERE title = 'Digital Detox'), 5, 5, '2024-01-18'),  -- Currently on 5-day streak for digital detox

-- Mike's streaks
((SELECT id FROM users WHERE username = 'mike_beginner'), (SELECT id FROM challenges WHERE title = 'Hydration Hero'), 1, 1, '2024-01-26'),  -- Just started hydration challenge
((SELECT id FROM users WHERE username = 'mike_beginner'), (SELECT id FROM challenges WHERE title = 'Morning Warrior'), 1, 1, '2024-01-24');  -- Just started morning warrior

-- =====================================================
-- ACHIEVEMENT BADGES
-- =====================================================

-- Various badges users can earn for different achievements
-- =====================================================

INSERT INTO badges (name, description, icon, xp_requirement, streak_requirement, category) VALUES
-- XP-based badges
('First Steps', 'Earn your first 100 XP', 'star', 100, 0, 'xp'),
('Rising Star', 'Earn 500 XP', 'star-fill', 500, 0, 'xp'),
('XP Master', 'Earn 1000 XP', 'trophy', 1000, 0, 'xp'),
('Legend', 'Earn 2000 XP', 'crown', 2000, 0, 'xp'),

-- Streak-based badges
('Consistency King', 'Maintain a 7-day streak', 'fire', 0, 7, 'streak'),
('Streak Master', 'Maintain a 30-day streak', 'fire-fill', 0, 30, 'streak'),
('Unstoppable', 'Maintain a 100-day streak', 'lightning', 0, 100, 'streak'),

-- Challenge completion badges
('Challenge Starter', 'Complete your first challenge', 'play-circle', 0, 0, 'challenge'),
('Challenge Master', 'Complete 5 challenges', 'check-circle', 0, 0, 'challenge'),
('Habit Hero', 'Complete 10 challenges', 'shield-check', 0, 0, 'challenge'),

-- Category-specific badges
('Health Enthusiast', 'Complete 3 health challenges', 'heart', 0, 0, 'health'),
('Productivity Pro', 'Complete 3 productivity challenges', 'clock', 0, 0, 'productivity'),
('Mindful Master', 'Complete 3 mindfulness challenges', 'brain', 0, 0, 'mindfulness');

-- =====================================================
-- USER BADGE AWARDS
-- =====================================================

-- Badges that users have already earned
-- =====================================================

INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
-- Alex's badges (high XP user)
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM badges WHERE name = 'First Steps'), '2024-01-01 10:00:00+00'),  -- First Steps
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM badges WHERE name = 'Rising Star'), '2024-01-05 10:00:00+00'),  -- Rising Star
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM badges WHERE name = 'XP Master'), '2024-01-10 10:00:00+00'),  -- XP Master
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM badges WHERE name = 'Consistency King'), '2024-01-08 10:00:00+00'),  -- Consistency King (7-day streak)
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM badges WHERE name = 'Challenge Starter'), '2024-01-08 10:00:00+00'),  -- Challenge Starter
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM badges WHERE name = 'Health Enthusiast'), '2024-01-08 10:00:00+00'), -- Health Enthusiast
((SELECT id FROM users WHERE username = 'alex_habit_master'), (SELECT id FROM badges WHERE name = 'Mindful Master'), '2023-12-22 10:00:00+00'), -- Mindful Master

-- Sarah's badges (medium XP user)
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM badges WHERE name = 'First Steps'), '2023-12-15 10:00:00+00'),  -- First Steps
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM badges WHERE name = 'Rising Star'), '2023-12-20 10:00:00+00'),  -- Rising Star
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM badges WHERE name = 'Consistency King'), '2023-12-29 10:00:00+00'),  -- Consistency King
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM badges WHERE name = 'Challenge Starter'), '2023-12-29 10:00:00+00'),  -- Challenge Starter
((SELECT id FROM users WHERE username = 'sarah_wellness'), (SELECT id FROM badges WHERE name = 'Productivity Pro'), '2023-12-29 10:00:00+00'), -- Productivity Pro

-- Mike's badges (beginner user)
((SELECT id FROM users WHERE username = 'mike_beginner'), (SELECT id FROM badges WHERE name = 'First Steps'), '2024-01-25 10:00:00+00');  -- First Steps

-- =====================================================
-- REFRESH MATERIALIZED VIEWS
-- =====================================================

-- Refresh the leaderboard view with the new data
-- =====================================================
REFRESH MATERIALIZED VIEW leaderboard_view;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Uncomment these queries to verify the seed data was inserted correctly
-- =====================================================

/*
-- Check users and their XP
SELECT username, xp, level, created_at FROM users ORDER BY xp DESC;

-- Check challenges
SELECT title, difficulty, xp_reward, duration_days, category FROM challenges;

-- Check user challenge participations
SELECT u.username, c.title, uc.status, uc.progress_days 
FROM user_challenges uc
JOIN users u ON uc.user_id = u.id
JOIN challenges c ON uc.challenge_id = c.id
ORDER BY u.username, uc.started_at;

-- Check leaderboard
SELECT rank, username, xp, level, completed_challenges, badges_earned 
FROM leaderboard_view 
ORDER BY rank 
LIMIT 10;

-- Check user badges
SELECT u.username, b.name as badge_name, ub.earned_at
FROM user_badges ub
JOIN users u ON ub.user_id = u.id
JOIN badges b ON ub.badge_id = b.id
ORDER BY u.username, ub.earned_at;
*/

-- =====================================================
-- NOTES FOR DEVELOPMENT
-- =====================================================

/*
SEED DATA SUMMARY:

Users:
- Alex Johnson: 1250 XP, Level 13 (experienced user)
- Sarah Chen: 680 XP, Level 7 (intermediate user)  
- Mike Rodriguez: 150 XP, Level 2 (beginner user)

Challenges:
- Hydration Hero: Easy, 7 days, 50 XP (health)
- Morning Warrior: Medium, 14 days, 150 XP (productivity)
- Digital Detox: Medium, 21 days, 200 XP (mindfulness)
- Study Marathon: Hard, 30 days, 500 XP (education)

Activity:
- Alex has completed 2 challenges and is active in 1
- Sarah has completed 1 challenge and is active in 2
- Mike is active in 2 challenges (just starting)

Badges:
- 15 different badges across XP, streak, challenge, and category types
- Users have earned various badges based on their activity

TESTING:
- All users have password "password123" (hashed)
- Use these accounts for testing login functionality
- Challenge completion and streak tracking can be tested
- Leaderboard functionality is ready to test
*/
