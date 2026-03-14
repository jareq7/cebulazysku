-- Affiliate click tracking (placeholder for future conversion tracking)
-- @author Claude Code (claude-opus-4-6) | 2026-03-14

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  clicked_at timestamptz NOT NULL DEFAULT now(),
  source_page text
);

CREATE INDEX idx_affiliate_clicks_offer_id ON affiliate_clicks(offer_id);
CREATE INDEX idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at DESC);
