/*
  # Add created_at column to missions table

  1. Changes
    - Add created_at column to missions table with default value of now()
    
  2. Notes
    - Uses IF NOT EXISTS to prevent errors if column already exists
    - Sets default value to now() for all new records
    - Backfills existing records with current timestamp
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'missions' 
    AND column_name = 'created_at'
  ) THEN 
    ALTER TABLE missions 
    ADD COLUMN created_at timestamptz DEFAULT now();

    -- Update existing records to have a created_at value
    UPDATE missions 
    SET created_at = now() 
    WHERE created_at IS NULL;
  END IF;
END $$;