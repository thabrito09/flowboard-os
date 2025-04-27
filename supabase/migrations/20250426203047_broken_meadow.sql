/*
  # Add additional profile fields

  1. Changes
    - Add email field to profiles table
    - Add last_login field to profiles table
    - Add active field to profiles table
    - Add settings JSONB field to profiles table
  
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS last_login timestamptz,
ADD COLUMN IF NOT EXISTS active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}'::jsonb;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Create index for active users
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(active);

-- Update last_login trigger
CREATE OR REPLACE FUNCTION update_profile_last_login()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profile_last_login
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (OLD.last_login IS DISTINCT FROM NEW.last_login)
  EXECUTE FUNCTION update_profile_last_login();