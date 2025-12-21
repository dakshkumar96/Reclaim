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

