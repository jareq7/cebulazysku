# 34. Migracja LeadStar: z XML feed na REST API

> **Data:** 13 marca 2026 r.

## Co się zmieniło

Źródło danych ofert zostało zmienione z parsowania XML feeda (regex) na oficjalne REST API LeadStar v0.4.3.

## Endpoint

- **URL:** `https://leadstar.pl/api/programs`
- **Metoda:** POST
- **Autoryzacja:** `partner_id` + `api_key`
- **Odpowiedź:** JSON z tablicą `rows[]`

## Zmienne środowiskowe

| Zmienna | Opis |
|---------|------|
| `LEADSTAR_PARTNER_ID` | ID partnera (zastępuje `LEADSTAR_FEED_URL`) |
| `LEADSTAR_API_KEY` | Klucz API |

Stara zmienna `LEADSTAR_FEED_URL` nie jest już używana.

## Korzyści

- **Czysty JSON** zamiast regex-owego parsowania XML — brak edge case'ów
- **HTML bez encji** — API zwraca `<br />` zamiast `&lt;br /&gt;`, eliminując problem z wyświetlaniem opisów
- **Filtrowanie `only_mailing`** — oferty dostępne wyłącznie w mailingach są pomijane
- **Stabilność** — wersjonowane API (0.4.3) vs nieudokumentowany feed XML

## Pliki

- `src/lib/leadstar.ts` — przepisany z XML parsera na klienta REST API
- `src/app/api/sync-offers/route.ts` — bez zmian (ten sam interfejs `LeadStarOffer`)

## Dostępne endpointy API

| Endpoint | Opis |
|----------|------|
| `/api/products` | Lista kategorii produktów |
| `/api/programs` | Programy partnera (aktywne) — **używany w sync** |
| `/api/allprograms` | Katalog wszystkich programów |
| `/api/leads` | Konwersje/wnioski (do przyszłej analityki) |
| `/api/accountBalance` | Stan konta partnera |
| `/api/benefits` | Programy z korzyściami dla klientów |
| `/api/deeplink` | Tworzenie deeplinków |
| `/api/banners` | Kreacje reklamowe |
