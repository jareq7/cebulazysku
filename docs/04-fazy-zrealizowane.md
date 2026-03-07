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

## Faza 0d — Automatyczny sync XML (Vercel Cron)

**Co zrobiono:**
- Utworzono `vercel.json` z cron schedule (`0 6 * * *` — codziennie o 6:00 UTC)
- Refaktor `sync-offers/route.ts`: wyodrębniono `runSync()`, dodano GET handler dla Vercel Cron
- Obsługa `CRON_SECRET` (Vercel) obok istniejącego `SYNC_SECRET` (ręczne)
- Soft delete: oferty nieobecne w feedzie XML → `is_active = false`
- Logi sync zapisywane w tabeli `sync_log` (z polem `offers_deactivated`)

📄 Szczegóły: [15-auto-sync-xml.md](./15-auto-sync-xml.md)

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
