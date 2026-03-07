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
| 1 | Supabase + prawdziwy auth + DB tracker | [05-fazy-planowane.md](./05-fazy-planowane.md#faza-1) | 🔲 Do zrobienia | Wysoki |
| 2 | XML parser LeadStar + tabela ofert + cron | [05-fazy-planowane.md](./05-fazy-planowane.md#faza-2) | 🔲 Do zrobienia | Wysoki |
| 3 | Auto-generowanie opisów (AI + cebulowy ton) | [05-fazy-planowane.md](./05-fazy-planowane.md#faza-3) | 🔲 Do zrobienia | Wysoki |
| 4 | Filtr „mam konto" + onboarding | [05-fazy-planowane.md](./05-fazy-planowane.md#faza-4) | 🔲 Do zrobienia | Średni |
| 5 | Powiadomienia email + push | [05-fazy-planowane.md](./05-fazy-planowane.md#faza-5) | 🔲 Do zrobienia | Średni |
| 6 | Gamifikacja, streaki, rankingi | [06-gamifikacja.md](./06-gamifikacja.md) | 🔲 Do zrobienia | Średni |
| 7 | Panel administracyjny | [07-admin-panel.md](./07-admin-panel.md) | 🔲 Do zrobienia | Średni |
| 8 | Aplikacje mobilne (iOS + Android) | [08-mobile.md](./08-mobile.md) | 🔲 Do zrobienia | Planowane |
| 9 | White-label + multi-branża | [09-white-label.md](./09-white-label.md) | 🔲 Do zrobienia | Planowane |
