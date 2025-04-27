/*
  # Space Blocks System

  1. New Tables
    - `space_blocks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text) - 'text' or 'checklist'
      - `content` (jsonb)
      - `order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
*/

-- Create space_blocks table
CREATE TABLE space_blocks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'checklist')),
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE space_blocks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own blocks"
  ON space_blocks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own blocks"
  ON space_blocks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blocks"
  ON space_blocks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blocks"
  ON space_blocks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_space_blocks_user_id ON space_blocks(user_id);
CREATE INDEX idx_space_blocks_order ON space_blocks("order");

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_space_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_space_blocks_updated_at
  BEFORE UPDATE ON space_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_space_blocks_updated_at();