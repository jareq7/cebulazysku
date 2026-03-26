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
| Gemini CLI | gemini-3.1-pro-preview | Terminal | ✅ Zakończył batch — czeka na nowe |
| Windsurf | claude-opus-4-6 | Windsurf IDE | ✅ Aktywny — feature branches |

---

## Zasady

1. **Przed edycją pliku** — sprawdź czy inny worker go nie rusza (sekcja "In Progress")
2. **Po zakończeniu zadania** — przenieś do "Done" z datą i krótkim opisem
3. **Konflikty** — jeśli dwóch workerów musi ruszać ten sam plik, Jarek koordynuje kolejność
4. **Po każdej edycji pliku src/** — zweryfikuj: `cat [ścieżka] | head -40`
5. **Commity** — Claude Code commituje na `main`. Gemini NIE pushuje. Windsurf commituje na `feature/*`.
6. **Windsurf** — ZAWSZE pracuje na feature branchu, NIGDY na main. Instrukcje w `WINDSURF.md`.

## Relacja z PRD/Tasks workflow

Ten plik to **tablica koordynacyjna** — NIE zastępuje flow PRD → Tasks → Code.

- **Nowe feature'y** → nadal wymagają PRD + task lista
- **Research, content, testy, SEO, audyty** → trafiają tutaj jako zadania operacyjne
- **Szczegółowy rozkład marketingu** → `tasks/tasks-marketing-strategy-detailed.md` (64 tasków, ~296 subtasków)

---

## In Progress

| Zadanie | Worker | Branch/Pliki | Notatki |
|---------|--------|-------------|---------|
| (nic aktualnie) | — | — | — |

---

## Backlog — Claude Code (priorytet od góry)

### 🔴 Priorytet wysoki
- [ ] **FAQ schema na stronach ofert** — `OfferFAQ.tsx`: accordion + JSON-LD FAQPage per oferta
- [ ] **Internal linking engine** — auto-link nazw banków → hub pages, terminów → słownik, ofert → strony ofert w blogach
- [ ] **CTA optymalizacja** — A/B test copy na stronach ofert, sticky CTA mobile, trust signals
- [ ] **Blog batch 4 — import do DB** — Gemini napisał 3 artykuły w `research/content/blog-batch-4/`, trzeba zaimportować do Supabase
- [ ] **Blog porównawcze — import** — 4 artykuły w `research/content/comparisons/`
- [ ] **Blog "Ile zarobić" — import** — 3 artykuły w `research/content/how-much/`
- [ ] **Blog Noob — import** — 2 artykuły w `research/content/noob/`

### 🟡 Priorytet średni
- [ ] **TikTok video pipeline** — PRD gotowy (`tasks/prd-tiktok-pipeline.md`). Wymaga: tasks breakdown → `TikTokVideo.tsx`, `HormoziCaptions.tsx`, Whisper, `social-publish.ts`, n8n workflow. Blokowany przez VPS + ElevenLabs upgrade.
- [ ] **Video Ads voiceover regen** — po resecie ElevenLabs: regen 8 voiceover z `sanitizeForTTS` fix
- [ ] **Referral widget ulepszenie** — bardziej widoczny "Zaproś znajomego" na dashboardzie
- [ ] **Admin /admin/seo** — GSC API integration (top queries, indexing status)
- [ ] **Autonomiczny content pipeline** — n8n: nowa oferta → AI blog + TikTok + email blast. Wymaga PRD.
- [ ] **GA4 setup guide** — custom dimensions (offer_id, bank_name, reward_amount, difficulty). Zapisz do `docs/ga4-setup-guide.md`.

---

## Backlog — Gemini (następny batch)

Cały poprzedni batch DONE. Nowe zadania do przydzielenia:
- [ ] **Blog batch 5** — następne tematy z keyword research
- [ ] **PDF lead magnet finalizacja** — "Przewodnik Cebularza" do druku/pobrania
- [ ] **Opisy ofert (AI review)** — review i poprawa istniejących AI-generated opisów
- [ ] **Social media kalendarz** — plan postów na 4 tygodnie (Wykop, Reddit, FB grupy)

---

## Backlog — Windsurf (feature branches)

Szczegółowe opisy w `WINDSURF.md`. Przed startem — potwierdź z Jarkiem który feature.

**🟢 ODBLOKOWANE (Gemini dostarczył content):**
- [ ] **Hub Pages per Bank** — `/bank/[slug]`, branch `feature/hub-pages`. Content: `research/bank-seo-copy.json` ✅
- [ ] **Glossary `/slownik`** — branch `feature/glossary`. Dane: `research/tooltip-glossary.json` ✅
- [ ] **Porównywarka** — `/porownanie/[slug]`, branch `feature/comparisons`. Content: `research/content/comparisons/` ✅
- [ ] **Landing "Pierwsze konto"** — `/pierwsze-konto`, branch `feature/noob-landing`. Content: `research/content/noob/` ✅
- [ ] **Kalkulator premii** — `PremiumCalculator.tsx`, branch `feature/calculator`. (niezależny, brak blokera)

---

## Zależności między workerami

```
Gemini: bank SEO copy ✅ ─────────► Windsurf: hub pages (ODBLOKOWANE)
Gemini: tooltip glossary ✅ ──────► Windsurf: glossary (ODBLOKOWANE)
Gemini: blog porównawcze ✅ ──────► Windsurf: porównywarka (ODBLOKOWANE)
Gemini: blog noob ✅ ─────────────► Windsurf: landing noob (ODBLOKOWANE)
Gemini: TikTok scripts ✅ ────────► Claude: TikTok pipeline (czeka na VPS/ElevenLabs)
Gemini: welcome email copy ✅ ────► Claude: newsletter system ✅ DONE
Claude: newsletter system ✅ ─────► Claude: lead magnet popup ✅ (popup = NewsletterPopup)
Claude: bio link page ✅ ─────────► Jarek: ustaw linki w bio social
```

---

## Done

| Data | Zadanie | Worker | Commit |
|------|---------|--------|--------|
| 2026-03-26 | Newsletter system (full) | Claude Code | `300680d` |
| 2026-03-26 | Bio link page + share buttons + OG images | Claude Code | `48e8a62`, `bfecb9b` |
| 2026-03-26 | SEO keyword research (20 keywords) | Gemini | `research/seo-keyword-list.md` |
| 2026-03-26 | Blog batch 4 (3 artykuły) | Gemini | `research/content/blog-batch-4/` |
| 2026-03-26 | Bank SEO copy (5 banków) | Gemini | `research/bank-seo-copy.json` |
| 2026-03-26 | TikTok skrypty Hack (15 scenariuszy) | Gemini | `research/tiktok-scripts-hack.md` |
| 2026-03-26 | TikTok skrypty Storytime (10 skryptów) | Gemini | `research/tiktok-scripts-storytime.md` |
| 2026-03-26 | TikTok Challenge arc (12 tygodni) | Gemini | `research/tiktok-challenge-arc.md` |
| 2026-03-26 | TikTok skrypty Edukacja (10 mitów) | Gemini | `research/tiktok-scripts-education.md` |
| 2026-03-26 | Blog porównawcze (4 artykuły) | Gemini | `research/content/comparisons/` |
| 2026-03-26 | Blog "Ile zarobić" (3 artykuły) | Gemini | `research/content/how-much/` |
| 2026-03-26 | Blog Noob (2 artykuły) | Gemini | `research/content/noob/` |
| 2026-03-26 | Brand book | Gemini | `research/brand-book.md` |
| 2026-03-26 | Hero copy warianty (A/B) | Gemini | `research/hero-copy-variants.md` |
| 2026-03-26 | Welcome email copy (3 warianty) | Gemini | `research/welcome-email-copy.md` |
| 2026-03-26 | Win stories (case study) | Gemini | `research/win-stories.md` |
| 2026-03-26 | Reddit answer templates | Gemini | `research/reddit-answer-templates.md` |
| 2026-03-26 | Wykop/FB posty | Gemini | `research/wykop-posts.md` |
| 2026-03-26 | Google Ads copy (10 wariantów) | Gemini | `research/google-ads-copy.md` |
| 2026-03-26 | PDF lead magnet (draft) | Gemini | `research/lead-magnet-guide.md` |
| 2026-03-25 | WINDSURF.md — instrukcje dla trzeciego workera | Claude Code | `bc8e1df` |
| 2026-03-25 | Marketing strategy detailed tasks (64 tasków) | Claude Code | `c8fc216` |
| 2026-03-24 | Marketing strategy doc + TikTok pipeline PRD | Claude Code | `43db10b` |
| 2026-03-24 | GTM container fix (consent mode) | Claude Code | `41c346f` |
| 2026-03-19 | Opisy tasków do roadmapy (JSON) | Gemini | — |
| 2026-03-19 | Conversand — manual affiliate links | Gemini | — |
| 2026-03-19 | Słownik tooltipów (JSON) | Gemini | — |
| 2026-03-19 | Breadcrumb JSON-LD schema | Gemini | — |
| 2026-03-18 | FAQ sekcja na stronę główną | Gemini | — |
| 2026-03-18 | Blog batch 3 — 4 artykuły SEO | Gemini | — |
| 2026-03-18 | Multi-source affiliates | Claude Code | feature → main |
| 2026-03-18 | Canva Connect API | Claude Code | `315f78b`→`2ad3da8` |
| 2026-03-18 | Homepage FAQ — accordion + JSON-LD | Claude Code | — |

---

## Pliki — kto rusza co

### Claude Code — `main` branch
- Wszystko w `src/`
- `supabase/migrations/*`
- Config files, `CLAUDE.md`, `AI-TASKS.md`

### Gemini — nie commituje
- `research/*`
- `docs/04-fazy-zrealizowane.md`, `docs/99-bledy-i-rozwiazania.md`

### Windsurf — `feature/*` branches
- NOWE pliki w `src/app/bank/`, `src/app/slownik/`, `src/app/porownanie/`, `src/app/pierwsze-konto/`
- NOWE komponenty: `BankHubPage.tsx`, `GlossaryTooltip.tsx`, `ComparisonTable.tsx`, `PremiumCalculator.tsx`
- **NIE rusza:** istniejących komponentów, `src/lib/`, config, migracji, `main` branch
