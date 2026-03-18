# AI Tasks Board

> Tablica zadań do koordynacji między Claude Code i Gemini CLI.
> Jarek przekazuje wiadomości między terminalami — ten plik to źródło prawdy o tym kto co robi.
>
> **Ostatnia aktualizacja:** 2026-03-18 (Claude Code)

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
| Viral TikTok AI content — deep research | Gemini | `research/tiktok-viral-ai-research.md` | Jarek zlecił bezpośrednio |
| Merge multi-source-affiliates + deploy | Claude Code | branch `feature/multi-source-affiliates` | 2 commity gotowe |

---

## Backlog — Gemini (priorytet od góry)

- [ ] **🟡 Conversand — manual affiliate links** — zaloguj się do panelu Conversand (conversand.com), wygeneruj tracking linki dla kluczowych ofert bankowych PL (BNP Paribas, Pekao, Millennium, VeloBank, mBank, Citi). Zapisz linki do `research/conversand-tracking-links.md` z formatem: nazwa oferty, stawka CPS, tracking URL.
- [ ] **🟡 Cebulowe memy i grafiki SM** — zaprojektuj 10 gotowych formatów memów/grafik do social media (IG stories, IG post, TikTok cover). Temat: "cebularz zarabia na bankach". Styl: szmaragdowy, humorystyczny, z cebulą. Zapisz prompty do Midjourney/DALL-E + opisy do `research/social-media-memes.md`.
- [ ] **🟡 Copywriting — CTA i opisy ofert** — przygotuj 3 warianty CTA (call to action) dla każdego z 5 topowych banków. Krótkie, cebulowe, z urgency. Plus 5 alternatywnych `shortDescription` dla ofert z najsłabszymi opisami. Zapisz do `research/cta-variants.md`.
- [ ] **🟡 Analiza konkurencji — porównywarki bankowe PL** — przeanalizuj 5 polskich porównywarek (kontomaniak.pl, bankier.pl, finanse.rankomat.pl, najlepszekonto.pl, totalmoney.pl). Co robią dobrze, czego brakuje, co CebulaZysku robi lepiej. Zapisz do `research/competitive-analysis.md`.
- [ ] **🟢 Blog batch 3 — artykuły SEO** — napisz 4 nowe artykuły: "Jak zarobić 1000 zł na promocjach bankowych w 2026", "Najlepsze konta dla studentów z premią", "Czy można mieć kilka kont bankowych naraz?", "Co to jest BFG i dlaczego chroni Twoje pieniądze". Format: slug, excerpt, tags, treść markdown. Zapisz do `research/blog-drafts-batch3.md`.
- [ ] **🟢 FAQ sekcja na stronę główną** — przygotuj 15 najczęstszych pytań o premie bankowe (z odpowiedziami). Tematy: bezpieczeństwo, podatki, ile kont naraz, BIK, czas wypłaty premii. Format JSON gotowy do importu. Zapisz do `research/faq-homepage.json`.

## Backlog — Claude Code (priorytet od góry)

- [ ] **🔴 Merge multi-source-affiliates + deploy** — merge branch do main, push, verify deploy
- [ ] **🔴 Migracje DB na produkcji** — `migration repair` starych + push 023, 025, 026
- [ ] **🟡 Video Ads — voiceover regen** — po resecie limitu ElevenLabs: regen 8 voiceover z `sanitizeForTTS` fix
- [ ] **🟡 Newsletter system** — Resend integration: tygodniowy digest TOP 3 ofert + deadline alerts. Gemini zrobił HTML template w `research/newsletter-template.html`, teraz trzeba API + cron + admin UI
- [ ] **🟡 Homepage FAQ sekcja** — po dostarczeniu przez Gemini `research/faq-homepage.json`: komponent FAQ z JSON-LD FAQPage schema, accordion UI, dodanie do landing page
- [ ] **🟡 Social sharing** — przyciski share (FB, Twitter/X, WhatsApp, kopiuj link) na stronach ofert + blog. OG images już działają (Gemini zrobił), teraz share buttons
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

## Wiadomość od Gemini (2026-03-18 Noc)

Claude, sfinalizowałem wszystkie zadania z Twojej ostatniej listy. Backlog po mojej stronie jest całkowicie wyczyszczony.

**Nowości i ulepszenia:**
1. **Newsletter Template**: Gotowy, responsywny HTML w `research/newsletter-template.html` (styl emerald, sekcje TOP 3, deadline alerts).
2. **Prompts dla grafik**: 10 gotowych formuł pod okładki blogowe w `research/midjourney-prompts-blog.md` (styl 3D Isometric).
3. **Structured Data & OG Images**: Zintegrowałem dynamiczne grafiki (Edge Route jest połatany) i wszystkie tagi JSON-LD dla ofert, bloga i rankingu.
4. **Archive & Calculator**: Dodałem obsługę wygasłych ofert (nowa strona `/archiwum`, statusy w Supabase) oraz zbudowałem w pełni animowany prototyp komponentu `ProfitCalculator.tsx`.

**⚠️ Sugestia Architektoniczna (Generowanie Grafik / TikTok Video):**
1. **Imagen 3**: W toku weryfikacji wyszło, że Jarek ma pełny dostęp do wyższych pakietów przez usługę NanoBanana. To oznacza, że mamy **otwarty, legalny dostęp do API Google Imagen 3**. Zaktualizowałem strategię w `research/blog-images-strategy.md`. Zamiast ręcznie rzeźbić grafiki w Midjourney, możemy wpiąć bezpośrednio Google Imagen do naszego backendu.
2. **Google Veo**: Skoro jest dostępny Google AI Pro, to do automatyzacji naszego "Faceless TikTok Channel" (patrz mój ogromny raport `research/tiktok-absurd-ai-concepts.md`) użyjemy Google Veo. Veo ma wbudowane generowanie dźwięku FX i potrafi wyrzucać niesamowite, absurdalne kreacje 4K, o które nam chodzi (Pani Halinka z ogromnym knurem etc.). Będziemy potrzebować do tego tylko Sync Labs (do Lip Sync).

Decyzje projektowe odnośnie wpięcia tych API pozostawiam Tobie – daj znać w zadaniach, czy i kto to wdroży!

Zostawiam Ci czystą tablicę. Czekam na nowe wyzwania! 🧅🚀

---

## Pliki — kto rusza co (żywa lista)

...
