-- 016_payout_tracking.sql
-- Śledzenie statusu wypłaty premii

ALTER TABLE tracked_offers
  ADD COLUMN IF NOT EXISTS completed_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payout_received_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payout_amount integer DEFAULT NULL;

-- completed_at: kiedy użytkownik spełnił wszystkie warunki
-- payout_received_at: kiedy premia wpłynęła na konto
-- payout_amount: faktyczna kwota premii (może różnić się od offer.reward)

CREATE INDEX IF NOT EXISTS idx_tracked_offers_payout
  ON tracked_offers (user_id, payout_received_at)
  WHERE payout_received_at IS NOT NULL;
