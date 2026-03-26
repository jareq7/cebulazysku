# Tasks: Newsletter System

> PRD: `tasks/prd-newsletter.md`

## 1. Database + API Foundation
- [x] 1.1 Migration `027_newsletter.sql`
- [x] 1.2 `POST /api/newsletter/subscribe` (validate, insert, send confirm email)
- [x] 1.3 `GET /api/newsletter/confirm?token=xxx` (activate + welcome email)
- [x] 1.4 `GET /api/newsletter/unsubscribe?token=xxx` (deactivate)
- [x] 1.5 Thank you pages: `/newsletter/potwierdzenie`, `/newsletter/wypisano`

## 2. Email Templates
- [x] 2.1 Confirmation email template
- [x] 2.2 Welcome email template
- [x] 2.3 Newsletter digest template (reuse weekly summary style)
- [x] 2.4 New offer alert template

## 3. Cron Integration
- [x] 3.1 Extend `email-notifications` cron — newsletter digest for subscribers
- [x] 3.2 Extend `sync-offers` — new offer alert trigger

## 4. UI Components
- [x] 4.1 `NewsletterPopup.tsx` (30s/scroll trigger, localStorage dismiss)
- [x] 4.2 `NewsletterInline.tsx` (compact form for blog footer)
- [x] 4.3 Add inline form to blog post pages
- [x] 4.4 Newsletter checkbox on registration page

## 5. Admin Panel
- [x] 5.1 `/admin/newsletter` page (list, stats, export)
- [x] 5.2 `/api/admin/newsletter` API (list, stats, export CSV)

## 6. Documentation
- [x] 6.1 Update `docs/` with newsletter feature doc
