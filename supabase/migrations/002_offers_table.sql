-- Offers table: stores bank offers from LeadStar XML feed + manual enrichment
create table if not exists offers (
  id text primary key, -- slug-based ID e.g. "mbank-ekonto-promo"
  slug text unique not null,
  bank_name text not null,
  bank_logo text, -- URL to logo
  bank_color text, -- hex color
  offer_name text not null,
  short_description text,
  full_description text,
  reward integer default 0,
  difficulty text default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  conditions jsonb default '[]'::jsonb, -- array of Condition objects
  deadline text, -- ISO date string
  affiliate_url text,
  pros jsonb default '[]'::jsonb,
  cons jsonb default '[]'::jsonb,
  faq jsonb default '[]'::jsonb,
  monthly_fee integer default 0,
  free_if text,
  featured boolean default false,
  last_updated text,
  -- LeadStar XML fields
  leadstar_id text, -- original ID from XML feed
  leadstar_product_id text,
  leadstar_branch text,
  leadstar_program_name text,
  leadstar_description_html text, -- raw HTML from XML
  leadstar_benefits_html text, -- raw HTML from XML
  leadstar_logo_url text, -- logo URL from XML
  leadstar_affiliate_url text, -- affiliate URL from XML
  free_first boolean default false, -- from XML free_first field
  -- Metadata
  source text default 'manual' check (source in ('manual', 'leadstar', 'hybrid')),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for active offers
create index if not exists idx_offers_active on offers(is_active) where is_active = true;
create index if not exists idx_offers_leadstar_id on offers(leadstar_id);

-- Sync log: tracks XML sync history
create table if not exists sync_log (
  id uuid default gen_random_uuid() primary key,
  synced_at timestamptz default now(),
  offers_found integer default 0,
  offers_created integer default 0,
  offers_updated integer default 0,
  errors jsonb default '[]'::jsonb,
  duration_ms integer default 0
);

-- RLS: offers are publicly readable
-- Writes happen via service_role key which bypasses RLS
alter table offers enable row level security;
alter table sync_log enable row level security;

create policy "Offers are publicly readable"
  on offers for select
  using (true);

create policy "Sync log is publicly readable"
  on sync_log for select
  using (true);

-- Note: INSERT/UPDATE/DELETE on offers and sync_log is done via
-- SUPABASE_SERVICE_ROLE_KEY which bypasses RLS entirely.
-- No additional write policies needed.
