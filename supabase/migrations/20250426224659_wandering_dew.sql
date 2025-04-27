/*
  # Life Areas and Habits Schema

  1. New Tables
    - life_areas
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - type (text) - mind, creation, learning, body, faith, work, finances
      - name (text)
      - description (text)
      - progress (integer)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - habits
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - area_id (uuid, foreign key)
      - name (text)
      - description (text)
      - frequency (text[]) - days of week
      - streak (integer)
      - total_completions (integer)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - habit_logs
      - id (uuid, primary key)
      - habit_id (uuid, foreign key)
      - completed_at (timestamp)
      - notes (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for user-specific access
*/

-- Life Areas Table
CREATE TABLE IF NOT EXISTS life_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('mind', 'creation', 'learning', 'body', 'faith', 'work', 'finances')),
  name text NOT NULL,
  description text,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habits Table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  area_id uuid REFERENCES life_areas(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  frequency text[] NOT NULL,
  streak integer DEFAULT 0,
  total_completions integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habit Logs Table
CREATE TABLE IF NOT EXISTS habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamptz DEFAULT now(),
  notes text
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_life_areas_user_id ON life_areas(user_id);
CREATE INDEX IF NOT EXISTS idx_life_areas_type ON life_areas(type);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_area_id ON habits(area_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_completed_at ON habit_logs(completed_at);

-- Enable RLS
ALTER TABLE life_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- Life Areas Policies
CREATE POLICY "Users can view own life areas"
  ON life_areas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own life areas"
  ON life_areas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own life areas"
  ON life_areas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Habits Policies
CREATE POLICY "Users can view own habits"
  ON habits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habits"
  ON habits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Habit Logs Policies
CREATE POLICY "Users can view own habit logs"
  ON habit_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM habits
    WHERE habits.id = habit_logs.habit_id
    AND habits.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own habit logs"
  ON habit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM habits
    WHERE habits.id = habit_logs.habit_id
    AND habits.user_id = auth.uid()
  ));

-- Updated At Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_life_areas_updated_at
  BEFORE UPDATE ON life_areas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Streak Update Function
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_completion timestamptz;
  current_streak integer;
BEGIN
  -- Get the last completion before this one
  SELECT completed_at INTO last_completion
  FROM habit_logs
  WHERE habit_id = NEW.habit_id
  AND completed_at < NEW.completed_at
  ORDER BY completed_at DESC
  LIMIT 1;

  -- Get current streak
  SELECT streak INTO current_streak
  FROM habits
  WHERE id = NEW.habit_id;

  -- Update streak based on completion time
  IF last_completion IS NULL OR 
     NEW.completed_at - last_completion <= interval '1 day' THEN
    -- Increment streak
    UPDATE habits
    SET streak = COALESCE(current_streak, 0) + 1,
        total_completions = total_completions + 1
    WHERE id = NEW.habit_id;
  ELSE
    -- Reset streak
    UPDATE habits
    SET streak = 1,
        total_completions = total_completions + 1
    WHERE id = NEW.habit_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_habit_streak_on_completion
  AFTER INSERT ON habit_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_habit_streak();