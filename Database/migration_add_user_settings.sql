-- Migration: Add user_settings table
-- Run this if your database already exists and you need to add the user_settings table
-- Date: 2024

-- Check if table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_settings'
    ) THEN
        -- Create user_settings table
        CREATE TABLE user_settings (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            notifications BOOLEAN DEFAULT TRUE,
            email_updates BOOLEAN DEFAULT TRUE,
            show_badges BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT one_settings_per_user UNIQUE(user_id)
        );

        -- Create index for faster lookups
        CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

        -- Grant permissions
        GRANT SELECT, INSERT, UPDATE ON user_settings TO reclaim_app;
        GRANT USAGE, SELECT ON SEQUENCE user_settings_id_seq TO reclaim_app;

        RAISE NOTICE 'user_settings table created successfully';
    ELSE
        RAISE NOTICE 'user_settings table already exists';
    END IF;
END $$;

-- Update get_user_stats function to include email (if not already updated)
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id INTEGER)
RETURNS JSON AS $$
DECLARE
    v_user users%ROWTYPE;
    v_total_challenges INTEGER;
    v_completed_challenges INTEGER;
    v_total_badges INTEGER;
    v_result JSON;
BEGIN
    -- Get user information
    SELECT * INTO v_user FROM users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found: %', p_user_id;
    END IF;
    
    -- Get challenge statistics
    SELECT COUNT(*) INTO v_total_challenges
    FROM user_challenges 
    WHERE user_id = p_user_id;
    
    SELECT COUNT(*) INTO v_completed_challenges
    FROM user_challenges 
    WHERE user_id = p_user_id AND status = 'completed';
    
    -- Get badge count
    SELECT COUNT(*) INTO v_total_badges
    FROM user_badges 
    WHERE user_id = p_user_id;
    
    -- Build result JSON (including email and names)
    v_result := json_build_object(
        'user_id', v_user.id,
        'username', v_user.username,
        'email', v_user.email,
        'first_name', v_user.first_name,
        'last_name', v_user.last_name,
        'xp', v_user.xp,
        'level', v_user.level,
        'total_challenges', v_total_challenges,
        'completed_challenges', v_completed_challenges,
        'total_badges', v_total_badges,
        'created_at', v_user.created_at,
        'last_active', v_user.last_active
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully';
END $$;
