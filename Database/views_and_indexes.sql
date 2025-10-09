
CREATE MATERIALIZED VIEW leaderboard_view AS
SELECT 
    u.id,
    u.username,
    u.xp,
    u.level,
    u.created_at,
    u.last_active,
    -- Calculate rank using window function
    ROW_NUMBER() OVER (ORDER BY u.xp DESC, u.created_at ASC) as rank,
    -- Additional stats for display
    (SELECT COUNT(*) FROM user_challenges uc WHERE uc.user_id = u.id AND uc.status = 'completed') as completed_challenges,
    (SELECT COUNT(*) FROM user_badges ub WHERE ub.user_id = u.id) as badges_earned,
    -- Current active streak (longest current streak across all challenges)
    (SELECT MAX(s.current_streak) FROM streaks s WHERE s.user_id = u.id) as current_streak
FROM users u
WHERE u.is_active = true
ORDER BY u.xp DESC, u.created_at ASC;

-- Create unique index on the materialized view for fast lookups
CREATE UNIQUE INDEX idx_leaderboard_user_id ON leaderboard_view (id);
CREATE INDEX idx_leaderboard_rank ON leaderboard_view (rank);
CREATE INDEX idx_leaderboard_xp ON leaderboard_view (xp DESC);


CREATE VIEW user_dashboard_view AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.xp,
    u.level,
    u.created_at,
    u.last_active,
    u.timezone,
    -- Challenge statistics
    (SELECT COUNT(*) FROM user_challenges uc WHERE uc.user_id = u.id) as total_challenges,
    (SELECT COUNT(*) FROM user_challenges uc WHERE uc.user_id = u.id AND uc.status = 'completed') as completed_challenges,
    (SELECT COUNT(*) FROM user_challenges uc WHERE uc.user_id = u.id AND uc.status = 'active') as active_challenges,
    -- Streak information
    (SELECT MAX(s.current_streak) FROM streaks s WHERE s.user_id = u.id) as current_streak,
    (SELECT MAX(s.longest_streak) FROM streaks s WHERE s.user_id = u.id) as longest_streak,
    -- Badge information
    (SELECT COUNT(*) FROM user_badges ub WHERE ub.user_id = u.id) as badges_earned,
    -- Recent activity (last 7 days)
    (SELECT COUNT(*) FROM daily_logs dl 
     WHERE dl.user_id = u.id 
     AND dl.log_date >= CURRENT_DATE - INTERVAL '7 days' 
     AND dl.completed = true) as recent_activity
FROM users u
WHERE u.is_active = true;


CREATE VIEW challenge_progress_view AS
SELECT 
    uc.id as user_challenge_id,
    uc.user_id,
    uc.challenge_id,
    c.title as challenge_title,
    c.description as challenge_description,
    c.difficulty,
    c.xp_reward,
    c.duration_days,
    c.category,
    uc.status,
    uc.started_at,
    uc.completed_at,
    uc.progress_days,
    -- Calculate progress percentage
    CASE 
        WHEN c.duration_days > 0 THEN 
            ROUND((uc.progress_days::DECIMAL / c.duration_days::DECIMAL) * 100, 2)
        ELSE 0 
    END as progress_percentage,
    -- Days remaining
    GREATEST(0, c.duration_days - uc.progress_days) as days_remaining,
    -- Streak information
    s.current_streak,
    s.longest_streak,
    s.last_active as streak_last_active
FROM user_challenges uc
JOIN challenges c ON uc.challenge_id = c.id
LEFT JOIN streaks s ON uc.user_id = s.user_id AND uc.challenge_id = s.challenge_id
WHERE c.is_active = true;

CREATE VIEW daily_activity_view AS
SELECT 
    dl.id as log_id,
    dl.user_id,
    dl.challenge_id,
    c.title as challenge_title,
    c.category as challenge_category,
    dl.log_date,
    dl.completed,
    dl.mood,
    dl.notes,
    dl.created_at,
    -- Calculate day of week
    TO_CHAR(dl.log_date, 'Day') as day_of_week,
    -- Calculate days since log
    CURRENT_DATE - dl.log_date as days_ago
FROM daily_logs dl
LEFT JOIN challenges c ON dl.challenge_id = c.id
ORDER BY dl.log_date DESC, dl.created_at DESC;


-- Users table indexes
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_xp ON users (xp DESC);
CREATE INDEX idx_users_level ON users (level DESC);
CREATE INDEX idx_users_last_active ON users (last_active DESC);
CREATE INDEX idx_users_created_at ON users (created_at DESC);

-- User challenges indexes
CREATE INDEX idx_user_challenges_user_id ON user_challenges (user_id);
CREATE INDEX idx_user_challenges_challenge_id ON user_challenges (challenge_id);
CREATE INDEX idx_user_challenges_status ON user_challenges (status);
CREATE INDEX idx_user_challenges_completed_at ON user_challenges (completed_at DESC);
CREATE INDEX idx_user_challenges_started_at ON user_challenges (started_at DESC);

-- Daily logs indexes
CREATE INDEX idx_daily_logs_user_id ON daily_logs (user_id);
CREATE INDEX idx_daily_logs_challenge_id ON daily_logs (challenge_id);
CREATE INDEX idx_daily_logs_log_date ON daily_logs (log_date DESC);
CREATE INDEX idx_daily_logs_user_date ON daily_logs (user_id, log_date DESC);
CREATE INDEX idx_daily_logs_completed ON daily_logs (completed);

-- Streaks indexes
CREATE INDEX idx_streaks_user_id ON streaks (user_id);
CREATE INDEX idx_streaks_challenge_id ON streaks (challenge_id);
CREATE INDEX idx_streaks_current_streak ON streaks (current_streak DESC);
CREATE INDEX idx_streaks_last_active ON streaks (last_active DESC);

-- Badges and user badges indexes
CREATE INDEX idx_badges_category ON badges (category);
CREATE INDEX idx_badges_xp_requirement ON badges (xp_requirement);
CREATE INDEX idx_user_badges_user_id ON user_badges (user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges (badge_id);
CREATE INDEX idx_user_badges_earned_at ON user_badges (earned_at DESC);

-- Challenges indexes
CREATE INDEX idx_challenges_difficulty ON challenges (difficulty);
CREATE INDEX idx_challenges_category ON challenges (category);
CREATE INDEX idx_challenges_xp_reward ON challenges (xp_reward DESC);
CREATE INDEX idx_challenges_is_active ON challenges (is_active);

-- =====================================================
-- COMPOSITE INDEXES FOR COMMON QUERY PATTERNS
-- =====================================================

-- Multi-column indexes for complex queries
CREATE INDEX idx_user_challenges_user_status ON user_challenges (user_id, status);
CREATE INDEX idx_user_challenges_user_challenge ON user_challenges (user_id, challenge_id);
CREATE INDEX idx_daily_logs_user_challenge_date ON daily_logs (user_id, challenge_id, log_date);
CREATE INDEX idx_streaks_user_challenge ON streaks (user_id, challenge_id);



-- Index only active users (saves space and improves performance)
CREATE INDEX idx_users_active_xp ON users (xp DESC) WHERE is_active = true;

-- Index only active challenges
CREATE INDEX idx_challenges_active_category ON challenges (category) WHERE is_active = true;

-- Index only completed user challenges
CREATE INDEX idx_user_challenges_completed_user ON user_challenges (user_id, completed_at DESC) WHERE status = 'completed';

-- Index only successful daily logs
CREATE INDEX idx_daily_logs_completed_user_date ON daily_logs (user_id, log_date DESC) WHERE completed = true;


CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_view;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's rank in leaderboard
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_rank(p_user_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    v_rank INTEGER;
BEGIN
    SELECT rank INTO v_rank
    FROM leaderboard_view
    WHERE id = p_user_id;
    
    RETURN COALESCE(v_rank, 0);
END;
$$ LANGUAGE plpgsql;

