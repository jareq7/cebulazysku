# 30. Quality Check Cron — nocne sprawdzanie zgodności premii

[← Powrót do spisu treści](./README.md)

---

## Problem

Dane o premiach z feedu LeadStar mogą być nieaktualne lub błędnie sparsowane. Potrzebny był automatyczny mechanizm weryfikacji kwot bezpośrednio ze stron banków — działający w tle, bez ingerencji człowieka.

---

## Rozwiązanie

Cron job uruchamiany wielokrotnie w nocy, sprawdzający kolejne oferty poprzez scraping ich stron docelowych i porównanie kwoty premii.

---

## Jak działa

### `GET /api/cron/quality-check`

1. Pobiera **5 ofert** aktywnych, posortowanych po `last_checked_at ASC NULLS FIRST` (najdawniej lub nigdy nesprawdzane pierwsze)
2. Pomija oferty sprawdzane w ciągu ostatnich 22h (`RECHECK_HOURS = 22`)
3. Dla każdej oferty:
   - Pobiera stronę docelową (podąża za redirectami z affiliate URL)
   - Stripuje HTML, wysyła do Gemini: „ile wynosi premia?"
   - Porównuje z zapisaną wartością `reward`
   - Jeśli różnica > 50 zł (`MISMATCH_THRESHOLD`) → ustawia `reward_mismatch: true`
4. Aktualizuje `quality_flags`:

```json
{
  "reward_mismatch": true,
  "page_unreachable": false,
  "page_js_only": false,
  "checked_reward": 300,
  "last_checked_at": "2026-03-12T02:30:00Z"
}
```

### Parametry

| Stała | Wartość | Opis |
|-------|---------|------|
| `MAX_PER_RUN` | 5 | Maks. ofert per uruchomienie |
| `RECHECK_HOURS` | 22 | Minimalna przerwa między sprawdzeniami tej samej oferty |
| `MISMATCH_THRESHOLD` | 50 zł | Tolerancja różnicy — mniejsze różnice ignorowane |

### Flagi jakości

| Flaga | Znaczenie |
|-------|-----------|
| `reward_mismatch` | Kwota na stronie banku różni się o >50 zł od zapisanej |
| `page_unreachable` | Strona banku niedostępna / błąd sieciowy |
| `page_js_only` | Strona renderowana przez JS — brak treści po fetch |
| `checked_reward` | Kwota odczytana ze strony banku |
| `last_checked_at` | Czas ostatniego sprawdzenia |

---

## Schedule

```json
{ "path": "/api/cron/quality-check", "schedule": "0,30 2-7 * * *" }
```

**12 uruchomień na noc** (co 30 minut, od 2:00 do 7:00 UTC) × 5 ofert = **60 sprawdzeń na noc**.

Przy 20 aktywnych ofertach każda jest sprawdzana kilka razy. Przy 60 ofertach nadal każda zostanie sprawdzona raz. Skaluje się automatycznie.

---

## Widoczność w panelu admina

Zakładka **Feed / Jakość** (`/admin/feed`):
- Kolumna **Jakość** — ikony: ⚠️ niezgodność, ❌ niedostępna, ✅ OK
- Filtr **„Niezgodności"** — oferty z `reward_mismatch` lub `page_unreachable`
- Tooltip — pokazuje `checked_reward` i datę sprawdzenia

---

## Pliki

| Plik | Opis |
|------|------|
| `src/app/api/cron/quality-check/route.ts` | Endpoint crona |
| `src/lib/scrape-offer.ts` | Scraping strony docelowej |
| `src/lib/gemini.ts` | Ekstrakcja kwoty Gemini |
| `vercel.json` | Schedule cron |
| `supabase/migrations/011_quality_flags.sql` | Kolumny `quality_flags`, `locked_fields` |

---

## Ograniczenia

- **JS-rendered strony** — oferty z bankami używającymi SPA bez SSR pozostają z flagą `page_js_only` i wymagają ręcznej weryfikacji
- **Anti-bot** — niektóre strony mogą blokować headless fetch (403); retry nie jest implementowane
- **Vercel timeout** — 60s max; 5 ofert × ~10s per scraping = mieści się w limicie
