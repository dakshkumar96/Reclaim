CREATE TYPE difficulty_level AS ENUM (
    'easy',      -- Simple habits like drinking water
    'medium',    -- Moderate habits like 30min exercise
    'hard'       -- Challenging habits like 2hr study sessions
);

-- Mood tracking for daily logs
CREATE TYPE mood_type AS ENUM (
    'terrible',  -- 1/5 mood
    'bad',       -- 2/5 mood
    'okay',      -- 3/5 mood
    'good',      -- 4/5 mood
    'excellent'  -- 5/5 mood
);

-- Status of user's participation in challenges
CREATE TYPE challenge_status AS ENUM (
    'active',    -- Currently participating
    'completed', -- Successfully finished
    'paused',    -- Temporarily stopped
    'abandoned'  -- Gave up on challenge
);

-- =====================================================
-- MAIN TABLES
-- =====================================================

-- Users table: Core user information and gamification stats
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- App must hash passwords before inserting
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    xp INTEGER DEFAULT 0,                 -- Experience points for gamification
    level INTEGER DEFAULT 1,              -- User level based on XP
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Constraints
    CONSTRAINT valid_username CHECK (LENGTH(username) >= 3),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_xp CHECK (xp >= 0),
    CONSTRAINT valid_level CHECK (level >= 1)
);

-- Challenges table: Available habit challenges users can participate in
-- =====================================================
CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty difficulty_level NOT NULL,
    xp_reward INTEGER NOT NULL,           -- XP earned when completed
    duration_days INTEGER NOT NULL,       -- How many days the challenge lasts
    category VARCHAR(100),                -- e.g., 'health', 'productivity', 'mindfulness'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_title CHECK (LENGTH(title) >= 5),
    CONSTRAINT valid_xp_reward CHECK (xp_reward > 0),
    CONSTRAINT valid_duration CHECK (duration_days > 0)
);

-- User challenges table: Tracks user participation in challenges
-- =====================================================
CREATE TABLE user_challenges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    status challenge_status DEFAULT 'active',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_days INTEGER DEFAULT 0,     -- Days completed out of total duration
    
    -- Constraints
    UNIQUE(user_id, challenge_id),       -- User can only participate once per challenge
    CONSTRAINT valid_progress CHECK (progress_days >= 0)
);

-- Daily logs table: Records daily habit completions and mood
-- =====================================================
CREATE TABLE daily_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE SET NULL,
    log_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    mood mood_type,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(user_id, challenge_id, log_date), -- One log per user/challenge/date
    CONSTRAINT valid_log_date CHECK (log_date <= CURRENT_DATE)
);

-- Streaks table: Tracks consecutive days of habit completion
-- =====================================================
CREATE TABLE streaks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_active DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(user_id, challenge_id),       -- One streak record per user/challenge
    CONSTRAINT valid_current_streak CHECK (current_streak >= 0),
    CONSTRAINT valid_longest_streak CHECK (longest_streak >= 0)
);

-- Badges table: Achievement badges users can earn
-- =====================================================
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),                    -- Icon identifier for frontend
    xp_requirement INTEGER DEFAULT 0,   -- Minimum XP needed to earn
    streak_requirement INTEGER DEFAULT 0, -- Minimum streak needed
    category VARCHAR(100),               -- Badge category
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_name CHECK (LENGTH(name) >= 3),
    CONSTRAINT valid_xp_requirement CHECK (xp_requirement >= 0),
    CONSTRAINT valid_streak_requirement CHECK (streak_requirement >= 0)
);

-- User badges table: Tracks which badges users have earned
-- =====================================================
CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(user_id, badge_id)            -- User can only earn each badge once
);

-- =====================================================
-- ADDITIONAL CONSTRAINTS AND TRIGGERS
-- =====================================================

-- Function to update user level based on XP
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
    -- Simple level calculation: every 100 XP = 1 level
    NEW.level = (NEW.xp / 100) + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update level when XP changes
CREATE TRIGGER trigger_update_user_level
    BEFORE UPDATE OF xp ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_level();

-- Function to update last_active when user completes a challenge
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user's last_active timestamp when they complete a challenge
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE users 
        SET last_active = CURRENT_TIMESTAMP 
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_active on challenge completion
CREATE TRIGGER trigger_update_user_last_active
    AFTER UPDATE OF status ON user_challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_user_last_active();


