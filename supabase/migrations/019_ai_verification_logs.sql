-- AI verification logs: tracks how AI corrects regex-parsed conditions
-- @author Claude Code (claude-opus-4-6) | 2026-03-14

CREATE TABLE IF NOT EXISTS ai_verification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id text NOT NULL,
  bank_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  regex_conditions jsonb NOT NULL DEFAULT '[]'::jsonb,
  ai_conditions jsonb NOT NULL DEFAULT '[]'::jsonb,
  corrections text[] NOT NULL DEFAULT '{}',
  verified boolean NOT NULL DEFAULT false
);

CREATE INDEX idx_ai_verification_logs_offer_id ON ai_verification_logs(offer_id);
CREATE INDEX idx_ai_verification_logs_created_at ON ai_verification_logs(created_at DESC);
CREATE INDEX idx_ai_verification_logs_has_corrections ON ai_verification_logs((array_length(corrections, 1) > 0)) WHERE array_length(corrections, 1) > 0;
