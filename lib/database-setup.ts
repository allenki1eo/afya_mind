"use server"

import { supabase } from "./supabase"

export async function setupDatabase() {
  // Create profiles table
  const { error: profilesError } = await supabase.rpc("create_profiles_table", {})
  if (profilesError) console.error("Error creating profiles table:", profilesError)

  // Create mood_entries table
  const { error: moodEntriesError } = await supabase.rpc("create_mood_entries_table", {})
  if (moodEntriesError) console.error("Error creating mood_entries table:", moodEntriesError)

  // Create journal_entries table
  const { error: journalEntriesError } = await supabase.rpc("create_journal_entries_table", {})
  if (journalEntriesError) console.error("Error creating journal_entries table:", journalEntriesError)

  // Create therapists table
  const { error: therapistsError } = await supabase.rpc("create_therapists_table", {})
  if (therapistsError) console.error("Error creating therapists table:", therapistsError)

  return {
    success: !profilesError && !moodEntriesError && !journalEntriesError && !therapistsError,
  }
}

// This function should be run in the Supabase SQL editor to create the necessary functions
export const supabaseSetupSQL = `
-- Create profiles table function
CREATE OR REPLACE FUNCTION create_profiles_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    nickname TEXT NOT NULL,
    age_range TEXT,
    primary_concerns TEXT[],
    preferred_therapist_gender TEXT,
    preferred_language TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Set up Row Level Security
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

  CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);
END;
$$ LANGUAGE plpgsql;

-- Create mood_entries table function
CREATE OR REPLACE FUNCTION create_mood_entries_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    mood_value INTEGER NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Set up Row Level Security
  ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  CREATE POLICY "Users can view their own mood entries"
    ON mood_entries FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own mood entries"
    ON mood_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own mood entries"
    ON mood_entries FOR UPDATE
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete their own mood entries"
    ON mood_entries FOR DELETE
    USING (auth.uid() = user_id);
END;
$$ LANGUAGE plpgsql;

-- Create journal_entries table function
CREATE OR REPLACE FUNCTION create_journal_entries_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    audio_url TEXT,
    transcript TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Set up Row Level Security
  ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  CREATE POLICY "Users can view their own journal entries"
    ON journal_entries FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own journal entries"
    ON journal_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own journal entries"
    ON journal_entries FOR UPDATE
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete their own journal entries"
    ON journal_entries FOR DELETE
    USING (auth.uid() = user_id);
END;
$$ LANGUAGE plpgsql;

-- Create therapists table function
CREATE OR REPLACE FUNCTION create_therapists_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS therapists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    specialties TEXT[] NOT NULL,
    languages TEXT[] NOT NULL,
    location TEXT NOT NULL,
    bio TEXT,
    education TEXT,
    price TEXT,
    online BOOLEAN DEFAULT TRUE,
    in_person BOOLEAN DEFAULT TRUE,
    rating FLOAT DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved BOOLEAN DEFAULT FALSE
  );

  -- Set up Row Level Security
  ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  CREATE POLICY "Anyone can view approved therapists"
    ON therapists FOR SELECT
    USING (approved = TRUE);

  CREATE POLICY "Therapists can view their own profile"
    ON therapists FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Therapists can insert their own profile"
    ON therapists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Therapists can update their own profile"
    ON therapists FOR UPDATE
    USING (auth.uid() = user_id);
END;
$$ LANGUAGE plpgsql;
`
