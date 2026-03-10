# Błędy w ofertach — analiza i poprawki (2026-03-10)

## Kontekst

Podczas weryfikacji ofert w Supabase z feedem XML LeadStar wykryto poważne rozbieżności w kwotach premii oraz obecność fikcyjnych ofert.

---

## 1. Fikcyjne oferty (seed data)

### Problem

W bazie Supabase znalazły się 2 oferty, które **nie istnieją w feedzie LeadStar** i **nie mają linków afiliacyjnych** (`affiliate_url: "#"`):

| ID | Bank | Kwota | Źródło |
|---|---|---|---|
| `ing-konto-promo` | ING Bank Śląski | 200 zł | manual |
| `credit-agricole-promo` | Credit Agricole | 150 zł | manual |

### Przyczyna

Kiedy Cascade budował aplikację, stworzył plik `src/data/banks.ts` z **8 wymyślonymi ofertami** jako dane przykładowe (seed data). Oferty te miały:
- Wymyślone kwoty premii (nie z feedu)
- Wymyślone warunki (np. "5 transakcji kartą")
- Placeholder zamiast linku afiliacyjnego (`#`)
- Lokalne ścieżki logo zamiast URL-i z feedu (`/banks/ing.svg`)

Przy późniejszym sync z feedem LeadStar, 6 z 8 statycznych ofert zostało zastąpionych przez prawdziwe dane z feedu (bo te banki istnieją w feedzie). Natomiast **ING i Credit Agricole nie istnieją w feedzie**, więc ich fikcyjne wpisy pozostały w Supabase.

### Rozwiązanie

- Obie oferty zostały **dezaktywowane** (`is_active: false`) w Supabase.
- Pozostają w `banks.ts` jako fallback dla środowiska deweloperskiego, ale nie są widoczne dla użytkowników na produkcji.

### Na przyszłość

> **NIGDY nie twórz fikcyjnych ofert z wymyślonymi kwotami.**
> Jeśli potrzebujesz seed data, oznacz je wyraźnie jako `source: "demo"` i ustaw `is_active: false`.

---

## 2. Błędne kwoty premii

### Problem

11 z 18 ofert w Supabase miało **nieprawidłowe kwoty premii** — albo 0 zł (brak danych), albo kwotę niezgodną z feedem.

| LeadStar ID | Bank | Była kwota | Prawidłowa kwota | Źródło kwoty |
|---|---|---|---|---|
| 6198 | BNP Paribas | 300 zł | **1000 zł** | opis HTML feedu: "do 1000 zł" (200+100+700) |
| 5980 | Santander | 0 zł | **800 zł** | "do 800 zł premii za aktywność" |
| 5981 | Santander (młodzi) | 0 zł | **800 zł** | j.w. |
| 5982 | Santander (student) | 0 zł | **800 zł** | j.w. |
| 4560 | Alior Konto Plus | 0 zł | **1000 zł** | "bonus do 1000 zł" (200+100+700) |
| 5983 | Alior Konto | 0 zł | **1000 zł** | "do 1000 zł z kodem BONUS1000" |
| 6048 | Millennium | 700 zł | **900 zł** | "do 900 zł" (200+500+200) |
| 5986 | mBank (13-17) | 210 zł | **300 zł** | "nawet 300 zł" |
| 6117 | mBank Intensive | 0 zł | **720 zł** | "nawet 720 zł premii" |
| 3431 | PKO BP | 0 zł | **100 zł** | "100 zł zwrotu za Allegro" |
| 5545 | VeloBank | 0 zł | **100 zł** | "100 zł" w opisie |
| 5907 | VeloBank (młodzi) | 0 zł | **100 zł** | "100 zł" w opisie |

### Przyczyna

Feed XML LeadStar **nie ma dedykowanego pola `reward`** (kwota premii). Kwota premii jest zakodowana wyłącznie w:
- `program_name` — np. "eKonto z zyskiem do 720 zł" (ale nie zawsze)
- `description` — HTML z opisem promocji (kwota ukryta w tekście)
- `benefits` — HTML z korzyściami

Skrypt importujący oferty z LeadStar (`/api/cron/sync-leadstar`) parsował kwotę z `program_name` za pomocą regex. Jeśli nazwa nie zawierała kwoty (np. "Konto Santander", "Alior Konto Plus"), reward ustawiano na **0 zł**.

Dodatkowo, kwoty w opisach HTML to nie zawsze sama premia — mogą zawierać:
- Oprocentowanie konta oszczędnościowego ("6,5% do 200 000 zł")
- Limity wpływów ("wpływ min. 3000 zł")
- Kwoty transakcji ("transakcje kartą min. 300 zł")

Dlatego **automatyczne parsowanie kwoty z opisu jest zawodne**.

### Rozwiązanie

Wszystkie kwoty zostały ręcznie zweryfikowane z opisami HTML w feedzie i poprawione w Supabase.

### Na przyszłość

> **Kwoty premii MUSZĄ być weryfikowane ręcznie** przy każdym imporcie/sync.
> Automatyczny sync powinien flagować oferty z `reward: 0` do ręcznej weryfikacji.

---

## 3. Nazwy ofert niezgodne z kwotami

### Problem

Po poprawieniu kwot, 2 oferty miały nazwy z nieaktualnymi kwotami:

| ID | Stara nazwa | Nowa nazwa |
|---|---|---|
| ls-5986-mbank | "...z promocją do 210 zł" | "...z promocją do 300 zł" |
| ls-6048-millennium | "Nawet 700 zł z Kontem..." | "Nawet 900 zł z Kontem..." |

### Rozwiązanie

Nazwy poprawione w Supabase.

---

## Instrukcje na przyszłość: Jak poprawnie zarządzać ofertami

### A. Import z feedu LeadStar

1. **Pobierz feed**: `curl -s "${LEADSTAR_FEED_URL}..." -o /tmp/feed.xml`
2. **Policz oferty**: `grep -c '<item>' /tmp/feed.xml` — upewnij się, że masz pełny feed
3. **Wylistuj oferty**: Wyciągnij `id`, `institution`, `program_name` z każdego `<item>`
4. **Dla każdej oferty**:
   - Parsuj kwotę z `program_name` (jeśli jest)
   - **Jeśli brak kwoty w nazwie** → przeczytaj `description` i `benefits` HTML
   - Szukaj fraz: "premia", "bonus", "zyskaj", "otrzymaj" + kwota
   - **Odróżnij premię od**: limitów wpływów, kwot transakcji, oprocentowania, sald
   - Jeśli niepewny → ustaw `reward: 0` i oznacz do ręcznej weryfikacji
5. **Porównaj z obecnymi danymi w Supabase** przed upsert
6. **Loguj każdą zmianę** — co się zmieniło, dlaczego

### B. Weryfikacja po imporcie

Po każdym sync uruchom porównanie:

```bash
# Pobierz feed
curl -s "https://leadstar.pl/xml?..." -o /tmp/feed.xml

# Wyciągnij kwoty z feedu (z nazw + opisów)
python3 extract_rewards.py /tmp/feed.xml > /tmp/feed_rewards.csv

# Porównaj z Supabase
curl -s ".../rest/v1/offers?select=leadstar_id,reward&leadstar_id=not.is.null" | python3 compare.py /tmp/feed_rewards.csv
```

### C. Czerwone flagi (sprawdzaj zawsze)

- ⚠️ `reward: 0` — prawie na pewno brak danych, nie "darmowa oferta"
- ⚠️ `affiliate_url: "#"` — fikcyjna oferta, nie ma linku afiliacyjnego
- ⚠️ `source: "manual"` bez `leadstar_id` — może być seed data
- ⚠️ Kwota w nazwie ≠ kwota w `reward` — niespójność

### D. Statyczne dane (`banks.ts`)

- `banks.ts` to **fallback** gdy Supabase jest niedostępny
- Kwoty i warunki w `banks.ts` **nie są automatycznie synchronizowane** z feedem
- Nie dodawać do `banks.ts` ofert, które nie istnieją w feedzie
- Rozważyć w przyszłości usunięcie `banks.ts` na rzecz 100% danych z Supabase

---

## Stan po poprawkach (2026-03-10)

Wszystkie 18 ofert z feedu LeadStar mają prawidłowe kwoty premii w Supabase.
2 fikcyjne oferty (ING, Credit Agricole) zostały dezaktywowane.

| ID | Bank | Premia | Status |
|---|---|---|---|
| 2637 | Bank Pekao | 450 zł | ✅ |
| 3431 | PKO BP | 100 zł | ✅ |
| 3444 | Bank Pekao (Młodzi) | 450 zł | ✅ |
| 4560 | Alior Konto Plus | 1000 zł | ✅ |
| 5545 | VeloBank | 100 zł | ✅ |
| 5550 | mBank (młodzi 18-24) | 620 zł | ✅ |
| 5563 | mBank (młodzi wybór) | 0 zł | ✅ (brak premii w feedzie) |
| 5564 | mBank eKonto | 720 zł | ✅ |
| 5907 | VeloBank (młodzi) | 100 zł | ✅ |
| 5951 | Citi Handlowy | 650 zł | ✅ |
| 5980 | Santander | 800 zł | ✅ |
| 5981 | Santander (młodzi) | 800 zł | ✅ |
| 5982 | Santander (student) | 800 zł | ✅ |
| 5983 | Alior Konto | 1000 zł | ✅ |
| 5986 | mBank (młodzi 13-17) | 300 zł | ✅ |
| 6048 | Millennium | 900 zł | ✅ |
| 6117 | mBank Intensive | 720 zł | ✅ |
| 6198 | BNP Paribas | 1000 zł | ✅ |
