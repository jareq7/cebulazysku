# 32. System powiadomień email (Faza 5)

[← Powrót do spisu treści](./README.md)

---

## Cel

Automatyczne emaile przypominające użytkownikom o ofertach z nadchodzącymi deadlinami oraz tygodniowe podsumowania aktywnych ofert. Działa wyłącznie dla użytkowników, którzy wyrazili zgodę w preferencjach.

---

## Typy emaili

| Typ | Kiedy | Opt-in field |
|-----|-------|-------------|
| Deadline 7 dni | 7 dni przed terminem oferty | `email_deadline_reminders` |
| Deadline 3 dni | 3 dni przed terminem oferty | `email_deadline_reminders` |
| Deadline 1 dzień | Dzień przed terminem oferty | `email_deadline_reminders` |
| Tygodniowy raport | Każdy poniedziałek | `email_weekly_summary` |

Domyślnie: `email_deadline_reminders = true`, `email_weekly_summary = false`.

---

## Architektura

### Cron endpoint `GET /api/cron/email-notifications`

Schedule: `0 8 * * *` — codziennie o 8:00 UTC.

**Deadline reminders:**
1. Pobiera wszystkie `tracked_offers` z JOIN na `offers` gdzie `deadline` jest aktywne
2. Filtruje do ofert z terminem za 1, 3 lub 7 dni
3. Sprawdza `notification_preferences.email_deadline_reminders` per user
4. Sprawdza tabelę `email_sends` — nie wysyła jeśli ten sam email był już dziś wysłany
5. Pobiera email + imię z `auth.users` (via `supabase.auth.admin.getUserById`)
6. Wysyła email przez Resend, loguje do `email_sends`

**Weekly summary (tylko poniedziałki):**
1. Pobiera wszystkich userów z aktywnymi ofertami
2. Sprawdza `notification_preferences.email_weekly_summary = true`
3. Grupuje oferty per user, liczy łączną premię
4. Wysyła email z podsumowaniem

### Deduplication

Tabela `email_sends` z UNIQUE na `(user_id, type, offer_id, sent_at::date)` — gwarantuje, że ten sam typ emaila nie zostanie wysłany dwa razy tego samego dnia, nawet jeśli cron uruchomi się ponownie.

### `src/lib/resend.ts`

Wrapper nad Resend SDK. Wymaga `RESEND_API_KEY` w env.

```typescript
sendEmail({ to, subject, html }) → { success, id?, error? }
```

### `src/lib/email-templates.ts`

Dwie funkcje generujące HTML emaile:
- `deadlineReminderEmail(data)` — z responsywnym layoutem, cebulowym tonem, przyciskiem CTA
- `weeklySummaryEmail(data)` — lista śledzonych ofert z sumą premii

Szablony używają inline CSS, bez zewnętrznych zależności (kompatybilne ze wszystkimi klientami email).

---

## Baza danych

**Migracja:** `supabase/migrations/015_email_sends.sql`

```sql
CREATE TABLE email_sends (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL,   -- 'deadline_7d' | 'deadline_3d' | 'deadline_1d' | 'weekly_summary'
  offer_id text,
  email text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, type, offer_id, (sent_at::date))
);
```

Tabela `notification_preferences` istnieje od migracji `010`. Zawiera pola:
- `email_deadline_reminders` (default: true)
- `email_weekly_summary` (default: false)

---

## Zmienne środowiskowe

| Zmienna | Opis |
|---------|------|
| `RESEND_API_KEY` | Klucz API z resend.com |
| `RESEND_FROM_EMAIL` | Adres nadawcy (np. `CebulaZysku <powiadomienia@cebulazysku.pl>`) |
| `NEXT_PUBLIC_SITE_URL` | Base URL do linków w emailach |

---

## Konfiguracja Resend

1. Załóż konto na [resend.com](https://resend.com) (100 emaili/dzień gratis)
2. Zweryfikuj domenę cebulazysku.pl (DNS TXT record)
3. Wygeneruj API key, wklej do `RESEND_API_KEY` w Vercel env vars
4. Dodaj `RESEND_FROM_EMAIL=CebulaZysku <powiadomienia@cebulazysku.pl>`

---

## Pliki

| Plik | Opis |
|------|------|
| `src/app/api/cron/email-notifications/route.ts` | Główny cron endpoint |
| `src/lib/resend.ts` | Wrapper Resend SDK |
| `src/lib/email-templates.ts` | HTML szablony emaili |
| `supabase/migrations/015_email_sends.sql` | Tabela logów wysyłek |
| `supabase/migrations/010_notification_preferences.sql` | Preferencje użytkownika |
| `vercel.json` | Schedule: `0 8 * * *` |

---

## Ograniczenia

- **100 emaili/dzień** na darmowym planie Resend — wystarczy do ~30 aktywnych userów z wieloma ofertami; płatny plan przy wzroście
- Deadline reminder wymaga pola `offers.deadline` — oferty bez deadline są pomijane
- Tygodniowe podsumowanie bez analizy postępów — pokazuje listę wszystkich śledzonych ofert
