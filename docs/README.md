# 🧅 CebulaZysku — Dokumentacja Projektu

> **Domena:** cebulazysku.pl  
> **Repozytorium:** https://github.com/jareq7/cebulazysku  
> **Deploy:** Vercel (automatyczny z brancha `main`)  
> **Ostatnia aktualizacja:** 7 marca 2026 r.

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
