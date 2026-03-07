# PRD: Automatyczny sync ofert z LeadStar XML

## 1. Wprowadzenie / Przegląd

Oferty bankowe w Supabase muszą być regularnie aktualizowane z feedu LeadStar XML. Obecnie sync wymaga ręcznego wywołania `POST /api/sync-offers`. Potrzebujemy automatycznego crona, który będzie wywoływał ten endpoint co kilka godzin — bez ingerencji człowieka.

## 2. Cele

1. Oferty w Supabase są automatycznie aktualizowane co 6 godzin
2. Logi synchronizacji zapisywane w tabeli `sync_log` (już istnieje w kodzie)
3. W razie błędu sync — zapis błędu do logów (bez przerywania działania strony)
4. Dezaktywacja ofert, które zniknęły z feedu XML (nie usuwanie — soft delete via `is_active = false`)

## 3. User Stories

- **Jako właściciel serwisu** chcę, żeby oferty aktualizowały się automatycznie, bez mojej ingerencji
- **Jako użytkownik** chcę widzieć aktualne oferty z poprawnymi linkami i cenami
- **Jako developer** chcę mieć logi synchronizacji, żeby wiedzieć czy cron działa poprawnie

## 4. Wymagania funkcjonalne

1. Vercel Cron Job wywołuje `POST /api/sync-offers` co 6 godzin (0 */6 * * *)
2. Endpoint musi obsługiwać nagłówek `Authorization: Bearer CRON_SECRET` z Vercel
3. Tabela `sync_log` musi istnieć w Supabase (migracja SQL jeśli nie istnieje)
4. Oferty nieobecne w feedzie XML oznaczane jako `is_active = false` (soft delete)
5. Ręcznie wzbogacone pola (`conditions`, `faq`, `pros`, `cons`) nie są nadpisywane przez sync
6. Endpoint zwraca JSON z podsumowaniem: created, updated, deactivated, errors, duration

## 5. Poza zakresem (Non-Goals)

- Nie budujemy UI do przeglądania logów sync (to będzie częścią admin panelu)
- Nie implementujemy notyfikacji email o błędach sync (przyszła faza)
- Nie zmieniamy logiki parsowania XML (działa dobrze)

## 6. Rozważania techniczne

- **Vercel Cron Jobs** — darmowe na planie Hobby (max 1 cron/dzień) lub Pro (dowolna ilość). Na Hobby ograniczymy do raz dziennie.
- **CRON_SECRET** — Vercel automatycznie ustawia `CRON_SECRET` env var; endpoint powinien weryfikować nagłówek `Authorization: Bearer <CRON_SECRET>` LUB istniejący `SYNC_SECRET`
- **Tabela `sync_log`** — route już próbuje do niej pisać, ale migracja SQL może nie istnieć
- **Timeout** — Vercel serverless functions mają limit 10s (Hobby) / 60s (Pro). Sync 18 ofert powinien zmieścić się w <10s.

## 7. Metryki sukcesu

- Cron uruchamia się automatycznie bez interwencji
- Logi sync zapisywane w Supabase po każdym uruchomieniu
- Oferty usunięte z feedu XML oznaczane jako nieaktywne
- Zero downtime strony podczas sync

## 8. Otwarte pytania

- Jaki plan Vercel (Hobby/Pro)? → wpływa na częstotliwość crona
- Czy tabela `sync_log` już istnieje w Supabase?
