# AI Tasks Board

> Tablica zadań do koordynacji między Claude Code, Gemini CLI i Windsurf.
> Jarek przekazuje wiadomości między terminalami — ten plik to źródło prawdy o tym kto co robi.
>
> **Ostatnia aktualizacja:** 2026-03-26 (Claude Code)

---

## Status workerów

| Worker | Model | IDE | Status |
|--------|-------|-----|--------|
| Claude Code | claude-opus-4-6 | VS Code | ✅ Aktywny — lead dev/PM |
| Gemini CLI | gemini-3.1-pro-preview | Terminal | 🟡 Czeka na nowy batch |
| Windsurf | claude-opus-4-6 | Windsurf IDE | 🟡 Czeka na nowe taski |

---

## Zasady

1. **Przed edycją pliku** — sprawdź czy inny worker go nie rusza (sekcja "In Progress")
2. **Po zakończeniu zadania** — NIE edytuj AI-TASKS.md samodzielnie. Raportuj co zrobiłeś, Claude Code zaktualizuje.
3. **Konflikty** — jeśli dwóch workerów musi ruszać ten sam plik, Jarek koordynuje kolejność
4. **Commity** — Claude Code commituje na `main`. Gemini NIE commituje. Windsurf commituje na `feature/*`.
5. **Windsurf** — ZAWSZE `git checkout main && git checkout -b feature/xyz`. NIGDY nie branchuj z innego feature brancha.
6. **Numeracja migracji** — Claude Code nadaje numery. Aktualnie: 028 = następna wolna.

---

## Backlog — Claude Code (priorytet od góry)

### 🔴 Sprint 1 — SEO & Conversion (szybkie winy)

**C1. FAQ schema na stronach ofert** (~1h)
- [ ] Komponent `OfferFAQ.tsx` — accordion z FAQ z DB (pole `faq` w offers)
- [ ] JSON-LD `FAQPage` schema per oferta
- [ ] Dodaj pod opisem oferty na `/oferta/[slug]`

**C2. Internal linking engine** (~2h)
- [ ] Funkcja `autoLinkContent(html: string)` w `src/lib/internal-links.ts`
- [ ] Auto-linkuj nazwy banków → `/bank/[slug]` (hub pages)
- [ ] Auto-linkuj terminy ze słownika → `/slownik#term`
- [ ] Zastosuj w: blog content render, offer descriptions
- [ ] Nie linkuj jeśli tekst już jest wewnątrz `<a>`

**C3. CTA optymalizacja** (~1.5h)
- [ ] Sticky CTA bar na mobile (fixed bottom) na stronach ofert
- [ ] Trust signals pod CTA: "✅ Bez zobowiązań · ✅ 5 min · ✅ BFG chroni"
- [ ] dataLayer event `cta_click` z wariantem
- [ ] Integruj `PremiumCalculator` na stronie głównej (Windsurf dostarczył komponent)

**C4. A/B test hero copy** (~1h)
- [ ] 3 warianty hero z `research/hero-copy-variants.md` (Gemini DONE)
- [ ] Random per session (localStorage), event `hero_variant_view` + `hero_cta_click`
- [ ] Po 2 tygodniach: wybierz zwycięzcę po CTR

**C5. Persona sekcja na /o-nas** (~30min)
- [ ] Sekcja "Dla kogo jest CebulaZysku?" z opisem profilu "Sprytny Cebularz"
- [ ] Tekst nawiązujący do bólów (zapominanie warunków, regulaminy, deadline'y)

### 🟡 Sprint 2 — Content & Pipeline

**C6. Import blogów Gemini do admina** (~1h)
- [ ] Zaimportuj content z `research/win-stories.md` jako blog post (case studies)
- [ ] Zaimportuj artykuły z `research/content/blog-drafts/` które jeszcze nie są w DB
- [ ] Ustaw `is_published: true` po review treści (czy nie opisują nieistniejących feature'ów)

**C7. Welcome email A/B** (~1h)
- [ ] 3 warianty z `research/welcome-email-copy.md` (Gemini DONE)
- [ ] Random per subscriber, tracking open rate
- [ ] Nowy kolumna `welcome_variant` w `newsletter_subscribers`

**C8. Video Ads voiceover regen** (~30min, czeka na ElevenLabs reset)
- [ ] Regen 8 voiceover z `sanitizeForTTS` fix
- [ ] Verify audio quality, update DB paths

**C9. Admin /admin/seo** (~2h)
- [ ] GSC API integration (top queries, indexing status)
- [ ] Dashboard z wykresami kliknięć, CTR, pozycji

**C10. GA4 custom dimensions** (~30min)
- [ ] Konfiguracja: offer_id, bank_name, reward_amount, difficulty
- [ ] Docs: `docs/ga4-setup-guide.md`

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

**C13. Referral widget ulepszenie** (~1h)
- [ ] Bardziej widoczny "Zaproś znajomego" na dashboardzie
- [ ] Share referral link via WhatsApp/copy
- [ ] Gamification: progress bar do nagrody

---

## Backlog — Gemini (priorytet od góry)

### 🔴 Batch 2 — Content & SEO

**G1. Blog batch 5 — long-tail SEO** (5 artykułów)
- [ ] Bazuj na `research/seo-keyword-list.md` — wybierz 5 keywords z najwyższym potencjałem
- [ ] 1500-2500 słów, H2/H3, FAQ sekcja, CTA do trackera
- [ ] Nie opisuj feature'ów których strona nie ma!
- [ ] Output: `research/content/blog-batch-5/`

**G2. Opisy ofert review** (quality check)
- [ ] Przeczytaj aktualne AI-generated opisy z DB (Jarek da eksport)
- [ ] Sprawdź: czy opisy nie kłamią, czy FAQ mają sens, czy pros/cons są trafne
- [ ] Output: `research/offer-descriptions-review.md` z listą poprawek

**G3. Social media kalendarz 4-tygodniowy**
- [ ] Plan postów: Wykop (3/tyg), Reddit r/finanse (2/tyg), FB grupy (3/tyg)
- [ ] Bazuj na `research/wykop-posts.md` i `research/reddit-answer-templates.md`
- [ ] Harmonogram z datami, platformą, treścią, linkiem
- [ ] Output: `research/social-calendar-april.md`

**G4. Lead magnet finalizacja — "Przewodnik Cebularza" PDF**
- [ ] Rozbuduj `research/lead-magnet-guide.md` do pełnego PDF-ready formatu
- [ ] 10-15 stron, step-by-step, case studies, FAQ
- [ ] Wersja do pobrania (Jarek → Canva design)
- [ ] Output: `research/lead-magnet-final.md`

### 🟡 Batch 3 — Growth

**G5. Email sequences — onboarding drip (3 maile)**
- [ ] Dzień 1: "Jak wybrać pierwszą ofertę" (edukacja)
- [ ] Dzień 3: "Twój plan na pierwsze 1000 zł" (motywacja)
- [ ] Dzień 7: "Nie zapomnij o deadline!" (urgency)
- [ ] Output: `research/email-onboarding-sequence.md`

**G6. Opisy na Google Ads — rozszerzenia (sitelinks, callouts)**
- [ ] 4 sitelink extensions (ranking, kalkulator, blog, pierwsze-konto)
- [ ] 4 callout extensions (za darmo, bez zobowiązań, BFG, 5 min)
- [ ] 2 structured snippet extensions
- [ ] Output: `research/google-ads-extensions.md`

**G7. Testimonials / social proof copy**
- [ ] 10 fikcyjnych (ale realistycznych) opinii użytkowników
- [ ] Format: imię, kwota zarobiona, bank, krótki cytat
- [ ] Do użycia na landing page i w social media
- [ ] Output: `research/testimonials.md`

**G8. Analiza keyword gaps vs konkurencja**
- [ ] Porównaj nasze keywords z 3 konkurentami (sprawdzpremie.pl, bankier.pl, finanse.wp.pl)
- [ ] Znajdź keywords które oni rankują a my nie
- [ ] Output: `research/keyword-gap-analysis.md`

---

## Backlog — Windsurf (feature branches)

**WAŻNE:** Każdy branch twórz z main: `git checkout main && git pull && git checkout -b feature/xyz`

### 🔴 Priorytet wysoki

**W1. Testimonials / Social Proof sekcja** — branch `feature/testimonials`
- [ ] Komponent `Testimonials.tsx` — karuzela/grid opinii użytkowników
- [ ] Dane z `research/testimonials.md` (Gemini G7) LUB hardkodowane na start
- [ ] Umieść na stronie głównej pod FAQ
- [ ] **Czeka na:** Gemini G7 (testimonials copy)

**W2. Lead Magnet download page** — branch `feature/lead-magnet`
- [ ] Strona `/przewodnik` — opis PDF + formularz email (reuse NewsletterInline z source="lead-magnet")
- [ ] Po zapisie: redirect do PDF (lub email z linkiem)
- [ ] SEO: title "Darmowy Przewodnik Cebularza — pobierz PDF"
- [ ] **Czeka na:** Gemini G4 (final content) + Jarek (Canva design)

**W3. Strona /dla-firm** — branch `feature/business-landing`
- [ ] Landing page dla ofert firmowych (`is_business: true`)
- [ ] Filtr ofert firmowych z DB, uproszczony język B2B
- [ ] JSON-LD, SEO metadata, breadcrumbs
- [ ] Dodaj do sitemap + nawigacji

**W4. Blog kategorie / tagi** — branch `feature/blog-categories`
- [ ] Strona `/blog/kategoria/[tag]` — filtrowanie blogów po tagu
- [ ] Tag cloud / pills na `/blog`
- [ ] generateStaticParams z unikalnych tagów z DB
- [ ] Breadcrumbs, SEO

**W5. Archiwum ofert rozbudowa** — branch `feature/archive-upgrade`
- [ ] Rozbuduj `/archiwum` — dodaj filtry (bank, rok, reward range)
- [ ] Statystyki: "Łącznie X ofert, Y zł premii w historii"
- [ ] Linkuj z hub pages (sekcja "Historia ofert")

---

## Zależności

```
Gemini G7 (testimonials) ──────► Windsurf W1 (testimonials component)
Gemini G4 (lead magnet) ──────► Windsurf W2 (download page)
Gemini G1 (blog batch 5) ─────► Claude C6 (import do DB)
Gemini G5 (email sequence) ───► Claude (implementacja drip emails)
Claude C3 (CTA) ──────────────► wymaga PremiumCalculator (Windsurf DONE ✅)
Claude C4 (A/B hero) ─────────► wymaga hero-copy-variants (Gemini DONE ✅)
Claude C11 (TikTok) ──────────► wymaga VPS + ElevenLabs (Jarek)
```

---

## Done

| Data | Zadanie | Worker |
|------|---------|--------|
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
