-- 015_email_sends.sql
-- Log wysłanych emaili — deduplication i audit trail

CREATE TABLE IF NOT EXISTS email_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,     -- 'deadline_7d' | 'deadline_3d' | 'deadline_1d' | 'weekly_summary' | 'new_offer'
  offer_id text,          -- NULL dla weekly_summary
  email text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),

  -- Deduplication: nie wysyłaj tego samego emaila dwa razy tego samego dnia
  UNIQUE (user_id, type, offer_id, (sent_at::date))
);

CREATE INDEX idx_email_sends_user_date ON email_sends (user_id, sent_at DESC);
CREATE INDEX idx_email_sends_type_date ON email_sends (type, sent_at DESC);
