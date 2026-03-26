# 45. System newslettera

## Przegląd

System newslettera CebulaZysku umożliwia zbieranie subskrybentów email niezależnie od kont użytkowników (auth). Wspiera double opt-in (RODO), automatyczne digest tygodniowy, alerty o nowych ofertach oraz 1-click unsubscribe.

## Architektura

### Baza danych

Tabela `newsletter_subscribers` (`supabase/migrations/027_newsletter.sql`):
- `id` UUID PK
- `email` TEXT UNIQUE
- `name` TEXT (opcjonalne)
- `status`: `pending` → `active` → `unsubscribed`
- `source`: `popup`, `inline`, `registration`, `manual`
- `confirm_token` UUID — link potwierdzający
- `unsubscribe_token` UUID — link wypisania
- RLS: tylko service role (brak dostępu publicznego)

### Endpointy API

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/api/newsletter/subscribe` | POST | Rejestracja + wysyłka maila potwierdzającego |
| `/api/newsletter/confirm?token=xxx` | GET | Aktywacja + welcome email z TOP ofertą |
| `/api/newsletter/unsubscribe?token=xxx` | GET | 1-click wypisanie |
| `/api/admin/newsletter` | GET | Stats + lista subskrybentów (admin) |
| `/api/admin/newsletter?format=csv` | GET | Eksport CSV (admin) |

### Subscribe flow

1. Użytkownik wpisuje email (popup/inline/rejestracja)
2. `POST /api/newsletter/subscribe` — walidacja, rate limit (5/IP/h), blokada disposable domen
3. Insert do DB ze statusem `pending`, wysyłka confirmation email
4. Użytkownik klika link → `GET /api/newsletter/confirm` → status = `active`
5. Welcome email z TOP ofertą

### Zabezpieczenia

- **Rate limiting**: 5 prób/IP/godzinę (in-memory, resetuje się na cold start)
- **Disposable domains**: blokada tempmail.com, mailinator.com itp.
- **Email validation**: regex + lowercase trim
- **Double opt-in**: wymagane kliknięcie linku potwierdzającego
- **Dedup**: re-subscribe aktualizuje istniejący rekord zamiast tworzyć nowy

## Szablony email

Wszystkie w `src/lib/email-templates.ts`:

| Funkcja | Kiedy | Treść |
|---------|-------|-------|
| `newsletterConfirmEmail()` | Po subscribe | Link potwierdzający |
| `newsletterWelcomeEmail()` | Po confirm | Powitanie + TOP oferta |
| `newsletterDigestEmail()` | Poniedziałki (cron) | TOP 8 ofert + nowe z tygodnia |
| `newsletterNewOfferEmail()` | Po sync (nowa oferta) | Alert o nowej ofercie |

Szablony używają `newsletterLayout()` z linkiem wypisania w stopce (osobny od `layout()` dla zalogowanych).

## Cron

- **Digest tygodniowy**: `email-notifications` cron (poniedziałki 08:00 UTC) — wysyła `newsletterDigestEmail` do aktywnych subskrybentów
- **Alert nowa oferta**: `sync-offers` — po utworzeniu nowej oferty z reward > 0, wysyła alert do wszystkich aktywnych subskrybentów
- **Dedup**: email_sends tabela (typ `newsletter_digest`)

## Komponenty UI

### NewsletterPopup (`src/components/NewsletterPopup.tsx`)
- Trigger: 30s timeout LUB 40% scroll
- localStorage dismiss (7 dni)
- Animowany backdrop + slide-in
- Stany: idle → loading → success/error

### NewsletterInline (`src/components/NewsletterInline.tsx`)
- Kompaktowy formularz na stronach bloga
- Dodany pod artykułem, przed "Wróć do bloga"

### Rejestracja
- Checkbox "Chcę otrzymywać newsletter" (domyślnie zaznaczony)
- Fire-and-forget POST po rejestracji (source: `registration`)

## Panel admina

`/admin/newsletter`:
- Karty statystyk (łącznie, aktywni, oczekujący, wypisani)
- Tabela ostatnich 100 subskrybentów
- Eksport CSV

## Strony potwierdzenia

- `/newsletter/potwierdzenie` — sukces po kliknięciu confirm link
- `/newsletter/wypisano` — sukces po wypisaniu (+ obsługa `?error=invalid`)
