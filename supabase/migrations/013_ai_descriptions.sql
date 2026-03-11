-- Śledzi kiedy ostatnio wygenerowano opisy AI dla danej oferty.
-- NULL = wymaga wygenerowania (nowa oferta lub zmienił się feed).
alter table offers
  add column if not exists ai_generated_at timestamptz default null;

-- Indeks dla szybkiego pobierania ofert oczekujących na generację
create index if not exists idx_offers_ai_pending
  on offers(ai_generated_at)
  where is_active = true and ai_generated_at is null;
