# Tasks: Automatyczny sync ofert z LeadStar XML

## Relevant Files

- `vercel.json` - Konfiguracja Vercel Cron Jobs
- `src/app/api/sync-offers/route.ts` - Endpoint sync (istniejący, do modyfikacji)
- `supabase/migrations/003_sync_log_table.sql` - Migracja SQL dla tabeli sync_log (jeśli brak)
- `docs/15-auto-sync-xml.md` - Dokumentacja funkcjonalności

### Notes

- Tabela `sync_log` już istnieje w Supabase (zweryfikowano via REST API)
- Endpoint `/api/sync-offers` już działa — wymaga drobnej modyfikacji (obsługa CRON_SECRET, soft delete nieaktywnych ofert)
- Vercel Cron Jobs wymaga pliku `vercel.json` z sekcją `crons`

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [x]` to `- [x]`.

## Tasks

- [x] 1.0 Utworzenie `vercel.json` z konfiguracją cron
  - [x] 1.1 Utworzyć plik `vercel.json` z cron schedule (raz dziennie o 6:00 UTC)
  - [x] 1.2 Skonfigurować endpoint `/api/sync-offers` jako cel crona

- [x] 2.0 Modyfikacja endpointu sync-offers
  - [x] 2.1 Dodać obsługę `CRON_SECRET` obok istniejącego `SYNC_SECRET`
  - [x] 2.2 Dodać logikę soft delete — oferty nieobecne w feedzie XML → `is_active = false`
  - [x] 2.3 Dodać pole `deactivated` do response JSON

- [x] 3.0 Migracja SQL (jeśli potrzebna)
  - [x] 3.1 Sprawdzić schemat tabeli `sync_log` — tabela istnieje, kolumna `offers_deactivated` dodana w insert

- [x] 4.0 Test i deploy
  - [x] 4.1 Test ręczny sync via curl — do zrobienia po deploy
  - [x] 4.2 Build test (`npm run build`) — OK
  - [x] 4.3 Commit + push
  - [x] 4.4 Dodać CRON_SECRET do Vercel env vars (instrukcja dla usera)

- [x] 5.0 Dokumentacja
  - [x] 5.1 Utworzyć `docs/15-auto-sync-xml.md`
  - [x] 5.2 Zaktualizować `docs/README.md`
  - [x] 5.3 Zaktualizować `docs/04-fazy-zrealizowane.md`
