# Audyt bezpieczeństwa — cebulazysku.pl

**Data:** 2026-03-10  
**Zakres:** Pełna aplikacja Next.js + Supabase + Vercel

---

## 🔴 KRYTYCZNE (wymaga natychmiastowej naprawy)

### 1. Brak autoryzacji na endpointach admin API

**Problem:** 8 z 9 endpointów admin API (`/api/admin/*`) nie mają żadnej weryfikacji po stronie serwera. Autoryzacja jest tylko na frontendzie (`sessionStorage`), co oznacza, że **każdy** może bezpośrednio wywołać te endpointy.

**Zagrożone endpointy:**
- `GET /api/admin/offers` — odczyt wszystkich ofert z danymi wewnętrznymi
- `PATCH /api/admin/offers` — edycja dowolnej oferty (kwoty, opisy, aktywność)
- `GET /api/admin/users` — pełna lista użytkowników z emailami i statystykami
- `GET /api/admin/stats` — wewnętrzne statystyki biznesowe
- `POST /api/admin/trigger-sync` — ręczne uruchomienie sync (modyfikacja bazy)
- `GET /api/admin/sync-logs` — logi sync
- `GET/POST /api/admin/blog` — odczyt/tworzenie postów
- `POST /api/admin/push/send` — wysłanie push notyfikacji do WSZYSTKICH użytkowników
- `GET /api/admin/messages` — odczyt wiadomości kontaktowych (dane osobowe)
- `GET /api/admin/test-reward-parser` — uruchomienie AI parsera (zużywa quota Gemini)

**Ryzyko:** Każdy znający URL może: edytować oferty, czytać dane użytkowników, wysyłać push notyfikacje do wszystkich, modyfikować bazę danych.

**Jak to działa teraz:**
- Frontend (`admin/layout.tsx`) sprawdza hasło i zapisuje `sessionStorage.admin_auth = "true"`
- Backend **nie sprawdza nic** — brak headera, tokenu, ciasteczka
- Ktokolwiek może zrobić: `curl https://cebulazysku.pl/api/admin/users` i dostanie dane

**Zalecenie:** Dodać middleware lub wrapper autoryzacyjny do wszystkich endpointów admin. Opcje:
- Sprawdzanie `ADMIN_PASSWORD` w headerze `Authorization` (szybkie)
- Sprawdzanie sesji Supabase + rola admin w bazie (właściwe)

---

### 2. Wyciek SYNC_SECRET w dokumentacji (git-tracked)

**Problem:** Plik `docs/15-auto-sync-xml.md` zawiera jawny sekret:
```
SYNC_SECRET = cebulazysku-sync-2026
```
oraz przykład z użyciem:
```
curl -H "Authorization: Bearer cebulazysku-sync-2026"
```

Ten plik jest w repozytorium Git (publicznym na GitHub), więc sekret jest widoczny dla każdego.

**Ryzyko:** Ktoś może wywołać sync endpoint i zmodyfikować dane w bazie.

**Zalecenie:** 
1. Usunąć sekret z dokumentacji (zamienić na placeholder)
2. Zmienić SYNC_SECRET na nowy (stary jest skompromitowany)
3. Zaktualizować w Vercel env vars

---

### 3. LeadStar feed URL z tokenem w kodzie źródłowym

**Problem:** Plik `src/lib/leadstar.ts` zawiera pełny URL z tokenem afiliacyjnym:
```
https://leadstar.pl/xml?pid=...&code=...&ha=...
```

URL jest też w wielu plikach .md w katalogu `docs/`.

**Ryzyko:** Ktoś może użyć Twojego tokenu afiliacyjnego lub podszyć się pod Twoje konto LeadStar.

**Zalecenie:** Przenieść URL do zmiennej środowiskowej `LEADSTAR_FEED_URL`.

---

## 🟡 ŚREDNIE (zalecana naprawa)

### 4. Admin auth bazuje na `sessionStorage` (client-side only)

**Problem:** Panel admina sprawdza hasło raz, potem zapisuje `sessionStorage.admin_auth = "true"`. To można obejść wklejając w konsolę przeglądarki:
```js
sessionStorage.setItem("admin_auth", "true")
```

**Ryzyko:** Brak prawdziwego zabezpieczenia panelu admin — ale to mniejszy problem, bo sam panel nie ma dostępu do API bez pkt. 1.

**Zalecenie:** Po naprawie pkt. 1 (backend auth) frontend auth staje się mniej krytyczny. Docelowo: sesja admin po stronie serwera.

---

### 5. Brak rate-limitu na admin auth login

**Problem:** Endpoint `POST /api/admin/auth` nie ma rate-limitingu. Możliwy brute-force hasła admina.

**Zalecenie:** Dodać rate-limiting (np. max 5 prób/minutę na IP).

---

### 6. In-memory rate limit na formularz kontaktowy

**Problem:** `contact/route.ts` używa `Map()` do rate-limitingu, ale na Vercel Serverless Functions:
- Mapa resetuje się przy każdym cold start
- Różne instancje nie dzielą stanu

**Ryzyko:** Rate-limit jest praktycznie nieefektywny — bot może spamować formularz.

**Zalecenie:** Przenieść rate-limiting do Supabase (sprawdzanie ostatniego wpisu po IP/email) lub użyć Vercel Edge Middleware.

---

## 🟢 DOBRE PRAKTYKI (już wdrożone)

### ✅ Zmienne środowiskowe
- `.env*` w `.gitignore` — pliki env nie trafiają do repo
- Service Role Key używany tylko server-side (`admin.ts`)
- Anon Key poprawnie jako `NEXT_PUBLIC_` (bezpieczne do ekspozycji)

### ✅ RLS (Row Level Security) na tabelach Supabase
- `offers` — public SELECT, service_role INSERT/UPDATE
- `tracked_offers` — user może CRUD tylko swoje
- `condition_progress` — user może CRUD tylko swoje
- `contact_messages` — anon INSERT, service_role SELECT/UPDATE
- `push_subscriptions` — user CRUD na swoje, service_role full
- `blog_posts` — public SELECT, service_role INSERT/UPDATE
- `gamification` — user CRUD na swoje, service_role full
- `notification_preferences` — user CRUD na swoje

### ✅ Input validation
- Formularz kontaktowy: walidacja długości, formatu email
- Honeypot field (anti-bot)
- Admin offers PATCH: allowlist pól (nie można modyfikować `id`, `leadstar_id` itp.)

### ✅ Push subscribe endpoint
- Sprawdza `auth.getUser()` — wymaga zalogowanego użytkownika
- RLS na tabeli `push_subscriptions`

### ✅ Sync endpoint
- Wymaga `Authorization: Bearer <SECRET>` (SYNC_SECRET lub CRON_SECRET)

### ✅ dangerouslySetInnerHTML
- Użyte tylko w `TrackingPixels.tsx` (GA/Meta — kontrolowane dane) i `JsonLd.tsx` (JSON.stringify)
- Brak użycia z danymi od użytkowników — OK

### ✅ Zależności npm
- `npm audit` → **0 vulnerabilities**

### ✅ Supabase client separation
- `client.ts` — browser (anon key)
- `server.ts` — server component (anon key + cookies)
- `admin.ts` — API routes only (service role key)
- `middleware.ts` — session refresh

---

## Plan naprawczy (priorytetyzowany)

| # | Co | Priorytet | Szacunek |
|---|---|---|---|
| 1 | Dodać backend auth do wszystkich admin API | 🔴 KRYTYCZNE | 30 min |
| 2 | Usunąć SYNC_SECRET z docs + zmienić na nowy | 🔴 KRYTYCZNE | 5 min |
| 3 | Przenieść LeadStar URL do env var | 🔴 KRYTYCZNE | 10 min |
| 4 | Rate-limit na admin auth login | 🟡 ŚREDNIE | 15 min |
| 5 | Poprawić rate-limit kontaktu (Supabase-based) | 🟡 ŚREDNIE | 20 min |

---

## Zastosowane poprawki (2026-03-10)

| # | Problem | Poprawka | Pliki |
|---|---------|---------|-------|
| 1 | Brak auth na admin API | Dodano `verifyAdmin()` do 9 endpointów + `adminFetch()` na frontendzie | `src/lib/admin-auth.ts`, `src/lib/admin-fetch.ts`, 9x `route.ts`, 7x admin pages |
| 2 | SYNC_SECRET w docs | Zamieniony na placeholder `<YOUR_SYNC_SECRET>` | `docs/15-auto-sync-xml.md` |
| 3 | LeadStar URL w kodzie | Przeniesiony do `LEADSTAR_FEED_URL` env var | `src/lib/leadstar.ts`, 4x docs |
| 4 | Brak rate-limit na login | Dodano 5 prób/min/IP | `src/app/api/admin/auth/route.ts` |
| 5 | sessionStorage "true" | Teraz przechowuje hasło do wysyłania w headerze | `src/app/admin/layout.tsx` |

### Wymagane akcje w Vercel Dashboard

Po deployu musisz dodać/zmienić te zmienne w **Vercel → Settings → Environment Variables**:

1. **`LEADSTAR_FEED_URL`** — wklej pełny URL feedu LeadStar z tokenem
2. **`SYNC_SECRET`** — zmień na nowy (stary `cebulazysku-sync-2026` jest skompromitowany w historii git)
3. **`CRON_SECRET`** — jeśli zmieniony, zaktualizuj też

---

## Podsumowanie

Wszystkie krytyczne problemy zostały naprawione. Endpointy admin API wymagają teraz hasła w headerze `x-admin-password`. LeadStar URL i SYNC_SECRET usunięte z kodu źródłowego. **WAŻNE:** Stary SYNC_SECRET (`cebulazysku-sync-2026`) był w publicznym repo — zmień go natychmiast w Vercel.
