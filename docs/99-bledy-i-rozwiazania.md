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

## Ogólne wnioski

| Zasada | Dlaczego |
|--------|----------|
| **Dane z feedu parsuj od razu** | Nie odkładaj na AI/cron — użytkownik potrzebuje danych natychmiast |
| **Typy definiuj w jednym miejscu** | `ConditionType` w `banks.ts` — waliduj na wejściu |
| **Autoryzacja od dnia 0** | Każdy API endpoint potrzebuje auth od początku |
| **Sekrety w env vars** | Nigdy w kodzie, nigdy w docs |
| **Rate limity z fallbackiem** | Zawsze delay + retry + alternatywny provider |
| **Testuj na prawdziwych danych** | Syntetyczne testy nie łapią edge case'ów (polskie odmiany, HTML entities) |
| **Regex: specyficzne przed ogólnymi** | Kolejność reguł jest krytyczna w klasyfikatorach |
