-- Welcome email A/B testing variant column
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS welcome_variant TEXT; -- A, B, or C
