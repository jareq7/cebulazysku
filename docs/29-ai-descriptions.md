# 29. AI Auto-generowanie opisów ofert (Faza 3)

[← Powrót do spisu treści](./README.md)

---

## Problem

Surowe dane z feedu LeadStar XML zawierają opisy HTML w języku korporacyjnym, pełne żargonu i trudne do przeczytania. Użytkownicy potrzebują czytelnych, angażujących opisów — a pisanie ich ręcznie dla 20+ ofert jest nieefektywne.

---

## Rozwiązanie

Automatyczne generowanie treści ofert przez **Google Gemini Flash** (bez użycia Claude API, który nie ma REST endpoint gotowego do serverless).

### Co jest generowane per oferta

| Pole | Opis |
|------|------|
| `short_description` | 2–3 zdania zachęcające, max 220 znaków, wspomina kwotę premii |
| `full_description` | 3–4 akapity w przystępnym języku, z cebulowym akcentem |
| `pros` | 2–5 prawdziwych zalet oferty |
| `cons` | 1–3 uczciwe wady / wymagające warunki |
| `faq` | 3–5 pytań i odpowiedzi, jakie mógłby zadać użytkownik |
| `conditions` | Wyciągnięte warunki jako JSON (type, requiredCount, perMonth, monthsRequired) |

### Ton copywriterski

Prompt instruuje Gemini jako copywritera **CebulaZysku.pl** — przystępny, lekko humorystyczny, nawiązujący do cebuli i „obierania warstw zysku". Unika korporacyjnego żargonu.

---

## Architektura

### Biblioteka `src/lib/generate-offer-content.ts`

- Buduje prompt z danymi oferty (bank, nazwa, premia, opis HTML, warunki HTML)
- Wysyła do Gemini przez `askGemini(prompt, 3000)` — 3000 tokenów na output (było 1024 — za mało, JSON ucinany)
- `extractJson()` — usuwa ewentualne markdown code fences z odpowiedzi
- Walidacja i sanityzacja pól przed zapisem
- Zwraca `GeneratedOfferContent | null`

```typescript
export interface GeneratedOfferContent {
  short_description: string;
  full_description: string;
  pros: string[];
  cons: string[];
  faq: { question: string; answer: string }[];
  conditions: {
    id: string;
    label: string;
    description: string;
    type: "transaction" | "deposit" | "login" | "setup" | "other";
    requiredCount: number;
    perMonth: boolean;
    monthsRequired: number;
  }[];
}
```

### Cron endpoint `GET /api/cron/generate-descriptions`

- Pobiera **3 oferty** z `ai_generated_at IS NULL` posortowane od najstarszych
- Dla każdej: wywołuje `generateOfferContent()`, zapisuje wyniki do DB
- 4s delay między ofertami (ochrona przed rate limitami Gemini)
- Aktualizuje `ai_generated_at` = teraz po udanej generacji
- Auth: `CRON_SECRET` header lub `VERCEL_ENV=production`

```typescript
export const maxDuration = 60;  // 60s limit Vercel
const MAX_PER_RUN = 3;
```

### Admin trigger `POST /api/cron/generate-descriptions`

Ten sam endpoint obsługuje POST z panelu admina — przycisk „Generuj opisy AI (N)" w zakładce Feed / Jakość.

### Cron schedule (`vercel.json`)

```json
{ "path": "/api/cron/generate-descriptions", "schedule": "15,30,45 1 * * *" }
```

3 uruchomienia w nocy (1:15, 1:30, 1:45 UTC) × 3 oferty = **9 ofert na noc**.

---

## Integracja z sync

`/api/sync-offers` przy każdym upsert sprawdza czy tekst opisu lub warunków z feedu zmienił się vs. poprzedni zapisany. Jeśli tak → resetuje `ai_generated_at = null`, co powoduje ponowne wygenerowanie w kolejnej nocy.

```typescript
if (descChanged || benefitsChanged) {
  updateData.ai_generated_at = null;
}
```

Pola z `locked_fields` są omijane przy tym porównaniu.

---

## Migracja bazy danych

**`supabase/migrations/013_ai_descriptions.sql`**

```sql
ALTER TABLE offers
  ADD COLUMN IF NOT EXISTS ai_generated_at timestamptz DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_offers_ai_pending
  ON offers (ai_generated_at, first_seen_at)
  WHERE ai_generated_at IS NULL AND is_active = true;
```

---

## Panel admina — widoczność

W zakładce **Feed / Jakość** (`/admin/feed`):
- Kolumna **AI opisy** — data generacji lub „brak"
- Filtr **„Bez AI (N)"** — pokazuje tylko oferty bez wygenerowanej treści
- Przycisk **„Generuj opisy AI (N)"** — uruchamia generację ręcznie

---

## Napotkane problemy

### JSON ucinany przez Gemini
- **Problem:** `maxOutputTokens: 1024` było za małe — pełny JSON z FAQ i warunkami przekraczał limit. Gemini ucinał odpowiedź w połowie, `extractJson()` nie znajdował zamykającego `}`.
- **Rozwiązanie:** Zmieniono `askGemini()` na `askGemini(prompt, 3000)` — parametr `maxOutputTokens` dodany jako opcjonalny argument.

### Env vars ładowane za późno w skryptach lokalnych
- **Problem:** `const GEMINI_API_KEY = process.env.GEMINI_API_KEY` w `gemini.ts` ewaluowany przy imporcie, przed wywołaniem `dotenv.config()`.
- **Rozwiązanie:** Uruchomienie skryptu z `node --env-file=.env.local $(which npx) tsx scripts/test-generate.ts`.

---

## Pliki

| Plik | Opis |
|------|------|
| `src/lib/generate-offer-content.ts` | Prompt + parsowanie odpowiedzi Gemini |
| `src/lib/gemini.ts` | Wywołanie Gemini API z opcjonalnym `maxOutputTokens` |
| `src/app/api/cron/generate-descriptions/route.ts` | Cron + admin trigger endpoint |
| `supabase/migrations/013_ai_descriptions.sql` | Kolumna `ai_generated_at` + indeks |
| `src/app/api/sync-offers/route.ts` | Reset `ai_generated_at` przy zmianie treści feedu |
| `src/app/admin/feed/page.tsx` | Kolumna AI, filtr „Bez AI", przycisk generacji |
| `scripts/test-generate.ts` | Lokalny skrypt testowy (tsx) |
