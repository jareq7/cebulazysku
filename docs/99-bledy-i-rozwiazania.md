# Błędy popełnione w projekcie — analiza i rozwiązania

[← Powrót do spisu treści](./README.md)

---

## 1. Warunki ofert generowane przez AI zamiast parsowane z feedu

**Problem:** Conditions (warunki trackera) były generowane przez AI (Gemini) w nocnym cronie. To powodowało:
- Tracker nie działał 1-2 dni po dodaniu nowej oferty
- AI używał swoich typów (`transaction`, `deposit`, `login`) zamiast typów z `ConditionType` (`card_payment`, `income`, `mobile_app_login`)
- Ikony trackera nie wyświetlały się (brak mapowania na `conditionIcons`)
- AI czasem wymyślał warunki lub pomijał ważne

**Rozwiązanie:** Deterministyczny parser tekstu (`parse-leadstar-conditions.ts`) uruchamiany podczas synca. AI generuje tylko opisy/pros/cons/FAQ.

**Jak unikać:** Jeśli dane źródłowe (feed) zawierają informację, parsuj ją bezpośrednio — nie deleguj do AI tego, co można zrobić regexem. AI używaj tylko do tworzenia treści, nie do ekstrakcji strukturalnych danych.

---

## 2. Niezgodność typów ConditionType między AI a frontendem

**Problem:** AI generował `type: "transaction"`, frontend oczekiwał `type: "card_payment"`. Brak walidacji — dane trafiały do bazy z niepoprawnymi typami.

**Rozwiązanie:**
- Rozszerzono `ConditionType` o brakujące typy (`setup`, `savings`, `other`)
- Parser od razu generuje poprawne typy
- Dodano ikony dla nowych typów w `ConditionTracker.tsx` i `OfferCard.tsx`

**Jak unikać:** Zawsze definiuj typy w jednym miejscu (`banks.ts`) i waliduj dane przed zapisem do bazy. Nie pozwalaj AI generować wartości z zamkniętego zbioru bez walidacji.

---

## 3. Hardkodowana lista modeli OpenRouter

**Problem:** Lista modeli w `ai-client.ts` była hardkodowana. Gdy modele znikały lub zmieniały ceny, kod nie reagował — wysyłał requesty do nieistniejących endpointów.

**Rozwiązanie:** Dynamiczne pobieranie modeli z API OpenRouter (`/api/v1/models`), sortowanie po cenie, cache 1h. Fallback na ostatnio zcachowaną listę.

**Jak unikać:** Nie hardkoduj list zewnętrznych zasobów (modeli AI, cen, endpointów). Pobieraj dynamicznie z API źródłowego.

---

## 4. Admin API bez autoryzacji (Faza 0n)

**Problem:** Wszystkie endpointy `/api/admin/*` były publicznie dostępne. Każdy mógł czytać dane użytkowników, edytować oferty, wysyłać push notyfikacje.

**Rozwiązanie:** Stworzono `verifyAdmin()` middleware i `adminFetch()` wrapper. Dodano do każdego handlera.

**Jak unikać:** Przy tworzeniu API endpointów ZAWSZE dodawaj autoryzację od razu. Nie odkładaj na "później". Testuj `curl` bez tokenów po deploy.

---

## 5. Sekrety w kodzie źródłowym i dokumentacji

**Problem:** `SYNC_SECRET` w docs, LeadStar feed URL z tokenami afiliacyjnymi w kodzie.

**Rozwiązanie:** Przeniesienie do env vars, maskowanie w docs.

**Jak unikać:** Nigdy nie commituj sekretów. Używaj env vars od początku. Review docs pod kątem wycieków.

---

## 6. Gemini API quota i rate limiting

**Problem:** Gemini free tier = 20 req/min. Przy testowaniu 18 ofert naraz quota się wyczerpywała. Brak graceful degradation.

**Rozwiązanie:**
- Retry z exponential backoff (4s, 8s, 16s)
- 4s delay między wywołaniami w sync
- Batch processing: max 3 oferty per cron run
- Fallback na OpenRouter gdy Gemini fail

**Jak unikać:** Zawsze projektuj z rate limitami na uwadze. Dodawaj fallback provider. Nie odpytuj AI synchronicznie w pętli bez delay.

---

## 7. Fikcyjne oferty w bazie (ING, Credit Agricole)

**Problem:** W bazie znaleziono 2 oferty z `affiliate_url: "#"` — były to fikcyjne/testowe dane które wyświetlały się użytkownikom.

**Rozwiązanie:** Deaktywacja (`is_active: false`). Dodanie walidacji — oferty z `reward = 0` lub `affiliate_url = "#"` są filtrowane.

**Jak unikać:** Nigdy nie seeduj bazy danymi testowymi na produkcji. Dodawaj walidację na poziomie query (`reward=gt.0`).

---

## 8. HTML entities w opisach z Leadstara

**Problem:** Leadstar zwracał HTML z entities (`&nbsp;`, `&#8217;`, `&ndash;`) które wyświetlały się jako surowy tekst na stronie.

**Rozwiązanie:** Moduł `decodeHtmlEntities()` z mapą named entities + numeric/hex decode. Strippowanie tagów HTML. Zastosowane w `offers.ts` i `generate-offer-content.ts`.

**Jak unikać:** Zawsze dekoduj HTML entities z zewnętrznych źródeł przed wyświetleniem. Nie ufaj że dane z API są "czyste".

---

## 9. Parser warunków — kolejność reguł regex

**Problem w trakcie rozwoju parsera:**
- `płatności telefonem (np. BLIK)` — matchował się jako BLIK zamiast contactless
- `kartą debetową lub BLIKIEM (wykluczone przelew BLIK na telefon)` — matchował `przelew.*blik` zamiast `karta.*BLIK`
- `\bblik\b` nie matchowało "BLIKIEM" (word boundary)

**Rozwiązanie:** Precyzyjna kolejność reguł:
1. karta+BLIK → card_payment (najpierw combo)
2. karta → card_payment (przed contactless!)
3. contactless (telefon/portfel) → contactless_payment (przed samym BLIK!)
4. przelew BLIK → blik_payment
5. BLIK samodzielny → blik_payment

Plus: `\bblik\b` → `\bblik` (żeby matchowało odmianę "BLIKIEM").

**Jak unikać:** Przy pisaniu reguł regex w klasyfikatorze:
- Bardziej specyficzne reguły PRZED ogólnymi
- Testuj na prawdziwych danych (nie na wymyślonych przykładach)
- Sprawdzaj word boundary z odmianami (polszczyzna!)
- Uważaj na tekst w nawiasach (wykluczenia, przykłady) który może fałszywie matchować

---

## 10. Brak dziedziczenia kontekstu miesięcznego w parserze

**Problem:** "c. do 300 zł za spełnienie warunków (w każdym z trzech kolejnych miesięcy):" → sub-punkty "zapewnić wpływ..." i "wykonać 5 transakcji..." nie dziedziczyły `perMonth: true` i `monthsRequired: 3`.

**Rozwiązanie:** Dwupoziomowe dziedziczenie:
1. `annotateBlocks()` — top-level numbered blocks propagują context do sub-items
2. `effectiveMonths` — block's own monthly context (np. z nazwanego sub-itemu "c.") nadpisuje parent context

**Jak unikać:** Przy parsowaniu hierarchicznych danych (listy w listach) zawsze projektuj propagację kontekstu z poziomu nadrzędnego.

---

---

## 11. Błędy w parsowaniu kwot z spacjami i zerami

**Problem:** Parser kwot w warunkach gubił cyfry przy spacjach (np. "1 500" stawało się "500") lub błędnie usuwał zera uznając je za grosze (np. "500" stawało się "5").

**Rozwiązanie:** 
- Poprawa regexa na `(\d[\d\s,.]*)`, aby przechwytywał całą grupę cyfr ze znakami rozdzielającymi.
- Inteligentne usuwanie groszy: tylko jeśli występują po separatorze `,` lub `.` (np. `500,00` -> `500`, ale `500` zostaje jako `500`).

**Jak unikać:** Przy wyciąganiu liczb z tekstu pisanego przez ludzi (lub banki), zawsze zakładaj obecność spacji "tysięcznych" i różnych separatorów groszy. Testuj na kwotach kończących się na zero.

---

## 12. Problemy z ESM i TypeScript w Node.js (v25)

**Problem:** Próba uruchomienia testów `node --experimental-strip-types test-parser.ts` kończyła się błędem `ERR_MODULE_NOT_FOUND`, mimo że plik istniał.

**Przyczyna:** W trybie ESM (ES Modules) Node.js wymaga **pełnych rozszerzeń plików** w instrukcjach `import`. Nawet jeśli importujemy plik `.ts`, w kodzie musi znaleźć się rozszerzenie, aby loader wiedział, co załadować.

**Rozwiązanie:** Zmiana importu z `import { ... } from './path'` na `import { ... } from './path.ts'`.

**Jak unikać:** Pracując z natywnym wsparciem dla TypeScript w nowym Node.js (bez transpilacji przez build step), zawsze podawaj pełne ścieżki z rozszerzeniami.

---

## 13. Problemy z narzędziem write_file i spacjami w ścieżkach

**Problem:** Narzędzie `write_file` zgłaszało sukces, ale pliki nie pojawiały się na dysku lub basha gubiła składnia przy próbie zapisu przez `cat <<EOF`.

**Przyczyna:** Spacja w nazwie katalogu głównego (`afiliacje bankowe/`) oraz specyfika buforowania narzędzi AI CLI mogą powodować błędy przy głębokich ścieżkach lub znakach ucieczki wewnątrz plików.

**Rozwiązanie:** Użycie **Pythona** jako "niezawodnego writera": `python3 -c "with open('path', 'w') as f: f.write(content)"`. Python lepiej radzi sobie ze znakami specjalnymi i ścieżkami w shellu niż proste przekierowania basha.

**Jak unikać:** Jeśli standardowe metody zapisu pliku zawodzą w środowisku AI, użyj skryptu w języku wyższego poziomu (Python/Node) do fizycznego zapisu treści na dysk.

---

## 14. Wyświetlanie "Jednorazowo" zamiast "5x jednorazowo"

**Problem:** Warunek z `requiredCount: 5` i `perMonth: false` pokazywał użytkownikowi "Jednorazowo" — sugerując 1 raz, mimo że wymagane było 5 powtórzeń.

**Rozwiązanie:** Zmiana logiki wyświetlania w `oferta/[slug]/page.tsx`: gdy `requiredCount > 1` i `perMonth: false`, wyświetlaj `"5x jednorazowo"` zamiast `"Jednorazowo"`.

**Jak unikać:** Zawsze testuj warianty danych na froncie. "Jednorazowo" brzmi jak "raz" — testy z `requiredCount > 1` powinny być w standardowym zestawie.

---

## 15. Luźne pliki .ts w rootcie projektu psują build

**Problem:** Plik `test-parser.ts` leżący w rootcie projektu powodował build error Next.js (`allowImportingTsExtensions`). `tsconfig.json` includował `**/*.ts` a excludował tylko `node_modules`.

**Rozwiązanie:** Usunięcie pliku z roota, przeniesienie do `scripts/`, dodanie `"scripts"` do `exclude` w `tsconfig.json`.

**Jak unikać:** Nie trzymaj luźnych plików .ts poza `src/`. Skrypty testowe/pomocnicze → `scripts/` (excluded z buildu). Sprawdzaj `tsconfig.json` exclude przy dziwnych build errors.

---

## 16. Frontend kodowany pod nieistniejące API

**Problem:** Bulk action "Regeneruj AI" w `/admin/oferty` wywoływał `/api/admin/enrich` z parametrem `offerIds` — ale ten endpoint nie przyjmuje takiego parametru (obsługuje tylko automatyczne wyszukiwanie ofert z `reward=0`).

**Rozwiązanie:** Zmiana strategii — zamiast wywoływać enrich, resetujemy `ai_generated_at` na null przez PATCH `/api/admin/offers`. Cron sam wygeneruje opisy przy następnym uruchomieniu. Trzeba było też dodać `ai_generated_at` do `allowedFields` w offers API.

**Jak unikać:** **Zawsze przeczytaj `route.ts` endpointu przed napisaniem frontendu który go wywołuje.** Sprawdź jakie parametry przyjmuje, co zwraca, jakie pola pozwala edytować.

---

## 17. Brak dokumentacji po implementacji feature'a

**Problem:** Po zaimplementowaniu 6 nowych funkcji admin panelu (edytor warunków, AI logs, konwersje, bulk actions, tracker preview, markdown preview) nie zaktualizowano `docs/README.md` ani nie stworzono plików dokumentacji.

**Rozwiązanie:** Dodanie `docs/38-admin-panel-v2.md` i `docs/39-ai-verification.md`, aktualizacja spisu treści i tabeli PRD tracking.

**Jak unikać:** Dokumentacja jest częścią feature'a, nie opcjonalnym dodatkiem. Checklist przed zamknięciem: 1) kod, 2) build test, 3) docs, 4) commit.

---

## 18. Supabase migracje — stare migracje failują na istniejących obiektach

**Problem:** `supabase db push` próbował wykonać wszystkie migracje od 001. Stare migracje (001-018) failowały bo obiekty (tabele, RLS policies) już istniały w bazie.

**Rozwiązanie:** Tymczasowe przeniesienie starych migracji do /tmp, push tylko nowych (019, 020), przywrócenie starych plików.

**Jak unikać:** Supabase CLI nie ma wbudowanego "push only new". Alternatywy: `supabase db push --dry-run` przed pushem, lub ręczne SQL w Supabase Dashboard dla pojedynczych migracji.

---

## 19. Kodowanie bez PRD i task listy

**Problem:** W pierwszych iteracjach projektu feature'y były kodowane ad hoc — od razu po briefie, bez dokumentacji wymagań. Skutki:
- Brak struktury → trudno śledzić co jest zrobione, a co nie
- Zakres feature'a rozrastał się w trakcie implementacji
- Dokumentacja dopisywana po fakcie (lub wcale)
- Ciężko wrócić do feature'a po przerwie

**Rozwiązanie:** Obowiązkowy flow PRD → Tasks → Code:
1. Brief od usera
2. 3-5 pytań wyjaśniających z opcjami A/B/C/D
3. PRD w `/tasks/prd-[feature].md`
4. Parent tasks → potwierdzenie "Go"
5. Sub-tasks w `/tasks/tasks-[feature].md`
6. Task 0.0 = feature branch
7. Implementacja z odznaczaniem `- [ ]` → `- [x]`
8. Nie koduj nic co nie jest w task liście

Szablony: `create-prd.md` i `generate-tasks.md` w rootcie projektu.

**Jak unikać:** Traktuj PRD jak warunek konieczny przed otwarciem edytora. Bez PRD nie ma kodu.

---

## Ogólne wnioski (Aktualizacja Marzec 2026)

| Zasada | Dlaczego |
|--------|----------|
| **Grosze usuwaj tylko po separatorze** | Zapobiega ucinaniu pełnych kwot (np. 500 -> 5) |
| **Importy ESM wymagają rozszerzeń** | `node --test` i `strip-types` nie domyślają się rozszerzeń `.ts` |
| **Python to stabilny File Writer** | Eliminuje problemy z `EOF` i znakami specjalnymi w shellu |
| **Testy jednostkowe to podstawa** | Pozwoliły wykryć 4 krytyczne błędy w parserze, które "żyły" na produkcji |
| **Czytaj API przed kodowaniem frontendu** | Unikasz pisania kodu pod endpoint który nie obsługuje twoich parametrów |
| **Dokumentacja = część feature'a** | Bez docs nikt nie wie co zostało zbudowane — ani AI, ani devs |
| **Luźne pliki .ts poza src/ psują build** | tsconfig includuje `**/*.ts` — skrypty trzymaj w `scripts/` (excluded) |
| **Testuj warianty danych na UI** | "Jednorazowo" z requiredCount=5 to UX bug widoczny dopiero z prawdziwymi danymi |
| **PRD przed kodem, zawsze** | Bez PRD zakres rośnie, progress nieśledzony, dokumentacja powstaje po fakcie |

