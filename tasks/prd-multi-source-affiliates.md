# PRD: Multi-Source Affiliate Integration (Conversand + porównywarka sieci)

## 1. Introduction / Overview

CebulaZysku.pl działa obecnie z jednym źródłem ofert — LeadStar. Oferty LeadStar mają premie dla użytkowników (300-1000 zł) i stanowią core serwisu.

Nowe źródło — **Conversand** — to sieć CPA z ofertami finansowymi (konta, pożyczki, lokaty, karty, crypto, ubezpieczenia), ale **bez informacji o premiach dla użytkowników**. Conversand podaje tylko naszą prowizję afiliacyjną.

Ten feature dodaje:
1. **Nowy typ ofert** — "bez premii" z Conversand, wyraźnie oddzielone od core offers
2. **Multi-source affiliate routing** — gdy oferta jest w obu sieciach, wybieramy lepiej płatną (preferując LeadStar)
3. **Admin panel — zakładka Conversand** — statystyki, saldo, wyświetlanie ofert z Conversand
4. **Auto-sync ofert z Conversand API** — codzienne pobieranie ofert Financial PL

## 2. Goals

1. Zwiększyć liczbę ofert na stronie (SEO: więcej podstron = więcej ruchu organicznego)
2. Monetyzować ruch na oferty bez premii (user i tak szuka konta — my zarabiamy prowizję)
3. Dać użytkownikom pełny obraz rynku (oferty z premią + bez premii)
4. Zachować jasność — user ZAWSZE wie czy oferta ma premię czy nie
5. Optymalizować przychód — per oferta wybieramy najlepiej płatną sieć afiliacyjną

## 3. User Stories

### Użytkownik
- **US1:** Jako użytkownik widzę na stronie głównej i rankingu NAJPIERW oferty z premiami (core), a POTEM sekcję "Konta bez aktywnej promocji" — wiem że te drugie nie dają bonusu, ale mogę przez nie otworzyć konto
- **US2:** Jako użytkownik klikając "Otwórz konto" na ofercie bez premii, jestem przekierowany na stronę banku — a CebulaZysku zarabia prowizję
- **US3:** Jako użytkownik widzę na karcie oferty bez premii: logo banku, nazwę konta, info "Brak aktywnej premii" i przycisk "Otwórz konto"
- **US4:** Jako użytkownik mogę przefiltrować oferty: "Tylko z premią" / "Wszystkie"

### Admin (Jarek)
- **US5:** Jako admin widzę w panelu zakładkę "Conversand" z: saldo do wypłaty, statystyki (kliknięcia, leady, przychód), lista ofert
- **US6:** Jako admin widzę przy każdej ofercie z jakiej sieci idzie ruch (LeadStar / Conversand) i jakie są stawki
- **US7:** Jako admin mogę ręcznie wybrać preferowaną sieć dla konkretnej oferty (override automatycznego wyboru)

## 4. Functional Requirements

### 4.1 Database

1. **FR1:** Dodać pole `source` do tabeli `offers`: `'leadstar' | 'conversand' | 'manual'` (default: `'leadstar'`)
2. **FR2:** Dodać pole `has_user_reward` do tabeli `offers`: boolean (default: `true` dla istniejących)
3. **FR3:** Nowa tabela `affiliate_sources`:
   ```
   id, offer_id (FK offers), network ('leadstar' | 'conversand'),
   affiliate_url, commission_amount, commission_type ('fixed' | 'percentage'),
   commission_currency, is_preferred (boolean), created_at, updated_at
   ```
4. **FR4:** Nowa tabela `conversand_stats` do cache'owania statystyk:
   ```
   id, date, program_name, clicks, leads, commission, created_at
   ```

### 4.2 Conversand API Client

5. **FR5:** Nowy moduł `src/lib/conversand.ts` z funkcjami:
   - `getOffers(country: 'PL', category: 21)` — pobiera oferty Financial PL
   - `getStatistics(groupBy, dateStart, dateStop)` — statystyki
   - `getBalance()` — saldo
   - `getPayouts()` — historia wypłat
6. **FR6:** Credentials jako env vars: `CONVERSAND_API_KEY`, `CONVERSAND_USER_ID`

### 4.3 Sync Conversand Offers

7. **FR7:** Nowy endpoint `/api/sync-conversand` (lub rozszerzenie istniejącego sync):
   - Pobiera wszystkie strony ofert Financial PL z Conversand API
   - Matchuje po nazwie banku z istniejącymi ofertami LeadStar
   - Dla matchujących: dodaje wpis do `affiliate_sources` (Conversand link + stawka)
   - Dla nowych (nie ma w LeadStar): tworzy ofertę z `source='conversand'`, `has_user_reward=false`, `reward=0`
   - Uruchamiany przez cron (raz dziennie, np. 01:30 UTC — po LeadStar sync o 01:00)
8. **FR8:** Matching banków musi być fuzzy (np. "mBank - Konto Osobiste" ↔ "mBank S.A.") — tablica mapowań lub algorytm

### 4.4 Frontend — Wyświetlanie ofert

9. **FR9:** Na stronie głównej (`/`) i rankingu (`/ranking`):
   - GÓRA: Oferty z premią (istniejące, jak teraz) — sortowane wg reward desc
   - DÓŁ: Sekcja "Inne oferty bankowe" / "Konta bez aktywnej promocji" — stonowany styl (szare/jaśniejsze karty), sortowane wg naszej prowizji desc
10. **FR10:** Karta oferty bez premii — uproszczona wersja OfferCard:
    - Logo banku, nazwa oferty
    - Badge "Bez premii" (szary/neutralny zamiast zielonego z kwotą)
    - Przycisk "Otwórz konto" (affiliate link)
    - BEZ: trackera warunków, opisu, FAQ, pros/cons
11. **FR11:** Filtr: dodać opcję "Tylko z premią" / "Wszystkie oferty" do OfferFilters
12. **FR12:** Podstrona oferty bez premii (`/oferta/[slug]`): minimalna strona — logo, nazwa, "To konto nie ma aktualnie aktywnej promocji z premią. Możesz je otworzyć przez nasz link." + przycisk

### 4.5 Affiliate Routing

13. **FR13:** Przy kliknięciu "Otwórz konto" / "Złóż wniosek":
    - Sprawdź `affiliate_sources` dla danej oferty
    - Jeśli jest `is_preferred=true` — użyj tego
    - Jeśli nie — preferuj LeadStar; jeśli brak LeadStar, użyj Conversand
    - Track click w `/api/track-click` z info o wybranej sieci
14. **FR14:** W admin panelu przy ofercie pokaż wszystkie dostępne sieci z ich stawkami

### 4.6 Admin Panel — Conversand

15. **FR15:** Nowa strona `/admin/conversand` z:
    - **Saldo:** aktualne saldo do wypłaty (z `balance.php`)
    - **Statystyki:** tabela z kliknięciami, leadami, przychodem (z `statistics.php`, grupowanie po programie)
    - **Wypłaty:** historia wypłat (z `payouts.php`)
    - **Oferty:** lista ofert z Conversand z ich stawkami, matched status (czy jest w naszej bazie)
16. **FR16:** Filtr dat na statystykach (domyślnie ostatnie 30 dni)

### 4.7 SEO

17. **FR17:** Oferty bez premii mają generowane podstrony z proper SEO (meta title: "{Bank} - Otwórz konto | CebulaZysku", canonical, sitemap)
18. **FR18:** Na stronach ofert bez premii dodaj noindex jeśli są zbyt ubogie w content — lub wygeneruj minimalny opis przez AI

## 5. Non-Goals (Out of Scope)

- **Tracker warunków dla ofert bez premii** — nie ma warunków do trackowania
- **AI-generowane opisy dla ofert Conversand** — na razie minimalna karta, bez opisów
- **Automatyczny wybór sieci wg real-time performance** — na razie statyczna preferencja LeadStar > Conversand
- **Integracja innych sieci CPA** — Conversand jako proof-of-concept, inne sieci w przyszłości
- **Oferty non-Financial z Conversand** (e-commerce, gaming, dating) — poza naszym scope

## 6. Design Considerations

- Karty ofert bez premii: stonowany styl, szary badge zamiast zielonego "Do X zł"
- Sekcja "Inne oferty" wizualnie oddzielona od core ofert (np. separator + nagłówek)
- Admin panel Conversand: wzorowany na istniejącym dashboardzie, ten sam UI framework (shadcn)
- Mobile: karty bez premii powinny być kompaktowe — mniej info = mniejsza karta

## 7. Technical Considerations

- **Conversand API:** REST, JSON response, paginacja (20/stronę), brak auth headerów (klucz w query params)
- **Env vars:** `CONVERSAND_API_KEY=cb6a9be8ffa0eda560809ae54cb3f599`, `CONVERSAND_USER_ID=69b9bc92fbe2b9575d0d5b6c`
- **Rate limiting:** Brak info o limitach w docs — dodaj 500ms delay między requestami
- **Bank name matching:** Kluczowy challenge. Conversand: "BNP Paribas - Konto Otwarte na Ciebie w Promocji", LeadStar/DB: "Bank BNP Paribas S.A.". Potrzebna tablica mapowań lub normalizacja nazw.
- **Cron:** Nowy cron `/api/sync-conversand` o 01:30 UTC (po LeadStar o 01:00)
- **Supabase migration:** Nowa migracja na pola `source`, `has_user_reward`, tabele `affiliate_sources`, `conversand_stats`

## 8. Success Metrics

1. **+15 ofert finansowych** na stronie w ciągu tygodnia od wdrożenia
2. **Pierwsze kliknięcia afiliacyjne** przez Conversand widoczne w statystykach
3. **SEO:** wzrost zaindeksowanych stron w GSC o 30%+ w ciągu miesiąca
4. **User clarity:** 0 reklamacji typu "kliknąłem a nie ma premii" (jasne oznaczenie)

## 9. Open Questions

1. **Conversand — brak affiliate linków w API.** Zwraca tylko nazwę/stawkę, nie link. Linki trzeba generować ręcznie w panelu webowym i wklejać do bazy przez admin panel. Auto-sync stawek TAK, auto-sync linków NIE.
2. Jak obsłużyć oferty które są w Conversand ale nie są stricte "konta bankowe" (np. pożyczki Funeda, crypto Binance) — wyświetlać pod osobnym nagłówkiem?
3. **TradeDoubler — trzecie źródło (pending).** Duża europejska sieć afiliacyjna. OAuth2 API, prawdopodobnie z pełnymi danymi (opisy, tracking linki). Status: weryfikacja strony in progress. Credentials: client_id=`67bae4c2-2b27-3529-bb22-691c8915cda3`, client_secret=`78344e35caa267d5`. Po weryfikacji zbadać API i porównać z LeadStar/Conversand.
4. Architektura `affiliate_sources` MUSI być generyczna od startu — `network` enum: `'leadstar' | 'conversand' | 'tradedoubler' | 'manual'`. Łatwe dodawanie nowych sieci w przyszłości.
