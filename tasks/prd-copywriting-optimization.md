# PRD — Optymalizacja Copywritingu i Formatowania Opisów Ofert

## 1. Cel i kontekst
Obecne opisy ofert w serwisie CebulaZysku.pl są generowane przez AI w formie jednolitych akapitów. Brak wyraźnego formatowania (pogrubienia, listy) sprawia, że są mało czytelne, a kluczowe informacje (kwoty, główne warunki) giną w tekście. Dodatkowo mechanizm pobierania danych z bazy wycina wszelkie tagi formatujące.1

**Cel:** Wprowadzenie nowej, modułowej struktury opisów, wsparcia dla Markdown oraz odświeżenie treści wszystkich ofert, aby były "soczyste", konkretne i łatwe do przeskanowania wzrokiem.

## 2. Grupa docelowa
"Cebularze" — użytkownicy szukający szybkich i konkretnych informacji o tym, jak zarobić na promocji bankowej, bez czytania bankowego żargonu.

## 3. Wymagania Funkcjonalne

### 3.1. Nowa Struktura Opisów (Modułowa)
Każdy opis (`full_description`) musi zawierać następujące sekcje wymuszone w prompcie AI:
1.  **Szybki strzał (TL;DR):** Pogrubiona kwota premii i jedno zdanie o głównej akcji (np. **Odbierz 400 zł** za założenie konta i 5 płatności).
2.  **Dla kogo ta cebulka?** Lista punktowa (kto może skorzystać, wykluczenia dla powracających klientów).
3.  **Kluczowe kroki:** Skondensowana lista etapów (np. Rejestracja -> Aktywacja -> Płatności).
4.  **Cebulowy werdykt:** Krótkie podsumowanie opłacalności/trudności w 2 zdaniach.

### 3.2. Obsługa Formatowania (Markdown)
- System musi wspierać **pogrubienia** (`**tekst**`) oraz listy punktowe (`- element`).
- Tagi te nie mogą być wycinane podczas mapowania ofert z bazy danych.
- UI musi poprawnie renderować te znaczniki.

### 3.3. Optymalizacja Promptu AI
- Prompt w `generate-offer-content.ts` musi zostać zaktualizowany o nową strukturę.
- AI musi otrzymać instrukcję używania Markdown do wyróżniania kwot i list.
- Balans humoru: poziom 7 (humorystycznie, ale z zachowaniem powagi przy kwotach).

## 4. Wymagania Techniczne

### 4.1. Backend / Lib
- `src/lib/offers.ts`: Zmiana funkcji `decodeAndStripHtml` (lub dodanie nowej), aby nie usuwała znaczników Markdown/prostego HTML potrzebnego do formatowania.
- `src/lib/generate-offer-content.ts`: Aktualizacja promptu głównego i weryfikacyjnego.

### 4.2. Frontend
- `src/app/oferta/[slug]/page.tsx`: Implementacja renderowania Markdown. Propozycja: użycie lekkiej biblioteki `react-markdown` lub prostej funkcji parsującej `**` na `<strong>` i `-` na `<li>`.

### 4.3. Migracja Danych
- Przygotowanie mechanizmu (np. skryptu lub tymczasowego endpointu), który wymusi ponowne wygenerowanie opisów dla wszystkich aktywnych ofert w bazie danych (tabela `offers`).

## 5. Kryteria Akceptacji
- [ ] Opis oferty nie jest "ścianą tekstu".
- [ ] Kwoty premii są pogrubione.
- [ ] Kluczowe warunki i wykluczenia są wymienione w listach punktowych.
- [ ] Tekst zachowuje humorystyczny ton serwisu.
- [ ] Wszystkie stare opisy zostały zastąpione nowymi, sformatowanymi.

## 6. Harmonogram (High-level)
1. Przygotowanie techniczne UI i Lib (obsługa Markdown).
2. Aktualizacja i testy nowego promptu AI.
3. Masowa re-generacja opisów w bazie danych.
4. Finalna weryfikacja wizualna na produkcji.
