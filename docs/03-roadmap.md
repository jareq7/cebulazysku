# 3. Roadmapa

[← Powrót do spisu treści](./README.md)

---

## Co zostało już zrobione

### ✅ Faza 0 — Rebranding na CebulaZysku
- Kompletna zmiana brandingu z „BankPremie" na „CebulaZysku"
- Nowa paleta kolorów: amber/orange (ciepłe cebulowe tony)
- Logo: emoji 🧅 + gradient amber→orange
- Cebulowy humor w całym messaging
- Dark mode z cebulowymi tonami
- 24 pliki zaktualizowane, build bez błędów

### ✅ Compliance (wcześniej)
- Strony prawne: regulamin, polityka prywatności, o nas, kontakt
- DisclaimerBanner na stronie głównej
- Checkbox zgody przy rejestracji
- Footer z linkami do stron prawnych
- Informacja o modelu afiliacyjnym

### ✅ SEO (wcześniej)
- Server Components gdzie to możliwe
- `generateMetadata` na każdej stronie
- JSON-LD (WebSite, FAQPage, BreadcrumbList, Article)
- Canonical URLs z domeną cebulazysku.pl
- `metadataBase` w root layout
- Dynamiczny sitemap.xml i robots.txt
- Open Graph meta tagi

### ✅ UX/UI (wcześniej)
- Filtry i sortowanie ofert (OfferFilters)
- Data ostatniej aktualizacji ofert
- Wewnętrzne linkowanie (breadcrumbs, "Zobacz też")
- Custom not-found page
- Social proof section
- Dashboard z sugestiami łatwych ofert
- Responsywny design (mobile-first)

### ✅ Growth (wcześniej)
- Blog infrastruktura (listing + post detail z JSON-LD)
- Dark mode (next-themes + ThemeToggle w Navbar)
- Placeholder tracking pixels (Google Ads, Meta Ads)
- Sitemap rozszerzony o blog i strony prawne

---

## Plan rozwoju

| Faza | Nazwa | Szczegóły | Status | Priorytet |
|------|-------|-----------|--------|-----------|
| 0 | Rebranding CebulaZysku | — | ✅ Gotowe | — |
| 0b | Migracja ofert do Supabase | [13-migracja-supabase-offers.md](./13-migracja-supabase-offers.md) | ✅ Gotowe | — |
| 0c | Logo i kolorystyka | [14-logo-kolorystyka.md](./14-logo-kolorystyka.md) | ✅ Gotowe | — |
| 0d | Auto-sync XML (Vercel Cron) | [15-auto-sync-xml.md](./15-auto-sync-xml.md) | ✅ Gotowe | — |
| 0e | SEO & Analytics | [16-seo-analytics.md](./16-seo-analytics.md) | ✅ Gotowe | — |
| 0f | Audyt UX/UI | [17-audyt-ux-ui.md](./17-audyt-ux-ui.md) | ✅ Gotowe | — |
| 0g | Backend kontaktu | [18-backend-kontakt.md](./18-backend-kontakt.md) | ✅ Gotowe | — |
| 0h | Admin Panel | [19-admin-panel.md](./19-admin-panel.md) | ✅ Gotowe | — |
| 0i | Blog dynamiczny | [20-blog-dynamiczny.md](./20-blog-dynamiczny.md) | ✅ Gotowe | — |
| 0j | PWA | [21-pwa.md](./21-pwa.md) | ✅ Gotowe | — |
| 0k | Gamifikacja (streaki, odznaki) | [22-gamifikacja.md](./22-gamifikacja.md) | ✅ Gotowe | — |
| 0l | Push notyfikacje | [23-push-notyfikacje.md](./23-push-notyfikacje.md) | ✅ Gotowe | — |
| 0m | AI reward parser (Gemini) | [24-ai-reward-parser.md](./24-ai-reward-parser.md) | ✅ Gotowe | — |
| 0n | Audyt bezpieczeństwa + poprawki | [25-audyt-bezpieczenstwa.md](./25-audyt-bezpieczenstwa.md), [26-security-fixes.md](./26-security-fixes.md) | ✅ Gotowe | — |
| 0o | Audyt wizualny (favicon, logo, OG) | [27-audyt-wizualny.md](./27-audyt-wizualny.md) | ✅ Gotowe | — |
| 0p | Feed Quality Monitor (walidacja + scraping + admin spreadsheet) | [28-feed-quality-monitor.md](./28-feed-quality-monitor.md) | ✅ Gotowe | — |
| 3 | Auto-generowanie opisów (AI + cebulowy ton) | [29-ai-descriptions.md](./29-ai-descriptions.md) | ✅ Gotowe | — |
| 4 | Filtr „mam konto" + onboarding | [31-user-banks-onboarding.md](./31-user-banks-onboarding.md) | ✅ Gotowe | — |
| 5 | Powiadomienia email (Resend) | [32-email-notifications.md](./32-email-notifications.md) | ✅ Gotowe | — |
| 6 | Rozszerzona gamifikacja (konfetti, status wypłaty, polecenia) | [33-gamifikacja-extended.md](./33-gamifikacja-extended.md) | ✅ Gotowe | — |
| 7 | CebulaZysku v2 (Compliance, SEO, UX, Growth) | [tasks/prd-cebulazysku-v2.md](../tasks/prd-cebulazysku-v2.md) | ✅ Gotowe | — |
| 8 | Video Ads (Remotion + ElevenLabs TTS) | [tasks/prd-video-ads.md](../tasks/prd-video-ads.md) | ⚠️ 80% (voiceover regen pending) | — |
| 8b | SEO & Conversion Sprint | [46-seo-conversion-sprint1.md](./46-seo-conversion-sprint1.md) | ✅ Gotowe | — |
| 8c | Content & Email Pipeline | [47-content-pipeline-sprint2.md](./47-content-pipeline-sprint2.md) | ✅ Gotowe | — |
| 8d | Windsurf batch 1 (testimonials, przewodnik, dla-firm, blog tags, archiwum) | AI-TASKS.md W1-W5 | ✅ Gotowe | — |
| 8e | Gemini batch 2+3 (8 research deliverables) | AI-TASKS.md G1-G8 | ✅ Gotowe | — |
| 8f | Referral widget upgrade | AI-TASKS.md C13 | ✅ Gotowe | — |
| 9 | **Sprint 4 — Retencja & Dystrybucja** | AI-TASKS.md C14-C18, G9-G13, W6-W10, J1-J7 | 🔄 W trakcie | Wysoki |
| 10 | TikTok/IG/YT Video Pipeline | AI-TASKS.md C11 | ⏸️ Czeka na VPS + ElevenLabs (Jarek J5, J6) | Wysoki |
| 11 | Autonomiczny Content Pipeline (n8n) | AI-TASKS.md C12 | 🔲 Wymaga PRD | Średni |
| 12 | Rozbudowa admin panelu (wykresy, logi AI) | [07-admin-panel.md](./07-admin-panel.md) | 🔲 Do zrobienia | Średni |
| 13 | Aplikacje mobilne (iOS + Android) | [08-mobile.md](./08-mobile.md) | 🔲 Do zrobienia | Planowane |
| 14 | White-label + multi-branża | [09-white-label.md](./09-white-label.md) | 🔲 Do zrobienia | Planowane |

> **Uwaga:** Fazy 1 (Supabase + auth) i 2 (XML parser) z oryginalnego planu zostały zrealizowane jako fazy 0b i 0d.
> Fazy 5 (push), 6 (gamifikacja bazowa) i 7 (admin panel bazowy) też zrealizowane jako 0l, 0k, 0h.
> V2 (compliance, SEO, UX, growth) i Video Ads zrealizowane w marcu 2026.
> Sprint 4 (marzec 2026): retencja, drip emails, nowe strony, Jarek odblokuje dystrybucję.
> Pozostałe fazy dotyczą rozszerzeń ponad to co jest obecnie zaimplementowane.
