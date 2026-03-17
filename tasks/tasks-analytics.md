# Tasks: Analytics — GTM, DataLayer, Consent, Conversion Tracking

> PRD: `tasks/prd-analytics.md`
> Feature branch: `feature/analytics`

---

## Faza 1: GTM + Consent + DataLayer

### 1.0 Create feature branch
- [x] `git checkout -b feature/analytics`
- **Worker:** Claude Code

### 1.1 GTM Provider — replace TrackingPixels
- [x] Refactor `src/components/TrackingPixels.tsx` → GTM snippet only (usunąć hardcoded gtag.js i fbq)
- [x] Env var: `NEXT_PUBLIC_GTM_ID`
- [x] GTM `<script>` w `<head>` + `<noscript>` w `<body>` via `layout.tsx`
- [x] Default consent state: all denied
- **Worker:** Claude Code
- **Pliki:** `src/components/TrackingPixels.tsx`, `src/app/layout.tsx`

### 1.2 Analytics helper library
- [x] Utworzyć `src/lib/analytics.ts` — `trackEvent()`, `setUserData()`, dataLayer types
- [x] Utworzyć `src/lib/analytics-events.ts` — typed event constants + parameter interfaces
- [x] Utworzyć `src/hooks/useTrackPageView.ts` — SPA page_view na route change (usePathname)
- **Worker:** Claude Code
- **Pliki:** `src/lib/analytics.ts`, `src/lib/analytics-events.ts`, `src/hooks/useTrackPageView.ts`

### 1.3 Consent Banner
- [x] Bazowy banner (Jarek podmieni na swój obrandowany)
- [x] Utworzyć `src/components/ConsentBanner.tsx` — 3 kategorie (analytics, ads, personalization)
- [x] Utworzyć `src/hooks/useConsent.ts` — stan zgody, localStorage + cookie
- [x] Opcje: "Akceptuję wszystkie" / "Tylko niezbędne" / "Dostosuj"
- [x] `gtag('consent', 'update', ...)` po akceptacji
- [x] Link "Ustawienia cookies" w `Footer.tsx`
- [x] Dodać `ConsentBanner` do `providers.tsx`
- **Worker:** Claude Code
- **Pliki:** `src/components/ConsentBanner.tsx`, `src/hooks/useConsent.ts`, `src/components/Footer.tsx`, `src/app/providers.tsx`

### 1.4 DataLayer events — core pages
- [x] `OfferFilters.tsx` (homepage): `view_item_list` on mount + `search` na zmianę filtrów
- [x] `oferta/[slug]/page.tsx`: `view_item` z parametrami oferty
- [x] `OfferCard.tsx`: `select_item` na klik
- **Worker:** Claude Code
- **Pliki:** `src/app/oferta/[slug]/page.tsx`, `src/components/OfferCard.tsx`, `src/components/OfferFilters.tsx`

### 1.5 DataLayer events — auth & user actions
- [x] `AuthContext.tsx`: `sign_up`, `login` + enhanced conversions (hashed email)
- [x] `TrackerContext.tsx`: `tracker_start`, `tracker_stop`, `condition_complete`, `payout_received`
- [x] Gamification: `achievement_unlock` (w `useAchievementChecker.ts`)
- [x] Push: `push_subscribe` (w `PushNotificationToggle.tsx`)
- [x] Blog: `blog_read` scroll 75% observer (w `TrackBlogRead.tsx`)
- [ ] Streak milestone — brak dedykowanego UI, pomijam (event zdefiniowany, wpięcie kiedy będzie UI)
- **Worker:** Claude Code
- **Pliki:** `src/context/AuthContext.tsx`, `src/context/TrackerContext.tsx`, `src/hooks/useAchievementChecker.ts`, `src/components/PushNotificationToggle.tsx`, `src/app/blog/[slug]/page.tsx`

---

## Faza 2: Affiliate Click Tracking

### 2.1 Extend affiliate_clicks table
- [x] Migracja `021_affiliate_clicks_extend.sql`: dodać `session_id`, `utm_source`, `utm_medium`, `utm_campaign`, `consent_state`, `user_agent`
- **Worker:** Claude Code
- **Pliki:** `supabase/migrations/021_affiliate_clicks_extend.sql`

### 2.2 Track click API endpoint
- [x] Utworzyć `src/app/api/track-click/route.ts` — POST, zapisuje do `affiliate_clicks`
- [x] Parsować UTM z request headers / body
- [x] Rate limiting (IP-based, 10/min)
- **Worker:** Claude Code
- **Pliki:** `src/app/api/track-click/route.ts`

### 2.3 AffiliateLink component
- [x] Utworzyć `src/components/AffiliateLink.tsx` — wrapper na `<a>`
- [x] Przed redirect: push `affiliate_click` + `generate_lead` + `begin_checkout` do dataLayer
- [x] POST `/api/track-click` via `navigator.sendBeacon()` (nie blokuje redirect)
- [x] UTM z `sessionStorage`
- [x] Podmienić linki w `OfferTrackingActions.tsx` i `oferta/[slug]/page.tsx`
- **Worker:** Claude Code
- **Pliki:** `src/components/AffiliateLink.tsx`, `src/components/OfferTrackingActions.tsx`, `src/app/oferta/[slug]/page.tsx`

### 2.4 UTM parser
- [x] Dodać do `src/lib/analytics.ts`: `captureUTM()` — czyta UTM z URL, zapisuje w sessionStorage
- [x] Wywołać w `useTrackPageView` hook
- **Worker:** Claude Code
- **Pliki:** `src/lib/analytics.ts`, `src/hooks/useTrackPageView.ts`

---

## Faza 3: GTM Container Export

### 3.1 GTM container JSON
- [x] Utworzyć `config/gtm-container-cebulazysku.json`
- [x] Tagi: GA4 config + events, Meta Pixel, TikTok Pixel, X Pixel, LinkedIn Insight, Google Ads conversion + remarketing, Microsoft Ads UET
- [x] Triggery per dataLayer event
- [x] Zmienne: dataLayer variables, consent state, user data, constant placeholders
- [x] Consent-aware: tagi odpalają się TYLKO po odpowiednim consent granted
- [x] Folder structure w GTM: per platforma
- **Worker:** Gemini CLI ✅
- **Pliki:** `config/gtm-container-cebulazysku.json`

### 3.2 GTM import instructions
- [x] Instrukcja importu kontenera
- [x] Lista placeholderów do podmiany z opisami skąd wziąć ID
- [x] Checklist weryfikacji (GTM Preview mode)
- **Worker:** Gemini CLI ✅
- **Pliki:** `research/gtm-import-guide.md`

---

## Faza 4: Admin Panel Konwersje

### 4.1 Conversions dashboard
- [x] Zamienić placeholder `/admin/konwersje` na dashboard
- [x] Wykres kliknięć w czasie (dziennie — pure CSS/Tailwind bars)
- [x] Top 10 ofert po kliknięciach
- [x] Filtr po okresie (7/14/30/90 dni)
- [x] Źródła ruchu (UTM breakdown)
- [x] API: `GET /api/admin/conversions` — agregacje z `affiliate_clicks`
- **Worker:** Claude Code
- **Pliki:** `src/app/admin/konwersje/page.tsx`, `src/app/api/admin/conversions/route.ts`

---

## Faza 5: Documentation

### 5.1 Analytics documentation
- [x] Utworzyć `docs/40-analytics-gtm.md` — pełna dokumentacja (architektura, eventy, consent flow, UTM conventions)
- [x] Zaktualizować `docs/README.md`
- [ ] Zaktualizować `docs/16-seo-analytics.md` — link do nowego docs/40
- **Worker:** Gemini CLI (draft) ✅ → Claude Code (review)
- **Pliki:** `docs/40-analytics-gtm.md`, `docs/README.md`, `docs/16-seo-analytics.md`

### 5.2 Privacy policy update
- [x] Zaktualizować `src/app/polityka-prywatnosci/page.tsx` — sekcje 6-8: cookies, platformy, Enhanced Conversions
- **Worker:** Gemini CLI (draft tekstu) ✅ → Claude Code (implementacja) ✅
- **Pliki:** `src/app/polityka-prywatnosci/page.tsx`
