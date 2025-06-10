-- This script sets up Row Level Security (RLS) for the Supabase tables.
-- It's crucial for ensuring users can only access their own data.

-- Note: Policies for other tables like 'users', 'content', and 'chat_messages'
-- should be added here as they are created. The policies below are based on
-- the 'decks' and 'cards' tables inferred from 'types/flashcards.ts'.

-- Enable RLS for the tables
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners. This is a good security practice.
ALTER TABLE public.decks FORCE ROW LEVEL SECURITY;
ALTER TABLE public.cards FORCE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts during re-runs of the script.
DROP POLICY IF EXISTS "Users can view their own decks" ON public.decks;
DROP POLICY IF EXISTS "Users can insert their own decks" ON public.decks;
DROP POLICY IF EXISTS "Users can update their own decks" ON public.decks;
DROP POLICY IF EXISTS "Users can delete their own decks" ON public.decks;

DROP POLICY IF EXISTS "Users can view cards in their own decks" ON public.cards;
DROP POLICY IF EXISTS "Users can insert cards in their own decks" ON public.cards;
DROP POLICY IF EXISTS "Users can update cards in their own decks" ON public.cards;
DROP POLICY IF EXISTS "Users can delete cards from their own decks" ON public.cards;


-- -----------------------------------------------------------------------------
-- Policies for 'decks' table
-- -----------------------------------------------------------------------------

-- 1. Users can select (view) their own decks.
CREATE POLICY "Users can view their own decks"
ON public.decks FOR SELECT
USING (auth.uid() = user_id);

-- 2. Users can insert new decks for themselves.
CREATE POLICY "Users can insert their own decks"
ON public.decks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own decks.
CREATE POLICY "Users can update their own decks"
ON public.decks FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Users can delete their own decks.
CREATE POLICY "Users can delete their own decks"
ON public.decks FOR DELETE
USING (auth.uid() = user_id);


-- -----------------------------------------------------------------------------
-- Policies for 'cards' table
-- -----------------------------------------------------------------------------
-- Access to cards is determined by ownership of the parent deck.

-- 1. Users can select (view) cards that belong to their decks.
CREATE POLICY "Users can view cards in their own decks"
ON public.cards FOR SELECT
USING ( EXISTS (SELECT 1 FROM decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()) );

-- 2. Users can insert cards into their own decks.
CREATE POLICY "Users can insert cards in their own decks"
ON public.cards FOR INSERT
WITH CHECK ( EXISTS (SELECT 1 FROM decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()) );

-- 3. Users can update cards in their own decks.
CREATE POLICY "Users can update cards in their own decks"
ON public.cards FOR UPDATE
USING ( EXISTS (SELECT 1 FROM decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()) )
WITH CHECK ( EXISTS (SELECT 1 FROM decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()) );

-- 4. Users can delete cards from their own decks.
CREATE POLICY "Users can delete cards from their own decks"
ON public.cards FOR DELETE
USING ( EXISTS (SELECT 1 FROM decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()) );


-- -----------------------------------------------------------------------------
-- Policies for 'user_progress' table
-- -----------------------------------------------------------------------------
-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress FORCE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own progress" ON public.user_progress;

-- Users can perform all actions on their own progress record
CREATE POLICY "Users can manage their own progress"
ON public.user_progress FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- -----------------------------------------------------------------------------
-- Policies for 'resources' table
-- -----------------------------------------------------------------------------
-- NOTE: This assumes 'resources' is a table for public content.
-- The policy allows any authenticated user to read, but only admins to modify.
-- You may need to create a function to check for an admin role from the JWT.
-- Example function `is_admin()`: `CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$ SELECT (auth.jwt()->>'user_role')::jsonb ? 'admin' $$ LANGUAGE sql STABLE;`
-- This also covers the 'videos' section, as videos are a type of resource.

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources FORCE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Resources are publically viewable" ON public.resources;
DROP POLICY IF EXISTS "Admins can manage resources" ON public.resources;

-- ANYONE can view all resources (public access)
CREATE POLICY "Resources are publically viewable"
ON public.resources FOR SELECT
TO anon, authenticated
USING (true);

-- Users with 'admin' role can manage all resources
CREATE POLICY "Admins can manage resources"
ON public.resources FOR ALL
USING (auth.jwt() ->> 'user_role' = 'admin') -- Placeholder for checking admin role from Clerk JWT
WITH CHECK (auth.jwt() ->> 'user_role' = 'admin');


-- -----------------------------------------------------------------------------
-- Policies for 'profiles' table
-- -----------------------------------------------------------------------------
-- NOTE: This assumes a 'profiles' table with an 'id' column of type UUID that
-- is a foreign key to auth.users.id. Policies for this table must use auth.uid().

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Profiles are publically viewable" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Anyone can view profiles
CREATE POLICY "Profiles are publically viewable"
ON public.profiles FOR SELECT
USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id); 