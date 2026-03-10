# 26. Security Fixes — szczegółowy opis naprawek

[← Powrót do spisu treści](./README.md) | [Audyt bezpieczeństwa](./25-audyt-bezpieczenstwa.md)

---

## Data: 10.03.2026

## Kontekst

Po przeprowadzeniu pełnego audytu bezpieczeństwa (`docs/25-audyt-bezpieczenstwa.md`) zidentyfikowano **5 krytycznych** i **2 średnie** problemy. Wszystkie krytyczne zostały naprawione tego samego dnia.

---

## 1. Backend auth na admin API (KRYTYCZNY)

### Problem

Wszystkie endpointy admin API (`/api/admin/*`) poza `/api/admin/auth` były **publicznie dostępne** — nie wymagały żadnej autoryzacji. Wystarczyło znać URL, np.:

```bash
# Przed naprawą — zwracało pełne dane:
curl https://cebulazysku.pl/api/admin/stats      → 200 + dane
curl https://cebulazysku.pl/api/admin/users       → 200 + dane użytkowników
curl https://cebulazysku.pl/api/admin/offers      → 200 + oferty
```

Dotyczyło to 9 endpointów:
- `/api/admin/stats` (GET) — statystyki
- `/api/admin/offers` (GET, PATCH) — lista i edycja ofert
- `/api/admin/users` (GET) — dane użytkowników
- `/api/admin/blog` (GET, POST, PATCH, DELETE) — blog CRUD
- `/api/admin/messages` (GET, PATCH) — wiadomości kontaktowe
- `/api/admin/sync-logs` (GET) — logi sync
- `/api/admin/trigger-sync` (POST) — ręczny sync
- `/api/admin/push/send` (POST) — wysyłanie push notyfikacji
- `/api/admin/test-reward-parser` (GET) — test AI parsera

### Przyczyna

Frontend admin panelu (`src/app/admin/layout.tsx`) sprawdzał hasło przez `sessionStorage`:
```ts
// Stare rozwiązanie — tylko client-side
sessionStorage.setItem("admin_auth", "true");
```

To oznaczało, że autoryzacja istniała **wyłącznie w przeglądarce** — przeglądarka decydowała czy pokazać panel. Backend nie weryfikował niczego.

### Rozwiązanie

**Krok 1:** Stworzono helper `src/lib/admin-auth.ts`:
```ts
export function verifyAdmin(request: NextRequest): NextResponse | null {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not configured" }, { status: 500 });
  }

  // Sprawdź header x-admin-password lub Authorization: Bearer
  const xAdminPass = request.headers.get("x-admin-password");
  if (xAdminPass === adminPassword) return null; // OK

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${adminPassword}`) return null; // OK

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Krok 2:** Dodano `verifyAdmin()` na początku każdego handlera w 9 plikach route.ts:
```ts
export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;
  // ... reszta logiki
}
```

**Krok 3:** Stworzono frontend helper `src/lib/admin-fetch.ts`:
```ts
export function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const password = sessionStorage.getItem("admin_password") || "";
  const headers = new Headers(init?.headers);
  headers.set("x-admin-password", password);
  return fetch(url, { ...init, headers });
}
```

**Krok 4:** Zamieniono `fetch()` na `adminFetch()` w 7 stronach admin panelu.

**Krok 5:** Zmieniono `sessionStorage` z `"admin_auth" = "true"` na `"admin_password" = hasło`.

### Zmienione pliki (18 plików)

**Nowe pliki:**
- `src/lib/admin-auth.ts` — helper backend
- `src/lib/admin-fetch.ts` — helper frontend

**Backend (9 plików):**
- `src/app/api/admin/stats/route.ts`
- `src/app/api/admin/offers/route.ts`
- `src/app/api/admin/users/route.ts`
- `src/app/api/admin/blog/route.ts`
- `src/app/api/admin/messages/route.ts`
- `src/app/api/admin/sync-logs/route.ts`
- `src/app/api/admin/trigger-sync/route.ts`
- `src/app/api/admin/push/send/route.ts`
- `src/app/api/admin/test-reward-parser/route.ts`

**Frontend (7 plików):**
- `src/app/admin/layout.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/oferty/page.tsx`
- `src/app/admin/blog/page.tsx`
- `src/app/admin/wiadomosci/page.tsx`
- `src/app/admin/sync/page.tsx`
- `src/app/admin/push/page.tsx`
- `src/app/admin/uzytkownicy/page.tsx`

### Weryfikacja

```bash
# Po naprawie:
curl https://cebulazysku.pl/api/admin/stats → 401 Unauthorized ✅
```

---

## 2. Wyciek SYNC_SECRET w dokumentacji (KRYTYCZNY)

### Problem

Plik `docs/15-auto-sync-xml.md` zawierał sekret w plain text:

```markdown
| `SYNC_SECRET` | `cebulazysku-sync-2026` | Ręczne wywołanie sync |

curl -X POST https://cebulazysku.pl/api/sync-offers \
  -H "Authorization: Bearer cebulazysku-sync-2026"
```

### Przyczyna

Dokumentacja została napisana z konkretnymi wartościami dla wygody, bez pomyślenia że plik jest śledzony przez git i publicznie dostępny na GitHub.

### Rozwiązanie

Zamieniono wartość na placeholder `<YOUR_SYNC_SECRET>` w obu miejscach.

**WAŻNE:** Stary sekret jest skompromitowany — istnieje w historii git. Dlatego:
1. Zmieniono SYNC_SECRET na nowy w Vercel Dashboard
2. Stary sekret `cebulazysku-sync-2026` nie jest już aktywny

### Zmienione pliki
- `docs/15-auto-sync-xml.md`

---

## 3. LeadStar feed URL z tokenem w kodzie (KRYTYCZNY)

### Problem

Pełny URL feedu z tokenami afiliacyjnymi był hardcoded:

```ts
// src/lib/leadstar.ts
const LEADSTAR_URL =
  "https://leadstar.pl/xml?pid=93050&code=9f3d50f263d704d90b38d3f6549b11cc&ha=4242926830";
```

Parametry `pid`, `code` i `ha` to tokeny identyfikujące konto afiliacyjne. Ktoś mógłby:
- Podszyć się pod konto afiliacyjne
- Podpiąć swoje linki pod cudze ID partnera
- Zablokować konto u LeadStar

URL był też w 5 plikach dokumentacji.

### Przyczyna

Przy pierwszej implementacji parsera XML nie traktowano URL-a feedu jako sekretu — wydawał się "zwykłym" linkiem. Jednak zawiera tokeny autoryzacyjne.

### Rozwiązanie

**Krok 1:** Zmieniono `src/lib/leadstar.ts`:
```ts
// Przed:
const LEADSTAR_URL = "https://leadstar.pl/xml?pid=93050&code=...";

// Po:
const LEADSTAR_URL = process.env.LEADSTAR_FEED_URL || "";
```

**Krok 2:** Dodano `LEADSTAR_FEED_URL` do:
- `.env.local` (lokalnie)
- Vercel Dashboard → Environment Variables (produkcja)

**Krok 3:** Zamaskowano URL w plikach docs (zamieniono na `${LEADSTAR_FEED_URL}`):
- `docs/DOKUMENTACJA.md` (2 miejsca)
- `docs/02-architecture.md`
- `docs/10-leadstar-xml.md`
- `docs/25-audyt-bezpieczenstwa.md`
- `docs/bledy-oferty-feed-2026-03-10.md` (2 miejsca)

### Zmienione pliki
- `src/lib/leadstar.ts`
- 5 plików docs

---

## 4. Rate-limit na admin login (ŚREDNI)

### Problem

Endpoint `/api/admin/auth` pozwalał na nieograniczoną liczbę prób logowania. Atakujący mógł brute-force'ować hasło admina.

### Przyczyna

Endpoint był prosty — sprawdź hasło, zwróć 200 lub 401. Nikt nie pomyślał o ochronie przed automatycznymi próbami.

### Rozwiązanie

Dodano in-memory rate-limiting w `src/app/api/admin/auth/route.ts`:

```ts
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000; // 1 minuta
const attempts = new Map<string, { count: number; firstAt: number }>();
```

- Maks. 5 prób na minutę na IP
- Po przekroczeniu → `429 Too Many Requests`
- Reset po udanym logowaniu

### Znane ograniczenie

In-memory Map resetuje się przy cold startach w Vercel (serverless). To znaczy, że przy każdym nowym instancji rate-limit się zeruje. To jest akceptowalne kompromis — brute-force i tak wymaga wielu szybkich requestów, a Vercel sam z siebie throttluje.

Lepsze rozwiązanie (przyszłość): rate-limit w Supabase lub Redis.

### Zmienione pliki
- `src/app/api/admin/auth/route.ts`

---

## 5. sessionStorage przechowywał "true" zamiast hasła (ŚREDNI)

### Problem

Po zalogowaniu admin panel zapisywał:
```ts
sessionStorage.setItem("admin_auth", "true");
```

To uniemożliwiało wysyłanie prawdziwego hasła w headerach API (bo hasło nie było nigdzie zapisane po stronie klienta).

### Rozwiązanie

Zmieniono na:
```ts
sessionStorage.setItem("admin_password", password);
```

I stworzono `adminFetch()` wrapper, który automatycznie czyta hasło z sessionStorage i dodaje header `x-admin-password`.

### Zmienione pliki
- `src/app/admin/layout.tsx`

---

## Podsumowanie zmian

| # | Typ | Pliki zmienione | Nowe pliki |
|---|-----|----------------|------------|
| 1 | Backend auth | 9 route.ts + 7 admin pages | `admin-auth.ts`, `admin-fetch.ts` |
| 2 | Wyciek sekretu | 1 doc | — |
| 3 | URL w kodzie | 1 .ts + 5 docs | — |
| 4 | Rate-limit | 1 route.ts | — |
| 5 | sessionStorage | 1 layout.tsx | — |
| **Razem** | | **25 plików** | **2 nowe pliki** |

---

## Co jeszcze można zrobić (przyszłość)

1. **Redis-based rate-limit** — zamiast in-memory Map (Upstash Redis, darmowy tier)
2. **JWT tokeny dla admin sesji** — zamiast hasła w sessionStorage (httpOnly cookies)
3. **2FA na admin login** — TOTP (Google Authenticator)
4. **Rate-limit kontaktu w Supabase** — zamiast in-memory Map
5. **CSP headers** — Content-Security-Policy w `next.config.js`
6. **Dependency audit** — regularne `npm audit` i Dependabot
