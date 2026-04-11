-- Production Security Policies for Ikigai App
-- Run this in your Supabase SQL editor for production

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow all read write" ON boards;
DROP POLICY IF EXISTS "Allow all read write" ON entries;
DROP POLICY IF EXISTS "Allow all read write" ON quizzes;
DROP POLICY IF EXISTS "Allow all read write" ON reports;
DROP POLICY IF EXISTS "Allow all read write" ON profiles;

-- Create secure RLS policies

-- Boards: Users can only see their own boards or anonymous boards
CREATE POLICY "Users can view their own boards" ON boards
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

CREATE POLICY "Users can create boards" ON boards
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

CREATE POLICY "Users can update their own boards" ON boards
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

-- Entries: Users can only see entries from their own boards
CREATE POLICY "Users can view entries from their boards" ON entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = entries.board_id 
      AND (boards.user_id = auth.uid() OR boards.user_id IS NULL)
    )
  );

CREATE POLICY "Users can create entries for their boards" ON entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = entries.board_id 
      AND (boards.user_id = auth.uid() OR boards.user_id IS NULL)
    )
  );

CREATE POLICY "Users can update entries from their boards" ON entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = entries.board_id 
      AND (boards.user_id = auth.uid() OR boards.user_id IS NULL)
    )
  );

-- Quizzes: Users can only see their own quizzes
CREATE POLICY "Users can view their own quizzes" ON quizzes
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

CREATE POLICY "Users can create quizzes" ON quizzes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

-- Reports: Users can only see their own reports
CREATE POLICY "Users can view their own reports" ON reports
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

-- Profiles: Users can only see their own profiles
CREATE POLICY "Users can view their own profiles" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    id IS NULL
  );

CREATE POLICY "Users can create profiles" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR 
    id IS NULL
  );

CREATE POLICY "Users can update their own profiles" ON profiles
  FOR UPDATE USING (
    auth.uid() = id OR 
    id IS NULL
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_board_id ON entries(board_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON quizzes(user_id);

-- Add constraints for data integrity
ALTER TABLE boards ADD CONSTRAINT check_title_length CHECK (char_length(title) <= 200);
ALTER TABLE entries ADD CONSTRAINT check_text_length CHECK (char_length(text) <= 1000);
ALTER TABLE profiles ADD CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE profiles ADD CONSTRAINT check_name_length CHECK (char_length(name) <= 100);

-- Add rate limiting table for production
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,
  endpoint text NOT NULL,
  count integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(identifier, endpoint, window_start)
);

-- Rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier text,
  p_endpoint text,
  p_limit integer,
  p_window_minutes integer DEFAULT 60
) RETURNS boolean AS $$
DECLARE
  current_count integer;
  window_start timestamptz;
BEGIN
  window_start := date_trunc('minute', now()) - (p_window_minutes || ' minutes')::interval;
  
  -- Clean old records
  DELETE FROM rate_limits 
  WHERE window_start < now() - (p_window_minutes * 2 || ' minutes')::interval;
  
  -- Get current count
  SELECT count INTO current_count
  FROM rate_limits
  WHERE identifier = p_identifier 
    AND endpoint = p_endpoint 
    AND window_start >= date_trunc('minute', now()) - (p_window_minutes || ' minutes')::interval;
  
  -- If no record exists or count is under limit
  IF current_count IS NULL OR current_count < p_limit THEN
    -- Insert or update record
    INSERT INTO rate_limits (identifier, endpoint, count, window_start)
    VALUES (p_identifier, p_endpoint, 1, date_trunc('minute', now()))
    ON CONFLICT (identifier, endpoint, window_start)
    DO UPDATE SET count = rate_limits.count + 1;
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION check_rate_limit TO anon, authenticated;
