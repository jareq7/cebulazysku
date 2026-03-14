# 37. API Endpoints

[← Powrót do spisu treści](./README.md)

---

## Public API

| Method | Endpoint | Opis |
|--------|----------|------|
| POST | `/api/contact` | Formularz kontaktowy (walidacja, rate limit, honeypot) |
| GET/POST | `/api/referral` | GET: pobierz/utwórz kod polecenia; POST: zarejestruj poleconego |
| GET/POST | `/api/gamification/streak` | GET: aktualny streak; POST: bump streak |
| GET/POST | `/api/gamification/achievements` | GET: odblokowane odznaki; POST: odblokuj nową |
| POST | `/api/push/subscribe` | Rejestracja Web Push subscription |
| POST | `/api/notifications/preferences` | Zapis preferencji email notifications |

## Auth

| Method | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/auth/callback` | Supabase auth callback (OAuth) |

## Cron Jobs (Vercel)

| Method | Endpoint | Schedule | Opis |
|--------|----------|----------|------|
| GET | `/api/sync-offers` | 01:00 UTC | Sync LeadStar XML → Supabase. Auth: `CRON_SECRET` lub `SYNC_SECRET` |
| GET | `/api/cron/generate-descriptions` | 02:00 UTC | AI generuje opisy (3 oferty/run). Auth: `CRON_SECRET` |
| GET | `/api/cron/quality-check` | 03:00 UTC | Scraping stron banków, weryfikacja kwot. Auth: `CRON_SECRET` |
| GET | `/api/cron/email-notifications` | 08:00 UTC | Deadline reminders + weekly digest. Auth: `CRON_SECRET` |

## Admin API

Wszystkie wymagają headera `x-admin-password` z wartością `ADMIN_PASSWORD` env var.

| Method | Endpoint | Opis |
|--------|----------|------|
| POST | `/api/admin/auth` | Weryfikacja hasła admina (rate limit 5/min/IP) |
| GET | `/api/admin/stats` | Dashboard stats (offers, users, messages, sync) |
| GET/POST/PATCH | `/api/admin/offers` | CRUD ofert |
| GET | `/api/admin/users` | Lista użytkowników |
| GET/PATCH | `/api/admin/messages` | Wiadomości kontaktowe + oznaczanie przeczytanych |
| GET/POST/PATCH/DELETE | `/api/admin/blog` | CRUD postów blogowych |
| POST | `/api/admin/push/send` | Broadcast push notification |
| POST | `/api/admin/trigger-sync` | Ręczny trigger sync |
| GET | `/api/admin/sync-logs` | Historia sync-ów |
| GET | `/api/admin/feed` | Statystyki feedu |
| POST | `/api/admin/enrich` | Trigger enrichment/scraping |
| GET | `/api/admin/test-reward-parser` | Test parsera kwot premii |

## Inne

| Method | Endpoint | Opis |
|--------|----------|------|
| POST | `/api/generate-voiceover` | Generacja voiceover via ElevenLabs TTS |
