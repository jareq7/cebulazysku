# 47. Sprint 2 — Content & Pipeline

> **Data:** 2026-03-26
> **Autor:** Claude Code (claude-opus-4-6)
> **Zakres:** C6–C10 z AI-TASKS.md

---

## C6. Import blogów Gemini

**Status:** Nie było co importować — wszystkie artykuły z `research/content/blog-drafts/` i `blog-batch-4/` były już w bazie z poprzedniej sesji. 18 blogów aktualnie w DB.

`research/win-stories.md` to testimoniale (case studies użytkowników), nie artykuły blogowe — przeznaczone do użycia w komponencie Testimonials (Windsurf W1).

---

## C7. Welcome Email A/B Test

**Pliki:**
- `src/lib/email-templates.ts` — 3 warianty `newsletterWelcomeEmail()` + `pickWelcomeVariant()`
- `src/app/api/newsletter/confirm/route.ts` — losowanie wariantu przy aktywacji
- `supabase/migrations/028_welcome_variant.sql` — kolumna `welcome_variant` w `newsletter_subscribers`

**Warianty:**

| Wariant | Styl | Subject line |
|---------|------|-------------|
| A | Autorytet / zaufanie | "Potwierdzenie. Twój Tracker Zysków jest aktywny" |
| B | Krótki / konwersyjny | "Twoje 500 zł już na Ciebie czeka" |
| C | Storytelling / "Oops" | "Prawie straciłem pierwszą stówę (Nie rób tego błędu)" |

**Mechanika:**
- `pickWelcomeVariant()` losuje A/B/C z równym prawdopodobieństwem
- Wariant zapisywany w kolumnie `welcome_variant` w tabeli `newsletter_subscribers`
- Do analizy: zapytanie SQL po open rate per wariant (wymaga Resend webhook lub śledzenia pixel)

---

## C9. Admin /admin/seo

**Pliki:**
- `src/app/admin/seo/page.tsx` — dashboard SEO
- `src/app/api/admin/seo-stats/route.ts` — API z danymi
- `src/app/admin/layout.tsx` — dodany link w nawigacji

**Funkcjonalności:**
- KPI cards: strony w sitemap, blogi, oferty, reguły internal linking
- Content coverage bars: hub pages, porównania, oferty z FAQ, blog posts
- Internal Linking Engine stats
- Przeglądarka sitemap (parsowanie XML po stronie klienta)
- Placeholder na GSC API z instrukcją konfiguracji Service Account

**GSC API follow-up:**
Wymaga: Google Cloud Service Account → włącz Search Console API → dodaj jako użytkownika GSC → env vars `GSC_SERVICE_ACCOUNT_EMAIL` + `GSC_PRIVATE_KEY`.

---

## C10. GA4 Custom Dimensions

**Pliki:**
- `src/lib/analytics-events.ts` — 5 nowych eventów
- `docs/ga4-setup-guide.md` — pełna instrukcja konfiguracji

**Nowe eventy:**
- `cta_click` — klik w sticky CTA lub sidebar
- `hero_variant_view` — wyświetlenie wariantu A/B hero
- `hero_cta_click` — klik CTA w hero
- `calculator_interaction` — pierwsza interakcja z kalkulatorem
- `calculator_result` — wyświetlenie wyniku kalkulatora

**Custom dimensions do skonfigurowania w GA4 Console:**
- `offer_id`, `bank_name`, `reward_amount`, `difficulty`, `hero_variant`, `cta_variant`, `welcome_variant`

Szczegóły: `docs/ga4-setup-guide.md`
