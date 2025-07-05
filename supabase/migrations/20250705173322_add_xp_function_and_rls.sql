-- Drop the function if it exists to ensure a clean setup
DROP FUNCTION IF EXISTS add_xp(uuid, text);

-- Create the function to add XP to a user based on an action
CREATE OR REPLACE FUNCTION add_xp(p_user_id uuid, p_action text)
RETURNS void
LANGUAGE plpgsql
-- SECURITY DEFINER allows the function to run with the permissions of the user who created it,
-- bypassing RLS for the table update while keeping the table secure for direct access.
SECURITY DEFINER AS $$
DECLARE
  xp_to_add int;
BEGIN
  -- Determine the amount of XP to award based on the action provided
  SELECT CASE p_action
    WHEN 'DAILY_LOGIN' THEN 5
    WHEN 'WATCH_VIDEO' THEN 10
    WHEN 'DOWNLOAD_RESOURCE' THEN 8
    WHEN 'COMPLETE_QUIZ' THEN 15
    WHEN 'AI_HELP' THEN 5
    WHEN 'STREAK_7_DAY' THEN 20
    WHEN 'STREAK_30_DAY' THEN 50
    ELSE 0
  END INTO xp_to_add;

  -- If a valid action was provided, update the user's total XP
  IF xp_to_add > 0 THEN
    UPDATE public.users
    SET xp_total = xp_total + xp_to_add
    WHERE id = p_user_id;
  END IF;
END;
$$;

-- Enable Row Level Security (RLS) on the 'users' table
-- This ensures that the policies below will be enforced.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Users can view their own profile." ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.users;

-- Policy: Allow users to view their own profile information
-- This uses `auth.uid()` which corresponds to the user's ID in Supabase's auth system.
CREATE POLICY "Users can view their own profile."
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Policy: Allow users to update their own profile information
CREATE POLICY "Users can update their own profile."
ON public.users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Note on Advanced Features:
-- To properly implement daily limits or streak bonuses, you would need an additional
-- 'user_activity_log' table to track when actions were performed. This function provides
-- the core logic for adding XP, and the activity log can be added later.
