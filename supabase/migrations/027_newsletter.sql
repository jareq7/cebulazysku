-- Newsletter subscribers (independent from auth users)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, unsubscribed
  source TEXT DEFAULT 'popup', -- popup, inline, registration, manual
  confirm_token UUID DEFAULT gen_random_uuid(),
  unsubscribe_token UUID DEFAULT gen_random_uuid(),
  subscribed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_confirm ON newsletter_subscribers(confirm_token);
CREATE INDEX IF NOT EXISTS idx_newsletter_unsub ON newsletter_subscribers(unsubscribe_token);

-- RLS: only service role can access (no public access)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
