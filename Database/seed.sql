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

