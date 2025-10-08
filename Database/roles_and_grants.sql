-- =====================================================
-- RECLAIM HABIT APP - ROLES AND GRANTS
-- =====================================================
-- This file creates database roles and sets up proper permissions
-- for the Reclaim habit tracking app.
--
-- Security Model:
-- - reclaim_app: Application role with limited privileges
-- - reclaim_admin: Administrative role for maintenance
-- - Proper separation of concerns for production security
--
-- Run this file after all other SQL files to set up permissions
-- =====================================================

-- =====================================================
-- CREATE ROLES
-- =====================================================

-- Application Role: Limited privileges for the Flask app
-- =====================================================
-- This role should be used by the Flask application for all database operations
-- It has only the minimum permissions needed for the app to function
-- =====================================================
CREATE ROLE reclaim_app;

-- Administrative Role: Full privileges for maintenance
-- =====================================================
-- This role is for database administrators and maintenance tasks
-- It has broader permissions for schema changes and data management
-- =====================================================
CREATE ROLE reclaim_admin;

-- =====================================================
-- GRANT PRIVILEGES TO APPLICATION ROLE
-- =====================================================

-- Table permissions for reclaim_app role
-- =====================================================
-- Grant SELECT, INSERT, UPDATE, DELETE on all main tables
-- =====================================================

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

-- =====================================================
-- VIEW AND MATERIALIZED VIEW PERMISSIONS
-- =====================================================

-- Grant access to views for the application
GRANT SELECT ON user_dashboard_view TO reclaim_app;
GRANT SELECT ON challenge_progress_view TO reclaim_app;
GRANT SELECT ON daily_activity_view TO reclaim_app;
GRANT SELECT ON leaderboard_view TO reclaim_app;

-- =====================================================
-- FUNCTION PERMISSIONS
-- =====================================================

-- Grant execute permissions on custom functions
GRANT EXECUTE ON FUNCTION complete_challenge(INTEGER, INTEGER) TO reclaim_app;
GRANT EXECUTE ON FUNCTION create_user(TEXT, TEXT, TEXT, TEXT, TEXT) TO reclaim_app;
GRANT EXECUTE ON FUNCTION get_user_stats(INTEGER) TO reclaim_app;
GRANT EXECUTE ON FUNCTION refresh_leaderboard() TO reclaim_app;
GRANT EXECUTE ON FUNCTION get_user_rank(INTEGER) TO reclaim_app;

-- =====================================================
-- GRANT PRIVILEGES TO ADMIN ROLE
-- =====================================================

-- Full permissions for administrative tasks
-- =====================================================

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

-- =====================================================
-- SECURITY POLICIES (ROW LEVEL SECURITY)
-- =====================================================

-- Enable Row Level Security on sensitive tables
-- =====================================================
-- This ensures users can only access their own data
-- =====================================================

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

-- =====================================================
-- HELPER FUNCTIONS FOR SECURITY
-- =====================================================

-- Function to set current user context for RLS
-- =====================================================
-- This function should be called at the beginning of each request
-- to set the user context for Row Level Security
-- =====================================================
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

-- =====================================================
-- CONNECTION LIMITS AND SECURITY SETTINGS
-- =====================================================

-- Set connection limits for security
-- =====================================================
-- Prevent connection exhaustion attacks
-- =====================================================

-- Limit concurrent connections for app role
ALTER ROLE reclaim_app CONNECTION LIMIT 50;

-- Limit concurrent connections for admin role
ALTER ROLE reclaim_admin CONNECTION LIMIT 10;

-- =====================================================
-- PASSWORD POLICIES (if using password authentication)
-- =====================================================

-- Note: These are commented out as they require additional extensions
-- Uncomment if you want to enforce password policies
-- =====================================================

/*
-- Set password policies (requires passwordcheck extension)
-- ALTER ROLE reclaim_app PASSWORD 'your_secure_password_here';
-- ALTER ROLE reclaim_admin PASSWORD 'your_admin_password_here';
*/

-- =====================================================
-- AUDIT LOGGING SETUP
-- =====================================================

-- Create audit log table for security monitoring
-- =====================================================
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

-- =====================================================
-- FLASK APPLICATION INTEGRATION
-- =====================================================

-- Example Flask database connection setup
-- =====================================================
/*
# In your Flask app, use these connection parameters:

# For application operations:
DATABASE_URL = "postgresql://reclaim_app:your_password@localhost/reclaim_db"

# For administrative operations:
ADMIN_DATABASE_URL = "postgresql://reclaim_admin:your_admin_password@localhost/reclaim_db"

# Set user context at the beginning of each request:
@app.before_request
def set_db_user_context():
    if 'user_id' in session:
        db.execute("SELECT set_user_context(%s)", [session['user_id']])

# Clear user context on logout:
@app.route('/logout')
def logout():
    db.execute("SELECT clear_user_context()")
    session.clear()
    return redirect(url_for('login'))
*/

-- =====================================================
-- PRODUCTION SECURITY CHECKLIST
-- =====================================================

/*
SECURITY CHECKLIST FOR PRODUCTION:

1. Change default passwords:
   - Set strong passwords for reclaim_app and reclaim_admin roles
   - Use environment variables for database credentials

2. Network security:
   - Use SSL/TLS for database connections
   - Restrict database access to application servers only
   - Use connection pooling (pgBouncer recommended)

3. Monitoring:
   - Enable audit logging for sensitive operations
   - Monitor failed login attempts
   - Set up alerts for unusual activity

4. Backup and recovery:
   - Regular automated backups
   - Test restore procedures
   - Document recovery processes

5. Updates and patches:
   - Keep PostgreSQL updated
   - Monitor security advisories
   - Apply patches promptly

6. Access control:
   - Use least privilege principle
   - Regular access reviews
   - Remove unused accounts

7. Data protection:
   - Encrypt sensitive data at rest
   - Use proper data retention policies
   - Implement data anonymization where needed
*/

-- =====================================================
-- USAGE EXAMPLES
-- =====================================================

/*
FLASK SECURITY INTEGRATION:

1. Database Connection with Role:
   ```python
   import psycopg2
   
   def get_db_connection():
       return psycopg2.connect(
           host='localhost',
           database='reclaim_db',
           user='reclaim_app',
           password='your_secure_password'
       )
   ```

2. Set User Context:
   ```python
   @app.before_request
   def set_user_context():
       if 'user_id' in session:
           with get_db_connection() as conn:
               with conn.cursor() as cur:
                   cur.execute("SELECT set_user_context(%s)", [session['user_id']])
   ```

3. Clear Context on Logout:
   ```python
   @app.route('/logout')
   def logout():
       with get_db_connection() as conn:
           with conn.cursor() as cur:
               cur.execute("SELECT clear_user_context()")
       session.clear()
       return redirect(url_for('login'))
   ```

4. Admin Operations:
   ```python
   def get_admin_connection():
       return psycopg2.connect(
           host='localhost',
           database='reclaim_db',
           user='reclaim_admin',
           password='your_admin_password'
       )
   ```
*/
