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

CREATE OR REPLACE FUNCTION create_user(
    p_username TEXT,
    p_password_hash TEXT,
    p_email TEXT,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_user_id INTEGER;
    v_result JSON;
BEGIN
    -- Validate required parameters
    IF p_username IS NULL OR p_password_hash IS NULL OR p_email IS NULL THEN
        RAISE EXCEPTION 'Username, password_hash, and email are required';
    END IF;
    
    -- Validate username length
    IF LENGTH(p_username) < 3 THEN
        RAISE EXCEPTION 'Username must be at least 3 characters long';
    END IF;
    
    -- Validate email format (basic check)
    IF p_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;
    
    BEGIN
        -- Insert new user
        INSERT INTO users (username, password_hash, email, first_name, last_name)
        VALUES (p_username, p_password_hash, p_email, p_first_name, p_last_name)
        RETURNING id INTO v_user_id;
        
        -- Create result JSON
        v_result := json_build_object(
            'success', true,
            'user_id', v_user_id,
            'username', p_username,
            'message', 'User created successfully'
        );
        
        RETURN v_result;
        
    EXCEPTION
        WHEN unique_violation THEN
            -- Handle unique constraint violations
            IF SQLSTATE = '23505' THEN
                -- Check which constraint was violated
                IF SQLERRM LIKE '%username%' THEN
                    RAISE EXCEPTION 'Username already exists: %', p_username;
                ELSIF SQLERRM LIKE '%email%' THEN
                    RAISE EXCEPTION 'Email already exists: %', p_email;
                ELSE
                    RAISE EXCEPTION 'User with this information already exists';
                END IF;
            END IF;
        WHEN check_violation THEN
            -- Handle check constraint violations
            RAISE EXCEPTION 'Invalid user data: %', SQLERRM;
        WHEN OTHERS THEN
            -- Handle any other errors
            RAISE EXCEPTION 'Error creating user: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;


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
    
    -- Build result JSON
    v_result := json_build_object(
        'user_id', v_user.id,
        'username', v_user.username,
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


-- Helper no-op functions to support app context calls
CREATE OR REPLACE FUNCTION set_user_context(p_user_id INTEGER)
RETURNS VOID AS $$
BEGIN
    -- Placeholder for future RLS or per-session context
    PERFORM 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION clear_user_context()
RETURNS VOID AS $$
BEGIN
    -- Placeholder for future RLS or per-session context
    PERFORM 1;
END;
$$ LANGUAGE plpgsql;