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
| 3 | Auto-generowanie opisów (AI + cebulowy ton) | [05-fazy-planowane.md](./05-fazy-planowane.md#faza-3) | 🔲 Do zrobienia | Wysoki |
| 4 | Filtr „mam konto" + onboarding | [05-fazy-planowane.md](./05-fazy-planowane.md#faza-4) | 🔲 Do zrobienia | Średni |
| 5 | Powiadomienia email (Resend) | [05-fazy-planowane.md](./05-fazy-planowane.md#faza-5) | 🔲 Do zrobienia | Średni |
| 6 | Rozszerzona gamifikacja (konfetti, rankingi, polecenia) | [06-gamifikacja.md](./06-gamifikacja.md) | 🔲 Do zrobienia | Średni |
| 7 | Rozbudowa admin panelu (wykresy, logi AI) | [07-admin-panel.md](./07-admin-panel.md) | 🔲 Do zrobienia | Średni |
| 8 | Aplikacje mobilne (iOS + Android) | [08-mobile.md](./08-mobile.md) | 🔲 Do zrobienia | Planowane |
| 9 | White-label + multi-branża | [09-white-label.md](./09-white-label.md) | 🔲 Do zrobienia | Planowane |

> **Uwaga:** Fazy 1 (Supabase + auth) i 2 (XML parser) z oryginalnego planu zostały zrealizowane jako fazy 0b i 0d.
> Fazy 5 (push), 6 (gamifikacja bazowa) i 7 (admin panel bazowy) też zrealizowane jako 0l, 0k, 0h.
> Pozostałe fazy 3–9 dotyczą rozszerzeń ponad to co jest obecnie zaimplementowane.
