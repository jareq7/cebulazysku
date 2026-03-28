# 46. Sprint 1 — SEO & Conversion

> **Data:** 2026-03-26
> **Autor:** Claude Code (claude-opus-4-6)
> **Zakres:** C1–C5 z AI-TASKS.md

---

## C1. FAQ Schema na stronach ofert

**Pliki:**
- `src/components/OfferFAQ.tsx` — klient component, shadcn Accordion
- `src/app/oferta/[slug]/page.tsx` — integracja komponentu

**Jak działa:**
- Dane FAQ pochodzą z pola `faq` w tabeli `offers` (generowane przez AI cron)
- Accordion `type="multiple"` — użytkownik może otworzyć wiele pytań naraz
- JSON-LD `FAQPage` schema był już obecny — zachowany bez zmian
- Jeśli `faq` jest puste, komponent renderuje `null`

---

## C2. Internal Linking Engine

**Pliki:**
- `src/lib/internal-links.ts` — silnik auto-linkowania
- `src/components/RenderMarkdown.tsx` — integracja + parser linków markdown

**Konfiguracja:**
- 12 banków: mBank, ING, BNP Paribas, Santander, PKO BP, Pekao, Millennium, VeloBank, Alior, Credit Agricole, Citi Handlowy, Nest Bank
- 10 terminów słownikowych: BIK, BFG, MCC, karencja, sprzedaż premiowa, limit debetowy, rotacja bankowa, BLIK P2P, karta wirtualna, ROR

**Zasady:**
- Każdy term linkowany tylko RAZ (pierwsze wystąpienie)
- Tekst wewnątrz `[...]` lub `(...)` pomijany
- Krótkie paragrafy (<50 znaków) pomijane
- Nagłówki (`#`) pomijane
- Banki → `/bank/[slug]`, terminy → `/slownik#anchor`

**Rozszerzanie:**
- Dodaj nowy bank: wpis w `BANK_LINKS` array w `internal-links.ts`
- Dodaj nowy termin: wpis w `GLOSSARY_TERMS` array
- `parseInlineStyles()` w RenderMarkdown obsługuje `[text](/url)` → `<Link>`

---

## C3. CTA Optymalizacja

**Pliki:**
- `src/components/StickyCTA.tsx` — sticky bar na mobile
- `src/app/oferta/[slug]/page.tsx` — integracja + trust signals w sidebarze
- `src/app/page.tsx` — PremiumCalculator na stronie głównej

**StickyCTA:**
- Pojawia się po scroll >400px
- Ukryty na desktop (`lg:hidden`)
- Pokazuje: nazwa banku, kwota premii, przycisk CTA
- Trust signals: "Bez zobowiązań", "5 min", "BFG chroni"
- Event `cta_click` z `variant: "sticky_mobile"`

**Trust Signals w sidebarze:**
- 3 punkty z ikonkami pod głównym CTA
- Widoczne tylko dla aktywnych ofert

**PremiumCalculator:**
- Windsurf dostarczył komponent, zintegrowany na homepage
- Slider z kwotą wpływu → lista pasujących ofert → suma premii
- Umieszczony między sekcją ofert a sekcją "Dlaczego warto?"

---

## C4. A/B Test Hero Copy

**Pliki:**
- `src/components/HeroABTest.tsx` — komponent z 3 wariantami
- `src/app/page.tsx` — zastąpił statyczny hero

**Warianty (z research/hero-copy-variants.md Gemini):**
| Wariant | Hook | H1 |
|---------|------|----|
| A | Greedy | "Przestań płacić bankom. Zacznij na nich zarabiać." |
| B | Utility | "Odbieraj premie od banków. My przypilnujemy haczyków." |
| C | Community | "Dołącz do Cebularzy. Rozdano już ponad 250 000 zł." |

**Mechanika:**
- Losowy wariant per użytkownik, zapisany w `localStorage` pod kluczem `hero_variant`
- Event `hero_variant_view` przy wyświetleniu
- Event `hero_cta_click` przy kliknięciu głównego CTA
- Po ~2 tygodniach: sprawdzić CTR w GA4 i wybrać zwycięzcę

**Uwaga:** Komponent jest `"use client"` — SSR renderuje `null` aby uniknąć hydration mismatch. Pierwsze renderowanie po stronie klienta może powodować flash.

---

## C5. Persona "Sprytny Cebularz" na /o-nas

**Pliki:**
- `src/app/o-nas/page.tsx` — nowa sekcja "Dla kogo jest CebulaZysku?"

**Zawartość:**
- Intro z terminem "Cebularze"
- 3 pain points z ikonkami: zapominanie warunków, regulaminy, deadline'y
- Tagline: "Sprytny Cebularz nie traci pieniędzy — on je obiera."
- Gradient tło emerald w stylu reszty strony
