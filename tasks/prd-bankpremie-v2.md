# PRD: BankPremie v2 – Compliance, SEO, UX & Growth

## 1. Introduction / Overview

BankPremie to serwis porównujący promocje bankowe w Polsce, umożliwiający użytkownikom śledzenie postępów spełniania warunków promocji. Wersja v1 zawiera landing page, strony ofert, auth, dashboard i tracker.

**Problem:** Obecna wersja ma krytyczne braki uniemożliwiające uruchomienie płatnych reklam (Google Ads, Meta Ads) oraz ograniczenia SEO, które utrudniają organiczną widoczność.

**Cel v2:** Dostosować serwis do wymogów compliance (prawne + polityki reklamowe), poprawić SEO (server-side rendering, structured data), ulepszyć UX/UI i przygotować infrastrukturę growth (blog, dark mode, tracking pixels).

## 2. Goals

1. **Compliance:** Strona spełnia wymogi RODO, UOKiK, Google Ads Financial Services policy i Meta Ads policy – reklamy nie będą odrzucane.
2. **SEO:** Strony ofert są pre-renderowane server-side, mają unikalne meta tagi, JSON-LD structured data, canonical URLs – widoczność w Google.
3. **UX/UI:** Użytkownik może filtrować/sortować oferty, widzi breadcrumbs, daty aktualizacji, social proof – wyższy conversion rate.
4. **Growth:** Infrastruktura bloga gotowa do publikacji artykułów SEO, dark mode, placeholdery tracking pixels.
5. **Quality Score:** Landing page spełnia wymagania Google Ads Quality Score ≥ 7/10.

## 3. User Stories

### Compliance
- Jako użytkownik, chcę przeczytać politykę prywatności i regulamin przed rejestracją, aby wiedzieć jak przetwarzane są moje dane.
- Jako użytkownik, chcę widzieć wyraźny disclaimer o charakterze informacyjnym serwisu, aby nie mylić go z doradztwem finansowym.
- Jako użytkownik, chcę mieć możliwość kontaktu z serwisem, aby zgłaszać pytania.

### SEO
- Jako bot Google, chcę widzieć pełną treść strony oferty w HTML response (SSR), aby poprawnie ją zaindeksować.
- Jako bot Google, chcę widzieć structured data (FAQPage, BreadcrumbList), aby wyświetlać rozszerzone snippety.
- Jako użytkownik social media, chcę widzieć ładny podgląd linku (OG tags), kiedy ktoś udostępnia ofertę.

### UX/UI
- Jako użytkownik, chcę filtrować oferty po trudności i sortować po kwocie premii, aby szybko znaleźć odpowiednią.
- Jako użytkownik, chcę widzieć datę aktualizacji oferty, aby wiedzieć że dane są aktualne.
- Jako użytkownik, chcę widzieć inne powiązane oferty na stronie oferty, aby porównać alternatywy.

### Growth
- Jako właściciel serwisu, chcę mieć sekcję blogową gotową do publikacji artykułów, aby budować ruch organiczny.
- Jako użytkownik, chcę przełączać między jasnym i ciemnym motywem.
- Jako właściciel, chcę mieć placeholdery dla Meta Pixel i Google Ads tag, aby szybko uruchomić kampanie.

## 4. Functional Requirements

### Faza 1 – Compliance (BLOKUJĄCE)
1. Stworzyć stronę `/polityka-prywatnosci` z treścią RODO-compliant (wzorcowa, do weryfikacji przez prawnika).
2. Stworzyć stronę `/regulamin` z treścią regulaminu serwisu porównawczego (wzorcowa).
3. Stworzyć stronę `/kontakt` z formularzem kontaktowym (frontend-only, bez backendu) oraz danymi kontaktowymi.
4. Dodać stronę `/o-nas` z opisem serwisu, misją i informacją o modelu afiliacyjnym.
5. Zmienić messaging w całym serwisie:
   - ❌ "Zarabiaj na promocjach bankowych" → ✅ "Porównaj promocje bankowe i odbieraj premie"
   - ❌ "Zacznij zarabiać" → ✅ "Sprawdź oferty" / "Porównaj promocje"
   - ❌ "Gotowy, żeby zacząć zarabiać?" → ✅ "Gotowy na premie bankowe?"
   - ❌ "darmowe pieniądze bank" (keyword) → usunąć
   - Zachować "Zyskaj nawet X zł z promocji bankowych" – z disclaimerem
6. Dodać widoczny disclaimer na stronie głównej (banner pod hero lub nad ofertami): "Serwis ma charakter informacyjny i nie stanowi doradztwa finansowego. Przedstawione oferty mogą ulec zmianie. Szczegóły na stronach banków."
7. Dodać checkbox akceptacji regulaminu i polityki prywatności w formularzu rejestracji.
8. Dodać linki do stron prawnych w footerze.
9. Poprawić literówkę "ponosissz" → "ponosisz" w `/oferta/[slug]/page.tsx`.

### Faza 2 – SEO
10. Przerobić `/app/page.tsx` (strona główna) na Server Component – wydzielić interaktywne elementy do Client Components.
11. Przerobić `/app/oferta/[slug]/page.tsx` na Server Component z `generateStaticParams()` i `generateMetadata()`.
12. Dodać JSON-LD structured data:
    - `WebSite` schema na stronie głównej
    - `FAQPage` schema na stronach ofert (generuje FAQ rich snippets w Google)
    - `BreadcrumbList` schema na stronach ofert
13. Usunąć `<meta keywords>` z layoutu (ignorowane przez Google, wygląda jak spam).
14. Dodać canonical URLs na stronach ofert.
15. Dodać `generateMetadata()` na stronach: jak-to-dziala, kontakt, o-nas, polityka, regulamin.

### Faza 3 – UX/UI
16. Dodać komponent filtrów/sortowania na stronie głównej:
    - Filtr: trudność (łatwy, średni, trudny) – multi-select
    - Sortowanie: kwota premii (rosnąco/malejąco), termin (najbliższy), trudność
17. Dodać breadcrumbs na stronie oferty (Strona główna > Oferty > [Nazwa banku]).
18. Dodać pole `lastUpdated` do danych ofert i wyświetlać "Zaktualizowano: DD.MM.RRRR" na karcie i stronie oferty.
19. Dodać sekcję "Zobacz też" na stronie oferty – 2-3 inne oferty (podobna trudność lub featured).
20. Stworzyć `/app/not-found.tsx` z przyjaznym komunikatem i linkiem do strony głównej.
21. Dodać sekcję social proof na landing page: "Dołącz do X użytkowników śledzących promocje" (mock counter).
22. Dodać sugerowane oferty na pustym dashboard ("Polecamy na start").

### Faza 4 – Growth
23. Stworzyć infrastrukturę bloga: `/app/blog/page.tsx` (lista artykułów), `/app/blog/[slug]/page.tsx` (artykuł), dane w `/data/blog.ts`.
24. Dodać dark mode z `next-themes`: ThemeProvider, przełącznik w navbarze.
25. Dodać placeholdery tracking pixels w `layout.tsx` z env variables:
    - `NEXT_PUBLIC_META_PIXEL_ID`
    - `NEXT_PUBLIC_GOOGLE_ADS_ID`
    - `NEXT_PUBLIC_TIKTOK_PIXEL_ID`
26. Dodać komponent `TrackingScripts` ładowany warunkowo gdy env variables są ustawione.

## 5. Non-Goals (Out of Scope)

- Backend / baza danych – pozostajemy przy localStorage mock
- Prawdziwe przetwarzanie płatności
- Prawdziwe linki afiliacyjne (zostają `#` placeholdery)
- Testy jednostkowe/integracyjne
- i18n / wielojęzyczność
- PWA / push notifications
- Treści artykułów blogowych (tylko infrastruktura + 1 placeholder)

## 6. Design Considerations

- Zachować obecny design system: shadcn/ui + TailwindCSS + Lucide icons
- Dark mode: użyć CSS variables z shadcn/ui (już skonfigurowane w globals.css)
- Disclaimer banner: subtelny, ale widoczny – jasnoszare tło, mały tekst, ikona info
- Filtry: inline nad kartami ofert, nie sidebar (mobile-first)
- Breadcrumbs: tekst z separatorami `/`, nie komponent UI

## 7. Technical Considerations

- Przerobienie na Server Components wymaga wydzielenia `useAuth()` / `useTracker()` hooks do dedykowanych Client Components
- `generateStaticParams()` powinno iterować po `bankOffers` – statyczne generowanie stron ofert
- JSON-LD: renderować jako `<script type="application/ld+json">` w Server Components
- `next-themes`: wymaga wrappera w `providers.tsx` i `suppressHydrationWarning` na `<html>`
- Tracking pixels: Script component Next.js z `strategy="afterInteractive"`

## 8. Success Metrics

1. **Google Ads:** Reklamy przechodzą review bez odrzuceń w kategorii Financial Services
2. **Meta Ads:** Reklamy przechodzą review bez oznaczenia "Misleading claims"
3. **SEO:** Strony ofert są w pełni renderowane server-side (sprawdzić: View Source w przeglądarce)
4. **Lighthouse:** Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90
5. **Quality Score:** Landing page experience ≥ "Above average" w Google Ads

## 9. Open Questions

1. Czy treści prawne (polityka prywatności, regulamin) wymagają weryfikacji przez prawnika przed publikacją? (Rekomendacja: tak)
2. Czy potrzebna jest wersja anglojęzyczna w przyszłości?
3. Jakie konkretne dane kontaktowe (email, adres) mają być na stronie kontaktowej?
4. Czy serwis będzie zarejestrowany jako działalność gospodarcza? (wpływa na treść regulaminu)
