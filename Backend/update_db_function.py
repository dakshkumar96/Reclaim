#!/usr/bin/env python3
"""Script to update get_user_stats function in the database"""
import psycopg2
from config import Config

def update_get_user_stats():
    """Update the get_user_stats function to include first_name and last_name"""
    sql = """
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
        
        -- Build result JSON (including first_name and last_name)
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
    """
    
    try:
        conn = psycopg2.connect(
            dbname=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            host=Config.DB_HOST
        )
        cur = conn.cursor()
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        print("Successfully updated get_user_stats function to include first_name and last_name")
        return True
    except Exception as e:
        print(f"Error updating function: {e}")
        print("\nYou may need to run this SQL manually with admin privileges:")
        print("See Database/update_get_user_stats.sql")
        return False

if __name__ == "__main__":
    update_get_user_stats()
