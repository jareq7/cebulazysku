-- Tracked offers: which offers a user is tracking
create table if not exists tracked_offers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  offer_id text not null,
  started_at timestamptz default now() not null,
  created_at timestamptz default now() not null,
  
  unique(user_id, offer_id)
);

-- Condition progress: per-condition, per-month counts
create table if not exists condition_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  offer_id text not null,
  condition_id text not null,
  month text not null, -- format: "YYYY-MM"
  count integer default 0 not null,
  updated_at timestamptz default now() not null,
  
  unique(user_id, offer_id, condition_id, month)
);

-- Indexes for fast lookups
create index if not exists idx_tracked_offers_user on tracked_offers(user_id);
create index if not exists idx_condition_progress_user_offer on condition_progress(user_id, offer_id);

-- Row Level Security
alter table tracked_offers enable row level security;
alter table condition_progress enable row level security;

-- Users can only see their own data
create policy "Users can view own tracked offers"
  on tracked_offers for select
  using (auth.uid() = user_id);

create policy "Users can insert own tracked offers"
  on tracked_offers for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own tracked offers"
  on tracked_offers for delete
  using (auth.uid() = user_id);

create policy "Users can view own condition progress"
  on condition_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own condition progress"
  on condition_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own condition progress"
  on condition_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own condition progress"
  on condition_progress for delete
  using (auth.uid() = user_id);
