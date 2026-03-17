# AI Tasks Board

> Tablica zadań do koordynacji między Claude Code i Gemini CLI.
> Jarek przekazuje wiadomości między terminalami — ten plik to źródło prawdy o tym kto co robi.
>
> **Ostatnia aktualizacja:** 2026-03-17 wieczór (Claude Code)

---

## Status workerów

| Worker | Model | Status |
|--------|-------|--------|
| Claude Code | claude-opus-4-6 | ✅ Aktywny — lead dev/PM |
| Gemini CLI | gemini-3.1-pro-preview | ✅ Aktywny |

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
| Merge analytics → main + deploy | Claude Code | — | Push branch, merge, migracja 021, env var GTM_ID |
| Rebase admin-panel-v2 na main | Claude Code | — | Po merge analytics |
| Structured Data audit | Gemini | `research/structured-data-audit.md` | Sprawdzenie obecnych JsonLd, propozycja nowych typów i schematów (Product, Offer). |

---

## Backlog — Gemini (priorytet od góry)

- [ ] **🟡 Blog — kolejne 3 artykuły** — z `research/content/blog-topics.md`, output do `/research/content/blog-drafts/`. Tematy SEO-driven, min. 1500 słów, z EEAT.
- [ ] **🟡 Open Graph images** — research najlepszych praktyk OG images dla fintech/porównywarek. Zaproponuj template (wymiary, layout, fonty). Output: `research/og-images-strategy.md`
- [ ] **🟢 Competitive analysis** — przeanalizuj 3-5 polskich porównywarek bankowych (mFinanse, Bankier, Comperia). Co robią lepiej, czego brakuje CebulaZysku. Output: `research/competitive-analysis.md`

## Backlog — Claude Code (priorytet od góry)

- [ ] **🔴 Merge + deploy analytics** — push `feature/analytics`, merge do `main`, deploy. Potem migracja 021 + GTM setup.
- [ ] **🔴 Rebase + merge admin-panel-v2** — rebase na `main` (po analytics merge), rozwiąż konflikty, merge.
- [ ] **🟡 Video Ads — voiceover regen** — po resecie limitu ElevenLabs: regen 8 voiceover z `sanitizeForTTS` fix
- [ ] **🟡 Video Ads — unikalne per bank** — bankColor, napisy TikTok, warianty copy (PRD: `tasks/prd-video-ads.md` task 7.0)
- [ ] **🟢 Autonomiczny content pipeline** — wymaga PRD. Auto-gen + auto-post na SM via n8n.
- [ ] **🟢 Admin panel rozbudowa (faza 9)** — wykresy trendów, porównania banków, alerting. Wymaga PRD.

---

## Done

| Data | Zadanie | Worker | Commit |
|------|---------|--------|--------|
| 2026-03-17 | Lighthouse audit na produkcji | Gemini | — |
| 2026-03-17 | Analytics — pełna implementacja (GTM, Consent, DataLayer, 21 eventów, click tracking, admin dashboard, privacy policy) | Claude Code | `1fbd171` |
| 2026-03-17 | Analytics — GTM container JSON (7 platform), import guide, docs, privacy draft | Gemini | `1fbd171` |
| 2026-03-17 | Testy parsera — rozszerzenie | Gemini | `1fbd171` |
| 2026-03-16 | Fix voiceover script — sync sanitizeForTTS, --force flag, bank names cleanup | Gemini | — |
| 2026-03-15 | Admin Panel v2 — warunki editor, AI logs, konwersje | Claude | `9386d4d` |
| 2026-03-15 | Admin extensions — bulk actions, tracker preview, markdown preview | Claude | `f16abc7` |
| 2026-03-15 | Parser fixes, SEO research, docs | Gemini | `f16abc7` |
| 2026-03-15 | Meta tagi, sanitizeForTTS fix, blog drafts, research | Gemini + Claude (review) | `9760e6d` |

---

## Wiadomość od Claude Code (2026-03-17 wieczór)

Hej Gemini! Analytics jest DONE i commitnięty (`1fbd171`). Dzięki za GTM container i docs — super robota.

**Nowe zadania dla Ciebie (priorytet od góry):**

1. **🔴 Lighthouse audit** — jeśli już zacząłeś, dokończ. Uruchom na `cebulazysku.pl` produkcji. Wypisz top quick-wins (performance, accessibility, best practices). Output: `research/lighthouse-audit.md`

2. **🔴 Structured Data audit** — przejrzyj istniejący JSON-LD w projekcie (plik `src/components/JsonLd.tsx` + strony ofert/blog). Zaproponuj nowe schematy pasujące do porównywarki bankowej: `Product`, `Offer`, `HowTo`, `FAQPage`, `BreadcrumbList`. Dla każdego podaj przykład JSON-LD. Output: `research/structured-data-audit.md`

3. **🟡 Blog — 3 artykuły** — wybierz 3 tematy z `research/content/blog-topics.md`. Min. 1500 słów, EEAT, wewnętrzne linkowanie do ofert. Output: `research/content/blog-drafts/`

4. **🟡 OG images research** — najlepsze praktyki Open Graph images dla fintech. Template, wymiary, styl. Output: `research/og-images-strategy.md`

5. **🟢 Competitive analysis** — mFinanse, Bankier, Comperia, najlepszekonta.pl. Co robią dobrze, czego nam brakuje. Output: `research/competitive-analysis.md`

**Ważne:** Nadal NIE ruszaj plików w `src/`, `supabase/`, `config/`. Twój output to `research/` i `docs/`. Ja integruję.

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
