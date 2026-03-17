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

## Faza 3 — AI Auto-generowanie opisów ofert

**Co zrobiono:**
- Moduł `src/lib/generate-offer-content.ts` — prompt Gemini generuje `short_description`, `full_description`, `pros`, `cons`, `faq`, `conditions` w tonie „CebulaZysku"
- Endpoint `GET/POST /api/cron/generate-descriptions` — przetwarza 3 oferty per run, 4s delay między wywołaniami
- Schedule: 3× w nocy (1:15, 1:30, 1:45 UTC) = 9 ofert na noc
- Sync resetuje `ai_generated_at = null` gdy treść feedu zmieni się — oferta trafia do ponownej generacji
- Migracja `013_ai_descriptions.sql`: kolumna `ai_generated_at` + indeks na oferty czekające na generację
- Parametr `maxOutputTokens: 3000` w `askGemini()` — rozwiązuje problem ucinania JSON przez Gemini
- Admin: kolumna „AI opisy", filtr „Bez AI (N)", przycisk ręcznej generacji przeniesiony do zakładki Feed / Jakość

📄 Szczegóły: [29-ai-descriptions.md](./29-ai-descriptions.md)

---

## Faza 4 — Filtr „mam konto" + Onboarding

**Co zrobiono:**
- Tabela `user_banks` (migracja `014_user_banks.sql`) z RLS — każdy user zarządza tylko swoją listą banków
- `UserBanksContext` — context z `hasBank()`, `addBank()`, `removeBank()`, `setBanks()`, `isLoaded`
- Ekran onboardingu `/onboarding` — grid z bankami po rejestracji, zapis w bulk, możliwość pominięcia
- `rejestracja/page.tsx` — redirect po rejestracji zmieniony z `/dashboard` na `/onboarding`
- `OfferFilters.tsx` — filtr „Ukryj: moje banki" (widoczny tylko gdy user ma zapisane banki)
- `OfferCard.tsx` — szara wstążka „Masz konto" na kartach ofert z banków z listy
- `dashboard/page.tsx` — sekcja „Moje banki" z możliwością usuwania banków i linkiem do edycji

📄 Szczegóły: [31-user-banks-onboarding.md](./31-user-banks-onboarding.md)

---

## Faza 0p — Nocny Quality Check Cron

**Co zrobiono:**
- Endpoint `GET /api/cron/quality-check` — scraping 5 ofert per run, porównanie kwoty premii ze strony banku vs. bazy
- 12 uruchomień na noc (co 30 min, 2:00–7:00 UTC) × 5 ofert = 60 sprawdzeń — skaluje się dla dowolnej liczby ofert
- Flagi wynikowe: `reward_mismatch`, `page_unreachable`, `page_js_only`, `checked_reward`, `last_checked_at`
- Próg niezgodności: 50 zł (mniejsze różnice ignorowane)
- Rercheck: oferty sprawdzane nie częściej niż raz na 22h
- Admin: filtr „Niezgodności" w Feed / Jakość pokazuje oferty z `reward_mismatch` lub `page_unreachable`

📄 Szczegóły: [30-quality-cron.md](./30-quality-cron.md)

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

---

## Faza 5 — Parser warunków z feedu + dynamiczny OpenRouter

**Co zrobiono:**

### Parser warunków z Leadstar (bez AI)
- Nowy moduł `src/lib/parse-leadstar-conditions.ts` — deterministyczny parser tekstu (regex)
- Parsuje `leadstar_benefits_html` na strukturalne `Condition[]` podczas synca
- Wykrywa 12 typów warunków: `transfer`, `card_payment`, `blik_payment`, `income`, `standing_order`, `direct_debit`, `mobile_app_login`, `online_payment`, `contactless_payment`, `setup`, `savings`, `other`
- Wykrywa liczbę wymaganych transakcji, miesięcy, warunki "perMonth"
- Dziedziczenie kontekstu miesięcznego z bloków nadrzędnych (np. "W każdym z 5 kolejnych miesięcy:")
- Deduplication — merguje duplikaty tego samego typu
- Odpalany automatycznie w `sync-offers/route.ts` — tracker działa od razu po syncu

### Rozdzielenie odpowiedzialności AI vs Feed
- `generate-offer-content.ts` — AI generuje TYLKO `short_description`, `full_description`, `pros`, `cons`, `faq`
- `conditions` usunięte z interfejsu `GeneratedOfferContent` i z AI prompta
- `cron/generate-descriptions` — nie nadpisuje `conditions` w bazie
- Sync respektuje `locked_fields` — ręcznie edytowane warunki nie są nadpisywane

### Nowe typy warunków
- `ConditionType` rozszerzony o `setup`, `savings`, `other`
- Ikony: `UserPlus` (setup), `PiggyBank` (savings), `ListChecks` (other)
- Zaktualizowane: `ConditionTracker.tsx`, `OfferCard.tsx`, `banks.ts`

### Dynamiczny OpenRouter
- `ai-client.ts` — zamiast hardkodowanej listy modeli, pobiera dynamicznie z `https://openrouter.ai/api/v1/models`
- Sortuje po cenie (najtańsze najpierw), automatycznie aktualizuje się gdy zmieniają się ceny
- Cache 1h, limit $2/M tokenów
- Fallback na ostatnio zcachowaną listę gdy API niedostępne

### Backfill
- Jednorazowy skrypt backfillujący warunki dla 13 ofert bez conditions
- 3 oferty bez parsowanych warunków (VeloBank — ogólne opisy, mBank "do wyboru" — brak HTML)

**Zmienione pliki:**
- `src/lib/parse-leadstar-conditions.ts` (NOWY)
- `src/lib/ai-client.ts` — dynamiczne modele OpenRouter
- `src/lib/generate-offer-content.ts` — usunięte conditions z AI
- `src/app/api/sync-offers/route.ts` — parser warunków przy syncu
- `src/app/api/cron/generate-descriptions/route.ts` — nie nadpisuje conditions
- `src/data/banks.ts` — nowe typy + ikony
- `src/components/ConditionTracker.tsx` — nowe ikony
- `src/components/OfferCard.tsx` — nowe ikony
- `scripts/test-generate.ts` — usunięte conditions

---

## Faza 7 — CebulaZysku v2 (Compliance, SEO, UX, Growth)

**Co zrobiono:**

### Compliance
- Strony prawne: `/polityka-prywatnosci`, `/regulamin`, `/o-nas`, `/kontakt` z `generateMetadata()`
- Zmiana messagingu: "Zarabiaj" → "Porównaj promocje", "Zacznij zarabiać" → "Sprawdź oferty"
- DisclaimerBanner na stronie głównej (charakter informacyjny, nie doradztwo finansowe)
- Checkbox akceptacji regulaminu i polityki w rejestracji
- Footer z linkami do stron prawnych

### SEO
- Server Components refactor (page.tsx, oferta/[slug])
- `generateStaticParams()` + `generateMetadata()` na stronach ofert
- JSON-LD: WebSite (strona główna), FAQPage + BreadcrumbList (oferty), Article (blog)
- `metadataBase` w layout.tsx, canonical URLs, usunięte `keywords`

### UX/UI
- OfferFilters — filtrowanie po trudności, sortowanie po kwocie/terminie
- Breadcrumbs na stronach ofert
- Data aktualizacji (`lastUpdated`) na kartach i stronach ofert
- "Zobacz też inne oferty" — 2-3 powiązane na stronie oferty
- Custom 404 (`not-found.tsx`)
- Social proof na landing page
- Sugerowane oferty na pustym dashboardzie

### Growth
- Blog infrastruktura (`/blog`, `/blog/[slug]` z `generateStaticParams`, JSON-LD Article)
- Dark mode (next-themes, ThemeToggle w Navbar)
- TrackingPixels (GA4, Meta Pixel, warunkowe renderowanie z env vars)

📄 Szczegóły: [tasks/prd-cebulazysku-v2.md](../tasks/prd-cebulazysku-v2.md) | [tasks/tasks-cebulazysku-v2.md](../tasks/tasks-cebulazysku-v2.md)

---

## Faza 8 — Video Ads (Remotion + ElevenLabs TTS)

**Co zrobiono:**

### Remotion Video
- Komponent `src/remotion/OfferVideo.tsx` — 6 scen, ~70 sekund, format 9:16 (1080×1920), 30fps
- Sceny: IntroScene → BankScene → ConditionsScene → ProblemScene → TrackerScene → CtaScene
- Proportional scene timing (procenty: 9/15/35/57/92%) — działa dla wszystkich ofert niezależnie od długości voiceover
- LOGO_MAP — mapowanie hashy z leadmax URL na lokalne pliki PNG
- Watermark z logo cebulazysku.pl (80px, opacity 0.5) w prawym górnym rogu
- Background music (jingle.mp3)

### ElevenLabs TTS
- Daniel voice (`onwK4e9ZLuTAKqWW03F9`), model `eleven_multilingual_v2`, Polish
- `sanitizeForTTS()` — konwersja skrótów przed wysłaniem do API:
  - "5x" → "5 razy", "min." → "minimum", "maks." → "maksimum"
  - "mies." → "miesięcznie", "zł/mies." → "złotych miesięcznie"
  - "zł" → "złotych", "nr." → "numer", "tys." → "tysięcy", "r." → "roku"
- Batch generator: `scripts/generate-all-voiceovers.mjs`
- 9 voiceovers wygenerowanych (62-70s każdy)

### Player
- `OfferVideoPlayer.tsx` — @remotion/player z play/pause, inline na stronie oferty
- Server-side check: voiceover wyświetlany tylko gdy plik MP3 istnieje (`existsSync`)

### Status
- ⚠️ 9 istniejących voiceovers wymaga regeneracji z poprawką sanitizeForTTS()
- ⚠️ Blokowane limitem ElevenLabs free tier (10k chars/month)
- 🔲 Unikalne video per bank (kolory, copy, wariant z napisami TikTok)
- 🔲 Server-side rendering do MP4

📄 Szczegóły: [tasks/prd-video-ads.md](../tasks/prd-video-ads.md) | [tasks/tasks-video-ads.md](../tasks/tasks-video-ads.md)

---

## Faza: Optymalizacja Contentu i Research Video (Marzec 2026)

**Co zrobiono:**

### Optymalizacja Contentu (AI + Markdown)
- **Markdown w opisach:** Wdrożenie obsługi Markdown (**bold**, listy, nagłówki ##) w promptach AI i renderowaniu frontendowym (`RenderMarkdown.tsx`).
- **Stylizacja Emerald:** Pogrubienia w Markdown są automatycznie kolorowane na `text-emerald-600` dla zachowania spójności brandu.
- **Dekodowanie HTML:** Mapper `decodeAndFormatDescription` w `offers.ts` poprawnie czyści encje HTML, zachowując strukturę Markdown.

### Strategia SEO & Content
- **Treść Rankingu:** Przygotowanie rozbudowanej sekcji tekstowej pod listę ofert na `/ranking` (FAQ, Metodologia, Słowniczek Cebularza).
- **Plan Blogowy:** Opracowanie listy Top 10 tematów blogowych (EEAT) targetujących frazy informacyjne i budujących zaufanie.
- **Meta Tags:** Optymalizacja tytułów i opisów meta dla kluczowych podstron (`/`, `/ranking`, `/jak-to-dziala`) z użyciem dynamicznych placeholderów.

### Research: Server-side Remotion Rendering
- **Analiza opcji:** Porównanie Remotion Lambda (AWS) vs. GitHub Actions vs. Self-hosted.
- **Rekomendacja:** Wybór **GitHub Actions** jako optymalnego, darmowego silnika do generowania plików MP4 dla MVP (automatyzacja przez workflow_dispatch/webhooks).
- **Infrastruktura:** Propozycja zapisu wideo na Cloudflare R2.

📄 Szczegóły: `/research/content/`, `/research/remotion-rendering.md`

---

## Faza: Stabilizacja Danych i Automatyzacja Contentu (Marzec 2026)

**Co zrobiono:**

### Optymalizacja Parserów (Deterministic logic)
- **Parser Warunków:** Naprawiono krytyczne błędy w `src/lib/parse-leadstar-conditions.ts`. Parser obsługuje teraz:
  - Kwoty ze spacjami i kropkami (np. `1.500 zł`) oraz inteligentne usuwanie groszy (tylko po separatorze).
  - Zagnieżdżone listy `<li>` i podpunkty literowe `a)`, `b)` jako osobne akcje.
  - Szeroki słownik czasowników akcji (*zaloguj, płać, aktywuj, pobierz, otwórz*).
  - Dziedziczenie kontekstu miesięcznego z bloków nadrzędnych do podpunktów.
- **Lektor (TTS):** Naprawiono funkcję `sanitizeForTTS` w `src/lib/elevenlabs.ts`. Poprawiono kolejność zamian (np. `zł/mies` przed `zł`), dodano obsługę Unicode i flagę `insensitive`. Wszystkie 16 testów przechodzi pomyślnie.

### Automatyzacja i Narzędzia (`scripts/`)
- **Generator Voiceoverów:** Stworzono nowy skrypt `scripts/generate-all-voiceovers.ts` (TS), który importuje logikę bezpośrednio z `lib`. Dodano obsługę flagi `--force` oraz zaawansowane czyszczenie nazw banków.
- **Import Bloga:** Stworzono skrypt `scripts/import-blog-drafts.ts` do masowego wrzucania szkiców Markdown do bazy danych przez API admina.
- **Testy Jednostkowe:** Rozszerzono zestaw testów parsera do 17 kompleksowych przypadków w `scripts/test-parser.ts`.

### SEO i Content
- **Blog:** Napisano 3 kompletne artykuły (Bezpieczeństwo, Podatki, Zamykanie konta) w `/research/content/blog-drafts/`.
- **Meta Tagi:** Zaimplementowano dynamiczne metadane (generateMetadata) na Stronie Głównej (z kwotą `totalEarnings`), Blogu, Ofertach i Dashboardzie.

### Standardy Współpracy (Gemini + Claude)
- **Tablica Zadań:** Wdrożono `AI-TASKS.md` jako centralny punkt koordynacji między modelami AI.
- **Zasada CAT:** Wprowadzono obowiązek weryfikacji plików po edycji (`cat | head`), aby zapobiec wyciekowi artefaktów narzędziowych do kodu.

📄 Szczegóły: `scripts/`, `/research/content/blog-drafts/`, `AI-TASKS.md`

// @cebulazysku.pl/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_15817684.js.map Gemini CLI (gemini-3-pro-preview) | 2026-03-14 — Dokumentacja fazy stabilizacji danych

---

## Faza: Analytics, GTM i Consent Mode (Marzec 2026)

**Co zrobiono:**

### Infrastruktura Analityczna (GTM)
- Skonfigurowano w 100% asynchroniczny i bezpieczny ekosystem śledzący za pośrednictwem **Google Tag Manager** (zastąpienie hardcoded pikseli z `TrackingPixels.tsx`).
- Przygotowano gotowy kontener JSON (`config/gtm-container-cebulazysku.json`) zawierający strukturę zintegrowaną z 7 platformami: GA4, Meta, TikTok, X (Twitter), LinkedIn, Google Ads, Microsoft Ads.
- Opracowano pełen wykaz DataLayer Events (e-commerce + gamifikacja/custom events aplikacji) w `docs/40-analytics-gtm.md`.
- Zaimplementowano reguły Google Consent Mode v2 bezpośrednio na poziomie reguł GTM (`analytics_storage` i `ad_storage`).

### Jakość Śledzenia (Enhanced Conversions)
- Wdrożono dokumentację dotyczącą przesyłania zahashowanych danych użytkowników (SHA-256 email) przy leadach i logowaniach dla platform Ads w celu lepszej atrybucji.
- Zaktualizowano Politykę Prywatności (`research/privacy-policy-cookies.md`) pod kątem RODO i listy platform zewnętrznych z jakich korzysta GTM.

### Rozwój Narzędzi i Danych
- Rozbudowano i sfinalizowano testy jednostkowe `parseLeadstarConditions` (ponad 21 udokumentowanych edge-case'ów z wynikami `pass`). 
- Przeprowadzono **Audyt Lighthouse na Produkcji** (wynik w `research/lighthouse-audit.md`), wyodrębniając szybkie poprawki do implementacji przez zespół developerski (LCP, a11y dla buttonów).

// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17 — Zapis infrastruktury analitycznej i wyników audytów
