# Research: TradeDoubler Panel Overview & Link Generation
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-18

Z uwagi na to, że panel wydawcy TradeDoubler jest aplikacją typu SPA (Single Page Application), automatyczne pobieranie danych przez boty jest utrudnione. Poniżej znajduje się zestawienie informacji zebranych na temat struktury panelu oraz metod generowania linków i dostępu do danych.

## 1. Generowanie Linków Trackingowych

W panelu TradeDoubler istnieją trzy główne sposoby tworzenia linków:

### 1.1 Deeplink Generator (Zalecane dla ofert bankowych)
Pozwala na kierowanie ruchu na konkretne podstrony promocji (np. formularz wniosku).
- **Ścieżka:** `Narzędzia (Tools) > Deeplink Generator`.
- **Proces:** Wybierasz swoją stronę (Site), wybierasz program (np. mBank), a następnie wklejasz docelowy URL ze strony banku.
- **Parametry dodatkowe:** Możesz dodać parametry `EPI` lub `EPI2` (Click References) do śledzenia sub-źródeł (np. `epi=tiktok_ad`).

### 1.2 Zarządzanie Reklamami (Ad Management)
Pobieranie gotowych linków tekstowych lub bannerów przygotowanych przez bank.
- **Ścieżka:** `Reklamy (Ads) > Szukaj`.
- **Proces:** Wyszukujesz program, klikasz ikonę "Reklamy" i wybierasz format "Link tekstowy".

### 1.3 Link Converter (Automatyczny)
Skrypt JavaScript, który automatycznie zamienia zwykłe linki do reklamodawców na Twojej stronie w linki afiliacyjne.
- **Ścieżka:** `Narzędzia (Tools) > Link Converter`.

## 2. Dostęp do danych (API)

TradeDoubler oferuje nowoczesne **REST API (v2022)** oparte na OAuth 2.0.

### 2.1 Autentykacja
Wymaga utworzenia klienta API w panelu:
- **Ścieżka:** `Narzędzia (Tools) > API Info`.
- Stamtąd pobierasz `Client ID` oraz `Client Secret`.

### 2.2 Kluczowe Endpointy
- **Programy:** Lista dostępnych programów, stawki CPS/CPL i statusy aplikacji.
- **Raporty:** Szczegółowe statystyki transakcji i kliknięć.
- **Produkty:** Dostęp do feedów produktowych (XML/JSON).

### 2.3 Legacy Reporting API (Klucz API)
Jeśli potrzebujesz prostego pobierania raportów do skryptów (np. CSV/XML):
- Przejdź do `Statystyki > Przegląd Programów`.
- Na dole raportu znajdziesz **API URL**. Parametr `&key=` w tym URL to Twój stały token do raportów.

## 3. Parametry śledzenia (Sub-tracking)
W linkach TradeDoubler należy używać:
- `&epi=WARTOŚĆ` — podstawowy identyfikator (np. ID usera w CebulaZysku).
- `&epi2=WARTOŚĆ` — opcjonalny drugi identyfikator.

---
**Wnioski dla Jarka:** 
Aby w pełni zautomatyzować pobieranie ofert z TradeDoubler, musimy skonfigurować OAuth w `API Info`. Do prostego śledzenia kliknięć wystarczy manualnie wygenerować Deeplinki z parametrem `epi`.
