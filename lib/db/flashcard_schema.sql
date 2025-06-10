-- This script is designed to be re-runnable.
-- It will drop existing tables, triggers, and functions before recreating them.
-- WARNING: This will delete all data in the 'cards', 'decks', and 'user_progress' tables.

-- Drop functions and their dependent objects (like triggers) using CASCADE.
DROP FUNCTION IF EXISTS public.trigger_set_timestamp() CASCADE;
DROP FUNCTION IF EXISTS public.get_card_counts_by_deck() CASCADE;

-- Drop tables if they exist. The order is important due to foreign key constraints.
DROP TABLE IF EXISTS public.cards;
DROP TABLE IF EXISTS public.decks;
DROP TABLE IF EXISTS public.user_progress;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Decks table
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(100),
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_studied_at TIMESTAMP WITH TIME ZONE
);
-- Add indexes for performance
CREATE INDEX idx_decks_user_id ON decks(user_id);

-- Cards table
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1, -- e.g., 1: Easy, 2: Medium, 3: Hard
  times_studied INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  last_studied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Add indexes for performance
CREATE INDEX idx_cards_deck_id ON cards(deck_id);

-- User progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  total_cards_studied INTEGER DEFAULT 0,
  last_study_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Add indexes for performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- Function to update the updated_at timestamp on decks
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get card counts for all decks
CREATE OR REPLACE FUNCTION get_card_counts_by_deck()
RETURNS TABLE (deck_id UUID, count BIGINT) AS $$
BEGIN
  RETURN QUERY
    SELECT c.deck_id, COUNT(c.id)::BIGINT
    FROM cards c
    GROUP BY c.deck_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update updated_at on deck update
CREATE TRIGGER set_deck_timestamp
BEFORE UPDATE ON decks
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- RLS policies have been moved to 'lib/supabase/rls.sql'
-- This file should only contain schema definitions. 