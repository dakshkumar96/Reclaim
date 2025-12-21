
CREATE ROLE reclaim_app;

CREATE ROLE reclaim_admin;


-- Users table permissions
GRANT SELECT, INSERT, UPDATE ON users TO reclaim_app;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO reclaim_app;

-- Challenges table permissions
GRANT SELECT ON challenges TO reclaim_app;
-- Note: INSERT/UPDATE/DELETE on challenges should be admin-only in production

-- User challenges table permissions
GRANT SELECT, INSERT, UPDATE ON user_challenges TO reclaim_app;
GRANT USAGE, SELECT ON SEQUENCE user_challenges_id_seq TO reclaim_app;

-- Daily logs table permissions
GRANT SELECT, INSERT, UPDATE ON daily_logs TO reclaim_app;
GRANT USAGE, SELECT ON SEQUENCE daily_logs_id_seq TO reclaim_app;

-- Streaks table permissions
GRANT SELECT, INSERT, UPDATE ON streaks TO reclaim_app;
GRANT USAGE, SELECT ON SEQUENCE streaks_id_seq TO reclaim_app;

-- Badges table permissions
GRANT SELECT ON badges TO reclaim_app;
-- Note: INSERT/UPDATE/DELETE on badges should be admin-only in production

-- User badges table permissions
GRANT SELECT, INSERT ON user_badges TO reclaim_app;
GRANT USAGE, SELECT ON SEQUENCE user_badges_id_seq TO reclaim_app;


-- Grant access to views for the application
GRANT SELECT ON user_dashboard_view TO reclaim_app;
GRANT SELECT ON challenge_progress_view TO reclaim_app;
GRANT SELECT ON daily_activity_view TO reclaim_app;
GRANT SELECT ON leaderboard_view TO reclaim_app;



-- Grant execute permissions on custom functions
GRANT EXECUTE ON FUNCTION complete_challenge(INTEGER, INTEGER) TO reclaim_app;
GRANT EXECUTE ON FUNCTION create_user(TEXT, TEXT, TEXT, TEXT, TEXT) TO reclaim_app;
GRANT EXECUTE ON FUNCTION get_user_stats(INTEGER) TO reclaim_app;
GRANT EXECUTE ON FUNCTION refresh_leaderboard() TO reclaim_app;
GRANT EXECUTE ON FUNCTION get_user_rank(INTEGER) TO reclaim_app;



-- All table permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO reclaim_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO reclaim_admin;

-- All view permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO reclaim_admin;

-- All function permissions
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO reclaim_admin;

-- Schema permissions
GRANT USAGE ON SCHEMA public TO reclaim_admin;
GRANT CREATE ON SCHEMA public TO reclaim_admin;


-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY user_own_data ON users
    FOR ALL TO reclaim_app
    USING (id = current_setting('app.current_user_id')::INTEGER);

-- Enable RLS on user_challenges table
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own challenges
CREATE POLICY user_own_challenges ON user_challenges
    FOR ALL TO reclaim_app
    USING (user_id = current_setting('app.current_user_id')::INTEGER);

-- Enable RLS on daily_logs table
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own logs
CREATE POLICY user_own_logs ON daily_logs
    FOR ALL TO reclaim_app
    USING (user_id = current_setting('app.current_user_id')::INTEGER);

-- Enable RLS on streaks table
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own streaks
CREATE POLICY user_own_streaks ON streaks
    FOR ALL TO reclaim_app
    USING (user_id = current_setting('app.current_user_id')::INTEGER);

-- Enable RLS on user_badges table
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own badges
CREATE POLICY user_own_badges ON user_badges
    FOR ALL TO reclaim_app
    USING (user_id = current_setting('app.current_user_id')::INTEGER);


CREATE OR REPLACE FUNCTION set_user_context(p_user_id INTEGER)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_user_id', p_user_id::TEXT, false);
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to application role
GRANT EXECUTE ON FUNCTION set_user_context(INTEGER) TO reclaim_app;

-- Function to clear user context (for logout)
-- =====================================================
CREATE OR REPLACE FUNCTION clear_user_context()
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_user_id', NULL, false);
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to application role
GRANT EXECUTE ON FUNCTION clear_user_context() TO reclaim_app;

