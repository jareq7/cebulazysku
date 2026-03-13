# 36. Typy ofert i filtry (osobiste / firmowe / dla młodych)

> **Data:** 13 marca 2026 r.

## Nowe kolumny w bazie

### Tabela `offers`

| Kolumna | Typ | Default | Opis |
|---------|-----|---------|------|
| `is_business` | boolean | false | Oferta firmowa (product_id=12 w LeadStar) |
| `for_young` | boolean | false | Oferta dla młodych |

### Tabela `notification_preferences`

| Kolumna | Typ | Default | Opis |
|---------|-----|---------|------|
| `account_type` | text | 'personal' | Wartości: `personal`, `business`, `both` |
| `show_young` | boolean | true | Czy pokazywać oferty dla młodych |

## Filtr na stronie głównej

Przełącznik segmentowy z trzema trybami:

| Tryb | Co widać |
|------|----------|
| **Osobiste** (domyślny) | Tylko konta osobiste |
| **Firmowe** | Tylko konta firmowe |
| **Oba** | Wszystkie oferty |

Dodatkowo badge "Ukryj: dla młodych" filtruje oferty z `for_young=true`.

### Zapisywanie preferencji

Dla zalogowanych użytkowników preferencje zapisują się automatycznie do `notification_preferences` przy każdej zmianie filtra. Przy kolejnej wizycie filtry ustawiają się na ostatnio wybrane wartości.

## Filtry w panelu admina (Feed / Jakość)

### Kategoria
- Wszystkie / 🏠 Osobiste / 🏢 Firmowe / 🎓 Dla młodych

### Nagroda dla usera
- Wszystkie / ✅ Coś dla usera (`reward > 0`) / ❌ Tylko dla mnie (`reward = 0`)

Pozwala szybko znaleźć programy które dają prowizję tylko partnerowi i je dezaktywować.

## Sync

Przy synchronizacji z LeadStar API, `is_business` ustawiany jest automatycznie na podstawie `product_id === "12"`.

## Email notifications

Cron email-notifications uwzględnia `account_type` użytkownika:
- `personal` — pomija oferty biznesowe
- `business` — pomija oferty osobiste
- `both` — wysyła wszystkie

## Pliki

- `supabase/migrations/018_offer_type_preferences.sql`
- `src/components/OfferFilters.tsx` — przełącznik Osobiste/Firmowe/Oba
- `src/app/api/sync-offers/route.ts` — `is_business` z `productId`
- `src/app/admin/feed/page.tsx` — filtry kategorii i nagrody
- `src/app/api/admin/feed/route.ts` — dodane pola do SELECT
- `src/app/api/cron/email-notifications/route.ts` — filtrowanie po `account_type`
