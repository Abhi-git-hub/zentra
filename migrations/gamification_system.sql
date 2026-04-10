-- Zentra Gamification System - RPC Functions and Schema Updates
-- This migration adds gamification support to the Zentra database

-- Ensure user_profiles has xp and discipline_score columns
DO $$
BEGIN
  -- Add xp column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS 
    WHERE TABLE_NAME = 'user_profiles' AND COLUMN_NAME = 'xp'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN xp INTEGER DEFAULT 0;
  END IF;

  -- Add discipline_score column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS 
    WHERE TABLE_NAME = 'user_profiles' AND COLUMN_NAME = 'discipline_score'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN discipline_score INTEGER DEFAULT 0;
  END IF;

  -- Add game_plays column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS 
    WHERE TABLE_NAME = 'user_profiles' AND COLUMN_NAME = 'game_plays'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN game_plays INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create or replace the increment_user_stats RPC function
-- This function atomically updates XP and discipline score
CREATE OR REPLACE FUNCTION increment_user_stats(
  p_user_id UUID,
  p_xp_delta INTEGER,
  p_score_delta INTEGER
)
RETURNS TABLE (
  new_xp INTEGER,
  new_discipline_score INTEGER
) AS $$
BEGIN
  UPDATE user_profiles
  SET 
    xp = xp + p_xp_delta,
    discipline_score = discipline_score + p_score_delta,
    updated_at = NOW()
  WHERE id = p_user_id;

  RETURN QUERY
  SELECT 
    user_profiles.xp,
    user_profiles.discipline_score
  FROM user_profiles
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create leaderboard view for efficient querying
CREATE OR REPLACE VIEW user_leaderboard AS
SELECT 
  id,
  full_name,
  avatar_url,
  xp,
  discipline_score,
  game_plays,
  created_at,
  ROW_NUMBER() OVER (ORDER BY xp DESC) AS rank
FROM user_profiles
WHERE xp > 0 OR discipline_score != 0
ORDER BY xp DESC;
