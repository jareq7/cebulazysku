# PRD: Newsletter System

> @author Claude Code (claude-opus-4-6) | 2026-03-26

## Introduction/Overview

System newslettera dla CebulaZysku.pl — zbieranie emaili od niezalogowanych użytkowników, weekly digest TOP ofert, alerty o nowych ofertach, welcome email. Rozszerza istniejący system emaili (który działa tylko dla zalogowanych userów śledzących oferty).

**Problem:** Obecny system emaili (`email-notifications` cron) wysyła maile tylko do zalogowanych użytkowników, którzy śledzą oferty. Nie mamy sposobu na zbieranie emaili od osób, które nie chcą się rejestrować — tracimy potencjalnych czytelników.

**Cel:** Zbudować newsletter jako osobny kanał pozyskiwania i utrzymywania ruchu.

## Goals

1. Zbieranie emaili od niezalogowanych użytkowników (popup + inline form)
2. Welcome email po potwierdzeniu subskrypcji (double opt-in, RODO)
3. Weekly digest: TOP 3 oferty + zbliżające się deadline'y (poniedziałek 9:00)
4. New offer alert: email przy nowej ofercie >300 zł (max 2/tydzień)
5. Admin panel: lista subskrybentów, statystyki, export CSV
6. Unsubscribe flow (link w emailu → natychmiastowe wypisanie)

## Architecture

### Istniejąca infrastruktura (reużywamy)

| Element | Status |
|---------|--------|
| `src/lib/resend.ts` — `sendEmail()` | ✅ Działa |
| `src/lib/email-templates.ts` — layout + template builder | ✅ Działa |
| `email_sends` tabela — deduplikacja | ✅ Działa |
| `notification_preferences` tabela | ✅ Działa (dla zalogowanych) |
| Vercel cron `email-notifications` (08:00 UTC) | ✅ Działa |

### Nowe elementy

| Element | Plik |
|---------|------|
| DB migration | `supabase/migrations/027_newsletter.sql` |
| Subscribe API | `src/app/api/newsletter/subscribe/route.ts` |
| Confirm API | `src/app/api/newsletter/confirm/route.ts` |
| Unsubscribe API | `src/app/api/newsletter/unsubscribe/route.ts` |
| Digest cron | Rozszerzenie `email-notifications/route.ts` |
| New offer trigger | Rozszerzenie `sync-offers/route.ts` |
| Popup component | `src/components/NewsletterPopup.tsx` |
| Inline form | `src/components/NewsletterInline.tsx` |
| Admin page | `src/app/admin/newsletter/page.tsx` |
| Admin API | `src/app/api/admin/newsletter/route.ts` |
| Email templates | Rozszerzenie `email-templates.ts` |

## Database Schema

```sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, unsubscribed
  source TEXT DEFAULT 'popup', -- popup, inline, registration, manual
  confirm_token UUID DEFAULT gen_random_uuid(),
  unsubscribe_token UUID DEFAULT gen_random_uuid(),
  subscribed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_confirm ON newsletter_subscribers(confirm_token);
CREATE INDEX idx_newsletter_unsub ON newsletter_subscribers(unsubscribe_token);
```

## Functional Requirements

### 1. Subscribe Flow (double opt-in)
- `POST /api/newsletter/subscribe` z `{ email, name?, source }`
- Walidacja: format email, nie disposable (lista domen), rate limit 5/IP/h
- Jeśli email istnieje i status=active → zwróć "Już subskrybujesz"
- Jeśli email istnieje i status=unsubscribed → re-subscribe (nowy token, status=pending)
- Wstaw do `newsletter_subscribers` ze status=pending
- Wyślij email potwierdzający z linkiem `cebulazysku.pl/api/newsletter/confirm?token=xxx`
- dataLayer event `newsletter_signup` z `{ source }`

### 2. Confirm
- `GET /api/newsletter/confirm?token=xxx`
- Znajdź subscriber po `confirm_token`, ustaw status=active, subscribed_at=now
- Redirect na `/newsletter/potwierdzenie` (thank you page)
- Wyślij welcome email

### 3. Unsubscribe
- `GET /api/newsletter/unsubscribe?token=xxx`
- Znajdź subscriber po `unsubscribe_token`, ustaw status=unsubscribed, unsubscribed_at=now
- Redirect na `/newsletter/wypisano`
- Każdy email ma footer z linkiem unsubscribe (token w URL)

### 4. Welcome Email
- Wysyłany po confirm
- Subject: "Witaj w CebulaZysku! Oto jak zarobić pierwszą premię"
- Treść: powitanie + 3 kroki + TOP 1 oferta + CTA
- Template w `email-templates.ts`

### 5. Weekly Digest (rozszerzenie istniejącego crona)
- W `email-notifications` cron (poniedziałek), oprócz digest dla zalogowanych:
  - Query `newsletter_subscribers` WHERE status=active
  - TOP 3 aktywne oferty (sortuj po reward DESC)
  - Oferty ze zbliżającymi się deadline'ami (<14 dni)
  - Deduplikacja: `email_sends` z type=newsletter_digest
  - Footer: link unsubscribe z tokenem

### 6. New Offer Alert (rozszerzenie sync-offers)
- Po `sync-offers`, jeśli nowa oferta z reward >300 zł:
  - Sprawdź czy w tym tygodniu wysłaliśmy <2 new offer alerty
  - Wyślij do active subscribers
  - Subject: "Nowa premia: [bank] daje [X] zł!"
  - Deduplikacja: `email_sends` z type=newsletter_new_offer

### 7. Popup (`NewsletterPopup.tsx`)
- Trigger: po 30s na stronie LUB scroll 50% (co pierwsze)
- Nie pokazuj jeśli: dismissed (localStorage `newsletter_dismissed`), zalogowany user z aktywną subskrypcją, w ciągu 30 dni od dismiss
- Copy: "Wysyłamy TOP 3 premie bankowe co poniedziałek"
- Formularz: email input + button "Zapisz się"
- Po submit: toast "Sprawdź skrzynkę — wyślemy link potwierdzający"
- Design: overlay modal, mobile-friendly, przycisk X do zamknięcia

### 8. Inline Form (`NewsletterInline.tsx`)
- Kompaktowy formularz na dole artykułów blogowych
- Copy: "Podobał Ci się artykuł? Zapisz się na cotygodniowy digest!"
- Ten sam API co popup, source=inline

### 9. Admin Panel (`/admin/newsletter`)
- Lista subskrybentów: email, status, source, data
- Filtry: status (active/pending/unsubscribed), source
- Stats: total, active, pending, unsubscribed, this week signups
- Export CSV (active subscribers)
- Przycisk "Wyślij testowy digest" (do admina)

### 10. Checkbox przy rejestracji
- Na stronie `/rejestracja` — checkbox "Zapisz się na newsletter" (domyślnie odznaczony, RODO)
- Jeśli zaznaczony → po rejestracji dodaj do `newsletter_subscribers` ze status=active (email już potwierdzony przez rejestrację)

## Non-Goals

- Segmentacja subskrybentów (wszystkim to samo)
- A/B testing emaili (na razie)
- Rich HTML editor w admin (template w kodzie)
- Załączniki/PDF w emailach

## Success Criteria

1. Subskrypcja działa end-to-end (signup → confirm → welcome → digest)
2. Weekly digest wysyła się automatycznie w poniedziałki
3. Unsubscribe działa w 1 klik
4. Admin widzi statystyki i może exportować listę
5. Popup nie irytuje (max 1x na 30 dni, respektuje dismiss)
