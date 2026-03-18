# Tasks: Multi-Source Affiliate Integration (Conversand + routing)

## Relevant Files

- `supabase/migrations/025_multi_source_affiliates.sql` — Migration: source, has_user_reward, affiliate_sources, conversand_stats
- `src/lib/conversand.ts` — Conversand API client (offers, stats, balance, payouts)
- `src/app/api/sync-conversand/route.ts` — Conversand daily sync endpoint
- `src/data/banks.ts` — BankOffer type (add source, has_user_reward)
- `src/lib/offers.ts` — Offer mapper (add new fields)
- `src/hooks/useOffers.ts` — Client-side offer hook (add new fields)
- `src/components/OfferCard.tsx` — Offer card (variant for no-reward offers)
- `src/components/OfferFilters.tsx` — Add "Tylko z premią" / "Wszystkie" filter
- `src/app/page.tsx` — Landing page (split core offers + other section)
- `src/app/ranking/page.tsx` — Ranking page (same split)
- `src/app/oferta/[slug]/page.tsx` — Offer detail (minimal page for no-reward)
- `src/app/admin/conversand/page.tsx` — Admin Conversand dashboard
- `src/app/api/admin/conversand/route.ts` — Admin Conversand API (stats, balance, offers)
- `src/lib/bank-name-matcher.ts` — Fuzzy bank name matching logic
- `docs/42-multi-source-affiliates.md` — Documentation

### Notes

- Conversand API returns NO affiliate links — only offer names and commission rates. Links must be manually entered in admin.
- Bank name matching is the hardest part — need mapping table + fuzzy logic.
- TradeDoubler credentials exist but verification pending — architecture must support it as future 3rd network.

## Tasks

### 0.0 Create feature branch
- [ ] 0.1 Create branch `feature/multi-source-affiliates` from main

### 1.0 Database migration
- [ ] 1.1 Create migration `025_multi_source_affiliates.sql`
- [ ] 1.2 ALTER TABLE offers ADD COLUMN `source` text NOT NULL DEFAULT 'leadstar' CHECK (source IN ('leadstar','conversand','tradedoubler','manual'))
- [ ] 1.3 ALTER TABLE offers ADD COLUMN `has_user_reward` boolean NOT NULL DEFAULT true
- [ ] 1.4 UPDATE existing offers: SET source='leadstar', has_user_reward=true
- [ ] 1.5 CREATE TABLE `affiliate_sources` (id uuid PK, offer_id uuid FK→offers, network text CHECK(...), affiliate_url text, commission_amount numeric, commission_type text CHECK('fixed','percentage'), commission_currency text DEFAULT 'PLN', is_preferred boolean DEFAULT false, created_at timestamptz, updated_at timestamptz)
- [ ] 1.6 CREATE TABLE `conversand_stats` (id uuid PK, date date, program_name text, clicks int, leads int, commission numeric, created_at timestamptz)
- [ ] 1.7 Run migration, verify

### 2.0 Conversand API client
- [ ] 2.1 Create `src/lib/conversand.ts` with env vars (CONVERSAND_API_KEY, CONVERSAND_USER_ID)
- [ ] 2.2 Implement `getOffers(page?)` — GET offers.php, category=21 (Financial), country=PL, paginated (20/page)
- [ ] 2.3 Implement `getAllOffers()` — paginate through all pages, 500ms delay between requests
- [ ] 2.4 Implement `getStatistics(dateStart, dateStop, groupBy?)` — GET statistics.php
- [ ] 2.5 Implement `getBalance()` — GET balance.php
- [ ] 2.6 Implement `getPayouts()` — GET payouts.php
- [ ] 2.7 TypeScript types for API responses

### 3.0 Bank name matching
- [ ] 3.1 Create `src/lib/bank-name-matcher.ts`
- [ ] 3.2 Build static mapping table: Conversand name → normalized bank name (e.g., "BNP Paribas - Konto Otwarte" → "bnp paribas")
- [ ] 3.3 Implement `matchBankName(conversandName: string, dbOffers: {bank_name, slug}[])` — returns matched offer or null
- [ ] 3.4 Normalize: lowercase, remove SA/S.A., trim common suffixes (Bank, -, konto, promocja)
- [ ] 3.5 Fallback: Levenshtein distance or token overlap for unmatched names

### 4.0 Sync Conversand offers
- [x] 4.1 Create `/api/sync-conversand/route.ts` — POST handler with CRON_SECRET auth
- [x] 4.2 Fetch all Conversand offers (Financial PL)
- [x] 4.3 For each offer: match to existing DB offer via bank name matcher
- [x] 4.4 If matched: insert/update `affiliate_sources` row (network='conversand', commission from API)
- [x] 4.5 If not matched: create new offer with source='conversand', has_user_reward=false, reward=0, basic info (name, bank_logo fallback)
- [x] 4.6 Log sync results (matched, new, skipped)
- [x] 4.7 Add to vercel.json cron: 01:30 UTC daily

### 5.0 Frontend — offer types + filtering
- [x] 5.1 Update `BankOffer` type in banks.ts: add `source`, `has_user_reward`
- [x] 5.2 Update offer mapper in `offers.ts`: map source, has_user_reward from DB + fetchNoRewardOffers()
- [x] 5.3 Update `useOffers.ts`: map new fields
- [x] 5.4 Update `OfferCard.tsx`: variant for has_user_reward=false — grey badge "Bez premii", simplified card (no tracker, no reward amount)
- [x] 5.5 Update `OfferFilters.tsx`: add toggle "Tylko z premią" / "Wszystkie oferty"
- [x] 5.6 Update landing page (`/page.tsx`): "Inne konta bankowe" section below main offers
- [ ] 5.7 Update ranking page (`/ranking/page.tsx`): skipped — ranking only shows reward offers
- [x] 5.8 Update offer detail page (`/oferta/[slug]/page.tsx`): minimal page for no-reward offers — logo, name, info text, affiliate button, no tracker/conditions

### 6.0 Affiliate routing
- [x] 6.1 Created `affiliate-routing.ts` with resolveAffiliateUrl() — checks affiliate_sources for best link
- [x] 6.2 Logic: is_preferred → LeadStar → any source with URL → fallback
- [x] 6.3 Added `network` column to affiliate_clicks (migration 026) + track-click logs network
- [ ] 6.4 In admin offer view: show all available networks with their commission rates

### 7.0 Admin panel — Conversand
- [x] 7.1 Create `/admin/conversand/page.tsx`
- [x] 7.2 Create `/api/admin/conversand/route.ts` — proxies Conversand API with admin auth
- [x] 7.3 Balance card: current balance, payout threshold
- [x] 7.4 Statistics table: clicks/leads/commission per program (last 30 days)
- [x] 7.5 Offers list: all Conversand offers with match status, commission rates, link status
- [x] 7.6 Add "Conversand" nav item to admin sidebar

### 8.0 SEO + documentation
- [x] 8.1 New offers in sitemap (no-reward offers included, priority 0.5)
- [x] 8.2 Meta tags for no-reward offer pages (title: "{Bank} — Otwórz konto | CebulaZysku")
- [x] 8.3 Create `docs/42-multi-source-affiliates.md`
- [x] 8.4 Update `docs/README.md`
- [x] 8.5 Update `CLAUDE.md` — add Conversand to stack, new tables, new cron
- [ ] 8.6 Build check, commit, merge to main, deploy
