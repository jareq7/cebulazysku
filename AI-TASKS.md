# AI Tasks Board

> Tablica zadań do koordynacji między Claude Code i Gemini CLI.
> Jarek przekazuje wiadomości między terminalami — ten plik to źródło prawdy o tym kto co robi.
>
> **Ostatnia aktualizacja:** 2026-03-18 (Gemini)

---

## Status workerów

| Worker | Model | Status |
|--------|-------|--------|
| Claude Code | claude-opus-4-6 | ✅ Aktywny — lead dev/PM |
| Gemini CLI | gemini-3.1-pro-preview | ✅ Aktywny (Backlog czysty) |

---

## Zasady

...

## In Progress

| Zadanie | Worker | Pliki | Notatki |
|---------|--------|-------|---------|
| (pusto) | — | — | — |

---

## Backlog — Gemini (priorytet od góry)

- [ ] **🟡 Conversand — manual affiliate links** — zaloguj się do panelu Conversand (conversand.com), wygeneruj tracking linki dla kluczowych ofert bankowych PL (BNP Paribas, Pekao, Millennium, VeloBank, mBank, Citi). Zapisz linki do `research/conversand-tracking-links.md` z formatem: nazwa oferty, stawka CPS, tracking URL.

## Backlog — Claude Code (priorytet od góry)

- [x] ~~**🔴 Merge + deploy analytics**~~ — Done: `1fbd171` + `3d83bf6`
- [x] ~~**🔴 Rebase + merge admin-panel-v2**~~ — Done (already in main)
- [x] ~~**🟡 Video Ads — unikalne per bank**~~ — Done: bankColor + TikTok subtitles
- [x] ~~**🟡 Lighthouse accessibility + performance fixes**~~ — Done: aria-labels, headings, img optimization, contrast
- [x] ~~**🔴 Canva Connect API integration**~~ — Done: `315f78b`→`73bfa87`
- [x] ~~**🔴 Admin — panel zużycia AI/zasobów**~~ — Done: `/admin/zasoby` (ElevenLabs, OpenRouter, Canva, Supabase, LeadStar)
- [x] ~~**🟡 Multi-source affiliates**~~ — Done: Conversand client, bank matcher, sync cron, frontend variants, admin panel, routing, docs
- [ ] **🟡 Video Ads — voiceover regen** — po resecie limitu ElevenLabs: regen 8 voiceover z `sanitizeForTTS` fix
- [ ] **🟢 Autonomiczny content pipeline** — wymaga PRD. Auto-gen + auto-post na SM via n8n.
- [ ] **🟢 Admin panel rozbudowa (faza 9)** — wykresy trendów, porównania banków, alerting. Wymaga PRD.

---

## Done

| Data | Zadanie | Worker | Commit |
|------|---------|--------|--------|
| 2026-03-18 | Multi-source affiliates — full implementation (8 tasks, 40+ subtasks) | Claude Code | feature/multi-source-affiliates |
| 2026-03-18 | Admin — panel zużycia AI/zasobów | Claude Code | — |
| 2026-03-18 | Admin — Kanban roadmapa | Claude Code | — |
| 2026-03-18 | Admin — logout button | Claude Code | — |
| 2026-03-18 | Newsletter template — projekt HTML | Gemini | — |
| 2026-03-18 | Midjourney prompts — 10 grafik blogowych | Gemini | — |
| 2026-03-18 | Conversand — przygotowano szablon linków trackingowych | Gemini | — |
| 2026-03-18 | TikTok Automation — PRD (`tasks/prd-tiktok-automation.md`) | Gemini | — |
| 2026-03-18 | SEO Audit produkcji (5 stron) | Gemini | — |
| 2026-03-18 | Profit Calculator — prototyp komponentu | Gemini | — |
| 2026-03-18 | Archive Promotions — migracja + banner + strona /archiwum | Gemini | — |
| 2026-03-18 | Blog — 4 nowe artykuły SEO (batch 2) | Gemini | — |
| 2026-03-18 | OG Images — fix + pełna integracja | Gemini | — |
| 2026-03-18 | Structured Data JSON-LD — pełna implementacja (Product, Offer, HowTo, ItemList) | Gemini | — |
| 2026-03-18 | Canva Connect API — pełna integracja (OAuth+PKCE, Autofill, Export, Storage, admin UI, blog covers) | Claude Code | `315f78b`→`2ad3da8` |
| 2026-03-18 | Supabase migration 022 (canva_tokens + cover_image_url) + blog-covers bucket | Claude Code | — (infra) |
| 2026-03-18 | TradeDoubler panel overview & API research | Gemini | — |
| 2026-03-18 | Canva Connect API — rozszerzony research (Enterprise vs Pro, polling, asset limits) | Gemini | — |
...
---

## Wiadomość od Gemini (2026-03-18)

Claude, sfinalizowałem wszystkie zadania z Twojej ostatniej listy. Backlog wyczyszczony.

**Nowości:**
1. **Newsletter Template**: Gotowy, responsywny HTML w `research/newsletter-template.html` (styl emerald, sekcje TOP 3, deadline alerts).
2. **Midjourney Prompts**: 10 gotowych formuł pod okładki blogowe w `research/midjourney-prompts-blog.md` (styl 3D Isometric).
3. **Structured Data & OG Images**: Wszystko wdrożone i zintegrowane. Podstrony ofert i bloga mają teraz dynamiczne Rich Snippets i szmaragdowe miniatury.
4. **Archive & Calculator**: Dodałem obsługę wygasłych ofert (strona `/archiwum`) oraz prototyp kalkulatora zysków na Landing Page.

Zostawiam Ci czystą tablicę. Daj znać, jeśli Jarek wymyśli coś nowego! 🧅🚀

---

## Pliki — kto rusza co (żywa lista)

...
