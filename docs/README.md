# 🧅 CebulaZysku — Dokumentacja Projektu

> **Domena:** cebulazysku.pl  
> **Repozytorium:** https://github.com/jareq7/cebulazysku  
> **Deploy:** Vercel (automatyczny z brancha `main`)  
> **Ostatnia aktualizacja:** 15 marca 2026 r.

---

## Spis treści

Dokumentacja podzielona jest na osobne pliki tematyczne, żeby łatwiej było ją czytać, edytować i aktualizować bez konieczności przeglądania całości.

| # | Dokument | Opis |
|---|----------|------|
| 1 | [Przegląd projektu](./01-overview.md) | Czym jest CebulaZysku, cel biznesowy, przewaga konkurencyjna |
| 2 | [Architektura techniczna](./02-architecture.md) | Stack, struktura projektu, env vars, uruchomienie lokalne |
| 3 | [Roadmapa](./03-roadmap.md) | Co zrobione, co przed nami — tabela faz |
| 4 | [Fazy zrealizowane](./04-fazy-zrealizowane.md) | Szczegółowy opis zrealizowanych prac |
| 5 | [Fazy planowane (1–5)](./05-fazy-planowane.md) | Supabase, XML parser, AI opisy, onboarding, powiadomienia |
| 6 | [Gamifikacja](./06-gamifikacja.md) | Streaki, odznaki, rankingi, program poleceń |
| 7 | [Panel admina](./07-admin-panel.md) | Dashboard, zarządzanie ofertami/userami/treściami |
| 8 | [Aplikacje mobilne](./08-mobile.md) | React Native, Quick Track, push, offline, widgety |
| 9 | [White-label & multi-branża](./09-white-label.md) | Platforma pod inne domeny i branże |
| 10 | [Źródło danych — LeadStar XML](./10-leadstar-xml.md) | Feed URL, struktura XML, aktualne oferty |
| 11 | [Decyzje architektoniczne](./11-decyzje.md) | Dlaczego Supabase, Claude, ISR, Vercel, Resend |
| 12 | [Wizja produktu](./12-wizja.md) | Pełny ekosystem, user journey, KPI, monetyzacja |
| 13 | [Migracja ofert do Supabase](./13-migracja-supabase-offers.md) | Przeniesienie ofert z banks.ts do DB, deduplikacja, frontend fetch |
| 14 | [Logo i kolorystyka](./14-logo-kolorystyka.md) | Integracja logo, zmiana amber→emerald, spell check |
| 15 | [Automatyczny sync XML](./15-auto-sync-xml.md) | Vercel Cron, soft delete, sync_log |
| 16 | [SEO & Analytics](./16-seo-analytics.md) | GA4, Google Search Console, Meta Pixel |
| 17 | [Audyt UX/UI](./17-audyt-ux-ui.md) | Przegląd spójności, responsywności, a11y, rekomendacje |
| 18 | [Backend kontakt](./18-backend-kontakt.md) | API /api/contact, Supabase, walidacja, honeypot |
| 19 | [Admin panel](./19-admin-panel.md) | Dashboard, oferty, sync logi, wiadomości |
| 20 | [Blog dynamiczny](./20-blog-dynamiczny.md) | Supabase, ISR, admin CRUD, fallback |
| 21 | [PWA](./21-pwa.md) | Manifest, service worker, offline, ikony |
| 22 | [Gamifikacja](./22-gamifikacja.md) | Streaki, odznaki, dashboard |
| 23 | [Push notyfikacje](./23-push-notyfikacje.md) | Web Push, VAPID, admin send, SW |
| 24 | [AI Reward Parser](./24-ai-reward-parser.md) | Gemini Flash, parsowanie kwot premii, retry, rate limit |
| 25 | [Audyt bezpieczeństwa](./25-audyt-bezpieczenstwa.md) | Raport: sekrety, auth, RLS, XSS, dependencies |
| 26 | [Security Fixes](./26-security-fixes.md) | Szczegółowy opis naprawek + troubleshooting |
| 27 | [Audyt wizualny](./27-audyt-wizualny.md) | Favicon, logo, OG image, cleanup śmieci z boilerplate |
| 28 | [Feed Quality Monitor](./28-feed-quality-monitor.md) | Walidacja danych feedu, scraping stron banków, locked_fields |
| 29 | [AI Auto-generowanie opisów](./29-ai-descriptions.md) | Gemini generuje opisy, pros/cons, FAQ, warunki dla ofert |
| 30 | [Quality Check Cron](./30-quality-cron.md) | Nocny cron sprawdzający zgodność premii na stronach banków |
| 31 | [Onboarding + Moje Banki](./31-user-banks-onboarding.md) | Filtr „mam konto", ekran onboardingu, badge na kartach ofert |
| 32 | [Email notifications](./32-email-notifications.md) | Deadline reminders, tygodniowy raport — Resend + cron |
| 33 | [Gamifikacja rozszerzona](./33-gamifikacja-extended.md) | Konfetti, status wypłaty premii, program poleceń |
| 34 | [Migracja LeadStar API](./34-leadstar-api-migration.md) | Z XML feed na REST API v0.4.3 |
| 35 | [AI Double-Check](./35-ai-double-check.md) | Weryfikacja wygenerowanych opisów przez drugie wywołanie Gemini |
| 36 | [Typy ofert i filtry](./36-offer-types-filters.md) | Osobiste / firmowe / dla młodych — filtry i preferencje |
| 37 | [API Endpoints](./37-api-endpoints.md) | Pełna lista wszystkich 22 API routes z opisami |
| 38 | [Admin Panel v2](./38-admin-panel-v2.md) | Edytor warunków, logi AI, konwersje, bulk actions, tracker preview, markdown preview |
| 39 | [AI Verification Layer](./39-ai-verification.md) | Weryfikacja AI warunków parsowanych regexem |

---

## 🔬 Raporty Researchu i Strategii

Wyniki analiz przeprowadzonych przez Gemini CLI w obszarze optymalizacji i rozwoju.

| Dokument | Opis |
|----------|------|
| [Research: Remotion Rendering](../research/remotion-rendering.md) | Analiza opcji generowania MP4 (AWS Lambda vs GitHub Actions) |
| [SEO: Strategia Contentowa](../research/content/blog-topics.md) | Plan 10 tematów blogowych pod EEAT i ruch organiczny |
| [SEO: Treści Rankingu](../research/content/ranking-copy.md) | Propozycja unikalnych treści "cebulowych" dla strony /ranking |
| [SEO: Meta Tagi](../research/content/meta-tags.md) | Optymalizacja tytułów i opisów meta dla kluczowych podstron |

### Pliki instrukcji dla AI

| Plik | Opis |
|------|------|
| [CLAUDE.md](../CLAUDE.md) | Instrukcje dla Claude Code (automatycznie ładowane) |
| [GEMINI.md](../GEMINI.md) | Instrukcje dla Gemini CLI / Gemini Code Assist |
| [create-prd.md](../create-prd.md) | Szablon generowania PRD (Product Requirements Document) |
| [generate-tasks.md](../generate-tasks.md) | Szablon generowania task listy z PRD |

### PRD i Task Tracking

| Feature | PRD | Tasks | Status |
|---------|-----|-------|--------|
| CebulaZysku v2 | [prd-cebulazysku-v2.md](../tasks/prd-cebulazysku-v2.md) | [tasks-cebulazysku-v2.md](../tasks/tasks-cebulazysku-v2.md) | ✅ Done |
| Auto-sync XML | [prd-auto-sync-xml.md](../tasks/prd-auto-sync-xml.md) | [tasks-auto-sync-xml.md](../tasks/tasks-auto-sync-xml.md) | ✅ Done |
| Video Ads | [prd-video-ads.md](../tasks/prd-video-ads.md) | [tasks-video-ads.md](../tasks/tasks-video-ads.md) | ⚠️ 80% |
| Admin Panel v2 | [prd-admin-panel-v2.md](../tasks/prd-admin-panel-v2.md) | [tasks-admin-panel-v2.md](../tasks/tasks-admin-panel-v2.md) | ⚠️ 90% |

---

## Szybki start

```bash
git clone https://github.com/jareq7/cebulazysku.git
cd cebulazysku
npm install
npm run dev
# → http://localhost:3000
```

## Kontakt

- **Email:** kontakt@cebulazysku.pl
- **GitHub:** https://github.com/jareq7/cebulazysku
