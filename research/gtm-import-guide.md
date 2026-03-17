# Instrukcja Importu Kontenera GTM (Google Tag Manager)
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17 — Instrukcja importu i konfiguracji GTM

Ten dokument opisuje krok po kroku, jak zaimportować i skonfigurować gotowy kontener GTM dla platformy CebulaZysku.pl, wspierający 7 platform reklamowych, Consent Mode v2 oraz tracking kliknięć afiliacyjnych.

## 1. Import Kontenera

1. Zaloguj się na swoje konto w [Google Tag Manager](https://tagmanager.google.com/).
2. Przejdź do zakładki **Administracja (Admin)** w górnym menu.
3. W kolumnie "Kontener", kliknij **Importuj kontener (Import Container)**.
4. Kliknij "Wybierz plik kontenera" i wskaż plik: `config/gtm-container-cebulazysku.json`.
5. Wybierz istniejący obszar roboczy (np. "Default Workspace") lub utwórz nowy (np. "Import CebulaZysku").
6. Wybierz opcję importu:
   - **Zastąp (Overwrite)**: UWAGA! Skasuje wszystkie obecne tagi, reguły i zmienne. Używaj tylko na czystym kontenerze.
   - **Scal (Merge)**: Sugerowane dla istniejących kontenerów. Wybierz podopcję **Zmień nazwy w przypadku konfliktów**.
7. Kliknij **Potwierdź**.

## 2. Uzupełnienie Placeholderów (Zmienne)

Po imporcie, przejdź do zakładki **Zmienne (Variables)**. Znajdziesz tam folder `1. Zmienne - Konfiguracja`. Musisz podmienić domyślne wartości w zmiennych stałych na Twoje rzeczywiste identyfikatory pikseli.

| Nazwa Zmiennej w GTM | Wymagane | Skąd wziąć ID? |
| --- | :---: | --- |
| `C - GA4_MEASUREMENT_ID` | **TAK** | Panel GA4 -> Administracja -> Strumienie danych -> Identyfikator pomiaru (zaczyna się od `G-XXXXXXXXXX`). |
| `C - META_PIXEL_ID` | **TAK** | Meta Events Manager -> Ustawienia -> Identyfikator piksela (ciąg cyfr). |
| `C - TIKTOK_PIXEL_ID` | NIE | TikTok Ads Manager -> Assets -> Events -> Web Events -> Pixel ID. |
| `C - GADS_CONVERSION_ID` | NIE | Google Ads -> Cele -> Konwersje -> Wybierz akcję -> Konfiguracja tagu -> Użyj GTM (ciąg cyfr, np. `10987654321`). |
| `C - GADS_CONVERSION_LABEL` | NIE | Jak wyżej, etykieta konwersji (np. `abcDEFghiJKL1234`). |
| `C - X_PIXEL_ID` | NIE | X (Twitter) Ads -> Events Manager -> Pixel ID (zaczyna się zazwyczaj literą i cyframi). |
| `C - LINKEDIN_PARTNER_ID` | NIE | LinkedIn Campaign Manager -> Analyze -> Insight Tag -> Partner ID. |
| `C - MSADS_TAG_ID` | NIE | Microsoft Advertising -> Tools -> UET tag -> Tag ID. |

*(Jeśli nie używasz danej platformy, możesz po prostu wstrzymać [Pause] tagi z jej folderu. Nie musisz ich usuwać).*

## 3. Lista eventów DataLayer i ich parametry

Twój kontener jest skonfigurowany pod następujące eventy (generowane z kodu aplikacji CebulaZysku.pl):

* `page_view` (Zmiana widoku w SPA Next.js)
* `sign_up` / `login`
* `view_item` / `view_item_list` / `select_item`
* `begin_checkout` / `generate_lead` / `affiliate_click`
* Oraz customowe z logiki serwisu: `tracker_start`, `tracker_stop`, `condition_complete`, `payout_received`, `achievement_unlock`, `streak_milestone`.

Wszystkie te zdarzenia posiadają już skonfigurowane odpowiednie reguły w folderze `3. Reguły`.

## 4. Checklist: Weryfikacja w GTM Preview Mode

Zanim opublikujesz kontener (Prześlij -> Opublikuj), bezwzględnie przetestuj go w trybie podglądu!

1. Kliknij przycisk **Podgląd (Preview)** w prawym górnym rogu GTM.
2. Wpisz adres produkcyjny (lub testowy) `cebulazysku.pl`.
3. Przejdź przez następujący **scenariusz testowy**:

- [ ] **Brak zgody:** Na pierwszej stronie, zignoruj banner z cookies. Sprawdź w Tag Assistant, czy tagi reklamowe i GA4 w zakładce `Tags Fired` pozostają puste / mają status `Consent Not Granted`.
- [ ] **Wyrażenie zgody:** Kliknij "Akceptuję wszystkie" na bannerze (uruchomi to event `cookie_consent` w kodzie strony). Sprawdź w Tag Assistant czy tagi GA4 Config oraz piksele bazowe natychmiast "odpaliły" w podglądzie i wysłały Page View.
- [ ] **Test kliknięcia:** Otwórz ofertę banku i kliknij "Otwórz konto".
    - Upewnij się, że w sekcji DataLayer w Tag Assistant pojawiły się po kolei zdarzenia: `affiliate_click` -> `begin_checkout` -> `generate_lead`.
    - Upewnij się, że tag `GAds - Conversion - Affiliate Click` został odpalony w odpowiednim momencie.
- [ ] **Test rejestracji:** Zarejestruj nowe konto.
    - Sprawdź czy wylądował event `sign_up`.
    - Sprawdź zmienne warstwy danych, by upewnić się, że do `user_data.sha256_email_address` trafił zaszyfrowany mail (a NIE jawny tekst).

## 5. Publikacja

Gdy wszystko w Tag Assistant wyświetla się na zielono i tagi szanują status Consent Mode, wejdź na główne okno GTM, kliknij **Prześlij (Submit)**, nazwij nową wersję (np. `Init - CebulaZysku Analytics (GA4/Meta/Ads)`) i opublikuj.
