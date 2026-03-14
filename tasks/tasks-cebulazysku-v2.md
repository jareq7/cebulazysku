# Tasks: CebulaZysku v2 – Compliance, SEO, UX & Growth

## Relevant Files

- `src/app/page.tsx` - Landing page – przerobienie na Server Component, zmiana messagingu, disclaimer, social proof, filtry
- `src/app/oferta/[slug]/page.tsx` - Strona oferty – przerobienie na Server Component, generateMetadata, JSON-LD, breadcrumbs, "Zobacz też"
- `src/app/layout.tsx` - Root layout – usunięcie meta keywords, canonical, tracking pixels, dark mode provider
- `src/app/providers.tsx` - Providers – dodanie ThemeProvider (next-themes)
- `src/app/polityka-prywatnosci/page.tsx` - Nowa strona polityki prywatności
- `src/app/regulamin/page.tsx` - Nowa strona regulaminu
- `src/app/kontakt/page.tsx` - Nowa strona kontaktowa
- `src/app/o-nas/page.tsx` - Nowa strona "O nas"
- `src/app/not-found.tsx` - Custom 404 page
- `src/app/blog/page.tsx` - Lista artykułów blogowych
- `src/app/blog/[slug]/page.tsx` - Strona artykułu blogowego
- `src/app/rejestracja/page.tsx` - Formularz rejestracji – dodanie checkboxa regulaminu
- `src/components/Navbar.tsx` - Nawigacja – dark mode toggle, linki
- `src/components/Footer.tsx` - Stopka – linki do stron prawnych
- `src/components/OfferCard.tsx` - Karta oferty – data aktualizacji
- `src/components/OfferFilters.tsx` - Nowy komponent filtrów/sortowania ofert
- `src/components/OfferTrackingActions.tsx` - Nowy Client Component – wydzielone akcje trackera z offer detail
- `src/components/DisclaimerBanner.tsx` - Nowy komponent disclaimera
- `src/components/JsonLd.tsx` - Nowy komponent renderujący JSON-LD structured data
- `src/components/TrackingScripts.tsx` - Nowy komponent tracking pixels
- `src/components/ThemeToggle.tsx` - Nowy komponent przełącznika dark/light mode
- `src/components/Breadcrumbs.tsx` - Nowy komponent breadcrumbs
- `src/data/banks.ts` - Dane ofert – dodanie pola lastUpdated
- `src/data/blog.ts` - Nowe dane artykułów blogowych (placeholder)

### Notes

- Przerobienie na Server Components wymaga wydzielenia hooków (useAuth, useTracker) do dedykowanych Client Components
- JSON-LD renderowany jako `<script type="application/ld+json">` w Server Components
- Treści prawne są wzorcowe i wymagają weryfikacji przez prawnika

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [x]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

### Faza 1 – Compliance

- [x] 1.0 Strony prawne i informacyjne
  - [x] 1.1 Stworzyć `/app/polityka-prywatnosci/page.tsx` z wzorcową treścią RODO-compliant (klauzula informacyjna, cele przetwarzania, prawa użytkownika, cookies)
  - [x] 1.2 Stworzyć `/app/regulamin/page.tsx` z wzorcową treścią regulaminu serwisu porównawczego (definicje, zasady korzystania, odpowiedzialność, afiliacja)
  - [x] 1.3 Stworzyć `/app/kontakt/page.tsx` z formularzem kontaktowym (frontend-only) i danymi kontaktowymi (placeholder email)
  - [x] 1.4 Stworzyć `/app/o-nas/page.tsx` z opisem serwisu, misją, informacją o modelu afiliacyjnym i disclaimerem
  - [x] 1.5 Dodać `generateMetadata()` z unikalnymi title/description na każdej z tych stron

- [x] 2.0 Zmiana messagingu w całym serwisie
  - [x] 2.1 Zaktualizować hero section na stronie głównej: "Zarabiaj na promocjach bankowych" → "Porównaj promocje bankowe i odbieraj premie"
  - [x] 2.2 Zaktualizować CTA: "Zacznij zarabiać" → "Sprawdź oferty", "Gotowy, żeby zacząć zarabiać?" → "Gotowy na premie bankowe?"
  - [x] 2.3 Zaktualizować meta description i OG tags w layout.tsx – usunąć "zarabiaj", dodać "porównaj", "odbieraj premie"
  - [x] 2.4 Zaktualizować stronę `/jak-to-dziala` – zmienić messaging na umiarkowany
  - [x] 2.5 Usunąć keyword "darmowe pieniądze bank" z meta keywords; usunąć cały `keywords` array (ignorowany przez Google)
  - [x] 2.6 Poprawić literówkę "ponosissz" → "ponosisz" w `/oferta/[slug]/page.tsx`

- [x] 3.0 Disclaimer i consent
  - [x] 3.1 Stworzyć `DisclaimerBanner.tsx` – widoczny banner na stronie głównej (pod hero) z tekstem o charakterze informacyjnym serwisu
  - [x] 3.2 Dodać DisclaimerBanner do strony głównej
  - [x] 3.3 Dodać checkbox akceptacji regulaminu i polityki prywatności w formularzu rejestracji (`/rejestracja/page.tsx`)
  - [x] 3.4 Zablokować submit jeśli checkbox nie jest zaznaczony

- [x] 4.0 Footer update
  - [x] 4.1 Dodać linki do: Polityka prywatności, Regulamin, Kontakt, O nas
  - [x] 4.2 Przeorganizować footer – sekcja "Prawne" obok "Nawigacja"

### Faza 2 – SEO

- [x] 5.0 Server Components refactor
  - [x] 5.1 Przerobić `/app/page.tsx` na Server Component – wydzielić interaktywne elementy (filtry) do Client Component `OfferFilters.tsx`
  - [x] 5.2 Przerobić `/app/oferta/[slug]/page.tsx` na Server Component – wydzielić przycisk trackera do `OfferTrackingActions.tsx` Client Component
  - [x] 5.3 Dodać `generateStaticParams()` w `/app/oferta/[slug]/page.tsx` – iteracja po bankOffers
  - [x] 5.4 Dodać `generateMetadata()` w `/app/oferta/[slug]/page.tsx` – unikalne title, description, OG per oferta

- [x] 6.0 JSON-LD Structured Data
  - [x] 6.1 Stworzyć `JsonLd.tsx` – reusable component renderujący `<script type="application/ld+json">`
  - [x] 6.2 Dodać `WebSite` schema na stronie głównej
  - [x] 6.3 Dodać `FAQPage` schema na stronach ofert (z danych FAQ oferty)
  - [x] 6.4 Dodać `BreadcrumbList` schema na stronach ofert

- [x] 7.0 Meta tagi cleanup
  - [x] 7.1 Usunąć `keywords` z metadata w layout.tsx
  - [x] 7.2 Dodać `metadataBase` w layout.tsx dla canonical URLs
  - [x] 7.3 Dodać `alternates.canonical` w generateMetadata na stronach ofert

### Faza 3 – UX/UI

- [x] 8.0 Filtry i sortowanie ofert
  - [x] 8.1 Stworzyć `OfferFilters.tsx` – Client Component z filtrami trudności (multi-select badge toggle) i sortowaniem (select dropdown: kwota ↑↓, termin, trudność)
  - [x] 8.2 Zintegrować filtry na stronie głównej – filtrowanie i sortowanie listy ofert

- [x] 9.0 Breadcrumbs
  - [x] 9.1 Stworzyć `Breadcrumbs.tsx` – component z linkami i separatorami
  - [x] 9.2 Dodać breadcrumbs na stronie oferty zamiast obecnego linku "Wróć do ofert"
  - [x] 9.3 Dodać BreadcrumbList JSON-LD (połączone z task 6.4)

- [x] 10.0 Data aktualizacji i linkowanie wewnętrzne
  - [x] 10.1 Dodać pole `lastUpdated: string` do interfejsu `BankOffer` w `banks.ts` i uzupełnić daty w danych
  - [x] 10.2 Wyświetlić "Zaktualizowano: DD.MM.RRRR" na `OfferCard.tsx` i na stronie oferty
  - [x] 10.3 Dodać sekcję "Zobacz też inne oferty" na stronie oferty – 2-3 karty powiązanych ofert

- [x] 11.0 Error states i social proof
  - [x] 11.1 Stworzyć `/app/not-found.tsx` – custom 404 z przyjaznym komunikatem i CTA do strony głównej
  - [x] 11.2 Dodać sekcję social proof na landing page (mock: "Ponad 1 200 osób korzysta z CebulaZysku")
  - [x] 11.3 Dodać sugerowane oferty na pustym stanie dashboardu ("Polecamy na start: najłatwiejsze oferty")

### Faza 4 – Growth

- [x] 12.0 Blog infrastruktura
  - [x] 12.1 Stworzyć `src/data/blog.ts` z interfejsem BlogPost i 1 placeholder artykułem
  - [x] 12.2 Stworzyć `/app/blog/page.tsx` – lista artykułów z kartami
  - [x] 12.3 Stworzyć `/app/blog/[slug]/page.tsx` z `generateStaticParams()` i `generateMetadata()`
  - [x] 12.4 Dodać link "Blog" w navbarze i footerze

- [x] 13.0 Dark mode
  - [x] 13.1 Zainstalować `next-themes`
  - [x] 13.2 Dodać `ThemeProvider` w `providers.tsx`, `suppressHydrationWarning` na `<html>`
  - [x] 13.3 Stworzyć `ThemeToggle.tsx` – przełącznik sun/moon w navbarze
  - [x] 13.4 Zweryfikować że shadcn/ui CSS variables obsługują dark mode (globals.css)

- [x] 14.0 Tracking pixels
  - [x] 14.1 Stworzyć `TrackingScripts.tsx` – component ładujący Meta Pixel, Google Ads tag, TikTok Pixel warunkowo z env variables
  - [x] 14.2 Dodać TrackingScripts w layout.tsx
  - [x] 14.3 Dodać `.env.example` z placeholder zmiennymi
  - [x] 14.4 Dodać zmienne do `.env.local` (puste wartości)

- [x] 15.0 Build, test i deploy
  - [x] 15.1 Uruchomić `npm run build` – naprawić ewentualne błędy
  - [x] 15.2 Przetestować wszystkie strony w przeglądarce
  - [x] 15.3 Deploy na Vercel
