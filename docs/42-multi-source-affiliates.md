# 42. Multi-Source Affiliates (Conversand + routing)

## Cel

Rozszerzenie systemu afiliacyjnego o dodatkowe sieci CPA (Conversand, przyszłościowo TradeDoubler) z automatycznym dopasowaniem ofert i routingiem kliknięć.

## Architektura

### Nowe tabele

- **`affiliate_sources`** — per-offer, per-network linki i prowizje
  - `offer_id` FK → offers, `network` (leadstar/conversand/tradedoubler/manual)
  - `affiliate_url`, `commission_amount`, `commission_type`, `is_preferred`
  - UNIQUE (offer_id, network)

- **`conversand_stats`** — cachowane statystyki Conversand
  - `date`, `program_name`, `clicks`, `leads`, `commission`

### Nowe kolumny w `offers`

- `source` text — źródło oferty (leadstar/conversand/tradedoubler/manual)
- `has_user_reward` boolean — czy oferta ma premię dla użytkownika

## Conversand API Client (`src/lib/conversand.ts`)

- REST API z API key + user ID
- `getOffers(page)` — kategoria 21 (Financial), PL, 20/stronę
- `getAllOffers()` — paginacja z 500ms delay
- `getStatistics()`, `getBalance()`, `getPayouts()`

## Bank Name Matcher (`src/lib/bank-name-matcher.ts`)

Dopasowuje nazwy ofert z Conversand do ofert w DB:

1. **Static aliases** — mapa 14 banków polskich (alior, bnp, mbank, pekao, millennium, ing, santander, pkobp, velobank, citi, credit-agricole, nest, toyota, bnp-go)
2. **Token overlap** — fallback z progiem >0.5

## Sync Endpoint (`/api/sync-conversand`)

- Cron: 01:30 UTC daily
- Fetchuje oferty Conversand → matchuje do DB → upsert affiliate_sources
- Niedopasowane → tworzy nową ofertę (source=conversand, has_user_reward=false, reward=0)

## Affiliate Routing (`src/lib/affiliate-routing.ts`)

Priorytet wyboru linku:
1. `is_preferred` w affiliate_sources
2. LeadStar (domyślny affiliate_url z offers)
3. Dowolny inny źródło z URL
4. Fallback na affiliate_url oferty

## Frontend

- `BankOffer` type: dodane `source`, `hasUserReward`
- `OfferCard`: wariant "Bez premii" (szary badge, brak kwoty, brak warunków)
- `OfferFilters`: toggle "Tylko z premią" / "Wszystkie"
- Landing page: sekcja "Inne konta bankowe" pod głównymi ofertami
- Offer detail: uproszczona strona dla no-reward (brak trackera/warunków, prosty CTA)

## Admin Panel (`/admin/conversand`)

- Saldo i próg wypłaty
- Statystyki (kliknięcia, leady, prowizja per program)
- Lista ofert z statusem dopasowania i dostępnością linków
- Manual sync trigger

## Pliki

| Plik | Opis |
|------|------|
| `supabase/migrations/025_multi_source_affiliates.sql` | Migracja DB |
| `supabase/migrations/026_affiliate_clicks_network.sql` | Network column w clicks |
| `src/lib/conversand.ts` | API client |
| `src/lib/bank-name-matcher.ts` | Fuzzy matching |
| `src/lib/affiliate-routing.ts` | Routing kliknięć |
| `src/app/api/sync-conversand/route.ts` | Daily sync |
| `src/app/api/admin/conversand/route.ts` | Admin API |
| `src/app/admin/conversand/page.tsx` | Admin dashboard |
| `vercel.json` | Cron schedule |
