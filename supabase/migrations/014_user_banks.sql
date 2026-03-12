-- 014_user_banks.sql
-- Table for storing banks where user already has an account

CREATE TABLE IF NOT EXISTS user_banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, bank_name)
);

ALTER TABLE user_banks ENABLE ROW LEVEL SECURITY;

-- Users can only see and manage their own entries
CREATE POLICY "user_banks_select" ON user_banks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_banks_insert" ON user_banks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_banks_delete" ON user_banks
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_user_banks_user_id ON user_banks (user_id);
