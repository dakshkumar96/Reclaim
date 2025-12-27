
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

-- Drop old policies if they exist (for re-running this script)
DROP POLICY IF EXISTS user_own_data ON users;
DROP POLICY IF EXISTS user_own_data_select ON users;
DROP POLICY IF EXISTS user_own_data_update ON users;
DROP POLICY IF EXISTS user_own_data_insert ON users;

-- Policy: Users can only see their own data (when logged in)
-- The 'true' parameter makes current_setting return NULL instead of erroring when parameter doesn't exist
CREATE POLICY user_own_data_select ON users
    FOR SELECT TO reclaim_app
    USING (
        current_setting('user.current_user_id', true) IS NOT NULL 
        AND current_setting('user.current_user_id', true) != ''
        AND id = current_setting('user.current_user_id', true)::INTEGER
    );

-- Policy: Users can only update their own data (when logged in)
CREATE POLICY user_own_data_update ON users
    FOR UPDATE TO reclaim_app
    USING (
        current_setting('user.current_user_id', true) IS NOT NULL 
        AND current_setting('user.current_user_id', true) != ''
        AND id = current_setting('user.current_user_id', true)::INTEGER
    );

-- Policy: Allow inserts for signup (no user_id needed)
-- This is critical - signup happens BEFORE a user exists
CREATE POLICY user_own_data_insert ON users
    FOR INSERT TO reclaim_app
    WITH CHECK (true);

-- Enable RLS on user_challenges table
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own challenges (when logged in)
CREATE POLICY user_own_challenges ON user_challenges
    FOR ALL TO reclaim_app
    USING (
        current_setting('user.current_user_id', true) IS NOT NULL 
        AND current_setting('user.current_user_id', true) != ''
        AND user_id = current_setting('user.current_user_id', true)::INTEGER
    )
    WITH CHECK (
        current_setting('user.current_user_id', true) IS NOT NULL 
        AND current_setting('user.current_user_id', true) != ''
        AND user_id = current_setting('user.current_user_id', true)::INTEGER
    );

-- Enable RLS on daily_logs table
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own logs (when logged in)
CREATE POLICY user_own_logs ON daily_logs
    FOR ALL TO reclaim_app
    USING (
        current_setting('user.current_user_id', true) IS NOT NULL 
        AND current_setting('user.current_user_id', true) != ''
        AND user_id = current_setting('user.current_user_id', true)::INTEGER
    )
    WITH CHECK (
        current_setting('user.current_user_id', true) IS NOT NULL 
        AND current_setting('user.current_user_id', true) != ''
        AND user_id = current_setting('user.current_user_id', true)::INTEGER
    );

-- Enable RLS on streaks table
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own streaks (when logged in)
CREATE POLICY user_own_streaks ON streaks
    FOR ALL TO reclaim_app
    USING (
        current_setting('user.current_user_id', true) IS NOT NULL 
        AND current_setting('user.current_user_id', true) != ''
        AND user_id = current_setting('user.current_user_id', true)::INTEGER
    )
    WITH CHECK (
        current_setting('user.current_user_id', true) IS NOT NULL 
        AND current_setting('user.current_user_id', true) != ''
        AND user_id = current_setting('user.current_user_id', true)::INTEGER
    );

-- Enable RLS on user_badges table
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own badges (when logged in)
CREATE POLICY user_own_badges ON user_badges
    FOR ALL TO reclaim_app
    USING (
        current_setting('user.current_user_id', true) IS NOT NULL 
        AND current_setting('user.current_user_id', true) != ''
        AND user_id = current_setting('user.current_user_id', true)::INTEGER
    );


CREATE OR REPLACE FUNCTION set_user_context(p_user_id INTEGER)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('user.current_user_id', p_user_id::TEXT, false);
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Grant execute permission to application role
GRANT EXECUTE ON FUNCTION set_user_context(INTEGER) TO reclaim_app;

-- Function to clear user context (for logout)
-- =====================================================
CREATE OR REPLACE FUNCTION clear_user_context()
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('user.current_user_id', '', false);
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to application role
GRANT EXECUTE ON FUNCTION clear_user_context() TO reclaim_app;

-- Limit concurrent connections for app role
ALTER ROLE reclaim_app CONNECTION LIMIT 50;

-- Limit concurrent connections for admin role
ALTER ROLE reclaim_admin CONNECTION LIMIT 10;

CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Grant permissions on audit log
GRANT INSERT ON audit_log TO reclaim_app;
GRANT USAGE, SELECT ON SEQUENCE audit_log_id_seq TO reclaim_app;
GRANT SELECT ON audit_log TO reclaim_admin;

-