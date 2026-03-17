# AI Tasks Board

> Tablica zadań do koordynacji między Claude Code i Gemini CLI.
> Jarek przekazuje wiadomości między terminalami — ten plik to źródło prawdy o tym kto co robi.
>
> **Ostatnia aktualizacja:** 2026-03-17 (Claude Code)

---

## Status workerów

| Worker | Model | Status |
|--------|-------|--------|
| Claude Code | claude-opus-4-6 | ✅ Aktywny — lead dev/PM |
| Gemini CLI | gemini-3-pro-preview | ✅ Aktywny |

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
| Lighthouse audit | Gemini | `research/lighthouse-audit.md` | Uruchomienie lighthouse na produkcji, wypisanie quick-wins. |

---

## Backlog — Gemini (priorytet od góry)

- [ ] **Blog — kolejne 3 artykuły** — z `research/content/blog-topics.md`, output do `/research/content/blog-drafts/`
- [ ] **Structured Data audit** — sprawdź JSON-LD w projekcie, zaproponuj nowe (Product, Offer, HowTo). Output: `research/structured-data-audit.md`

## Backlog — Claude Code

- [ ] **🔴 Analytics — GTM, Consent, DataLayer, Conversions** — PRD: `tasks/prd-analytics.md`, Tasks: `tasks/tasks-analytics.md`. Fazy 1-2-4 (kod). Blokuje marketing.
- [ ] **Canva MCP setup** — podpiąć Canva AI Connector do Claude Code
- [ ] **Video Ads** — dokończyć (voiceover regen po sanitizeForTTS fix, unikalne video per bank)
- [ ] **Roadmap faza 9** — rozbudowa admin panelu (wykresy, dashboardy)

---

## Done

| Data | Zadanie | Worker | Commit |
|------|---------|--------|--------|
| 2026-03-17 | Testy parsera — rozszerzenie | Gemini | — |
| 2026-03-17 | Analytics — GTM container JSON, import guide, docs & privacy draft | Gemini | — |
| 2026-03-16 | Fix voiceover script — sync sanitizeForTTS, --force flag, bank names cleanup | Gemini | — |
| 2026-03-15 | Admin Panel v2 — warunki editor, AI logs, konwersje | Claude | `9386d4d` |
| 2026-03-15 | Admin extensions — bulk actions, tracker preview, markdown preview | Claude | `f16abc7` |
| 2026-03-15 | Parser fixes, SEO research, docs | Gemini | `f16abc7` |
| 2026-03-15 | Meta tagi, sanitizeForTTS fix, blog drafts, research | Gemini + Claude (review) | `9760e6d` |

---

## Wiadomość od Claude Code (2026-03-17)

Hej Gemini! Nowy duży feature: **Analytics** (GTM, Consent, DataLayer, Conversion Tracking). Pełne PRD: `tasks/prd-analytics.md`, task lista: `tasks/tasks-analytics.md`.

**Podział pracy:**
- **Claude Code** — cały kod w `src/`, `supabase/`, API, komponenty, hooks. Fazy 1, 2, 4.
- **Gemini** — research + content bez ruszania kodu produkcyjnego. Faza 3 + docs:

**Twoje zadania analytics (priorytet 🔴):**
1. **GTM container JSON** (`config/gtm-container-cebulazysku.json`) — gotowy kontener GTM do importu. Tagi dla 7 platform: GA4, Meta Pixel, TikTok Pixel, X Pixel, LinkedIn Insight, Google Ads (conversion + remarketing), Microsoft Ads UET. Każdy tag z consent-aware triggerem. Placeholdery na ID: `{{GA4_MEASUREMENT_ID}}`, `{{META_PIXEL_ID}}`, itd. Przeczytaj `tasks/tasks-analytics.md` faza 3.1 po szczegóły.
2. **GTM import guide** (`research/gtm-import-guide.md`) — instrukcja krok po kroku jak zaimportować kontener, lista placeholderów do podmiany z opisem skąd wziąć każdy ID, checklist weryfikacji w GTM Preview mode.
3. **Analytics docs draft** (`docs/40-analytics-gtm.md`) — architektura, lista eventów, consent flow, UTM conventions, troubleshooting. Ja zrobię review i merge.
4. **Privacy policy draft** (`research/privacy-policy-cookies.md`) — tekst prawny po polsku o cookies, GTM, consent mode, enhanced conversions, lista platform. Ja wstawię do kodu.

**Kolejność:** dokończ to co masz in progress (blog import script), potem leć z analytics taskami (🔴). Reszta backlogu (testy parsera, lighthouse, blog, structured data) ma niższy priorytet.

**Ważne:** NIE ruszaj plików w `src/`, `supabase/`, `config/` poza `config/gtm-container-cebulazysku.json`. Całą implementację kodu robię ja. Ty dostarczasz JSON + Markdown, ja integruję.

---

## Pliki — kto rusza co (żywa lista)

### Gemini — wolne do edycji
- `scripts/*`
- `research/*`
- `docs/04-fazy-zrealizowane.md`
- `docs/99-bledy-i-rozwiazania.md` (dopisywanie)
- Meta tagi w `src/app/*/page.tsx` (tylko generateMetadata)

### Gemini — NIE ruszać
- `src/app/admin/*`
- `src/app/api/*`
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
