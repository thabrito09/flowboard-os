/*
  # Add created_at column to profiles table

  1. Changes
    - Add `created_at` column to profiles table with timestamp and default value
    - Set default value to now() for automatic timestamp on creation
    - Make column not nullable to ensure data consistency

  2. Notes
    - This is a safe migration that adds a new column without affecting existing data
    - The default value ensures the column will be populated for all new rows
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'created_at'
  ) THEN 
    ALTER TABLE profiles 
    ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;