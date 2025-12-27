-- Fix set_user_context function to use SECURITY DEFINER
-- This allows the function to properly set the configuration parameter
-- =====================================================

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

