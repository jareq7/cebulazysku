# 5. Fazy planowane (1–5)

[← Powrót do spisu treści](./README.md) | [Roadmapa](./03-roadmap.md)

---

## Faza 1 — Supabase + Auth + DB Tracker {#faza-1}

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

## Faza 2 — XML Parser LeadStar {#faza-2}

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

## Faza 3 — Auto-generowanie opisów AI {#faza-3}

**Cel:** Unikalne, czytelne opisy ofert w cebulowym tonie, generowane automatycznie z surowych danych XML.

**Podejście:**
- Przy nowej/zmienionej ofercie → trigger generowania opisów
- **Claude API** (user ma Claude Pro) z promptem:
  ```
  Jesteś copywriterem serwisu CebulaZysku. Pisz w humorystycznym, 
  przystępnym tonie nawiązującym do cebuli i obierania warstw zysku.
  
  Na podstawie poniższych surowych danych z banku, napisz:
  1. Krótki opis (2-3 zdania, max 200 znaków)
  2. Pełny opis (3-5 akapitów, przystępny język)
  3. Lista warunków (jako JSON z polami: label, description, type, requiredCount)
  4. Lista zalet (3-5 punktów)
  5. Lista wad (1-3 punktów)
  
  Surowe dane: [XML description + benefits]
  ```
- Wygenerowane opisy zapisywane w DB (`generated_description`, `generated_short_description`)
- Regeneracja tylko gdy oferta się zmieni (porównanie hash benefits)
- Rate limiting — max 5 generacji na minutę

**Alternatywa:** Jeśli API Claude niedostępne, fallback na template engine z wariacjami.

---

## Faza 4 — Filtr „mam konto" + Onboarding {#faza-4}

**Cel:** Użytkownik oznacza banki w których już ma konto → personalizacja ofert.

**Zakres:**
1. Ekran onboardingu po rejestracji:
   - „W których bankach masz już konto?" — grid z logo banków + checkboxy
   - Zapisywane do tabeli `user_banks`
2. Logika filtrowania:
   - Oferty na **nowe konto** w bankach z `has_account = true` → **ukryte**
   - Inne promocje tego banku (karty, lokaty) → **nadal widoczne**
3. Sekcja w ustawieniach profilu — edycja listy banków
4. Badge „Masz już konto" na kartach ofert dla oznaczonych banków

---

## Faza 5 — System powiadomień {#faza-5}

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
