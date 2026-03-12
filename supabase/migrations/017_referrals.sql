-- 017_referrals.sql
-- Program poleceń

CREATE TABLE IF NOT EXISTS user_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  code text NOT NULL UNIQUE,
  registered_at timestamptz DEFAULT NULL,   -- kiedy zaproszony się zarejestrował
  first_offer_at timestamptz DEFAULT NULL,  -- kiedy zaproszony dodał pierwszą ofertę
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrals_select_own" ON user_referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "referrals_insert_service" ON user_referrals
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX idx_user_referrals_referrer ON user_referrals (referrer_id);
CREATE INDEX idx_user_referrals_code ON user_referrals (code);
