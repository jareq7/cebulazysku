-- Extend affiliate_clicks with UTM, session, user agent tracking
-- @author Claude Code (claude-opus-4-6) | 2026-03-17

ALTER TABLE affiliate_clicks
  ADD COLUMN IF NOT EXISTS session_id text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS consent_state text,
  ADD COLUMN IF NOT EXISTS user_agent text;

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_utm_source ON affiliate_clicks(utm_source);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_utm_campaign ON affiliate_clicks(utm_campaign);
