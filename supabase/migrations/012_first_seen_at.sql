-- Data pierwszego pojawienia się oferty w feedzie LeadStar
ALTER TABLE offers
  ADD COLUMN IF NOT EXISTS first_seen_at timestamptz DEFAULT now();

-- Dla istniejących ofert ustaw first_seen_at na updated_at (najlepsze przybliżenie)
UPDATE offers SET first_seen_at = updated_at WHERE first_seen_at IS NULL;

COMMENT ON COLUMN offers.first_seen_at IS 'Data pierwszego pojawienia się oferty w feedzie LeadStar (nie zmienia się przy kolejnych syncach)';
