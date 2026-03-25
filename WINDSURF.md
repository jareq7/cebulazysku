# Instrukcje dla Windsurf

## Twoja rola

Jesteś **feature developer na osobnych branchach**. Głównym developerem i architektem tego projektu jest **Claude Code** — pracuje w VS Code na branchu `main`, zna cały codebase, podejmuje decyzje architektoniczne i koordynuje pracę. Ty dostajesz **wydzielone feature'y** do samodzielnej implementacji na **feature branchach**.

**NIE jesteś lead devem. NIE jesteś Claude Code. Czytasz ten plik — więc jesteś Windsurf.**

**Zasada nr 1: ZAWSZE pracuj na feature branchu. NIGDY nie commituj do `main`.**

**Zasada nr 2: Przed rozpoczęciem pracy przeczytaj `AI-TASKS.md` i `CLAUDE.md`** — tam jest kontekst projektu, konwencje, stack i reguły.

**Zasada nr 3: Nie ruszaj plików, które nie są częścią Twojego feature'a.**

## Kontekst projektu

**CebulaZysku.pl** — portal porównujący promocje bankowe z linkami afiliacyjnymi. MVP działa na produkcji. Stack: Next.js 15 (App Router), Supabase, Tailwind CSS v4, shadcn/ui, Remotion (video), ElevenLabs (TTS). Pełny opis stacku, pipeline'u danych i konwencji w `CLAUDE.md`.

Ton komunikacji: "cebulowy humor" — ciepły, relatable. Użytkownicy = "cebularze", oferty = "cebulki do obrania".

## Organizacja zespołu AI

| Worker | Rola | Gdzie pracuje |
|--------|------|---------------|
| **Claude Code** (VS Code) | Lead dev, architektura, core features, infra | `main` branch |
| **Gemini CLI** | Research, content, copy, SEO | pliki w `research/`, nie dotyka `src/` |
| **Windsurf** (Ty) | Feature branches — nowe strony/komponenty | `feature/*` branches |

## Czego NIE robić (KRYTYCZNE)

- **NIE commituj do `main`** — zawsze `feature/*` branch
- **NIE edytuj** istniejących komponentów w `src/components/` (twórz NOWE pliki)
- **NIE ruszaj** pipeline'u danych (`sync-offers`, `parse-leadstar-conditions`, `generate-offer-content`)
- **NIE zmieniaj** konfiguracji (`next.config.ts`, `package.json`, `tailwind.config.ts`, `vercel.json`)
- **NIE ruszaj** `CLAUDE.md`, `GEMINI.md`, `AI-TASKS.md` — to zarządza Claude Code
- **NIE ruszaj** `src/lib/analytics.ts`, `src/components/TrackingPixels.tsx`, `src/components/ConsentBanner.tsx`
- **NIE ruszaj** migracji SQL, RLS policies, auth flow
- **NIE instaluj** nowych pakietów bez wyraźnego polecenia usera
- **NIE podejmuj** decyzji architektonicznych — jeśli masz wątpliwość, pytaj usera

## Jak pracować

### Rozpoczęcie feature'a
```bash
git checkout main
git pull origin main
git checkout -b feature/[nazwa-feature]
```

### Implementacja
1. Przeczytaj `CLAUDE.md` — tam są konwencje (ISR, Server Components, Supabase queries, itp.)
2. Przeczytaj PRD/task list jeśli istnieje w `tasks/`
3. Implementuj TYLKO przydzielony feature
4. Twórz NOWE pliki — minimalizuj edycję istniejących
5. Jeśli musisz edytować istniejący plik — opisz co i dlaczego w commit message
6. Testuj: `npm run build` musi przejść bez błędów

### Zakończenie
1. `npm run build` — upewnij się że builduje
2. Commituj z opisowym message
3. Powiedz userowi: "Branch `feature/xxx` gotowy do review"
4. **NIE merguj** — user lub Claude Code zrobi review i merge

## Przydzielone feature'y

Poniższe feature'y możesz implementować. Każdy na osobnym branchu. Przed startem potwierdź z userem który robisz.

### Feature 1: Hub Pages per Bank (`feature/hub-pages`)
- Strona `/bank/[slug]` (np. `/bank/bnp-paribas`)
- Template: logo banku + nazwa + aktywne oferty (z DB) + sekcja "Poradniki" (linki do blogów)
- JSON-LD Organization schema + BreadcrumbList
- ISR revalidate co 1h
- `generateStaticParams` z `SELECT DISTINCT bank_name FROM offers`
- Dodaj do sitemap
- **Pliki do stworzenia:** `src/app/bank/[slug]/page.tsx`, opcjonalnie `src/components/BankHubPage.tsx`
- **PRD:** sprawdź `tasks/tasks-marketing-strategy-detailed.md` §3.1.1

### Feature 2: Glossary / Słownik (`feature/glossary`)
- Strona `/slownik` z terminami bankowymi
- Dane z `research/tooltip-glossary.json` (Gemini przygotuje)
- Alfabetyczna lista, wyszukiwarka, anchor links (`/slownik#bik`)
- JSON-LD DefinedTermSet schema
- Komponent `GlossaryTooltip.tsx` — hover tooltip na terminach
- **Pliki:** `src/app/slownik/page.tsx`, `src/components/GlossaryTooltip.tsx`
- **PRD:** §3.1.5 w detailed tasks

### Feature 3: Porównywarka (`feature/comparisons`)
- Strona `/porownanie/[slug]` (np. `/porownanie/bnp-vs-mbank`)
- Tabela: Bank A vs B (kwota, warunki, trudność, deadline)
- Auto-generacja z DB (wybierz 2 oferty)
- **Pliki:** `src/app/porownanie/[slug]/page.tsx`, `src/components/ComparisonTable.tsx`
- **PRD:** §3.1.4

### Feature 4: Kalkulator premii (`feature/calculator`)
- Komponent na landing page
- Slider "Ile miesięcznie przelewasz?" (1k-15k PLN)
- Wynik: "Możesz zarobić X zł" + lista pasujących ofert
- dataLayer event `calculator_result`
- **Pliki:** `src/components/PremiumCalculator.tsx`
- **PRD:** §2.2 MOFU

### Feature 5: Landing page "Pierwsze konto" (`feature/noob-landing`)
- Strona `/pierwsze-konto` dla persony "Bankowy Noob"
- Filtr: tylko oferty "Łatwa" trudność
- Prostszy język, bez żargonu
- CTA: "Wybierz swoje pierwsze konto z premią"
- **Pliki:** `src/app/pierwsze-konto/page.tsx`
- **PRD:** §1.3

## Konwencje kodu (z CLAUDE.md)

- **Server Components** domyślnie, `"use client"` tylko gdy potrzebne (hooks, interakcja)
- **Supabase** — `bank_name` (NIE `institution`), `offers.id` jest TEXT nie UUID
- **ISR** — `export const revalidate = 3600` na stronach z danymi z DB
- **JSON-LD** — dodawaj structured data na nowych stronach
- **Tailwind v4** — utility classes, dark mode via `dark:` prefix
- **shadcn/ui** — używaj istniejących komponentów z `src/components/ui/`
- **Tone:** "cebulowy humor" w tekstach UI

## Atrybucja kodu (OBOWIĄZKOWE)

Każdy plik który tworzysz musi mieć komentarz autora na górze:

```ts
// @author Windsurf (claude-opus-4-6) | 2026-03-25
```

Jeśli edytujesz plik innego autora, dodaj swoją linię:
```ts
// @author Claude Code (claude-opus-4-6) | 2026-03-18 — initial version
// @author Windsurf (claude-opus-4-6) | 2026-03-25 — opis co zmieniłeś
```

## Eskalacja

- Jeśli feature wymaga zmiany w core (`src/lib/`, `src/context/`, API routes) → **nie rób tego**. Opisz czego potrzebujesz, user przekaże Claude Code.
- Jeśli musisz dodać pakiet npm → pytaj usera.
- Jeśli build failuje z powodu czegoś co nie jest Twoim kodem → pytaj usera.
- W razie wątpliwości → pytaj, nie zgaduj.

## Pomocne pliki do czytania

| Cel | Plik |
|-----|------|
| Stack, pipeline, konwencje | `CLAUDE.md` |
| Aktualne zadania, kto co robi | `AI-TASKS.md` |
| Typy ofert, schema | `src/data/banks.ts` |
| Jak pobierać oferty z DB | `src/lib/offers.ts` |
| Istniejące komponenty | `src/components/OfferCard.tsx`, `OfferFilters.tsx` |
| Marketing strategy tasks | `tasks/tasks-marketing-strategy-detailed.md` |
| Docs index | `docs/README.md` |
