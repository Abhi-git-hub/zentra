-- Zentra Gamification System - RPC Functions and Schema Updates
-- This migration adds gamification support to the Zentra database

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_NAME = 'user_profiles' AND COLUMN_NAME = 'xp'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN xp INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_NAME = 'user_profiles' AND COLUMN_NAME = 'discipline_score'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN discipline_score INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_NAME = 'user_profiles' AND COLUMN_NAME = 'game_plays'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN game_plays INTEGER DEFAULT 0;
  END IF;
END $$;

-- Atomic user-stat update. Never allow a caller to mutate another user's profile.
CREATE OR REPLACE FUNCTION increment_user_stats(
  p_user_id UUID,
  p_xp_delta INTEGER,
  p_score_delta INTEGER
)
RETURNS TABLE (
  new_xp INTEGER,
  new_discipline_score INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized to update these user stats';
  END IF;

  IF abs(COALESCE(p_xp_delta, 0)) > 1000 OR abs(COALESCE(p_score_delta, 0)) > 100 THEN
    RAISE EXCEPTION 'Stat delta exceeds the allowed limit';
  END IF;

  UPDATE public.user_profiles
  SET
    xp = GREATEST(0, COALESCE(xp, 0) + COALESCE(p_xp_delta, 0)),
    discipline_score = LEAST(100, GREATEST(0, COALESCE(discipline_score, 0) + COALESCE(p_score_delta, 0))),
    updated_at = NOW()
  WHERE id = p_user_id;

  RETURN QUERY
  SELECT user_profiles.xp, user_profiles.discipline_score
  FROM public.user_profiles
  WHERE id = p_user_id;
END;
$$;

CREATE OR REPLACE VIEW public.user_leaderboard AS
SELECT
  id,
  full_name,
  avatar_url,
  xp,
  discipline_score,
  game_plays,
  created_at,
  ROW_NUMBER() OVER (ORDER BY xp DESC) AS rank
FROM public.user_profiles
WHERE xp > 0 OR discipline_score <> 0
ORDER BY xp DESC;
