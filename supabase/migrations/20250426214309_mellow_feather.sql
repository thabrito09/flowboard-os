/*
  # User Routes Schema

  1. New Tables
    - `user_routes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `goal` (text, user's main goal)
      - `phases` (jsonb, array of phases with checklists)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on user_routes table
    - Add policies for CRUD operations
    - Add foreign key constraint to profiles

  3. Changes
    - Add trigger for updated_at
*/

-- Create user_routes table
CREATE TABLE user_routes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  goal text NOT NULL,
  phases jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_routes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own routes"
  ON user_routes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own routes"
  ON user_routes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routes"
  ON user_routes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routes"
  ON user_routes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_routes_user_id ON user_routes(user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_user_routes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_routes_updated_at
  BEFORE UPDATE ON user_routes
  FOR EACH ROW
  EXECUTE FUNCTION update_user_routes_updated_at();