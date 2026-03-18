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
| OG Images — fix + integracja | Gemini | `src/app/api/og/route.tsx`, `src/app/oferta/[slug]/page.tsx`, `src/app/blog/[slug]/page.tsx` | Naprawa fontów i podpięcie pod generateMetadata. |

---

## Backlog — Gemini (priorytet od góry)

- [ ] **🔴 Blog — 4 nowe artykuły SEO** — napisz 4 artykuły (każdy 800-1200 słów, Markdown) na tematy: (1) "Jak bezpiecznie łupić banki — kompletny poradnik dla początkujących 2026", (2) "Ranking najlepszych promocji bankowych — marzec 2026", (3) "Czy można mieć wiele kont bankowych? Jak to robić legalnie", (4) "Promocje bankowe a PIT — co musisz wiedzieć o rozliczeniu". Format: tytuł, slug, excerpt (150 znaków), tagi, reading_time, pełna treść. WAŻNE: opisuj TYLKO to co strona faktycznie oferuje (konta osobiste, tracker warunków). Zapisz do `research/blog-drafts-batch2.md`.
- [ ] **🟡 Archive Promotions — migracja + frontend** — na podstawie `research/archive-promotions-seo.md`: (1) napisz migrację SQL: ALTER TABLE offers ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active','expired','draft')), UPDATE offers SET status='expired' WHERE is_active=false, (2) stwórz komponent `src/components/ExpiredOfferBanner.tsx` (żółty banner "Ta promocja się zakończyła" z datą), (3) napisz stronę `/archiwum` listującą expired offers. Zapisz migrację do `supabase/migrations/023_offer_status_enum.sql`, resztę do odpowiednich plików src/.
- [ ] **🟡 Profit Calculator — prototyp** — na podstawie `research/profit-calculator-concept.md`: stwórz komponent `src/components/ProfitCalculator.tsx` — 3-step wizard: (1) wybierz banki które masz, (2) pokaż animowaną sumę "Tyle możesz jeszcze zarobić: X zł", (3) CTA "Zobacz oferty". Użyj Framer Motion do animacji licznika. Dane z `getActiveOffers()`. Komponent ma być gotowy do wstawienia na landing page.
- [ ] **🟡 Conversand — manual affiliate links** — zaloguj się do panelu Conversand (conversand.com), wygeneruj tracking linki dla kluczowych ofert bankowych PL (BNP Paribas, Pekao, Millennium, VeloBank, mBank, Citi). Zapisz linki do `research/conversand-tracking-links.md` z formatem: nazwa oferty, stawka CPS, tracking URL
- [ ] **🟡 SEO Audit produkcji** — uruchom Lighthouse na 5 kluczowych stronach (/, /ranking, /oferta/alior-konto-1, /blog, /jak-to-dziala). Zapisz wyniki (Performance, SEO, Accessibility, Best Practices scores) do `research/lighthouse-audit-march2026.md` z rekomendacjami co poprawić. Sprawdź też Core Web Vitals (LCP, FID, CLS).
- [ ] **🟢 TikTok Automation — task breakdown** — na podstawie `research/tiktok-viral-automation-research.md` napisz szczegółowy PRD (`tasks/prd-tiktok-automation.md`) z architekturą (Make.com webhooks, Remotion templates, ElevenLabs TTS, auto-upload). Wymaga formatu `create-prd.md`.

## Backlog — Claude Code (priorytet od góry)

- [x] ~~**🔴 Merge + deploy analytics**~~ — Done: `1fbd171` + `3d83bf6`
- [x] ~~**🔴 Rebase + merge admin-panel-v2**~~ — Done (already in main)
- [x] ~~**🟡 Video Ads — unikalne per bank**~~ — Done: bankColor + TikTok subtitles
- [x] ~~**🟡 Lighthouse accessibility + performance fixes**~~ — Done: aria-labels, headings, img optimization, contrast
- [x] ~~**🔴 Canva Connect API integration**~~ — Done: `315f78b`→`73bfa87`
- [ ] **🔴 Admin — panel zużycia AI/zasobów** — nowa zakładka w admin: ElevenLabs (chars used/limit), OpenRouter (credits), Canva (token status), Supabase (DB size), Vercel (bandwidth)
- [ ] **🟡 Multi-source affiliates — task generation** — po review PRD: wygeneruj task listę z `tasks/prd-multi-source-affiliates.md`
- [ ] **🟡 Video Ads — voiceover regen** — po resecie limitu ElevenLabs: regen 8 voiceover z `sanitizeForTTS` fix
- [ ] **🟢 Autonomiczny content pipeline** — wymaga PRD. Auto-gen + auto-post na SM via n8n.
- [ ] **🟢 Admin panel rozbudowa (faza 9)** — wykresy trendów, porównania banków, alerting. Wymaga PRD.

---

## Done

| Data | Zadanie | Worker | Commit |
|------|---------|--------|--------|
| 2026-03-18 | Structured Data JSON-LD — pełna implementacja (Product, Offer, HowTo, ItemList) | Gemini | — |
| 2026-03-18 | Canva Connect API — pełna integracja (OAuth+PKCE, Autofill, Export, Storage, admin UI, blog covers) | Claude Code | `315f78b`→`2ad3da8` |
| 2026-03-18 | Supabase migration 022 (canva_tokens + cover_image_url) + blog-covers bucket | Claude Code | — (infra) |
| 2026-03-18 | TradeDoubler panel overview & API research | Gemini | — |
| 2026-03-18 | Canva Connect API — rozszerzony research (Enterprise vs Pro, polling, asset limits) | Gemini | — |
| 2026-03-17 | TikTok Viral Video Automation — deep research (2000+ słów) | Gemini | — |
| 2026-03-17 | Blog cover images strategy — Midjourney formula | Gemini | — |
| 2026-03-17 | Blog — 6 artykułów zaimportowanych do Supabase (direct REST API) | Claude Code | `63a3f10` |
| 2026-03-17 | Blog drafts → baza (przygotowano insert SQL) | Gemini | `63a3f10` |
| 2026-03-17 | Structured Data templates (Product, Offer, HowTo) | Gemini | `63a3f10` |
| 2026-03-17 | OG Images draft (vercel/og) 3 szablony | Gemini | `63a3f10` |
| 2026-03-17 | Koncepcja: Archiwum promocji (SEO long tail) | Gemini | `63a3f10` |
| 2026-03-17 | Koncepcja: Kalkulator zysku | Gemini | `63a3f10` |
| 2026-03-17 | Video Ads — bankColor + TikTok subtitles | Claude Code | `63a3f10` |
| 2026-03-17 | Lighthouse fixes — accessibility + performance | Claude Code | `63a3f10` |
| 2026-03-17 | Wdrożenie OG Tags + Canonical na wszystkich stronach | Gemini | — |
| 2026-03-17 | Competitive analysis PL | Gemini | — |
| 2026-03-17 | Open Graph images strategy | Gemini | — |
| 2026-03-17 | Blog — 3 artykuły SEO (karencja, BLIK, karty) | Gemini | — |
| 2026-03-17 | Structured Data audit + rekomendacje | Gemini | — |
| 2026-03-17 | Lighthouse audit na produkcji | Gemini | — |
| 2026-03-17 | UX/UI AI Delighters research | Gemini | — |
| 2026-03-17 | Analytics — pełna implementacja (GTM, Consent, DataLayer, 21 eventów, click tracking, admin dashboard, privacy policy) | Claude Code | `1fbd171` |
| 2026-03-17 | Analytics — GTM container JSON (7 platform), import guide, docs, privacy draft | Gemini | `1fbd171` |
| 2026-03-17 | Testy parsera — rozszerzenie (21/21 green) | Gemini | `1fbd171` |
| 2026-03-16 | Fix voiceover script — sync sanitizeForTTS, --force flag, bank names cleanup | Gemini | — |
| 2026-03-15 | Admin Panel v2 — warunki editor, AI logs, konwersje | Claude | `9386d4d` |
| 2026-03-15 | Admin extensions — bulk actions, tracker preview, markdown preview | Claude | `f16abc7` |
| 2026-03-15 | Parser fixes, SEO research, docs | Gemini | `f16abc7` |
| 2026-03-15 | Meta tagi, sanitizeForTTS fix, blog drafts, research | Gemini + Claude (review) | `9760e6d` |

---

## Wiadomość od Gemini (2026-03-18)

Cześć Claude! Przejąłem stery nad nowymi zadaniami SEO i technicznymi.

Status:
1. **Structured Data JSON-LD**: Zaimplementowane w `oferta/[slug]` (Product, Offer, HowTo) oraz w `/ranking` (ItemList). Wykorzystałem szablony, które przygotowałem wcześniej.
2. **OG Images**: Wchodzę w naprawę fontów w `api/og/route.tsx` i integrację z `generateMetadata`.

Zaktualizowałem tablicę. Lecimy dalej! 🧅🚀

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
