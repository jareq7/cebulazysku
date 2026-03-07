# 13. Migracja ofert do Supabase

[← Powrót do spisu treści](./README.md)

---

## 1. Wprowadzenie

### Problem
Oferty bankowe były przechowywane w dwóch miejscach:
- **`src/data/banks.ts`** — 8 ręcznie opisanych ofert z pełnymi szczegółami (warunki, FAQ, zalety/wady)
- **Supabase `offers` table** — 18 ofert zaimportowanych z LeadStar XML (minimalne dane: nazwa, opis HTML)

Frontend korzystał wyłącznie z `banks.ts`, co uniemożliwiało dynamiczne zarządzanie ofertami.

### Cel
Przenieść wszystkie oferty do jednej bazy danych (Supabase), zachować szczegółowe informacje z `banks.ts`, i przestawić frontend na pobieranie danych z bazy.

---

## 2. Co zostało zrobione

### Faza 1: Wzbogacenie ofert LeadStar w Supabase
- Wyodrębniono `logo`, `program_name` i `url` z pliku XML (`/tmp/leadstar.xml`) za pomocą `awk`
- Dla każdej z 18 ofert LeadStar wykonano `curl -X PATCH` aktualizujący pola:
  - `bank_logo` (URL logo banku)
  - `offer_name` (nazwa programu)
  - `affiliate_url` (link afiliacyjny)
  - `reward` (kwota premii)

### Faza 2: Migracja ofert z `banks.ts` do Supabase
- Dla każdej z 8 ofert ręcznych przygotowano plik JSON (`/tmp/offer_*.json`)
- Wykonano `curl -X POST` z `Prefer: resolution=merge-duplicates` (upsert) do Supabase
- Przeniesione pola: `conditions`, `faq`, `pros`, `cons`, `difficulty`, `monthly_fee`, `free_if`, `bank_color`

### Faza 3: Deduplikacja — merge manual + LeadStar
6 z 8 ofert ręcznych miało odpowiednik w LeadStar. Strategia:
1. Przygotowano pliki JSON (`/tmp/patch_*.json`) ze szczegółami z ofert ręcznych
2. `PATCH` na odpowiadające oferty LeadStar — wzbogacono o `conditions`, `faq`, `pros`, `cons`
3. Ustawiono `source = "hybrid"` na wzbogaconych ofertach
4. `DELETE` na 6 zduplikowanych ofert ręcznych
5. 2 oferty bez odpowiednika LeadStar (ING, Credit Agricole) pozostały z `source = "manual"`

**Wynik końcowy: 20 ofert w bazie** (16 LeadStar/hybrid + 2 manual + 2 hybrid)

### Faza 4: Przestawienie frontendu na Supabase

#### `src/lib/offers.ts` — nowy moduł do pobierania danych
- `supabaseGet(path)` — bezpośredni fetch REST API (kompatybilny z Server Components)
- `mapDbOffer(row)` — mapowanie kolumn snake_case z DB na camelCase interfejsu `BankOffer`
- `fetchOffersFromDB()` — pobiera aktywne oferty posortowane po reward DESC
- `fetchOfferBySlug(slug)` — pobiera ofertę po slug
- `getTotalPotentialEarnings()` — suma nagród
- `getFeaturedOffers()` — filtruje oferty z `featured = true`
- **Fallback**: jeśli Supabase niedostępny → zwraca dane ze statycznego `banks.ts`

#### `src/hooks/useOffers.ts` — hook kliencki
- Komponent `useOffers()` do użycia w Client Components (`"use client"`)
- Fetch z Supabase REST API przez `useEffect`
- Fallback na `staticOffers` jeśli brak danych

#### Zmienione strony:
| Plik | Zmiana |
|------|--------|
| `src/app/page.tsx` | `async function`, fetch z `fetchOffersFromDB()` i `getTotalPotentialEarnings()` |
| `src/app/sitemap.ts` | `async function`, fetch z `fetchOffersFromDB()` |
| `src/app/oferta/[slug]/page.tsx` | `generateStaticParams`, `generateMetadata` i komponent na async fetch |
| `src/app/dashboard/page.tsx` | Import `useOffers` hook zamiast statycznego `bankOffers` |

---

## 3. Decyzje techniczne

| Decyzja | Uzasadnienie |
|---------|-------------|
| Direct REST API fetch zamiast Supabase JS client | Server Components nie mogą używać browser-only `@supabase/supabase-js`. Direct `fetch` działa wszędzie. |
| Fallback na `banks.ts` | Jeśli Supabase jest niedostępny (np. podczas build), strona nadal działa z danymi statycznymi. |
| `source` field (leadstar/manual/hybrid) | Pozwala śledzić pochodzenie danych i chronić ręcznie wzbogacone oferty przed nadpisaniem przez sync XML. |
| `revalidate: 300` na fetch | Cache 5 min — kompromis między świeżością danych a wydajnością. |
| Osobny hook `useOffers` dla Client Components | Dashboard jest `"use client"` — nie może używać `await` na top level. Hook z `useState`/`useEffect` to standardowe rozwiązanie. |

---

## 4. Pliki źródłowe

| Plik | Opis |
|------|------|
| `supabase/migrations/002_offers_table.sql` | Definicja tabeli `offers` (kolumny, indeksy, RLS) |
| `src/lib/offers.ts` | Moduł serwerowy do pobierania ofert z Supabase |
| `src/hooks/useOffers.ts` | Hook kliencki do pobierania ofert |
| `src/data/banks.ts` | Statyczny fallback (8 ofert z pełnymi szczegółami) |
| `src/app/api/sync-offers/route.ts` | API route do synchronizacji z LeadStar XML |

---

## 5. Troubleshooting

### Problem: `supabaseGet` nie działał w Server Components
- **Przyczyna**: Początkowa implementacja używała `@supabase/supabase-js` (browser-only)
- **Rozwiązanie**: Zamieniono na direct `fetch` z Supabase REST API (`/rest/v1/...`) z nagłówkami `apikey` i `Authorization`

### Problem: `node -e` timeout przy wieloliniowych skryptach
- **Przyczyna**: Node.js v25.6.1 ma problemy z `eval` dla złożonych skryptów
- **Rozwiązanie**: Zapisywanie danych do plików JSON (`/tmp/*.json`) i wykonywanie `curl -d @plik` zamiast skryptów

### Problem: Duplikaty po wgraniu ofert ręcznych
- **Przyczyna**: 6 z 8 ofert z `banks.ts` dotyczyło tych samych banków co oferty LeadStar
- **Rozwiązanie**: Merge szczegółów (PATCH) na oferty LeadStar + DELETE duplikatów ręcznych, pole `source = "hybrid"` do śledzenia

### Problem: Build failure po zmianie `page.tsx` na async
- **Przyczyna**: `params` w Next.js 16 wymaga `await` (`const { slug } = await params`)
- **Rozwiązanie**: Dodanie `await` na destrukturyzację `params` w `generateMetadata` i komponencie strony

---

## 6. Status

✅ **Ukończone** — 7 marca 2026

- 20 ofert w Supabase (aktywne, z pełnymi danymi)
- Frontend pobiera dane z bazy z fallbackiem na static
- Build przechodzi bez błędów
- Commit: `feat: frontend reads offers from Supabase`
