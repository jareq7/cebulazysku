# PRD: Analytics — GTM, DataLayer, Consent, Conversion Tracking

## Introduction

CebulaZysku.pl ma infrastrukturę pod GA4 i Meta Pixel (env vars w `TrackingPixels.tsx`), ale brakuje: GTM jako centralnego hub'a, consent management (RODO), dataLayer z eventami, tracking kliknięć afiliacyjnych i integracji z platformami reklamowymi. Bez tego nie można ruszyć z marketingiem ani mierzyć ROI kampanii.

Celem jest wdrożenie **world-class analytics** gotowej do skalowania na kolejne kraje — z pełną warstwą danych, consent mode v2, enhanced conversions i gotowcem GTM do importu.

## Goals

1. **GTM jako jedyny punkt wstrzykiwania tagów** — usunąć hardcoded GA4/Meta Pixel, wszystko przez GTM
2. **Consent Mode v2** — RODO-compliant cookie banner (custom, obrandowany) blokujący tagi do momentu zgody
3. **DataLayer events** — pełny zestaw eventów GA4 recommended + custom affiliate events
4. **Affiliate click tracking** — rejestracja kliknięć w DB + dataLayer + server-side
5. **Enhanced Conversions** — hashed email do GA4/Meta dla lepszego matchowania
6. **GTM container export** — gotowy JSON do importu z placeholderami na ID (GA4, Meta, TikTok, X, LinkedIn, Google Ads, Microsoft Ads)
7. **Skalowalność** — UTM conventions, naming conventions, łatwe dodawanie nowych krajów/języków

## User Stories

- Jako marketer chcę widzieć w GA4 pełną ścieżkę użytkownika od wejścia do kliknięcia w link afiliacyjny
- Jako admin chcę widzieć w panelu statystyki kliknięć afiliacyjnych (CTR, top oferty, trend)
- Jako użytkownik chcę zdecydować na jakie cookies wyrażam zgodę (RODO)
- Jako marketer chcę importować gotowy kontener GTM i tylko podmienić ID pikseli
- Jako marketer chcę odpalać kampanie na Meta/TikTok/Google Ads/Microsoft Ads z poprawnym trackingiem konwersji
- Jako owner chcę przenieść ten sam setup analytics na wersję DE/UK z minimalnym nakładem pracy

## Functional Requirements

### 1. GTM Integration

1.1. Usunąć hardcoded `gtag.js` i `fbq()` z `TrackingPixels.tsx`
1.2. Wstrzyknąć GTM snippet (`<script>` w `<head>` + `<noscript>` w `<body>`) — sterowany przez `NEXT_PUBLIC_GTM_ID`
1.3. Komponent `GTMProvider` w `layout.tsx` — inicjalizuje GTM z default consent state (denied)
1.4. Env var: `NEXT_PUBLIC_GTM_ID` (np. `GTM-XXXXXXX`)

### 2. Consent Mode v2

2.1. Komponent `ConsentBanner` — custom, obrandowany w stylu CebulaZysku (cebulowy humor)
2.2. Trzy kategorie zgód:
  - `analytics_storage` — GA4, statystyki
  - `ad_storage` — piksele reklamowe (Meta, TikTok, Google Ads, etc.)
  - `ad_personalization` + `ad_user_data` — enhanced conversions, remarketing
2.3. Opcje: "Akceptuję wszystkie" / "Tylko niezbędne" / "Dostosuj" (rozwijane checkboxy)
2.4. Zgoda zapisywana w `localStorage` + cookie `consent_state` (na potrzeby SSR)
2.5. Przy pierwszej wizycie: `gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ... })`
2.6. Po akceptacji: `gtag('consent', 'update', { analytics_storage: 'granted', ... })` — GTM automatycznie odpali tagi
2.7. Link do zmiany zgód w stopce strony ("Ustawienia cookies")
2.8. Banner NIE blokuje korzystania ze strony (overlay na dole, nie modal)
2.9. Jarek dostarczy swój istniejący banner do adaptacji

### 3. DataLayer Events

Eventy GA4 recommended (z prescribed parameters) + custom:

**Recommended Events:**

| Event | Kiedy | Parametry |
|-------|-------|-----------|
| `page_view` | Każda zmiana strony (SPA navigation) | `page_title`, `page_location`, `page_referrer` |
| `sign_up` | Rejestracja | `method` (email) |
| `login` | Logowanie | `method` (email) |
| `view_item` | Otwarcie strony oferty | `item_id` (slug), `item_name` (bank_name), `item_category` (offer type), `price` (reward), `currency` (PLN) |
| `view_item_list` | Lista ofert (homepage, filtrowanie) | `item_list_name` (np. "all_offers", "filtered_savings"), `items[]` |
| `select_item` | Klik w kartę oferty | `item_id`, `item_name`, `item_list_name` |
| `begin_checkout` | Klik "Otwórz konto w banku" (przed redirect) | `item_id`, `item_name`, `value` (reward), `currency` (PLN) |
| `generate_lead` | Klik afiliacyjny (confirmed redirect) | `item_id`, `item_name`, `value` (reward), `currency` (PLN) |
| `share` | Udostępnienie kodu polecającego | `method`, `content_type` (referral), `item_id` |
| `search` | Użycie filtrów/wyszukiwarki ofert | `search_term` |

**Custom Events:**

| Event | Kiedy | Parametry |
|-------|-------|-----------|
| `affiliate_click` | Klik w link afiliacyjny | `offer_id`, `bank_name`, `reward`, `source_page`, `user_logged_in` |
| `tracker_start` | User zaczyna śledzić ofertę | `offer_id`, `bank_name` |
| `tracker_stop` | User przestaje śledzić ofertę | `offer_id`, `bank_name`, `days_tracked` |
| `condition_complete` | Ukończenie warunku | `offer_id`, `condition_type`, `condition_label` |
| `payout_received` | Oznaczenie wypłaty | `offer_id`, `bank_name`, `value` (reward) |
| `achievement_unlock` | Odblokowanie osiągnięcia | `achievement_id`, `achievement_name`, `category` |
| `streak_milestone` | Streak 7/30/90 dni | `streak_days` |
| `blog_read` | Przeczytanie artykułu (scroll 75%) | `article_id`, `article_title`, `read_time` |
| `newsletter_signup` | Zapis na powiadomienia email | `notification_type` |
| `push_subscribe` | Włączenie push notifications | — |
| `cookie_consent` | Zmiana ustawień consent | `analytics`, `ads`, `personalization` (granted/denied) |

### 4. Affiliate Click Tracking

4.1. Nowy API endpoint: `POST /api/track-click`
  - Body: `{ offerId, sourcePage }`
  - Zapisuje do tabeli `affiliate_clicks` (migracja 020 — już istnieje)
  - Zwraca `{ ok: true }`
4.2. Komponent `AffiliateLink` (wrapper na `<a>`) — przed redirect:
  - Push `affiliate_click` + `generate_lead` + `begin_checkout` do dataLayer
  - POST do `/api/track-click`
  - Redirect do `affiliate_url` (z krótkim delay lub beacon)
4.3. Rozszerzenie tabeli `affiliate_clicks`:
  - Dodać kolumny: `session_id`, `utm_source`, `utm_medium`, `utm_campaign`, `consent_state`, `user_agent`
4.4. Admin panel `/admin/konwersje` — zamienić placeholder na:
  - Wykres kliknięć w czasie (dziennie, tygodniowo)
  - Top 10 ofert po kliknięciach
  - CTR per oferta (kliknięcia / page views)
  - Filtr po dacie, banku, source

### 5. Enhanced Conversions

5.1. Przy `sign_up` i `generate_lead` — pushować hashed email (SHA-256) do dataLayer:
  ```
  dataLayer.push({ user_data: { sha256_email_address: hashedEmail } })
  ```
5.2. GTM konfiguracja: User-Provided Data w tagach GA4/Meta/Google Ads
5.3. Hash wykonywany client-side (Web Crypto API) — surowy email NIGDY nie trafia do dataLayer

### 6. GTM Container Export

6.1. Plik `gtm-container-cebulazysku.json` w katalogu `/config/`
6.2. Zawiera gotowe do importu:

**Tagi:**
- GA4 Configuration tag (placeholder: `{{GA4_MEASUREMENT_ID}}`)
- GA4 Event tags (per event z sekcji 3)
- Meta Pixel Base + Event tags (placeholder: `{{META_PIXEL_ID}}`)
- TikTok Pixel Base + Event tags (placeholder: `{{TIKTOK_PIXEL_ID}}`)
- X (Twitter) Pixel (placeholder: `{{X_PIXEL_ID}}`)
- LinkedIn Insight Tag (placeholder: `{{LINKEDIN_PARTNER_ID}}`)
- Google Ads Conversion + Remarketing (placeholders: `{{GADS_CONVERSION_ID}}`, `{{GADS_CONVERSION_LABEL}}`)
- Microsoft Ads UET Tag (placeholder: `{{MSADS_TAG_ID}}`)
- Consent Mode Initialization tag

**Triggery:**
- Per event z dataLayer (custom event triggers)
- Page View trigger
- Consent Initialized trigger

**Zmienne:**
- DataLayer variables per event parameter
- Consent state variables
- User data variables (hashed email)
- Constant placeholders na ID pikseli (łatwa podmiana)

6.3. Instrukcja importu w pliku `docs/XX-analytics-gtm.md`

### 7. Utility: Analytics Helper

7.1. `src/lib/analytics.ts` — centralna funkcja do pushowania eventów:
```typescript
export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ event, ...params });
  }
}
```
7.2. `src/lib/analytics-events.ts` — typed event definitions (enum/const z nazwami eventów + parametrami)
7.3. Hook `useTrackPageView()` — SPA page_view tracking na route change (Next.js App Router `usePathname`)

### 8. UTM & Naming Conventions

8.1. Dokumentacja UTM conventions w `docs/XX-analytics-gtm.md`:
  - `utm_source`: platform (google, meta, tiktok, linkedin, email, organic)
  - `utm_medium`: cpc, social, email, referral, push
  - `utm_campaign`: `{country}_{product}_{objective}_{date}` (np. `pl_bankpromo_awareness_202603`)
  - `utm_content`: wariant kreacji
  - `utm_term`: keyword (search only)
8.2. Lowercase everywhere, underscores, no spaces
8.3. UTM parser: czytaj UTM z URL, zapisuj w `sessionStorage`, dołączaj do affiliate click tracking

## Non-Functional Requirements

- Consent banner renderowany SSR (no CLS/layout shift)
- GTM snippet w `<head>` — zero opóźnienia
- Affiliate click tracking: beacon API (nie blokuje redirect)
- DataLayer pushes: < 1ms overhead
- Zero PII w dataLayer (email ONLY as SHA-256 hash)
- TypeScript strict types na wszystkie eventy
- Tagi warunkowe — odpalane TYLKO po consent granted

## Technical Architecture

```
User Action
    ↓
trackEvent('affiliate_click', { ... })
    ↓
window.dataLayer.push({ event: 'affiliate_click', ... })
    ↓
GTM picks up event
    ├── Consent granted (ad_storage)? → Fire Meta/TikTok/Google Ads/MS Ads tags
    ├── Consent granted (analytics_storage)? → Fire GA4 event tag
    └── Always → POST /api/track-click (server-side, 1st party)
```

```
Consent Flow:
1. GTM loads → consent default: all denied
2. ConsentBanner shows (first visit)
3. User clicks "Akceptuję" → consent update: granted
4. GTM re-fires buffered tags
5. Subsequent visits → read consent from localStorage, set on init
```

## Out of Scope

- Server-side GTM (sGTM) — future phase
- Offline conversion import (Google Ads) — future
- Custom attribution model — GA4 default (data-driven) for now
- A/B testing framework — separate PRD
- Heatmaps (Hotjar/Clarity) — can be added via GTM later without code changes

## Risks

| Risk | Mitigation |
|------|-----------|
| Consent banner blocks conversions | "Accept all" prominent + non-intrusive position |
| GTM container too complex | Structured naming, folders per platform |
| Enhanced conversions privacy concern | SHA-256 only, no raw PII, documented in privacy policy |
| SPA page_view double-firing | Debounce + Next.js router event listeners |
| Microsoft Ads UET compatibility | Test with GTM debug mode before launch |

## Migration Path

1. Faza 1: GTM + Consent + DataLayer events + affiliate click tracking
2. Faza 2: GTM container export z tagami per platforma
3. Faza 3: Admin panel konwersje (wykresy, stats)
4. Faza 4: Enhanced conversions activation

## Success Metrics

- 100% page views tracked in GA4 (po consent)
- Affiliate CTR measurable per offer
- All 6 ad platforms receiving events through GTM
- Consent rate > 70% (benchmark for PL market)
- Zero PII leaks — audit-ready
- Time to add new country: < 1 day (new GTM container + same dataLayer)

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/TrackingPixels.tsx` | **Replace** | GTM snippet only (remove hardcoded GA4/Meta) |
| `src/components/ConsentBanner.tsx` | **Create** | RODO cookie banner with consent mode v2 |
| `src/lib/analytics.ts` | **Create** | trackEvent(), dataLayer types, helpers |
| `src/lib/analytics-events.ts` | **Create** | Event name constants + parameter types |
| `src/hooks/useTrackPageView.ts` | **Create** | SPA page view tracking hook |
| `src/hooks/useConsent.ts` | **Create** | Consent state management hook |
| `src/components/AffiliateLink.tsx` | **Create** | Tracked affiliate link wrapper |
| `src/app/api/track-click/route.ts` | **Create** | Server-side click recording |
| `src/app/layout.tsx` | **Modify** | Add GTM, ConsentBanner, useTrackPageView |
| `src/app/oferta/[slug]/page.tsx` | **Modify** | view_item event, AffiliateLink component |
| `src/app/page.tsx` | **Modify** | view_item_list event |
| `src/components/OfferCard.tsx` | **Modify** | select_item event |
| `src/components/OfferTrackingActions.tsx` | **Modify** | Use AffiliateLink, begin_checkout event |
| `src/context/TrackerContext.tsx` | **Modify** | tracker_start/stop, condition_complete events |
| `src/context/AuthContext.tsx` | **Modify** | sign_up, login events + enhanced conversions |
| `supabase/migrations/021_affiliate_clicks_extend.sql` | **Create** | Add utm/session columns to affiliate_clicks |
| `src/app/admin/konwersje/page.tsx` | **Modify** | Replace placeholder with stats dashboard |
| `config/gtm-container-cebulazysku.json` | **Create** | GTM import-ready container |
| `docs/XX-analytics-gtm.md` | **Create** | Full analytics documentation |
