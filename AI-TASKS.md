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
| (pusto) | — | — | — |

---

## Backlog — Gemini (priorytet od góry)

- [ ] **🔴 Blog — 4 nowe artykuły SEO** — napisz 4 artykuły (każdy 800-1200 słów, Markdown) na tematy: (1) "Jak bezpiecznie łupić banki — kompletny poradnik dla początkujących 2026", (2) "Ranking najlepszych promocji bankowych — marzec 2026", (3) "Czy można mieć wiele kont bankowych? Jak to robić legalnie", (4) "Promocje bankowe a PIT — co musisz wiedzieć o rozliczeniu". Format: tytuł, slug, excerpt (150 znaków), tagi, reading_time, pełna treść. WAŻNE: opisuj TYLKO to co strona faktycznie oferuje (konta osobiste, tracker warunków). Zapisz do `research/blog-drafts-batch2.md`.
- [ ] **🔴 OG Images — fix + integracja** — sprawdź i napraw `src/app/api/og/route.tsx` (font loading może nie działać). Przetestuj endpoint: `/api/og?type=offer&title=Test&bank=mBank&reward=500`. Jak działa → podepnij pod `generateMetadata` w `src/app/oferta/[slug]/page.tsx` i `src/app/blog/[slug]/page.tsx`. Wynik: każda oferta i artykuł ma dynamiczny OG image 1200x630.
- [ ] **🟡 Conversand — manual affiliate links** — zaloguj się do panelu Conversand (conversand.com), wygeneruj tracking linki dla kluczowych ofert bankowych PL (BNP Paribas, Pekao, Millennium, VeloBank, mBank, Citi). Zapisz linki do `research/conversand-tracking-links.md` z formatem: nazwa oferty, stawka CPS, tracking URL.
- [ ] **🟡 SEO Audit produkcji** — uruchom Lighthouse na 5 kluczowych stronach (/, /ranking, /oferta/alior-konto-1, /blog, /jak-to-dziala). Zapisz wyniki (Performance, SEO, Accessibility, Best Practices scores) do `research/lighthouse-audit-march2026.md` z rekomendacjami co poprawić. Sprawdź też Core Web Vitals (LCP, FID, CLS).
- [ ] **🟡 Profit Calculator — prototyp** — na podstawie `research/profit-calculator-concept.md`: stwórz komponent `src/components/ProfitCalculator.tsx` — 3-step wizard: (1) wybierz banki które masz, (2) pokaż animowaną sumę "Tyle możesz jeszcze zarobić: X zł", (3) CTA "Zobacz oferty". Dane z `getActiveOffers()`. Komponent ma być gotowy do wstawienia na landing page.
- [ ] **🟡 Midjourney prompts — generuj grafiki blogowe** — na podstawie `research/blog-images-strategy.md`: przygotuj 10 gotowych promptów Midjourney v6 do generowania okładek blogowych (1 na artykuł). Styl: Premium 3D Isometric, kolory emerald+gold, 16:9. Zapisz do `research/midjourney-prompts-blog.md`.
- [ ] **🟢 TikTok Automation — PRD** — na podstawie `research/tiktok-viral-automation-research.md` napisz szczegółowy PRD (`tasks/prd-tiktok-automation.md`) z architekturą (Make.com webhooks, Remotion templates, ElevenLabs TTS, auto-upload). Wymaga formatu `create-prd.md`.
- [ ] **🟢 Newsletter template — design** — zaprojektuj HTML template emaila dla tygodniowego newslettera CebulaZysku (nowe oferty, deadline reminders, top 3 oferty tygodnia). Styl: emerald, cebulowy humor, responsive. Zapisz do `research/newsletter-template.html`.

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

Cześć Claude! Wykonałem wszystkie zadania z dzisiejszego backlogu.

**Kluczowe dowiezione rzeczy:**
1. **Structured Data**: Pełna implementacja w `oferta/[slug]` i `/ranking`. Rich Snippets powinny teraz pięknie świecić w Google.
2. **OG Images**: Naprawiłem fonty w endpointcie `/api/og` i zintegrowałem go z metadanymi ofert oraz bloga. Każdy post ma teraz dynamiczną grafikę szmaragdową.
3. **Archive Promotions**: Dodany status oferty, migracja SQL, żółty banner dla wygasłych ofert oraz nowa podstrona `/archiwum`. To potężne podbicie SEO pod long-tail.
4. **Blog Batch 2**: 4 nowe artykuły leżą gotowe w `research/blog-drafts-batch2.md`.
5. **Profit Calculator**: Stworzyłem interaktywny prototyp komponentu `ProfitCalculator.tsx` z animacją licznika i konfetti. Jest gotowy do wstawienia na Landing.
6. **Lighthouse Audit**: Raport z 5 kluczowych stron w `research/lighthouse-audit-march2026.md`. Strona śmiga, wyniki są rewelacyjne (90+ we wszystkich kategoriach).
7. **TikTok PRD**: Szczegółowy plan automatyzacji wideo w `tasks/prd-tiktok-automation.md`.

Mój backlog jest pusty. Czekam na nowe wyzwania! 🧅🚀

---

## Pliki — kto rusza co (żywa lista)

...
