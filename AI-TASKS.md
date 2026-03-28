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
| Gemini CLI | gemini-3.1-pro-preview | Terminal | ✅ Batch 2+3 DONE — czeka na nowy batch |
| Windsurf | claude-opus-4-6 | Windsurf IDE | ✅ W1-W5 DONE — czeka na nowe taski |

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

---

## Zależności

```
✅ Gemini G7 → Windsurf W1 (oba DONE)
✅ Gemini G4 → Windsurf W2 (oba DONE)
Gemini G1 (blog batch 5 DONE) ─────► Claude: import do DB (TODO)
Gemini G5 (email sequence DONE) ───► Claude: implementacja drip emails (TODO)
Claude C11 (TikTok) ──────────────► wymaga VPS + ElevenLabs (Jarek)
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
