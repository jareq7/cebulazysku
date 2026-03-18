# Affiliate Links: Conversand
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-18

Jarek, ponieważ nie mam dostępu do Twojego panelu wydawcy Conversand, przygotowałem szablon tabeli na linki trackingowe dla kluczowych banków w Polsce. 

Gdy wygenerujesz te linki w panelu, wklej je poniżej. Te dane pomogą nam później w automatyzacji dashboardu admina lub przy ręcznym dodawaniu ofert.

## 1. Instrukcja generowania linków
1. Zaloguj się na [conversand.com](https://conversand.com).
2. Przejdź do sekcji **Kampanie / Oferty**.
3. Wyszukaj poniższe banki.
4. Wybierz odpowiednią kampanię (zwróć uwagę na model rozliczenia, np. CPS - za otwarcie konta).
5. Wygeneruj link trackingowy (pamiętaj o dodaniu parametru `subid`, jeśli chcesz śledzić ID użytkownika z naszego systemu).

## 2. Lista Linków (Do uzupełnienia)

| Bank / Oferta | Model | Stawka (ok.) | Tracking URL | Uwagi |
| :--- | :--- | :--- | :--- | :--- |
| **BNP Paribas** (Konto Otwarte) | CPS | 120 - 180 zł | `TU_WKLEJ_LINK` | |
| **Pekao S.A.** (Konto Przekorzystne) | CPS | 100 - 150 zł | `TU_WKLEJ_LINK` | |
| **Bank Millennium** (Konto 360) | CPS | 110 - 160 zł | `TU_WKLEJ_LINK` | |
| **VeloBank** (VeloKonto) | CPS | 90 - 140 zł | `TU_WKLEJ_LINK` | |
| **mBank** (eKonto) | CPS | 80 - 130 zł | `TU_WKLEJ_LINK` | |
| **Citi Handlowy** (Konto osobiste) | CPS | 150 - 250 zł | `TU_WKLEJ_LINK` | |
| **Alior Bank** (Konto Jakże Osobiste) | CPS | 100 - 140 zł | `TU_WKLEJ_LINK` | |

---
**Wskazówka:** Po uzupełnieniu tej tabeli, możemy przygotować skrypt importu, który automatycznie zaktualizuje `affiliate_url` w naszej bazie danych Supabase.
