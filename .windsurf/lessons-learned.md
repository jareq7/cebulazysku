# Lessons Learned — CebulaZysku projekt

## Środowisko
- **Node.js v25.6.1** — ma problemy z `node -e` (eval) dla skomplikowanych skryptów. NIE UŻYWAĆ `node -e` do wieloliniowych skryptów.
- **macOS grep** nie ma `-P` (Perl regex). Używać `grep -E` lub `awk`.
- **Port 3000** jest często zajęty przez inny projekt (SEMGOKU). Sprawdzać `lsof -i :3000` i użyć innego portu.
- **Python3** — proste jednolinijkowe OK, ale async HTTP (urllib) w `-c` wisi. NIE UŻYWAĆ do sieciowych operacji.

## Zasady pracy z narzędziami

### Curl — PREFEROWANE podejście do API
- Krótkie, pojedyncze curle działają niezawodnie i szybko (~1-2s)
- Batch insert: zapisz JSON do pliku (`/tmp/dane.json`), potem `curl -d @/tmp/dane.json`
- Nigdy nie łącz >3 curli w jednym poleceniu (`&&`) — za długie, user canceluje
- Supabase REST API: `POST` z `Prefer: resolution=merge-duplicates` = upsert

### Skrypty — UNIKAĆ w runtime
- Node.js eval (`node -e`) → NIE dla wieloliniowych
- Python3 -c z HTTP → NIE, wisi
- Bash heredoc z długim JSON → NIE, timeout
- **ZAMIAST TEGO**: zapisz dane do pliku i użyj curl z `-d @plik`

### Dev server
- Zawsze sprawdź `lsof -i :3000` przed uruchomieniem
- Użyj `PORT=3001 npm run dev` lub `npx next dev -p 3001`
- Nie próbuj uruchomić jeśli `.next/dev/lock` istnieje

## Zasady pracy z Supabase

### Tabele i migracje
- SQL migracje pisać w `supabase/migrations/00X_nazwa.sql`
- User musi ręcznie uruchomić SQL w Supabase Dashboard (brak CLI)
- Link: https://supabase.com/dashboard/project/ndhcyrivrvoagfyqewfm/sql/new
- Zawsze sprawdzić czy tabela istnieje przed próbą insert: `curl ...rest/v1/tabela?select=id&limit=1`

### RLS Policies
- Publiczne tabele (offers): `for select using (true)`
- User-owned tabele (tracked_offers, condition_progress): `using (auth.uid() = user_id)`
- Zapis do publicznych tabel: przez `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)

### Dane
- Seed danych: zapisz JSON array do pliku, POST z `Prefer: resolution=merge-duplicates`
- Update per-row: `PATCH ...?id=eq.wartość` (max 1-2 na polecenie)
- Nie próbuj batch PATCH — Supabase REST nie obsługuje

## Zasady planowania

### Podział zadań
- NIGDY nie rób fetch + parse + transform + upsert w jednym kroku
- Podziel na: (1) fetch do pliku, (2) sprawdź dane, (3) przygotuj JSON, (4) wrzuć
- Każdy krok = max 5 sekund wykonania

### Migracja danych
- Najpierw schema (SQL migration)
- Potem seed minimalnymi danymi (batch insert)
- Potem wzbogacaj (PATCH per row lub sync API)
- Frontend podpinaj dopiero gdy dane w DB są kompletne

### Fallback strategy
- Zachowaj hardcoded dane (`banks.ts`) jako fallback
- Nie usuwaj starego kodu dopóki nowy nie jest w pełni działający
- Frontend: najpierw hook `useOffers()` z fallback na static data

## Konfiguracja projektu
- Env vars w `.env.local` (gitignored — nie da się `write_to_file`, użyj `cat >` przez run_command)
- Vercel env vars: user musi dodać ręcznie w Dashboard
- Service role key: NIGDY nie commitować, tylko .env.local i Vercel

## Stan projektu (aktualizuj!)
- ✅ Supabase: client, server, middleware
- ✅ Auth: Supabase Auth (signup/login/logout)
- ✅ Tracker: tracked_offers + condition_progress w DB
- ✅ Offers table: 18 ofert z LeadStar (minimalne dane)
- ✅ Sync API route: `/api/sync-offers` (POST, chronione SYNC_SECRET)
- ⏳ Oferty w DB wymagają wzbogacenia (opisy, loga, affiliate URL z XML)
- ⏳ Frontend nadal czyta z `banks.ts` (8 hardcoded ofert)
- ⏳ Vercel env vars nie dodane
