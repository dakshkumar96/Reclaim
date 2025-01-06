-- Custom types for the app
CREATE TYPE difficulty_level AS ENUM (
    'easy',
    'medium', 
    'hard'
);

-- Mood tracking
CREATE TYPE mood_type AS ENUM (
    'terrible',
    'bad',
    'okay',
    'good',
    'excellent'
);

-- Challenge status
CREATE TYPE challenge_status AS ENUM (
    'active',
    'completed',
    'paused',
    'abandoned'
);
