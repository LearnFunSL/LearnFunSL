-- Add last_login_xp_awarded_at column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS last_login_xp_awarded_at TIMESTAMPTZ;

-- Update the add_xp function to handle daily login logic
CREATE OR REPLACE FUNCTION public.add_xp(p_user_id uuid, p_action text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET SEARCH_PATH = public
AS $$
DECLARE
  xp_to_add INT;
  v_last_awarded_at TIMESTAMPTZ;
BEGIN
  -- Determine XP to add based on action
  CASE p_action
    WHEN 'AI_HELP' THEN xp_to_add := 5;
    WHEN 'WATCH_VIDEO' THEN xp_to_add := 15;
    WHEN 'DOWNLOAD_RESOURCE' THEN xp_to_add := 10;
    WHEN 'COMPLETE_QUIZ' THEN xp_to_add := 25;
    WHEN 'DAILY_LOGIN' THEN xp_to_add := 20;
    WHEN 'STREAK_MILESTONE' THEN xp_to_add := 100; -- Example value
    ELSE xp_to_add := 0;
  END CASE;

  -- Handle DAILY_LOGIN logic
  IF p_action = 'DAILY_LOGIN' THEN
    -- Get the last time daily XP was awarded for the user
    SELECT last_login_xp_awarded_at INTO v_last_awarded_at
    FROM public.users
    WHERE id = p_user_id;

    -- Award XP only if it hasn't been awarded today (or ever)
    -- We check if the last award was before the start of today (in UTC)
    IF v_last_awarded_at IS NULL OR v_last_awarded_at < date_trunc('day', now() at time zone 'utc') THEN
      -- Update user's total XP and the timestamp
      UPDATE public.users
      SET
        xp_total = xp_total + xp_to_add,
        last_login_xp_awarded_at = now()
      WHERE id = p_user_id;
    END IF;
  ELSE
    -- For all other actions, just add the XP
    IF xp_to_add > 0 THEN
      UPDATE public.users
      SET xp_total = xp_total + xp_to_add
      WHERE id = p_user_id;
    END IF;
  END IF;
END;
$$;
