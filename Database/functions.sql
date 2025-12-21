CREATE OR REPLACE FUNCTION complete_challenge(
    p_user_id INTEGER,
    p_challenge_id INTEGER
)
RETURNS JSON AS $$
DECLARE
    v_challenge challenges%ROWTYPE;
    v_user users%ROWTYPE;
    v_streak streaks%ROWTYPE;
    v_new_xp INTEGER;
    v_new_streak INTEGER;
    v_yesterday DATE;
    v_today DATE;
    v_result JSON;
BEGIN
    -- Validate input parameters
    IF p_user_id IS NULL OR p_challenge_id IS NULL THEN
        RAISE EXCEPTION 'User ID and Challenge ID cannot be null';
    END IF;
    
    -- Get current date values
    v_today := CURRENT_DATE;
    v_yesterday := CURRENT_DATE - INTERVAL '1 day';
    
    -- Get challenge information (read-only, no lock needed)
    SELECT * INTO v_challenge 
    FROM challenges 
    WHERE id = p_challenge_id AND is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Challenge not found or inactive: %', p_challenge_id;
    END IF;
    
    -- Lock user row to prevent concurrent modifications
    -- This ensures atomic XP updates
    SELECT * INTO v_user 
    FROM users 
    WHERE id = p_user_id 
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found: %', p_user_id;
    END IF;
    
    -- Check if user is already participating in this challenge
    IF NOT EXISTS (
        SELECT 1 FROM user_challenges 
        WHERE user_id = p_user_id 
        AND challenge_id = p_challenge_id 
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'User is not actively participating in this challenge';
    END IF;
    
    -- Check if challenge is already completed
    IF EXISTS (
        SELECT 1 FROM user_challenges 
        WHERE user_id = p_user_id 
        AND challenge_id = p_challenge_id 
        AND status = 'completed'
    ) THEN
        RAISE EXCEPTION 'Challenge already completed';
    END IF;
    
    -- Start transaction block (functions run in their own transaction)
    BEGIN
        -- Update user_challenges table
        UPDATE user_challenges 
        SET 
            status = 'completed',
            completed_at = CURRENT_TIMESTAMP,
            progress_days = v_challenge.duration_days
        WHERE user_id = p_user_id 
        AND challenge_id = p_challenge_id;
        
        -- Update user XP
        v_new_xp := v_user.xp + v_challenge.xp_reward;
        UPDATE users 
        SET xp = v_new_xp
        WHERE id = p_user_id;
        
        -- Handle streak logic
        -- Get or create streak record
        SELECT * INTO v_streak 
        FROM streaks 
        WHERE user_id = p_user_id 
        AND challenge_id = p_challenge_id;
        
        IF NOT FOUND THEN
            -- Create new streak record
            INSERT INTO streaks (user_id, challenge_id, current_streak, longest_streak, last_active)
            VALUES (p_user_id, p_challenge_id, 1, 1, v_today);
            v_new_streak := 1;
        ELSE
            -- Update existing streak
            IF v_streak.last_active = v_yesterday THEN
                -- Consecutive day - increment streak
                v_new_streak := v_streak.current_streak + 1;
            ELSE
                -- Not consecutive - reset to 1
                v_new_streak := 1;
            END IF;
            
            -- Update streak record
            UPDATE streaks 
            SET 
                current_streak = v_new_streak,
                longest_streak = GREATEST(v_streak.longest_streak, v_new_streak),
                last_active = v_today
            WHERE user_id = p_user_id 
            AND challenge_id = p_challenge_id;
        END IF;
        
        -- Create result JSON
        v_result := json_build_object(
            'success', true,
            'new_xp', v_new_xp,
            'new_streak', v_new_streak,
            'xp_gained', v_challenge.xp_reward,
            'challenge_title', v_challenge.title
        );
        
        RETURN v_result;
        
    EXCEPTION
        WHEN OTHERS THEN
            -- Log error and re-raise
            RAISE EXCEPTION 'Error completing challenge: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;
