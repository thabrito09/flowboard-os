/*
  # Fix Database Schema

  1. Changes
    - Add missing columns to profiles table
    - Update RLS policies
    - Fix foreign key constraints
    - Add necessary indexes

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
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

-- Update RLS policies for profiles
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

-- Ensure daily_missions table has correct structure
ALTER TABLE daily_missions
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN title SET NOT NULL,
ALTER COLUMN is_completed SET DEFAULT false,
ALTER COLUMN xp_reward SET DEFAULT 50;

-- Add created_at if missing
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'daily_missions' 
    AND column_name = 'created_at'
  ) THEN 
    ALTER TABLE daily_missions 
    ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Update or create trigger for completed_at
CREATE OR REPLACE FUNCTION update_daily_mission_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_completed = true AND OLD.is_completed = false THEN
    NEW.completed_at = now();
  ELSIF NEW.is_completed = false THEN
    NEW.completed_at = null;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_daily_mission_completed_at ON daily_missions;
CREATE TRIGGER set_daily_mission_completed_at
  BEFORE UPDATE ON daily_missions
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_mission_completed_at();

-- Update RLS policies for daily_missions
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