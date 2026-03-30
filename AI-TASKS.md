# AI Tasks Board

> Tablica zadań do koordynacji między Claude Code, Gemini CLI, Windsurf i Jarkiem.
> Ten plik to źródło prawdy o tym kto co robi. Parsowany automatycznie przez `/admin/roadmap`.
>
> **Ostatnia aktualizacja:** 2026-03-29 (Claude Code)

---

## Status workerów

| Worker | Rola | Status |
|--------|------|--------|
| Claude Code | Lead dev/PM, implementacja, code review | ✅ Sprint 4 DONE (C14-C18) |
| Gemini CLI | Research, content, copy | ✅ Batch 4 DONE (G9-G13) |
| Windsurf | Feature branches, nowe strony/komponenty | ✅ W6-W8,W10 merged, ⏸️ W9 do poprawki |
| Jarek | Konta, decyzje, konfiguracja platform, community | 📋 Sprint 4 gotowy (J1-J7) |

---

## Zasady

1. **Przed edycją pliku** — sprawdź czy inny worker go nie rusza (sekcja "In Progress")
2. **Po zakończeniu zadania** — NIE edytuj AI-TASKS.md samodzielnie. Raportuj co zrobiłeś, Claude Code zaktualizuje.
3. **Konflikty** — jeśli dwóch workerów musi ruszać ten sam plik, Jarek koordynuje kolejność
4. **Commity** — Claude Code commituje na `main`. Gemini NIE commituje. Windsurf commituje na `feature/*`.
5. **Windsurf** — ZAWSZE `git checkout main && git checkout -b feature/xyz`. NIGDY nie branchuj z innego feature brancha.
6. **Numeracja migracji** — Claude Code nadaje numery. Aktualnie: 030 = następna wolna.

---

## Backlog — Claude Code (priorytet od góry)

### 🔴 Sprint 1 — SEO & Conversion (szybkie winy)

**C1. FAQ schema na stronach ofert** ✅ DONE
- [x] Komponent `OfferFAQ.tsx` — accordion z FAQ z DB (pole `faq` w offers)
- [x] JSON-LD `FAQPage` schema per oferta (było, zachowane)
- [x] Dodaj pod opisem oferty na `/oferta/[slug]`

**C2. Internal linking engine** ✅ DONE
- [x] Funkcja `autoLinkContent(text)` w `src/lib/internal-links.ts`
- [x] Auto-linkuj nazwy banków → `/bank/[slug]` (12 banków)
- [x] Auto-linkuj terminy ze słownika → `/slownik#term` (10 terminów)
- [x] Zastosuj w: RenderMarkdown (offer descriptions) + blog content
- [x] Nie linkuj jeśli tekst już jest wewnątrz markdown link

**C3. CTA optymalizacja** ✅ DONE
- [x] Sticky CTA bar na mobile (`StickyCTA.tsx`, fixed bottom, lg:hidden)
- [x] Trust signals pod CTA + w sidebarze oferty
- [x] dataLayer event `cta_click` z wariantem `sticky_mobile`
- [x] `PremiumCalculator` na stronie głównej (między ofertami a trust section)

**C4. A/B test hero copy** ✅ DONE
- [x] `HeroABTest.tsx` — 3 warianty z `research/hero-copy-variants.md`
- [x] Random per session (localStorage), event `hero_variant_view` + `hero_cta_click`
- [x] Po 2 tygodniach: wybierz zwycięzcę po CTR (manual)

**C5. Persona sekcja na /o-nas** ✅ DONE
- [x] Sekcja "Dla kogo jest CebulaZysku?" z opisem profilu "Sprytny Cebularz"
- [x] Tekst nawiązujący do bólów (zapominanie warunków, regulaminy, deadline'y)

### 🟡 Sprint 2 — Content & Pipeline

**C6. Import blogów Gemini do admina** ✅ DONE
- [x] Artykuły z `research/content/blog-drafts/` — wszystkie 6 już w DB (poprzednia sesja)
- [x] `win-stories.md` to testimoniale, nie blogi — do użycia w W1 (Windsurf)
- [x] Treści zweryfikowane — nie opisują nieistniejących feature'ów

**C7. Welcome email A/B** ✅ DONE
- [x] 3 warianty (A: autorytet, B: konwersyjny, C: storytelling) z research Gemini
- [x] Random per subscriber w `confirm/route.ts`, zapis `welcome_variant` w DB
- [x] Migracja 028: kolumna `welcome_variant` w `newsletter_subscribers`

**C8. Video Ads voiceover regen** ⏸️ ZABLOKOWANY
- [ ] Czeka na ElevenLabs quota reset
- [ ] Regen 8 voiceover z `sanitizeForTTS` fix

**C9. Admin /admin/seo** ✅ DONE (partial)
- [x] Dashboard: KPI cards, content coverage bars, internal linking stats
- [x] Przeglądarka sitemap
- [x] API `/api/admin/seo-stats` — zlicza blogi, oferty, FAQ, hub pages
- [ ] GSC API integration — wymaga Service Account (follow-up, instrukcja w placeholder)

**C10. GA4 custom dimensions** ✅ DONE
- [x] Nowe eventy w `analytics-events.ts`: cta_click, hero_variant_view, hero_cta_click, calculator_*
- [x] Docs: `docs/ga4-setup-guide.md` — pełna instrukcja custom dimensions + GTM config

### 🔵 Sprint 3 — Automation & Growth

**C11. TikTok video pipeline** (duży, wymaga PRD breakdown)
- [ ] Tasks breakdown z `tasks/prd-tiktok-pipeline.md`
- [ ] `TikTokVideo.tsx` — 9:16, Hormozi captions
- [ ] Whisper subtitles
- [ ] `social-publish.ts` — auto-post via API
- [ ] n8n workflow integration
- [ ] **Blokowany przez:** VPS setup, ElevenLabs upgrade

**C12. Autonomiczny content pipeline** (wymaga PRD)
- [ ] PRD: nowa oferta → AI blog draft + newsletter blast + TikTok script
- [ ] n8n orchestration

**C13. Referral widget ulepszenie** ✅ DONE
- [x] Bardziej widoczny "Zaproś znajomego" na dashboardzie (przeniesiony pod StreakBadge, gradient card)
- [x] Share referral link via WhatsApp/copy
- [x] Gamification: progress bar do nagrody (5 referrals = Super Cebularz)

### 🟢 Sprint 4 — Retencja & Email Drip (Faza 5 roadmapy)

**C14. Import blog batch 5 do DB** ✅ DONE
- [x] Import 5 artykułów z `research/content/blog-batch-5/` do Supabase (via admin API)
- [x] Sprawdź czy treści nie opisują nieistniejących feature'ów (naprawiono linki /ranking → /)
- [x] Tagowanie: przypisz tagi do każdego artykułu

**C15. Drip email sequence — 3 maile onboardingowe** ✅ DONE
- [x] Treść z `research/email-onboarding-sequence.md` (Gemini G5)
- [x] Nowa tabela/kolumna: `onboarding_step` w `newsletter_subscribers` (migracja 029)
- [x] Cron `/api/cron/email-onboarding` — dzień 1/3/7 po rejestracji (09:00 UTC)
- [x] Szablony email w `email-templates.ts` (3 warianty)
- [x] Deduplikacja: nie wysyłaj jeśli już wysłano ten krok

**C16. Streak break push notification** ✅ DONE
- [x] Cron `/api/cron/streak-reminder` (18:00 UTC) — sprawdza kto nie był aktywny wczoraj
- [x] Push notification "Twój streak jest zagrożony! 🔥"
- [x] Email fallback dla userów bez push
- [x] Max 1 notification per streak break (deduplikacja via email_sends)

**C17. Email "Poleć znajomemu"** ✅ DONE
- [x] Szablon `onboardingEmail4Referral` z CTA do dashboardu (WhatsApp deeplink tam jest)
- [x] Trigger: dzień 10 po rejestracji (step 4 w drip sequence)
- [x] CTA "Wyślij zaproszenie" → /dashboard (referral widget)

**C18. Pepper.pl post generator w adminie** ✅ DONE
- [x] Nowa sekcja w admin: "Marketing Tools" (/admin/marketing)
- [x] 10 szablonów Pepper.pl (z research Gemini G11), auto-generowanie z danych oferty
- [x] Copy to clipboard, UTM tracking link (utm_source=pepper)

---

## Backlog — Gemini (priorytet od góry)

### 🔴 Batch 2 — Content & SEO

**G1. Blog batch 5 — long-tail SEO** ✅ DONE
- [x] 5 artykułów w `research/content/blog-batch-5/` (59-70 linii każdy)
- [x] Tematy: bezpieczeństwo promocji, karencja, kilka kont, konto studenckie, podatek od premii

**G2. Opisy ofert review** ✅ DONE
- [x] Output: `research/offer-descriptions-review.md` (56 linii, pełny audyt + sugestie)

**G3. Social media kalendarz 4-tygodniowy** ✅ DONE
- [x] Output: `research/social-calendar-april.md` (67 linii, 4 tygodnie, 3 platformy)

**G4. Lead magnet finalizacja — "Przewodnik Cebularza" PDF** ✅ DONE
- [x] Output: `research/lead-magnet-final.md` (141 linii, "Kodeks Cebularza", gotowy do Canva)

### 🟡 Batch 3 — Growth

**G5. Email sequences — onboarding drip (3 maile)** ✅ DONE
- [x] Output: `research/email-onboarding-sequence.md` (87 linii, 3 maile z subject/preheader/body)

**G6. Opisy na Google Ads — rozszerzenia (sitelinks, callouts)** ✅ DONE
- [x] Output: `research/google-ads-extensions.md` (62 linie, sitelinks + callouts + snippets)

**G7. Testimonials / social proof copy** ✅ DONE
- [x] Output: `research/testimonials.md` (56 linii, 10 opinii z imionami/kwotami/bankami)

**G8. Analiza keyword gaps vs konkurencja** ✅ DONE
- [x] Output: `research/keyword-gap-analysis.md` (56 linii, 3 konkurentów, gaps + rekomendacje)

### 🟢 Batch 4 — Content & TikTok Prep

**G9. Blog batch 6 — keyword gaps** ✅ DONE
- [x] 5 artykułów w `research/content/blog-batch-6/` (keyword gaps)
- [x] H2/H3, FAQ, internal links do /bank/[slug] i /slownik

**G10. TikTok skrypty — 10 scenariuszy** ✅ DONE
- [x] Output: `research/tiktok-scripts-batch1.md`

**G11. Pepper.pl szablony postów** ✅ DONE
- [x] Output: `research/pepper-post-templates.md`

**G12. Porównania banków — content do hub pages** ✅ DONE
- [x] Output: `research/bank-hub-descriptions.md`

**G13. FAQ — najczęstsze pytania użytkowników** ✅ DONE
- [x] Output: `research/user-faq-expanded.md`

---

## Backlog — Windsurf (feature branches)

**WAŻNE:** Każdy branch twórz z main: `git checkout main && git pull && git checkout -b feature/xyz`

### 🔴 Priorytet wysoki

**W1. Testimonials / Social Proof sekcja** ✅ DONE (merged)
- [x] Komponent `Testimonials.tsx` (194 linii) — karuzela 6 opinii z paginacją, gwiazdki, kwoty
- [x] Umieszczone na stronie głównej pod FAQ

**W2. Lead Magnet download page** ✅ DONE (merged)
- [x] Strona `/przewodnik` (204 linii) — opis PDF + LeadMagnetForm, 6 rozdziałów, trust signals
- [x] Newsletter z source="lead-magnet". Czeka na: Jarek (Canva design PDF)

**W3. Strona /dla-firm** ✅ DONE (merged)
- [x] Landing page (274 linii) — filtr ofert firmowych, hero, 3 trust signals, FAQ (5 pytań)
- [x] JSON-LD, SEO metadata, breadcrumbs

**W4. Blog kategorie / tagi** ✅ DONE (merged)
- [x] Strona `/blog/kategoria/[tag]` (319 linii) — generateStaticParams, tag cloud, normalizacja PL znaków
- [x] Breadcrumbs, SEO, nawigacja po tagach

**W5. Archiwum ofert rozbudowa** ✅ DONE (merged)
- [x] ArchiveFilters.tsx (309 linii) — search, bank pills, reward range (≤200, 201-400, >400 zł)
- [x] Statystyki: łącznie ofert, banków, suma premii, najwyższa

### 🟢 Batch 2

**W6. Strona /faq** ✅ DONE (merged)
- [x] Strona `/faq` z 20 pytaniami, FAQPage JSON-LD, Accordion, search
- [x] Bazuje na `research/user-faq-expanded.md` (Gemini G13)

**W7. Strona /jak-zarabiac** ✅ DONE (merged)
- [x] Landing `/jak-zarabiac` — 5 kroków, HowTo JSON-LD, `pluralize.ts`
- [x] Dodano disclaimer Omnibus przy kwotach zarobków (Claude fix)

**W8. Hub pages upgrade — opisy banków** ✅ DONE (merged)
- [x] Opisy 6 banków z Gemini G12, plusy/minusy, "dla kogo", historia
- [x] Button asChild fix (proaktywnie), slug fix pko-polski→pekao (Claude)

**W9. Monthly leaderboard** ⏸️ ZWRÓCONY DO POPRAWKI
- [ ] Brak auth na API (GDPR risk) — dodaj session check
- [ ] Dead code: query na `profiles` table (nie istnieje) — usuń
- [ ] "Monthly" ale agreguje all-time — dodaj filtr lub zmień etykietę
- [ ] Inline pluralizacja z bugiem — użyj `@/lib/pluralize`
- [ ] Przenieś type z API route do `@/data/types.ts`

**W10. Strona /kalkulator** ✅ DONE (merged)
- [x] Kalkulator z filtrami (dochód, trudność, konta/mies), projekcja 3/6/12 mies
- [x] Zamieniono `<img>` na next/image, usunięto role="button", dodano disclaimer (Claude fix)

---

## Backlog — Jarek (ręczna praca, konfiguracja platform)

> Bez tych tasków nie odblokujemy ruchu na stronie. Priorytet od góry.

### 🔴 Sprint 4 — Odblokowanie dystrybucji

**J1. Google Search Console** (~15 min)
- [ ] Zweryfikuj domenę cebulazysku.pl w GSC (DNS TXT lub HTML tag)
- [ ] Submit sitemap: `cebulazysku.pl/sitemap.xml`
- [ ] Sprawdź indexowanie: ile stron zaindexowanych, jakie errory
- [ ] Podaj Claude dane do GSC API (Service Account JSON) → odblokuje C9 (admin SEO pełny)

**J2. Social media — konta** (~1h łącznie)
- [ ] Załóż Facebook Page "CebulaZysku.pl"
- [ ] Załóż Instagram Professional (połącz z FB Page)
- [ ] Załóż TikTok Business Account (tiktok.com/business)
- [ ] Załóż kanał YouTube "CebulaZysku"
- [ ] Na każdym profilu ustaw link w bio → cebulazysku.pl/link

**J3. Import GTM container + weryfikacja GA4** (~10 min)
- [ ] Zaimportuj GTM container (plik JSON w repo) do Google Tag Manager
- [ ] Publish container
- [ ] Wejdź na cebulazysku.pl, sprawdź GA4 Realtime — czy widać eventy

**J4. Community seeding — start** (~15 min/dzień, ongoing)
- [ ] Załóż konto na Reddit (r/polska, r/finanse)
- [ ] Załóż konto na Wykop (mikroblog)
- [ ] Dołącz do FB grup "Promocje bankowe", "Oszczędzanie"
- [ ] Zacznij odpowiadać na pytania o premie — 80% wartość, 20% link do CebulaZysku
- [ ] Zgłoś pierwszy deal na Pepper.pl (szablon: Claude C18)

### 🟡 Później — Video Pipeline unblock

**J5. ElevenLabs upgrade** (~5 min)
- [ ] Upgrade plan do Creator ($22/mies) lub Pro ($99/mies)
- [ ] Podaj Claude nowy API key jeśli się zmienił
- [ ] **Odblokuje:** C8 (voiceover regen), C11 (TikTok pipeline)

**J6. VPS (Hetzner)** (~15 min)
- [ ] Zamów Hetzner CX22 (~€4/mies)
- [ ] Podaj IP + SSH key Claude → setup Docker + n8n
- [ ] **Odblokuje:** C11 (TikTok video render), C12 (auto content pipeline)

**J7. Lead Magnet PDF — Canva design** (~1-2h)
- [ ] Weź treść z `research/lead-magnet-final.md` (141 linii, gotowe)
- [ ] Zaprojektuj PDF w Canva (10-15 stron, "Kodeks Cebularza 2026")
- [ ] Upload do `/public/przewodnik-cebularza.pdf`
- [ ] **Odblokuje:** pełna strona /przewodnik z downloadem

---

## Zależności

```
Gemini G1 (blog batch 5 DONE) ─────► Claude C14 (DONE)
Gemini G5 (email sequence DONE) ───► Claude C15 (DONE)
Gemini G12 (DONE) ────────────────► Windsurf W8 (ODBLOKOWANY)
Gemini G13 (DONE) ────────────────► Windsurf W6 (ODBLOKOWANY)
Jarek J5 (ElevenLabs) ────────────► Claude C8 (voiceover regen) + C11 (TikTok)
Jarek J6 (VPS) ───────────────────► Claude C11 (TikTok render) + C12 (auto pipeline)
Jarek J7 (Canva PDF) ─────────────► strona /przewodnik pełna
Jarek J1 (GSC) ───────────────────► Claude C9 (admin SEO - GSC integration)
Jarek J3 (GTM import) ────────────► GA4 data collection starts
Gemini G10 (TikTok scripts) ──────► Claude C11 (scenariusze do renderowania)
```

---

## Done

| Data | Zadanie | Worker |
|------|---------|--------|
| 2026-03-30 | W6-W8,W10 merged: /faq, /jak-zarabiac, hub descriptions, /kalkulator. W9 zwrócony. | Windsurf → merged |
| 2026-03-30 | C14-C18: Blog import, drip emails (4 maile + cron), streak reminder, referral email, Pepper generator | Claude Code |
| 2026-03-30 | Gemini batch 4 complete (G9-G13: blog batch 6, TikTok scripts, Pepper templates, bank descriptions, FAQ) | Gemini |
| 2026-03-28 | C13: Referral widget upgrade (prominent card, WhatsApp, progress bar) | Claude Code |
| 2026-03-26 | Gemini batch 2+3 complete (G1-G8: 8 research files) | Gemini |
| 2026-03-26 | Windsurf batch complete (W1-W5: testimonials, przewodnik, dla-firm, blog tags, archiwum) | Windsurf → merged |
| 2026-03-26 | Sprint 1 (C1-C5): FAQ, internal linking, sticky CTA, A/B hero, persona /o-nas | Claude Code |
| 2026-03-26 | Sprint 2 (C6-C10): welcome email A/B, admin SEO, GA4 dimensions | Claude Code |
| 2026-03-26 | Newsletter system (full: API, templates, popup, inline, cron, admin) | Claude Code |
| 2026-03-26 | Bio link /link + ShareButtons + OG images | Claude Code |
| 2026-03-26 | Hub pages /bank/[slug] (10 stron) | Windsurf → merged |
| 2026-03-26 | Glossary /slownik + GlossaryTooltip | Windsurf → merged |
| 2026-03-26 | Porównywarka /porownanie/[slug] (28 stron) | Windsurf → merged |
| 2026-03-26 | PremiumCalculator component | Windsurf → merged |
| 2026-03-26 | Landing /pierwsze-konto | Windsurf → merged |
| 2026-03-26 | 12 blogów zaimportowanych do DB | Claude Code |
| 2026-03-26 | Gemini batch 1 complete (20+ research files) | Gemini |
| 2026-03-25 | WINDSURF.md, AI-TASKS.md, marketing tasks | Claude Code |
| 2026-03-24 | GTM + consent mode fix | Claude Code |
| ≤2026-03-19 | Słownik tooltipów, FAQ JSON, blog batch 3, Conversand, breadcrumbs | Gemini |
| ≤2026-03-18 | Multi-source affiliates, Canva, Homepage FAQ | Claude Code |

---

## Pliki — kto rusza co

### Claude Code — `main` branch
- Wszystko w `src/` (jedyny kto edytuje istniejące pliki)
- `supabase/migrations/*` (numeracja od 028)
- Config files, `CLAUDE.md`, `AI-TASKS.md` (jedyny editor)
- `tasks/`, `docs/`

### Gemini — nie commituje, nie edytuje AI-TASKS.md
- `research/*` (nowe pliki)
- Raportuje wyniki do Jarka, Claude Code aktualizuje tablicę

### Windsurf — `feature/*` branches (z main!)
- NOWE pliki w `src/app/` (nowe strony, nowe komponenty)
- **NIE rusza:** istniejących plików w `src/`, `src/lib/`, config, migracji
- Po zakończeniu: raportuj do Jarka, Claude Code robi cherry-pick/merge
