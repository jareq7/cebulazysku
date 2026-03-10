-- Notification preferences per user
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_new_offers BOOLEAN DEFAULT true,
  email_deadline_reminders BOOLEAN DEFAULT true,
  email_weekly_summary BOOLEAN DEFAULT false,
  push_new_offers BOOLEAN DEFAULT true,
  push_condition_reminders BOOLEAN DEFAULT true,
  push_streak_reminders BOOLEAN DEFAULT true,
  hide_young_offers BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to notification_preferences"
  ON notification_preferences FOR ALL
  USING (auth.role() = 'service_role');
