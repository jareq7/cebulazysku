# 40. Analityka, GTM i Consent Mode v2

[← Powrót do spisu treści](./README.md)

// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17 — Architektura i eventy analityczne
// @author Claude Code (claude-opus-4-6) | 2026-03-17 — Implementacja, pliki źródłowe, enhanced conversions

## 1. Architektura Systemu Analitycznego

CebulaZysku.pl wykorzystuje w pełni asynchroniczną strukturę opartą na Google Tag Manager i DataLayer, ze wsparciem dla Google Consent Mode v2 (RODO). Żadne tagi (skrypty śledzące, piksele Meta/TikTok) nie są zahardcodowane w aplikacji – wszystko jest wstrzykiwane dynamicznie poprzez GTM w zależności od stanu zgody użytkownika.

```
Działanie Użytkownika / Kod React
         │
         ▼
trackEvent('event_name', { params })  (src/lib/analytics.ts)
         │
         ▼
window.dataLayer.push()
         │
         ▼
Google Tag Manager (GTM)
         │
         ├── Sprawdzenie Zgody (Consent Mode v2)
         │    ├── analytics_storage: GRANTED -> Odrzucenie / Wysłanie tagu GA4
         │    └── ad_storage: GRANTED -> Odrzucenie / Wysłanie Pikseli (Meta, TikTok, GAds)
         │
         ▼
Rozsył danych do platform
```

Oprócz analityki front-endowej, krytyczne działania (np. kliknięcie w link afiliacyjny) zapisywane są również **server-side** do bazy danych Supabase (tabela `affiliate_clicks`) by zachować bezwzględne źródło prawdy niezależnie od blokowania skryptów (np. AdBlock).

## 2. Consent Flow (Consent Mode v2)

- **Default (odrzucenie):** Przy załadowaniu strony (`layout.tsx`), GTM zostaje zainicjowany w stanie domyślnym (`denied` dla `analytics_storage`, `ad_storage`, `ad_personalization`, `ad_user_data`). Tagi są w trybie czuwania.
- **Aktualizacja (akceptacja):** Kiedy user podejmie decyzję w `ConsentBanner`, aplikacja wywołuje `gtag('consent', 'update', { ... })`. Zmiana zostaje zapisana w `localStorage` oraz pliku cookie `consent_state` w celu szybszego wczytywania przy następnej wizycie (dla SSR).
- Jeśli użytkownik posiadał już zaakceptowany `consent_state`, inicjalizacja tagów wywoływana jest od razu jako `granted`.

## 3. Konwencje UTM

Aby utrzymać porządek w ruchu, wszystkie linki przychodzące do CebulaZysku z kampanii reklamowych powinny stosować poniższe zasady. 
Aplikacja odczytuje tagi UTM i przypisuje je do konkretnych konwersji w panelu afiliacyjnym.

* **Brak wielkich liter, brak spacji** (spacje zastąp znakiem `_`).
* **`utm_source`** (Źródło): `google`, `meta`, `tiktok`, `linkedin`, `email`, `push`, `organic`.
* **`utm_medium`** (Medium): `cpc` (płatne), `social` (organiczny post), `email`, `referral`.
* **`utm_campaign`** (Kampania): Format: `{kraj}_{produkt}_{cel}_{data}` (np. `pl_bankpromo_awareness_202603`).

## 4. Spis Eventów DataLayer

### Recommended Events (Standard E-commerce / GA4)

| Event | Kiedy Występuje | Przekazywane Parametry |
|-------|-----------------|------------------------|
| `page_view` | Zmiana ścieżki w SPA (App Router) | Wbudowane parametry strony + referrer |
| `sign_up` | Poprawna rejestracja w Supabase | `method` = 'email' |
| `login` | Poprawne zalogowanie | `method` = 'email' |
| `view_item` | Wejście na stronę `/oferta/[slug]` | `item_id`, `item_name`, `item_category`, `price`, `currency`='PLN' |
| `view_item_list` | Wejście na główną lub lista w filtrach | `item_list_name`, `items[]` |
| `select_item` | Klik w kartę oferty na liście | `item_id`, `item_name`, `item_list_name` |
| `begin_checkout` | Klik w "Otwórz konto" (przed redirectem) | `item_id`, `item_name`, `value` (premia), `currency` |
| `generate_lead` | Wygenerowanie leada (jak wyżej) | *jak wyżej*, służy jako konwersja do systemów Ads |
| `search` | Użycie filtrów lub wyszukiwarki ofert | `search_term` |

### Custom Events (Logika Aplikacji / Gamifikacja)

| Event | Kiedy Występuje | Przekazywane Parametry |
|-------|-----------------|------------------------|
| `affiliate_click` | Fizyczne kliknięcie wychodzące | `offer_id`, `bank_name`, `reward`, `source_page` |
| `tracker_start` | Dodanie oferty do Trackera | `offer_id`, `bank_name` |
| `tracker_stop` | Usunięcie oferty z Trackera | `offer_id`, `bank_name`, `days_tracked` |
| `condition_complete` | Zaznaczenie checkboxa w warunkach | `offer_id`, `condition_type`, `condition_label` |
| `payout_received` | Oznaczenie wypłaty jako otrzymanej | `offer_id`, `bank_name`, `value` |
| `achievement_unlock` | Osiągnięcie przyznane (gamifikacja) | `achievement_id`, `achievement_name` |
| `streak_milestone` | Długi streak (7/30/90) dni | `streak_days` |

## 5. Rozwiązywanie Problemów (Troubleshooting)

**1. Tagi nie wysyłają zdarzeń mimo kliknięcia.**
-> **Rozwiązanie**: Sprawdź w Tag Assistant czy `consent_state` widnieje jako Granted. Przy włączonym Consent Mode tagi są domyślnie blokowane. 

**2. Brak danych UTM przy kliknięciach afiliacyjnych w panelu Admina.**
-> **Rozwiązanie**: `useTrackPageView` nie zapisał ich w `sessionStorage`. Sprawdź czy URL wejścia posiada poprawne parametry (np. `?utm_source=...`).

**3. SPA nawiguje, ale GTM nie zlicza Page Views.**
-> **Rozwiązanie**: W Next.js (App Router) tradycyjny tag "All Pages" odpali się tylko raz (SSR). Należy w Tagu GA4 Config upewnić się, że funkcja reagująca na History Change Event lub dedykowany event `page_view` z hooka `useTrackPageView` aktywuje tag wyświetlenia.

---

## 6. Pliki źródłowe

| Plik | Opis |
|------|------|
| `src/lib/analytics.ts` | Centralny moduł: `trackEvent()`, `setUserData()`, `captureUTM()`, consent management |
| `src/lib/analytics-events.ts` | Typed event constants (21 eventów) + parameter interfaces |
| `src/hooks/useTrackPageView.ts` | SPA page_view tracking na route change |
| `src/hooks/useConsent.ts` | Consent state management (acceptAll, rejectAll, saveCustom, reopenBanner) |
| `src/components/TrackingPixels.tsx` | GTM snippet + consent default (zastąpił hardcoded GA4/Meta) |
| `src/components/ConsentBanner.tsx` | RODO cookie banner z 3 kategoriami zgód |
| `src/components/AffiliateLink.tsx` | Tracked affiliate link wrapper (dataLayer + beacon + server-side) |
| `src/components/TrackViewItem.tsx` | Client wrapper do view_item na SSR stronach ofert |
| `src/components/TrackBlogRead.tsx` | Scroll 75% observer → blog_read event |
| `src/components/PageViewTracker.tsx` | Suspense wrapper dla useTrackPageView |
| `src/app/api/track-click/route.ts` | Server-side click tracking (POST, rate limited, UTM) |
| `src/app/api/admin/conversions/route.ts` | Admin API: agregacje kliknięć, top oferty, UTM sources |
| `src/app/admin/konwersje/page.tsx` | Admin dashboard: wykres dzienny, top oferty, UTM breakdown |
| `config/gtm-container-cebulazysku.json` | GTM container export — gotowy do importu (7 platform) |
| `supabase/migrations/021_affiliate_clicks_extend.sql` | Rozszerzenie tabeli o UTM, session, user_agent |

## 7. Jak aktywować

### Krok 1: GTM

1. Przejdź do [tagmanager.google.com](https://tagmanager.google.com)
2. Utwórz nowy kontener Web dla `cebulazysku.pl`
3. Zaimportuj `config/gtm-container-cebulazysku.json` (Admin → Import Container)
4. Podmień placeholdery na prawdziwe ID (szczegóły w `research/gtm-import-guide.md`)
5. W Vercel Dashboard dodaj env var: `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX`
6. Redeploy

### Krok 2: Baza danych

1. Uruchom migrację `021_affiliate_clicks_extend.sql` na Supabase (Dashboard → SQL Editor)

### Krok 3: Weryfikacja

1. GTM Preview mode → sprawdź czy tagi się odpalają po consent
2. Chrome DevTools → Console → `dataLayer` → powinny być eventy
3. GA4 DebugView → powinny spływać eventy
4. Admin panel `/admin/konwersje` → powinien pokazywać dane po kilku kliknięciach

## 8. Enhanced Conversions

Przy `sign_up` i `login` pushujemy SHA-256 hashed email do dataLayer:

```
window.dataLayer.push({
  event: 'user_data_set',
  user_data: { sha256_email_address: '5e884898da28047151d0e56f8dc6292773603d0d...' }
})
```

- Hash wykonywany client-side (Web Crypto API)
- Surowy email NIGDY nie trafia do dataLayer
- GTM: skonfiguruj User-Provided Data w tagach GA4/Meta/Google Ads
- Użytkownik może zrezygnować wyłączając kategorię "Reklamowe" w consent banner

## 9. Affiliate Click Tracking (server-side)

Niezależnie od GTM/consent, każde kliknięcie w link afiliacyjny jest rejestrowane server-side:

```
AffiliateLink onClick → navigator.sendBeacon('/api/track-click', { offerId, sourcePage, utm_* })
                       → affiliate_clicks table (Supabase)
```

- `sendBeacon` nie blokuje redirect do banku
- Rate limiting: 10 kliknięć/min per IP
- Dane w admin panelu `/admin/konwersje`: wykres dzienny, top oferty, źródła UTM
- Niezależne od AdBlocka i consent state

## 10. Decyzje techniczne

| Decyzja | Uzasadnienie |
|---------|-------------|
| GTM zamiast hardcoded tags | Jedna zmiana w GTM = aktualizacja na wszystkich platformach bez deploy |
| Consent default: all denied | RODO wymaga opt-in; GTM buforuje tagi i odpala po granted |
| consent w tym samym `<script>` co GTM | Gwarancja że consent ustawiony PRZED bootstrap GTM |
| `sendBeacon` dla click tracking | Nie blokuje redirect; działa nawet gdy strona się zamyka |
| Server-side + client-side tracking | Server-side = source of truth (AdBlock-proof); client-side = GTM events |
| SHA-256 client-side | Zero raw PII w dataLayer; hash nieodwracalny |
| Pure CSS charts zamiast recharts | Zero dodatkowych zależności; wystarczające dla admin dashboard |
| Client wrapper components | Server Components nie obsługują hooków; lightweight wrappers renderujące null |

---

## 11. Status

✅ **Ukończone** — 17 marca 2026

- GTM provider z Consent Mode v2
- 21 eventów DataLayer (10 recommended + 11 custom)
- Consent banner RODO z 3 kategoriami
- Affiliate click tracking (server + client)
- Enhanced conversions (SHA-256)
- Admin dashboard konwersje
- GTM container JSON (7 platform)
- Polityka prywatności zaktualizowana
- PRD: `tasks/prd-analytics.md`
- Tasks: `tasks/tasks-analytics.md`
