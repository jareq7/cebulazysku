# 4. Fazy zrealizowane — szczegóły

[← Powrót do spisu treści](./README.md) | [Roadmapa](./03-roadmap.md)

---

## Faza 0 — Rebranding

**Co zrobiono:**
- Zmieniono nazwę serwisu z „BankPremie" na „CebulaZysku" we **wszystkich** plikach
- Zaktualizowano domenę z `bankpremie.pl` na `cebulazysku.pl` we wszystkich URL-ach
- Nowa paleta kolorów CSS (oklch) — ciepłe odcienie amber/brąz w light mode, złoto-brązowe w dark mode
- Gradient logo: `from-amber-600 to-orange-500`
- Wszystkie `text-green-*` i `bg-green-*` zamienione na `text-amber-*` / `bg-amber-*` (poza semantycznym green-500 na checkmarkach)
- Cebulowy język w hero, CTA, sekcjach, badge'ach:
  - „Obierz premie bankowe warstwa po warstwie"
  - „Jak cebula — każda warstwa to kolejny zysk"
  - „🧅 ofert do ołupienia"
  - „Łupimy banki legalnie!"
  - „cebularze" (użytkownicy)

**Zmienione pliki (24):**
- `globals.css` — paleta kolorów light + dark
- `layout.tsx` — metadata, OG, metadataBase
- `page.tsx` — hero, stats, how-it-works, offers, social proof, trust, CTA
- `Navbar.tsx`, `Footer.tsx` — logo, linki, copyright
- `DisclaimerBanner.tsx` — treść disclaimera
- `OfferCard.tsx`, `OfferTrackingActions.tsx`, `ConditionTracker.tsx` — kolory
- `o-nas/page.tsx`, `regulamin/page.tsx`, `polityka-prywatnosci/page.tsx`, `kontakt/page.tsx` — branding
- `logowanie/page.tsx`, `rejestracja/page.tsx` — kolory, linki
- `jak-to-dziala/page.tsx` — kolory, ikony
- `oferta/[slug]/page.tsx` — kolory, URL-e canonical
- `blog/[slug]/page.tsx` — publisher name, URL-e
- `sitemap.ts`, `robots.ts` — domena
- `banks.ts` — kolor badge'a difficulty
- `blog.ts` — nazwa autora
- `README.md` — tytuł, opis

---

## Faza 0b — Migracja ofert do Supabase

**Co zrobiono:**
- Wzbogacono 18 ofert LeadStar w Supabase o logo, affiliate URL, reward z pliku XML
- Przeniesiono 8 ofert z `banks.ts` do Supabase (conditions, FAQ, pros, cons)
- Deduplikacja: merge 6 ofert ręcznych z LeadStar (→ `source: "hybrid"`), DELETE duplikatów
- Wynik: **20 ofert w bazie** (16 LeadStar/hybrid + 2 manual + 2 hybrid)
- Frontend przestawiony na fetch z Supabase REST API (z fallbackiem na `banks.ts`)
- Nowy moduł: `src/lib/offers.ts` (server-side fetch)
- Nowy hook: `src/hooks/useOffers.ts` (client-side fetch)
- Strony `page.tsx`, `sitemap.ts`, `oferta/[slug]/page.tsx`, `dashboard/page.tsx` — async fetch

📄 Szczegóły: [13-migracja-supabase-offers.md](./13-migracja-supabase-offers.md)

---

## Faza 0c — Logo i kolorystyka

**Co zrobiono:**
- Wstawiono logo PNG (`public/logo-icon.png`) do Navbara (36px) i Footera (28px)
- Zmieniono kolorystykę z `amber/orange` na `emerald/green` w **15 plikach**
- Gradient: `from-amber-600 to-orange-500` → `from-emerald-700 to-green-500`
- Poprawka pisowni: „obięramy" → „obieramy"
- Sprawdzono pisownię na wszystkich stronach

📄 Szczegóły: [14-logo-kolorystyka.md](./14-logo-kolorystyka.md)

---

## Faza 0l — Push notyfikacje

**Co zrobiono:**
- Tabela `push_subscriptions` z RLS
- `PushNotificationToggle` — przycisk włącz/wyłącz na dashboard
- Service worker: `push` + `notificationclick` handlers
- API: `/api/push/subscribe` (POST/DELETE), `/api/admin/push/send` (POST)
- Admin panel: `/admin/push` — formularz masowego wysyłania
- Auto-cleanup wygasłych subskrypcji (410/404)
- Biblioteka `web-push` do wysyłania z serwera

📄 Szczegóły: [23-push-notyfikacje.md](./23-push-notyfikacje.md)

---

## Faza 0k — Gamifikacja (streaki, odznaki)

**Co zrobiono:**
- Tabele `user_streaks` i `user_achievements` z RLS
- 13 odznak w 4 kategoriach (oferty, streak, pieniądze, specjalne)
- Streak tracking z auto-bump przy wejściu na dashboard
- Komponenty `StreakBadge` + `AchievementsList` na dashboard
- API: `/api/gamification/streak` (GET/POST), `/api/gamification/achievements` (GET/POST)

📄 Szczegóły: [22-gamifikacja.md](./22-gamifikacja.md)

---

## Faza 0j — PWA (Progressive Web App)

**Co zrobiono:**
- `public/manifest.json` — standalone, emerald theme, ikony 192/512
- `public/sw.js` — network-first, cache fallback, offline support
- Ikony wygenerowane z logo-icon.png (192x192, 512x512)
- Metatagi: manifest, themeColor, appleWebApp w layout.tsx
- `ServiceWorkerRegister` komponent z rejestracją SW

📄 Szczegóły: [21-pwa.md](./21-pwa.md)

---

## Faza 0i — Blog dynamiczny (Supabase)

**Co zrobiono:**
- Tabela `blog_posts` z RLS (anon SELECT published, service_role full)
- `src/lib/blog.ts` — `getPublishedPosts()`, `getPostBySlug()`
- Blog listing i detail z ISR (5 min) + fallback na statyczne dane
- Admin CRUD: `/admin/blog` — tworzenie, edycja, publikacja, usuwanie
- API: `/api/admin/blog` (GET/POST/PATCH/DELETE)
- Auto-generowanie slug z tytułu, tagi jako PostgreSQL `TEXT[]`

📄 Szczegóły: [20-blog-dynamiczny.md](./20-blog-dynamiczny.md)

---

## Faza 0h — Admin Panel (/admin)

**Co zrobiono:**
- Layout z auth gate (hasło z env var `ADMIN_PASSWORD`)
- Dashboard: statystyki ofert, wiadomości, sync
- Lista ofert z wyszukiwarką i statusem
- Logi sync XML + przycisk ręcznego sync
- Wiadomości kontaktowe z oznaczaniem przeczytanych
- 6 API routes w `/api/admin/*`

📄 Szczegóły: [19-admin-panel.md](./19-admin-panel.md)

---

## Faza 0g — Backend formularza kontaktowego

**Co zrobiono:**
- API route `POST /api/contact` z walidacją, rate limitingiem i honeypot
- Frontend z loading/error states, przycisk z spinnerem
- Tabela `contact_messages` w Supabase (SQL migracja gotowa)
- RLS: anon INSERT, service_role full access

📄 Szczegóły: [18-backend-kontakt.md](./18-backend-kontakt.md)

---

## Faza 0f — Audyt UX/UI

**Co zrobiono:**
- Pełny audyt UX/UI (10 problemów zidentyfikowanych i naprawionych)
- CSS variables amber→green (globals.css)
- Favicon z logo
- CTA hero → #oferty zamiast /rejestracja
- Logo banków na kartach ofert i stronie szczegółów
- Ukrywanie pustych sekcji (warunki, pros/cons)
- Loading skeleton (loading.tsx)
- Social proof — usunięto fałszywą liczbę
- Mobile menu: auto-close na resize, Escape key, aria-expanded
- Checkbox rejestracji → shadcn Checkbox
- Skip-to-content link + aria labels

📄 Szczegóły: [17-audyt-ux-ui.md](./17-audyt-ux-ui.md)

---

## Faza 0e — SEO & Analytics

**Co zrobiono:**
- Zamieniono zakomentowany placeholder `TrackingPixels.tsx` na działający komponent z env vars
- Google Analytics 4 (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- Google Search Console verification (`NEXT_PUBLIC_GSC_VERIFICATION`)
- Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`)
- Warunkowe renderowanie — brak env var = brak skryptu

📄 Szczegóły: [16-seo-analytics.md](./16-seo-analytics.md)

---

## Faza 0d — Automatyczny sync XML (Vercel Cron)

**Co zrobiono:**
- Utworzono `vercel.json` z cron schedule (`0 6 * * *` — codziennie o 6:00 UTC)
- Refaktor `sync-offers/route.ts`: wyodrębniono `runSync()`, dodano GET handler dla Vercel Cron
- Obsługa `CRON_SECRET` (Vercel) obok istniejącego `SYNC_SECRET` (ręczne)
- Soft delete: oferty nieobecne w feedzie XML → `is_active = false`
- Logi sync zapisywane w tabeli `sync_log` (z polem `offers_deactivated`)

📄 Szczegóły: [15-auto-sync-xml.md](./15-auto-sync-xml.md)

---

## Faza 0m — AI Reward Parser (Gemini)

**Co zrobiono:**
- Integracja z Google Gemini Flash API (`gemini-2.0-flash`) do automatycznego parsowania kwot premii z opisów HTML ofert LeadStar
- Moduł `src/lib/gemini.ts` — wywołanie Gemini z promptem ekstrakcji kwoty
- Moduł `src/lib/parse-reward.ts` — wrapper z fallbackiem na regex gdy AI niedostępne
- Retry z exponential backoff (3 próby, 4s delay) dla obsługi rate limitów
- Helper `sleep()` eksportowany do użycia w sync route
- Integracja z `/api/sync-offers/route.ts` — 4s delay między wywołaniami AI
- Endpoint testowy `/api/admin/test-reward-parser` do weryfikacji parsera
- Przetestowano na 12/18 ofertach — 11/12 poprawnych wyników

**Napotkane problemy i rozwiązania:**

1. **Gemini API quota = 0** — model `gemini-2.0-flash` zwracał `quota: 0` na darmowym tierze.
   - **Rozwiązanie:** Przełączenie na model `gemini-2.0-flash` z headerem `x-goog-api-key` zamiast `Authorization: Bearer`.

2. **Rate limit 429 errors** — Gemini free tier pozwala na ~20 req/min.
   - **Rozwiązanie:** Dodano retry z exponential backoff (4s, 8s, 16s) w `gemini.ts` + 4s delay między kolejnymi ofertami w sync route.

3. **Test przerwany przez rate limit** — przy testowaniu 18 ofert naraz quota się wyczerpywała.
   - **Rozwiązanie:** Testowano w partiach po 5-6 ofert. 12/18 przetestowanych, pozostałe 6 czeka na reset quota.

4. **Zmiana danych w feedzie** — BNP Paribas zmienił premię z 1000 na 300 PLN między testami.
   - **Rozwiązanie:** To nie był błąd parsera — potwierdzone w feedzie XML. Parser poprawnie odczytał nową kwotę.

📄 Szczegóły: [24-ai-reward-parser.md](./24-ai-reward-parser.md)

---

## Faza 0n — Audyt bezpieczeństwa + poprawki

**Co zrobiono:**
- Pełny audyt bezpieczeństwa aplikacji (sekrety, auth, RLS, middleware, XSS, dependencies)
- Dodano backend auth (`verifyAdmin()`) do **9 endpointów** admin API
- Stworzono `src/lib/admin-auth.ts` — helper sprawdzający header `x-admin-password`
- Stworzono `src/lib/admin-fetch.ts` — frontend helper dodający header auth do każdego fetch
- Zaktualizowano 7 stron admin panelu na `adminFetch()`
- Usunięto wyciek `SYNC_SECRET` z `docs/15-auto-sync-xml.md`
- Przeniesiono LeadStar feed URL do zmiennej `LEADSTAR_FEED_URL` (env var)
- Zamaskowano LeadStar URL w 5 plikach docs
- Dodano rate-limiting na admin login (5 prób/min/IP)
- Zmieniono `sessionStorage` z `"admin_auth" = "true"` na `"admin_password"` z prawdziwym hasłem

**Napotkane problemy i rozwiązania:**

1. **Admin API bez autoryzacji** — wszystkie endpointy `/api/admin/*` (poza `/auth`) były publicznie dostępne. Każdy mógł czytać dane użytkowników, edytować oferty, wysyłać push notyfikacje.
   - **Przyczyna:** Frontend auth opierał się wyłącznie na `sessionStorage` flag. Backend nie weryfikował niczego.
   - **Rozwiązanie:** Stworzono `verifyAdmin()` middleware sprawdzający hasło w headerze `x-admin-password` lub `Authorization: Bearer`. Dodano do każdego handlera GET/POST/PATCH/DELETE w 9 plikach route.ts.

2. **SYNC_SECRET w publicznym repo** — sekret `cebulazysku-sync-2026` był jawnie zapisany w pliku `docs/15-auto-sync-xml.md` (zarówno w tabeli jak i w przykładzie curl).
   - **Przyczyna:** Dokumentacja została napisana z konkretnymi wartościami zamiast placeholderów.
   - **Rozwiązanie:** Zamieniono na `<YOUR_SYNC_SECRET>`. Stary sekret jest skompromitowany (w historii git) — wymaga zmiany w Vercel.

3. **LeadStar feed URL z tokenem w kodzie źródłowym** — pełny URL z `pid`, `code` i `ha` parametrami (tokeny afiliacyjne) był hardcoded w `src/lib/leadstar.ts` i w 5 plikach docs.
   - **Przyczyna:** Przy pierwszej implementacji nie pomyślano o tym jako o sekrecie.
   - **Rozwiązanie:** Przeniesiono do `process.env.LEADSTAR_FEED_URL`. Zamaskowano we wszystkich docs. Dodano do `.env.local` i Vercel env vars.

4. **Brak rate-limit na loginie** — endpoint `/api/admin/auth` przyjmował nieograniczoną liczbę prób hasła.
   - **Przyczyna:** Prosty endpoint — sprawdź hasło, zwróć 200 lub 401. Brak ochrony przed brute-force.
   - **Rozwiązanie:** Dodano in-memory rate-limit 5 prób/min/IP. Uwaga: w serverless (Vercel) to nie jest idealne (cold starts resetują Map), ale znacząco utrudnia automatyczny brute-force.

5. **sessionStorage przechowywał "true" zamiast hasła** — po zalogowaniu frontend zapisywał `sessionStorage.setItem("admin_auth", "true")`, co nie pozwalało na wysyłanie hasła w headerach API.
   - **Rozwiązanie:** Zmieniono na `sessionStorage.setItem("admin_password", password)`. Stworzono `adminFetch()` wrapper który automatycznie dodaje `x-admin-password` header.

6. **Weryfikacja na produkcji** — po deployu przetestowano curlem:
   ```
   curl https://cebulazysku.pl/api/admin/stats → 401 Unauthorized ✅
   ```
   Wcześniej ten endpoint zwracał dane bez żadnej autoryzacji.

📄 Szczegóły: [25-audyt-bezpieczenstwa.md](./25-audyt-bezpieczenstwa.md)

---

## Fazy wcześniejsze (1–4)

Zostały zrealizowane w poprzednich sesjach. Kluczowe deliverables:

### Strony prawne (Compliance)
- `/regulamin` — pełny regulamin serwisu
- `/polityka-prywatnosci` — polityka prywatności zgodna z RODO
- `/o-nas` — opis misji, modelu działania, wartości
- `/kontakt` — formularz kontaktowy + dane

### SEO
- Każda strona ma `generateMetadata` z tytułem, opisem i canonical URL
- JSON-LD na stronach ofert (FAQPage), blogu (Article), breadcrumbs (BreadcrumbList)
- Dynamiczny sitemap generowany z `banks.ts` i `blog.ts`

### UX/UI
- `OfferFilters` — filtrowanie po banku, trudności, sortowanie po premii/trudności
- Breadcrumbs na stronach ofert
- „Zobacz też inne oferty" — 3 powiązane oferty na stronie oferty
- Dashboard empty state z sugestiami łatwych ofert

### Growth
- `/blog` i `/blog/[slug]` — infrastruktura blogowa z SEO
- Dark mode via `next-themes` + `ThemeToggle`
- `TrackingPixels` component (placeholder dla Google Ads i Meta Pixel)
