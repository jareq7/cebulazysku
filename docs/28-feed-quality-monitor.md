# 28. Feed Quality Monitor — walidacja danych i podgląd feedu

[← Powrót do spisu treści](./README.md)

---

## Problem

Feed LeadStar XML nie zawsze dostarcza kompletnych danych:
- Pole `reward` bywało `0` (AI Gemini nie znalazł kwoty w opisie HTML)
- Pola `description` lub `benefits` bywały puste lub zbyt krótkie
- Brak mechanizmu wykrywania i sygnalizowania takich problemów

Wcześniej wymagało to ręcznej weryfikacji w panelu admina — nieakceptowalne przy codziennym sync.

---

## Rozwiązanie

### 1. Nowe kolumny w tabeli `offers`

**Migracja:** `supabase/migrations/011_quality_flags.sql`

```sql
ALTER TABLE offers
  ADD COLUMN locked_fields jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN quality_flags jsonb DEFAULT '{}'::jsonb;
```

**`locked_fields`** — tablica nazw pól chronionych przed nadpisaniem przez sync:
```json
["reward", "bank_name", "offer_name"]
```

**`quality_flags`** — obiekt z flagami jakości aktualizowany przy każdym sync:
```json
{
  "reward_zero": true,
  "description_empty": false,
  "benefits_empty": false,
  "scraped_from_page": true,
  "scrape_failed": false,
  "scrape_reward": 300,
  "last_scraped_at": "2026-03-11T06:00:00Z",
  "scrape_final_url": "https://www.bank.pl/konto"
}
```

---

### 2. Rozszerzenie sync (`/api/sync-offers`)

Po każdym upsert oferty sync:

1. **Sprawdza `locked_fields`** — pola na liście są pomijane podczas aktualizacji z feedu
2. **Wykrywa problemy jakości:**
   - `reward_zero` — premia = 0 lub null po parsowaniu AI
   - `description_empty` — opis z feedu krótszy niż 30 znaków
   - `benefits_empty` — warunki z feedu krótsze niż 30 znaków
3. **Próbuje scrapować stronę docelową** dla ofert z problemami:
   - Podąża za linkiem afiliacyjnym (redirect chain)
   - Pobiera HTML strony banku
   - Gemini wyciąga kwotę premii ze strony banku
   - Max 5 prób scrapingu per sync (ochrona przed Vercel timeout 60s)
   - Scraping odpala się raz na dobę per oferta (nie za każdym sync)
4. **Aktualizuje `quality_flags`** z wynikami walidacji i scrapingu

Response sync zawiera teraz dodatkowe pola:
```json
{
  "quality_issues": 3,
  "scraped_from_pages": 1
}
```

---

### 3. Scraping strony docelowej (`src/lib/scrape-offer.ts`)

```
affiliateUrl → follow redirects → finalUrl (bank's page)
             → fetch HTML
             → strip scripts/styles
             → Gemini: wyciągnij kwotę premii
             → return { reward, finalUrl }
```

**Fallback gdy scraping niemożliwy:**
- Strona JS-only (za mało tekstu po strippingu) → `skipped: "js_only"`
- Błąd sieciowy / timeout → `scrape_failed: true`
- W obu przypadkach oferta pozostaje z problemem i flagą — widoczne w panelu

---

### 4. Admin Feed Viewer (`/admin/feed`)

Nowy widok w panelu admina — spreadsheet podobny do Google Sheets:

**Kolumny:**
| Kolumna | Edytowalna | Blokowana | Uwagi |
|---------|-----------|-----------|-------|
| Bank | ✅ | ✅ | Z feedu — auto |
| Nazwa oferty | ✅ | ✅ | Z feedu — auto |
| Premia (zł) | ✅ | ✅ | AI-parsed lub scraped |
| Krótki opis | ✅ | ✅ | Ręczne / AI |
| Trudność | ✅ | ✅ | Ręczne |
| Aktywna | ✅ | ❌ | Toggle |
| Opis z feedu | ❌ | — | Read-only, surowy HTML z LeadStar |
| Warunki z feedu | ❌ | — | Read-only, surowy HTML z LeadStar |
| Flagi jakości | ❌ | — | Wyniki walidacji |
| Link | ❌ | — | Otwiera stronę banku |

**Mechanizm blokowania:**
- Hover na komórce → pojawia się ikona 🔓
- Kliknięcie → zmienia się w 🔒 i zapisuje pole do `locked_fields`
- Przy następnym sync — pole jest pomijane (wartość z admina wygrywa)

**Filtry:**
- Wszystkie / Problemy (reward=0 lub brak opisu) / Zablokowane / Scrapowane

**Kolory:**
- Czerwone tło — komórka z problemem (reward=0, pusty opis)
- Żółte tło — warunki z feedu puste

---

## Pliki

| Plik | Opis |
|------|------|
| `supabase/migrations/011_quality_flags.sql` | Migracja DB |
| `src/lib/scrape-offer.ts` | Scraping strony docelowej z AI |
| `src/app/api/sync-offers/route.ts` | Rozszerzony sync |
| `src/app/api/admin/feed/route.ts` | API feed viewera (GET/PATCH) |
| `src/app/admin/feed/page.tsx` | UI spreadsheet |
| `src/app/admin/layout.tsx` | Dodano "Feed / Jakość" do nav |

---

## Ograniczenia

- **JS-rendered strony** — banki używające React SPA bez SSR nie dostarczą treści przez `fetch`. Oferty pozostaną z flagą `scrape_failed: "js_only"` — wymagają ręcznej edycji.
- **Anti-bot** — niektóre strony mogą blokować requesty (403). Retry nie jest implementowane dla scrapingu (ryzyko bana).
- **Vercel timeout** — max 5 prób scrapingu per sync (60s limit funkcji serverless).
