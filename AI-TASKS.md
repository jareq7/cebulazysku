# AI Tasks Board

> Tablica zadań do koordynacji między Claude Code, Gemini CLI i Windsurf.
> Jarek przekazuje wiadomości między terminalami — ten plik to źródło prawdy o tym kto co robi.
>
> **Ostatnia aktualizacja:** 2026-03-28 (Claude Code)

---

## Status workerów

| Worker | Model | IDE | Status |
|--------|-------|-----|--------|
| Claude Code | claude-opus-4-6 | VS Code | ✅ Aktywny — lead dev/PM |
| Gemini CLI | gemini-3.1-pro-preview | Terminal | 📋 Batch 4 gotowy (G9-G13) |
| Windsurf | claude-opus-4-6 | Windsurf IDE | 📋 Batch 2 gotowy (W6-W10, W6/W8 czekają na Gemini) |

---

## Zasady

1. **Przed edycją pliku** — sprawdź czy inny worker go nie rusza (sekcja "In Progress")
2. **Po zakończeniu zadania** — NIE edytuj AI-TASKS.md samodzielnie. Raportuj co zrobiłeś, Claude Code zaktualizuje.
3. **Konflikty** — jeśli dwóch workerów musi ruszać ten sam plik, Jarek koordynuje kolejność
4. **Commity** — Claude Code commituje na `main`. Gemini NIE commituje. Windsurf commituje na `feature/*`.
5. **Windsurf** — ZAWSZE `git checkout main && git checkout -b feature/xyz`. NIGDY nie branchuj z innego feature brancha.
6. **Numeracja migracji** — Claude Code nadaje numery. Aktualnie: 029 = następna wolna.

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

**C14. Import blog batch 5 do DB** (~30 min)
- [ ] Import 5 artykułów z `research/content/blog-batch-5/` do Supabase (via admin API)
- [ ] Sprawdź czy treści nie opisują nieistniejących feature'ów
- [ ] Tagowanie: przypisz tagi do każdego artykułu

**C15. Drip email sequence — 3 maile onboardingowe** (~2h)
- [ ] Treść z `research/email-onboarding-sequence.md` (Gemini G5)
- [ ] Nowa tabela/kolumna: `onboarding_step` w `newsletter_subscribers` (migracja 029)
- [ ] Cron `/api/cron/email-onboarding` — dzień 1/3/7 po rejestracji
- [ ] Szablony email w `email-templates.ts` (3 warianty)
- [ ] Deduplikacja: nie wysyłaj jeśli już wysłano ten krok

**C16. Streak break push notification** (~1h)
- [ ] Cron: sprawdź kto stracił streak (ostatnia aktywność >24h)
- [ ] Push notification "Wróć! Tracisz swój streak 🔥"
- [ ] Email fallback dla userów bez push
- [ ] Max 1 notification per streak break (nie spamuj)

**C17. Email "Poleć znajomemu"** (~30 min)
- [ ] Szablon email z referral kodem + linkiem
- [ ] Trigger: 7 dni po rejestracji (w ramach drip sequence)
- [ ] CTA "Wyślij zaproszenie" z WhatsApp deeplink

**C18. Pepper.pl post generator w adminie** (~1h)
- [ ] Nowa sekcja w admin: "Marketing Tools"
- [ ] Auto-generuj post na Pepper.pl per oferta (szablon + dane z DB)
- [ ] Copy to clipboard, UTM tracking link

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

**G9. Blog batch 6 — keyword gaps** (5 artykułów)
- [ ] Bazuj na `research/keyword-gap-analysis.md` — wybierz 5 keywords z gaps
- [ ] 1500-2500 słów, H2/H3, FAQ, internal links do /bank/[slug] i /slownik
- [ ] Nie opisuj feature'ów których strona nie ma!
- [ ] Output: `research/content/blog-batch-6/`

**G10. TikTok skrypty — 10 scenariuszy** (prep dla C11)
- [ ] Input: aktualne oferty z cebulazysku.pl (Jarek da listę)
- [ ] 10 skryptów, max 140 słów każdy
- [ ] Warianty hooków: pytanie/szok/kontrowersja/historia
- [ ] Cebulowy humor, dynamiczny ton, CTA
- [ ] Output: `research/tiktok-scripts-batch1.md`

**G11. Pepper.pl szablony postów** (10 szablonów)
- [ ] Zbadaj format popularnych deali na Pepper.pl
- [ ] 10 szablonów do ofert bankowych (tytuł, opis, instrukcja)
- [ ] Output: `research/pepper-post-templates.md`

**G12. Porównania banków — content do hub pages**
- [ ] Dla 6 największych banków: mBank, PKO, Santander, ING, Alior, BNP
- [ ] Per bank: krótki opis (2-3 zdania), plusy/minusy, „dla kogo", historia promocji
- [ ] Output: `research/bank-hub-descriptions.md`

**G13. FAQ — najczęstsze pytania użytkowników**
- [ ] 20 najczęstszych pytań o promocje bankowe (z perspektywy usera)
- [ ] Odpowiedzi SEO-friendly, 3-5 zdań każda
- [ ] Do użycia: strona /faq, JSON-LD, snippet optimization
- [ ] Output: `research/user-faq-expanded.md`

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

**W6. Strona /faq** — branch `feature/faq-page`
- [ ] Strona `/faq` z pytaniami pogrupowanymi po kategorii
- [ ] JSON-LD FAQPage schema (cała strona)
- [ ] Accordion UI (shadcn Accordion), search/filter
- [ ] Bazuj na danych z `research/user-faq-expanded.md` (Gemini G13)
- [ ] **Czeka na:** Gemini G13

**W7. Strona /jak-zarabiac — poradnik krok po kroku** — branch `feature/how-to-earn`
- [ ] Landing `/jak-zarabiac` — 5 kroków ilustrowanych (wybierz bank → otwórz konto → spełnij warunki → zgarnij premię → powtórz)
- [ ] Ilustracje/ikony per krok, CTA do rankingu
- [ ] SEO: "jak zarabiać na promocjach bankowych"
- [ ] JSON-LD HowTo schema

**W8. Hub pages upgrade — opisy banków** — branch `feature/hub-upgrade`
- [ ] Dodaj opisy banków z `research/bank-hub-descriptions.md` (Gemini G12) do `/bank/[slug]`
- [ ] Sekcja "O banku", plusy/minusy, "dla kogo"
- [ ] **Czeka na:** Gemini G12

**W9. Monthly leaderboard** — branch `feature/leaderboard`
- [ ] Komponent `Leaderboard.tsx` — top 10 userów po obranych premiach
- [ ] Na dashboardzie pod achievements
- [ ] Anonimizacja: "Cebularz #1", "Cebularz #2" (chyba że user ustawi nick)

**W10. Strona /kalkulator** — branch `feature/calculator-page`
- [ ] Dedykowana strona z PremiumCalculator (reuse z homepage)
- [ ] Rozszerzone opcje: ile kont, jak długo, trudność
- [ ] SEO: "kalkulator premii bankowych"
- [ ] Wynik: "W 6 miesięcy możesz zarobić X zł" + lista ofert

---

## Zależności

```
Gemini G1 (blog batch 5 DONE) ─────► Claude C14 (import do DB)
Gemini G5 (email sequence DONE) ───► Claude C15 (drip emails)
Gemini G12 (bank descriptions) ────► Windsurf W8 (hub upgrade)
Gemini G13 (user FAQ) ─────────────► Windsurf W6 (/faq page)
Claude C11 (TikTok) ──────────────► wymaga VPS + ElevenLabs (Jarek)
Gemini G10 (TikTok scripts) ──────► Claude C11 (scenariusze do renderowania)
```

---

## Done

| Data | Zadanie | Worker |
|------|---------|--------|
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
