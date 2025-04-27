/*
  # Add Daily Missions Schema

  1. New Tables
    - `daily_missions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `title` (text)
      - `is_completed` (boolean)
      - `created_at` (timestamp)
      - `completed_at` (timestamp)
      - `xp_reward` (integer)

  2. Security
    - Enable RLS on `daily_missions` table
    - Add policies for authenticated users to:
      - Read their own daily missions
      - Create new daily missions
      - Update their own daily missions
*/

-- Create daily_missions table
CREATE TABLE IF NOT EXISTS daily_missions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  xp_reward integer DEFAULT 50,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_missions_user_id ON daily_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_missions_created_at ON daily_missions(created_at);

-- Add trigger to update completed_at timestamp
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

CREATE TRIGGER set_daily_mission_completed_at
  BEFORE UPDATE ON daily_missions
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_mission_completed_at();