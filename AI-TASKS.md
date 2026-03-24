# AI Tasks Board

> Tablica zadań do koordynacji między Claude Code i Gemini CLI.
> Jarek przekazuje wiadomości między terminalami — ten plik to źródło prawdy o tym kto co robi.
>
> **Ostatnia aktualizacja:** 2026-03-19 (Claude Code)

---

## Status workerów

| Worker | Model | Status |
|--------|-------|--------|
| Claude Code | claude-opus-4-6 | ✅ Aktywny — lead dev/PM |
| Gemini CLI | gemini-3.1-pro-preview | ✅ Aktywny (Backlog czysty) |

---

## Zasady

1. **Przed edycją pliku** — sprawdź czy drugi worker go nie rusza (sekcja "In Progress")
2. **Po zakończeniu zadania** — przenieś do "Done" z datą i krótkim opisem
3. **Konflikty** — jeśli obaj muszą ruszać ten sam plik, Jarek koordynuje kolejność
4. **Po każdej edycji pliku src/** — zweryfikuj: `cat [ścieżka] | head -40` (lekcja z page.tsx artefaktu)
5. **Commity** — robi Claude Code po review. Gemini NIE pushuje.

## Relacja z PRD/Tasks workflow

Ten plik to **tablica koordynacyjna** między workerami — NIE zastępuje flow PRD → Tasks → Code.

- **Nowe feature'y** (nowy kod, nowa funkcjonalność) → nadal wymagają PRD (`/tasks/prd-*.md`) + task lista (`/tasks/tasks-*.md`) wg `create-prd.md` i `generate-tasks.md`
- **Research, content, testy, SEO, audyty** → trafiają tutaj jako zadania operacyjne (nie potrzebują PRD)
- **Claude Code** decyduje czy zadanie wymaga PRD czy wystarczy wpis tutaj

---

## In Progress

| Zadanie | Worker | Pliki | Notatki |
|---------|--------|-------|---------|
| UI Components Upgrade — implementacja 7 komponentów | Claude Code | `tasks/tasks-ui-components-upgrade.md` | PRD gotowy, FAQ done |

---

## Backlog — Gemini (priorytet od góry)

- [ ] (Brak zadań w backlogu)

## Backlog — Claude Code (priorytet od góry)

- [x] **🔴 Migracje DB na produkcji** — ✅ Wszystkie 26 migracji zsynchronizowane (023-025 były już applied, 026 pushed)
- [ ] **🟡 Video Ads — voiceover regen** — po resecie limitu ElevenLabs: regen 8 voiceover z `sanitizeForTTS` fix
- [ ] **🟡 Newsletter system** — Resend integration: tygodniowy digest TOP 3 ofert + deadline alerts. Gemini zrobił HTML template w `research/newsletter-template.html`, teraz trzeba PRD → Tasks → API + cron + admin UI
- [x] **🟡 Homepage FAQ sekcja** — ✅ Accordion + JSON-LD FAQPage, 15 pytań, 2 kolumny
- [ ] **🔴 UI Components Upgrade** — 7 komponentów UX: Toast, Deadline Alert, Tooltip, Skeleton, Breadcrumb, Drawer, Table. PRD: `tasks/prd-ui-components-upgrade.md`, Tasks: `tasks/tasks-ui-components-upgrade.md`. Tooltip i Breadcrumb czekają na Gemini research.
- [ ] **🟡 Social sharing** — przyciski share (FB, Twitter/X, WhatsApp, kopiuj link) na stronach ofert + blog. OG images już działają (Gemini zrobił), teraz share buttons
- [ ] **🟡 TikTok video pipeline** — po dostarczeniu 20 konceptów przez Gemini: PRD → Tasks → implementacja pipeline'u (Veo/Kling → ElevenLabs → Remotion → auto-post)
- [ ] **🟢 Autonomiczny content pipeline** — wymaga PRD. Auto-gen + auto-post na SM via n8n.
- [ ] **🟢 Admin panel rozbudowa (faza 9)** — wykresy trendów, porównania banków, alerting. Wymaga PRD.

---

## Done

| Data | Zadanie | Worker | Commit |
|------|---------|--------|--------|
| 2026-03-19 | Opisy tasków do roadmapy (JSON) | Gemini | — |
| 2026-03-19 | Conversand — manual affiliate links (szablon wygenerowany) | Gemini | — |
| 2026-03-19 | Słownik tooltipów (JSON) + opisy trudności | Gemini | — |
| 2026-03-19 | Breadcrumb JSON-LD schema dla 3 typów podstron | Gemini | — |
| 2026-03-18 | FAQ sekcja na stronę główną (JSON z 15 pytaniami) | Gemini | — |
| 2026-03-18 | Blog batch 3 — 4 artykuły SEO (Markdown) | Gemini | — |
| 2026-03-18 | Analiza konkurencji — porównywarki bankowe PL (5 topowych) | Gemini | — |
| 2026-03-18 | Copywriting — CTA i 5 alternatywnych opisów ofert | Gemini | — |
| 2026-03-18 | Cebulowe memy i grafiki SM (10 formatów) | Gemini | — |
| 2026-03-18 | TikTok Viral AI — rozszerz do 20 konceptów | Gemini | — |
| 2026-03-18 | Multi-source affiliates — full implementation (8 tasks, 40+ subtasks) + merge + deploy | Claude Code | feature/multi-source-affiliates → main |
| 2026-03-18 | TikTok viral AI concepts — 4 scenariusze (Halinka, Latający Dziadek, Muskularna Cebula, Wywiad) | Gemini | research/tiktok-absurd-ai-concepts.md |
| 2026-03-18 | Admin — panel zużycia AI/zasobów | Claude Code | — |
| 2026-03-18 | Admin — Kanban roadmapa | Claude Code | — |
| 2026-03-18 | Admin — logout button | Claude Code | — |
| 2026-03-18 | Newsletter template — projekt HTML | Gemini | — |
| 2026-03-18 | Midjourney prompts — 10 grafik blogowych | Gemini | — |
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

---

## Wiadomość od Gemini (2026-03-19 Update)

Cześć Claude! Zauważyłem, że dorzuciłeś mi szybkie zadanie na biznesowe opisy do roadmapy.

**Gotowe!** Plik `research/roadmap-descriptions.json` czeka na Ciebie na dysku. Rozpisałem elegancko, w języku korzyści, po co i dla kogo robimy te wszystkie nowe feature'y. Pomoże to w zarządzaniu projektem i priorytetyzacją. 

Widziałem, że przy okazji aktualizacji AI-TASKS zniknęły mi z "Done" Tooltipy i Breadcrumbs – spokojnie, one już wczoraj wylądowały w katalogu `research/` jako gotowe pliki, nic nam nie wcięło. Mój backlog jest znów w 100% czysty, zostawiam Ci pole do popisu z tymi komponentami UX/UI! 🧅

---

## Pliki — kto rusza co (żywa lista)

### Gemini — wolne do edycji
- `scripts/*`
- `research/*`
- `docs/04-fazy-zrealizowane.md`
- `docs/99-bledy-i-rozwiazania.md` (dopisywanie)
- Meta tagi w `src/app/*/page.tsx` (tylko generateMetadata)
- **Wyjątek:** `src/app/api/og/route.tsx` (jednorazowo, draft OG images)

### Gemini — NIE ruszać
- `src/app/admin/*`
- `src/app/api/*` (poza og/route.tsx)
- `src/lib/verify-conditions-ai.ts`
- `src/lib/parse-leadstar-conditions.ts` (poza testami w scripts/)
- `src/components/*`
- `supabase/*`
- `package.json`, `tsconfig.json`, `next.config.*`
- `CLAUDE.md`, `GEMINI.md`

### Claude Code — wolne do edycji
- Wszystko w `src/`
- `supabase/migrations/*`
- Config files
- `CLAUDE.md`, `AI-TASKS.md`
