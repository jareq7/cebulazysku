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
| Gemini CLI | gemini-3.1-pro-preview | Terminal | ✅ Aktywny — research/content |
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
| UI Components Upgrade — 7 komponentów | Claude Code | `main`, `tasks/tasks-ui-components-upgrade.md` | PRD gotowy, FAQ done |

---

## Backlog — Claude Code (priorytet od góry)

### 🔴 Priorytet wysoki
- [ ] **Bio link page `/link`** — strona z TOP ofertami do linkowania z TikTok/IG bio. Mobile-first, UTM tracking, ISR. (~1h)
- [ ] **Social share buttons** — FB, X, WhatsApp, kopiuj link na stronach ofert + blog. Event `share` w dataLayer. (~1h)
- [ ] **Newsletter system** — PRD → Tasks → implementacja: Resend, subscribe/unsubscribe API, welcome email, weekly digest cron, deadline alerts, admin panel. Gemini ma template HTML (`research/newsletter-template.html`).
- [ ] **Lead magnet popup** — `NewsletterPopup.tsx`: po 30s/scroll 50%, email capture, localStorage dismiss, tracking.

### 🟡 Priorytet średni
- [ ] **OG images audit** — sprawdź czy wszystkie oferty mają poprawne og:image (1200×630)
- [ ] **FAQ schema na stronach ofert** — `OfferFAQ.tsx`: accordion + JSON-LD FAQPage per oferta
- [ ] **TikTok video pipeline** — PRD gotowy (`tasks/prd-tiktok-pipeline.md`). Wymaga: tasks breakdown → `TikTokVideo.tsx`, `HormoziCaptions.tsx`, Whisper, `social-publish.ts`, n8n workflow. Blokowany przez VPS + ElevenLabs upgrade.
- [ ] **Internal linking engine** — auto-link nazw banków → hub pages, terminów → słownik, ofert → strony ofert w blogach
- [ ] **Video Ads voiceover regen** — po resecie ElevenLabs: regen 8 voiceover z `sanitizeForTTS` fix
- [ ] **CTA optymalizacja** — A/B test copy na stronach ofert, sticky CTA mobile, trust signals

### 🟢 Priorytet niski
- [ ] **Newsletter inline signup** — formularz na dole artykułów blogowych
- [ ] **Referral widget ulepszenie** — bardziej widoczny "Zaproś znajomego" na dashboardzie
- [ ] **Admin /admin/seo** — GSC API integration (top queries, indexing status)
- [ ] **Admin /admin/newsletter** — lista subskrybentów, stats, export CSV
- [ ] **Autonomiczny content pipeline** — n8n: nowa oferta → AI blog + TikTok + email blast. Wymaga PRD.
- [ ] **Admin panel rozbudowa** — wykresy trendów, alerting. Wymaga PRD.
- [ ] **GA4 setup guide** — custom dimensions (offer_id, bank_name, reward_amount, difficulty). Zapisz do `docs/ga4-setup-guide.md`.

---

## Backlog — Gemini (priorytet od góry)

### 🔴 Priorytet wysoki (blokuje inne taski)
- [ ] **SEO keyword research** — 20 long-tail keywords z estymowanym volumem. Tematy: "jak zdobyć premię [bank]", "warunki promocji [bank]", generyczne. Output: `research/seo-keyword-list.md`
- [ ] **Blog batch 4 — 5 artykułów long-tail** — bazuj na keyword research. 1500-2500 słów, H2/H3, FAQ, CTA do trackera. Output: `research/content/blog-batch-4/`
- [ ] **Bank SEO copy** — opisy 5 banków (BNP, mBank, ING, Santander, PKO) do hub pages. USP, historia ofert, 2-3 akapity. Output: `research/bank-seo-copy.json`

### 🟡 Priorytet średni
- [ ] **TikTok skrypty Hack** — 15 gotowych skryptów (3 per bank × 5 banków). Hook/szok/prowokacja, max 140 słów. Output: `research/tiktok-scripts-hack.md`
- [ ] **TikTok skrypty Storytime** — 10 skryptów narracyjnych. Pierwsza osoba, emocjonalne. Output: `research/tiktok-scripts-storytime.md`
- [ ] **TikTok Challenge arc** — 12-tygodniowy plan serialu "Wyzwanie 3000 zł". Output: `research/tiktok-challenge-arc.md`
- [ ] **TikTok skrypty Edukacja** — 10 tematów (BIK, MCC, podatki, karencja...). Output: `research/tiktok-scripts-education.md`
- [ ] **Blog artykuły porównawcze** — 5 artykułów "X vs Y" (BNP vs mBank, ING vs Santander, etc.). Output: `research/content/comparisons/`
- [ ] **Blog artykuły "Ile zarobić"** — 3 artykuły: 1000/3000/5000 zł na premiach. Output: `research/content/how-much/`
- [ ] **Blog artykuły dla Noobów** — 5 artykułów (pierwsze konto, obalanie mitów, krok po kroku). Output: `research/content/noob/`

### 🟢 Priorytet niski
- [ ] **Brand book** — misja, wizja, tone of voice guidelines, do/don't. Output: `research/brand-book.md`
- [ ] **Hero copy warianty** — 3 warianty na landing page (oszczędności/narzędzie/społeczność). Output: `research/hero-copy-variants.md`
- [ ] **Welcome email copy** — 3 warianty do A/B testu. Output: `research/welcome-email-copy.md`
- [ ] **Win stories** — 6 case study "Jak użytkownik X zarobił Y zł". Output: `research/win-stories.md`
- [ ] **Reddit answer templates** — 10 szablonów odpowiedzi na typowe pytania. Output: `research/reddit-answer-templates.md`
- [ ] **Wykop/FB posty** — 5+5 gotowych postów. Output: `research/wykop-posts.md`, `research/facebook-group-posts.md`
- [ ] **Google Ads copy** — 10 wariantów (headline + description). Output: `research/google-ads-copy.md`
- [ ] **PDF lead magnet** — "Przewodnik Cebularza" 10-15 stron. Output: `research/lead-magnet-guide.md`

---

## Backlog — Windsurf (feature branches)

Szczegółowe opisy w `WINDSURF.md`. Przed startem — potwierdź z Jarkiem który feature.

- [ ] **Hub Pages per Bank** — `/bank/[slug]`, branch `feature/hub-pages`. Czeka na: bank SEO copy od Gemini.
- [ ] **Glossary `/slownik`** — branch `feature/glossary`. Dane: `research/tooltip-glossary.json` (Gemini DONE ✅).
- [ ] **Porównywarka** — `/porownanie/[slug]`, branch `feature/comparisons`. Czeka na: artykuły porównawcze od Gemini.
- [ ] **Kalkulator premii** — `PremiumCalculator.tsx`, branch `feature/calculator`.
- [ ] **Landing "Pierwsze konto"** — `/pierwsze-konto`, branch `feature/noob-landing`. Czeka na: blog artykuły dla noobów od Gemini.

---

## Zależności między workerami

```
Gemini: bank SEO copy ──────────► Windsurf: hub pages
Gemini: tooltip glossary (DONE) ─► Windsurf: glossary
Gemini: blog porównawcze ────────► Windsurf: porównywarka
Gemini: blog noob ──────────────► Windsurf: landing noob
Gemini: keyword research ────────► Gemini: blog batch 4
Gemini: TikTok scripts ─────────► Claude: TikTok pipeline
Gemini: welcome email copy ─────► Claude: newsletter system
Claude: newsletter system ──────► Claude: lead magnet popup
Claude: bio link page ──────────► Jarek: ustaw linki w bio social
```

---

## Done

| Data | Zadanie | Worker | Commit |
|------|---------|--------|--------|
| 2026-03-25 | WINDSURF.md — instrukcje dla trzeciego workera | Claude Code | `bc8e1df` |
| 2026-03-25 | Marketing strategy detailed tasks (64 tasków, ~296 subtasków) | Claude Code | `c8fc216` |
| 2026-03-24 | Marketing strategy doc + TikTok pipeline PRD | Claude Code | `43db10b` |
| 2026-03-24 | GTM container fix (measurementIdOverride) | Claude Code | `41c346f` |
| 2026-03-24 | GTM full container, consent mode fix, social auth "wkrótce" | Claude Code | `470fc45` |
| 2026-03-19 | Opisy tasków do roadmapy (JSON) | Gemini | — |
| 2026-03-19 | Conversand — manual affiliate links | Gemini | — |
| 2026-03-19 | Słownik tooltipów (JSON) + opisy trudności | Gemini | — |
| 2026-03-19 | Breadcrumb JSON-LD schema dla 3 typów podstron | Gemini | — |
| 2026-03-18 | FAQ sekcja na stronę główną (JSON z 15 pytaniami) | Gemini | — |
| 2026-03-18 | Blog batch 3 — 4 artykuły SEO | Gemini | — |
| 2026-03-18 | Multi-source affiliates — full implementation | Claude Code | feature branch → main |
| 2026-03-18 | TikTok viral AI concepts — 20 konceptów | Gemini | — |
| 2026-03-18 | Canva Connect API — pełna integracja | Claude Code | `315f78b`→`2ad3da8` |
| 2026-03-18 | Homepage FAQ — accordion + JSON-LD | Claude Code | — |
| 2026-03-18 | Newsletter template HTML | Gemini | — |
| 2026-03-18 | Analiza konkurencji (5 porównywarek) | Gemini | — |

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
