# 5. Fazy planowane i zrealizowane

[← Powrót do spisu treści](./README.md) | [Roadmapa](./03-roadmap.md)

---

## ~~Faza 1 — Supabase + Auth + DB Tracker~~ ✅ ZREALIZOWANA

Zaimplementowana jako faza 0b. Szczegóły: [13-migracja-supabase-offers.md](./13-migracja-supabase-offers.md)

**Cel:** Zamiana mock auth/tracker na prawdziwy backend.

**Zakres:**
1. Utworzenie projektu Supabase
2. Schemat bazy danych:
   ```sql
   -- Tabela ofert (wypełniana z XML)
   offers (
     id, leadstar_id, institution, program_name, product,
     description_html, benefits_html, logo_url, affiliate_url,
     reward_amount, difficulty, conditions JSONB,
     generated_description, generated_short_description,
     is_active, created_at, updated_at
   )
   
   -- Użytkownicy (rozszerzenie Supabase Auth)
   user_profiles (
     id (FK → auth.users), display_name, created_at
   )
   
   -- Banki w których user ma konto
   user_banks (
     id, user_id, bank_name, has_account, created_at
   )
   
   -- Śledzone oferty
   user_tracked_offers (
     id, user_id, offer_id, started_at, completed_at, status
   )
   
   -- Postępy w warunkach
   user_condition_progress (
     id, user_id, offer_id, condition_id, month,
     current_count, required_count, is_done, updated_at
   )
   
   -- Kolejka powiadomień
   notifications (
     id, user_id, type, message, offer_id,
     scheduled_for, sent_at, is_read
   )
   ```
3. Integracja `@supabase/supabase-js` + `@supabase/ssr`
4. Wymiana `AuthContext` → Supabase Auth (email/hasło)
5. Wymiana `TrackerContext` → Supabase DB queries
6. Row Level Security (RLS) — user widzi tylko swoje dane
7. Migracja UI na nowe źródło danych

**Wymagane od właściciela:**
- Założenie projektu na supabase.com
- Podanie URL i anon key

---

## ~~Faza 2 — XML Parser LeadStar~~ ✅ ZREALIZOWANA

Zaimplementowana jako faza 0d + faza 5 (parser warunków). Szczegóły: [15-auto-sync-xml.md](./15-auto-sync-xml.md)

**Cel:** Automatyczne pobieranie ofert z feedu XML LeadStar.

**Szczegóły źródła danych:** → [10-leadstar-xml.md](./10-leadstar-xml.md)

**Zakres implementacji:**
1. API Route `/api/sync-offers` — parser XML → upsert do Supabase
2. Vercel Cron Job — uruchamia sync co 6 godzin
3. Mapowanie pól XML → schemat DB:
   - `id` → `leadstar_id`
   - `institution` → `institution`
   - `program_name` → `program_name`
   - `description` → `description_html`
   - `benefits` → `benefits_html`
   - `logo` → `logo_url`
   - `url` → `affiliate_url`
   - `free_first` → `is_free_first_year`
4. Parsowanie `benefits` HTML → ekstrakcja warunków (kwota premii, kroki do spełnienia, terminy)
5. Logika deaktywacji — oferty usunięte z feedu → `is_active = false`
6. Strony ofert generowane dynamicznie z DB (ISR, revalidate co 1h)
7. Usunięcie hardcoded `banks.ts`

---

## ~~Faza 3 — Auto-generowanie opisów AI~~ ✅ ZREALIZOWANA

Zaimplementowana 12 marca 2026. Szczegóły: [29-ai-descriptions.md](./29-ai-descriptions.md)

**Co zrobiono:** Gemini Flash generuje `short_description`, `full_description`, `pros`, `cons`, `faq`, `conditions` w cebulowym tonie. Cron 3× w nocy (1:15/1:30/1:45 UTC), max 3 oferty per run. Sync resetuje `ai_generated_at` gdy treść feedu zmieni się.

---

## ~~Faza 4 — Filtr „mam konto" + Onboarding~~ ✅ ZREALIZOWANA

Zaimplementowana 12 marca 2026. Szczegóły: [31-user-banks-onboarding.md](./31-user-banks-onboarding.md)

**Co zrobiono:** Tabela `user_banks`, `UserBanksContext`, ekran `/onboarding` po rejestracji, filtr „Ukryj: moje banki" w `OfferFilters`, badge „Masz konto" na kartach, sekcja w dashboardzie.

---

## ~~Faza 5 — System powiadomień~~ ✅ ZREALIZOWANA

Zaimplementowana 12 marca 2026. Szczegóły: [32-email-notifications.md](./32-email-notifications.md)

**Co zrobiono:** Resend API, deadline reminders (7/3/1 dzień), tygodniowy raport (poniedziałki), deduplication via `email_sends`, preferencje opt-in/out w `notification_preferences`. Cron codziennie o 8:00 UTC.

**Wymagana konfiguracja:** `RESEND_API_KEY` + `RESEND_FROM_EMAIL` w Vercel env vars + weryfikacja domeny w Resend.

---

## Faza 5 — archiwum planu {#faza-5}

**Cel:** Użytkownik dostaje maile i push notifications przypominające o warunkach do spełnienia.

**Technologia:** Resend.com (darmowe 100 emaili/dzień) + Expo Push (mobile)

**Typy powiadomień:**

| Typ | Trigger | Treść |
|-----|---------|-------|
| Deadline reminder | 7/3/1 dzień przed terminem warunku | „Hej cebularzu! Za 3 dni mija termin na wpłatę 1000 zł w Santanderze. Nie daj się obrać!" |
| Nowa oferta | Nowa oferta pasująca do profilu | „Nowa cebulka do obrania! Alior daje 1000 zł za konto." |
| Gratulacje | Wszystkie warunki spełnione | „Brawo! Obrana cebulka w mBanku — 720 zł leci na konto! 🧅💰" |
| Podsumowanie tygodniowe | Co poniedziałek | „Twój cebulowy raport: 3 oferty w trakcie, 1250 zł do obrania" |

**Implementacja:**
1. Vercel Cron Job — codziennie o 9:00 sprawdza deadliny vs. postępy
2. Resend API — wysyłka emaili HTML
3. Expo Push API — natywne powiadomienia mobilne
4. Tabela `notifications` — kolejka + logi wysyłek
5. Ustawienia użytkownika — opt-in/opt-out per typ powiadomienia
6. Unsubscribe link w każdym mailu
