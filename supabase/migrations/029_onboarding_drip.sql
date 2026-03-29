-- @author Claude Code (claude-opus-4-6) | 2026-03-29
-- Onboarding drip email sequence tracking

ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_started_at TIMESTAMPTZ;

-- Set onboarding_started_at for existing active subscribers
UPDATE newsletter_subscribers
SET onboarding_started_at = subscribed_at
WHERE status = 'active' AND onboarding_started_at IS NULL AND subscribed_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_newsletter_onboarding
ON newsletter_subscribers(status, onboarding_step, onboarding_started_at);
