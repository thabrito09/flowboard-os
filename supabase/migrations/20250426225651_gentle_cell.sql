/*
  # Training Area Schema

  1. New Tables
    - `user_trainings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `exercise_name` (text)
      - `weight` (numeric)
      - `reps` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_trainings` table
    - Add policies for authenticated users to manage their own training data
*/

-- Create user_trainings table
CREATE TABLE IF NOT EXISTS user_trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  exercise_name text NOT NULL,
  weight numeric NOT NULL CHECK (weight >= 0),
  reps integer NOT NULL CHECK (reps > 0),
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_trainings_user_id ON user_trainings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_trainings_created_at ON user_trainings(created_at);

-- Enable RLS
ALTER TABLE user_trainings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own trainings"
  ON user_trainings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own trainings"
  ON user_trainings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trainings"
  ON user_trainings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trainings"
  ON user_trainings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);