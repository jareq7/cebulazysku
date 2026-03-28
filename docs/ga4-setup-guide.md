# GA4 Custom Dimensions — Instrukcja konfiguracji

> **Autor:** Claude Code | **Data:** 2026-03-26

---

## Custom Dimensions do skonfigurowania w GA4

W panelu GA4 → Admin → Custom definitions → Create custom dimensions:

| Nazwa | Scope | Event parameter | Opis |
|-------|-------|-----------------|------|
| `offer_id` | Event | `offer_id` | Slug oferty (np. "mbank-ekonto") |
| `bank_name` | Event | `bank_name` | Nazwa banku (np. "mBank") |
| `reward_amount` | Event | `reward` | Kwota premii (PLN) |
| `difficulty` | Event | `item_category` | Trudność oferty (easy/medium/hard) |
| `hero_variant` | Event | `variant` | Wariant A/B testu hero (A/B/C) |
| `cta_variant` | Event | `variant` | Wariant CTA (sticky_mobile, sidebar, etc.) |
| `welcome_variant` | Event | `welcome_variant` | Wariant welcome email (A/B/C) |

## Custom Metrics

| Nazwa | Scope | Event parameter | Unit |
|-------|-------|-----------------|------|
| `reward_value` | Event | `reward` | Currency (PLN) |
| `total_potential` | Event | `total_potential` | Currency (PLN) |

---

## Eventy wysyłane do dataLayer

### Affiliate & Offers

| Event | Parametry | Kiedy |
|-------|-----------|-------|
| `view_item` | offer_id, bank_name, item_category, price | Wejście na stronę oferty |
| `affiliate_click` | offer_id, bank_name, reward, source_page, user_logged_in | Klik w link afiliacyjny |
| `tracker_start` | offer_id, bank_name | Dodanie oferty do trackera |
| `condition_complete` | offer_id, condition_type, condition_label | Odhaczenie warunku |
| `payout_received` | offer_id, bank_name, value | Potwierdzenie wypłaty |

### CTA & Conversion

| Event | Parametry | Kiedy |
|-------|-----------|-------|
| `cta_click` | variant, bank_name, reward | Klik w CTA (sticky, sidebar) |
| `hero_variant_view` | variant | Wyświetlenie wariantu hero |
| `hero_cta_click` | variant | Klik CTA w hero |
| `calculator_interaction` | initial_amount | Pierwsza interakcja z kalkulatorem |
| `calculator_result` | amount, matching_offers, total_potential, offer_ids | Wyświetlenie wyniku kalkulatora |

### Engagement

| Event | Parametry | Kiedy |
|-------|-----------|-------|
| `blog_read` | article_id, article_title | Wejście na artykuł bloga |
| `newsletter_signup` | source, email_hash | Zapis do newslettera |
| `sign_up` | method | Rejestracja |
| `share` | method, content_type, item_id | Udostępnienie treści |

---

## Raporty do zbudowania w GA4

### 1. A/B Test Hero — Explore report
- Dimension: `hero_variant` (A/B/C)
- Metric: `hero_cta_click` count / `hero_variant_view` count = CTR per wariant
- Okres: min. 2 tygodnie, min. 1000 sesji per wariant

### 2. Offer Funnel
- `view_item` → `affiliate_click` → `tracker_start` → `condition_complete` → `payout_received`
- Filtr per `bank_name` lub `difficulty`

### 3. CTA Performance
- Dimension: `cta_variant`
- Metric: `cta_click` count vs `affiliate_click` count

---

## Konfiguracja GTM

Eventy są pushowane do `window.dataLayer`. GTM powinien mieć:

1. **Custom Event Trigger** per event name
2. **Data Layer Variable** per parametr (offer_id, bank_name, reward, variant)
3. **GA4 Event Tag** mapujący trigger → GA4 z parametrami

Istniejąca konfiguracja GTM (docs/40-analytics-gtm.md) już obsługuje `dataLayer.push()` — wystarczy dodać nowe triggery i tagi dla nowych eventów.
