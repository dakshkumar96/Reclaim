-- Fix RLS policies for daily_logs and streaks to support INSERT operations
-- =====================================================

-- Fix daily_logs policy
DROP POLICY IF EXISTS user_own_logs ON daily_logs;

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

-- Fix streaks policy
DROP POLICY IF EXISTS user_own_streaks ON streaks;

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

