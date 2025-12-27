-- Fix RLS policy for user_challenges to support INSERT operations
-- =====================================================

DROP POLICY IF EXISTS user_own_challenges ON user_challenges;

-- Policy: Users can only see their own challenges (when logged in)
-- WITH CHECK is needed for INSERT operations
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

