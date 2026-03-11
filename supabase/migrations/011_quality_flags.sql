-- Dodanie kolumn do śledzenia jakości danych i blokowania pól przed nadpisaniem przez sync

ALTER TABLE offers
  ADD COLUMN IF NOT EXISTS locked_fields jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS quality_flags jsonb DEFAULT '{}'::jsonb;

-- locked_fields: tablica nazw pól chronionych przed nadpisaniem przez sync
-- Przykład: ["reward", "bank_name", "offer_name"]

-- quality_flags: obiekt z flagami jakości wykrytymi podczas sync
-- Przykład:
-- {
--   "reward_zero": true,
--   "description_empty": true,
--   "benefits_empty": true,
--   "scraped_from_page": true,
--   "scrape_failed": true,
--   "scrape_failed_reason": "bot_protection",
--   "last_scraped_at": "2026-03-11T06:00:00Z",
--   "reward_changed": true,
--   "reward_prev": 1000,
--   "reward_new": 300
-- }

COMMENT ON COLUMN offers.locked_fields IS 'Pola chronione przed nadpisaniem przez automatyczny sync z LeadStar';
COMMENT ON COLUMN offers.quality_flags IS 'Flagi jakości danych wykryte podczas sync (brak premii, puste opisy, wynik scrapingu)';
