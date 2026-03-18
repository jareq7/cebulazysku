-- @author Claude Code (claude-opus-4-6) | 2026-03-18
-- Multi-source affiliate integration: Conversand + routing

-- Add source and has_user_reward to offers
ALTER TABLE offers ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'leadstar';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS has_user_reward boolean NOT NULL DEFAULT true;

-- Mark all existing offers as LeadStar with user rewards
UPDATE offers SET source = 'leadstar', has_user_reward = true WHERE source = 'leadstar';

-- Affiliate sources: per-offer, per-network links and commissions
CREATE TABLE IF NOT EXISTS affiliate_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id text NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  network text NOT NULL CHECK (network IN ('leadstar', 'conversand', 'tradedoubler', 'manual')),
  affiliate_url text,
  commission_amount numeric,
  commission_type text CHECK (commission_type IN ('fixed', 'percentage')),
  commission_currency text DEFAULT 'PLN',
  is_preferred boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (offer_id, network)
);

-- Conversand cached statistics
CREATE TABLE IF NOT EXISTS conversand_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  program_name text NOT NULL,
  clicks integer DEFAULT 0,
  leads integer DEFAULT 0,
  commission numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (date, program_name)
);
