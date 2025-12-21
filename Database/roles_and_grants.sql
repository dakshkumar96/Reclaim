
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

