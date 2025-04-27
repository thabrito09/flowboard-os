/*
  # Fix Core Functionality

  1. Tables
    - Ensure profiles table has all required fields
    - Add proper indexes for performance
    - Set up RLS policies
    - Create triggers for automated updates

  2. Security
    - Enable RLS on all tables
    - Set up proper policies for data access
*/

-- Ensure profiles table has all required columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS level integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS xp integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS last_login timestamptz,
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Create or replace indexes
DROP INDEX IF EXISTS idx_profiles_email;
CREATE INDEX idx_profiles_email ON profiles(email);

DROP INDEX IF EXISTS idx_profiles_active;
CREATE INDEX idx_profiles_active ON profiles(active);

-- Update RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Update last_login trigger
CREATE OR REPLACE FUNCTION update_profile_last_login()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profile_last_login ON profiles;
CREATE TRIGGER set_profile_last_login
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (OLD.last_login IS DISTINCT FROM NEW.last_login)
  EXECUTE FUNCTION update_profile_last_login();

-- Create XP update trigger
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
DECLARE
  xp_threshold integer := 1000;
  current_level integer := OLD.level;
BEGIN
  -- Calculate new level based on XP
  WHILE NEW.xp >= xp_threshold LOOP
    NEW.xp := NEW.xp - xp_threshold;
    current_level := current_level + 1;
    xp_threshold := xp_threshold * 1.5;
  END LOOP;
  
  NEW.level := current_level;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_level ON profiles;
CREATE TRIGGER trigger_update_user_level
  BEFORE UPDATE OF xp ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

-- Ensure daily_missions table has correct structure
ALTER TABLE daily_missions
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN title SET NOT NULL,
ALTER COLUMN is_completed SET DEFAULT false,
ALTER COLUMN xp_reward SET DEFAULT 50;

-- Update RLS policies for daily_missions
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own daily missions" ON daily_missions;
DROP POLICY IF EXISTS "Users can create own daily missions" ON daily_missions;
DROP POLICY IF EXISTS "Users can update own daily missions" ON daily_missions;

CREATE POLICY "Users can read own daily missions"
ON daily_missions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own daily missions"
ON daily_missions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily missions"
ON daily_missions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_missions_user_id ON daily_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_missions_created_at ON daily_missions(created_at);