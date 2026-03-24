# Tasks: Strategia Marketingowa CebulaZysku.pl

> Master task list — pełny obraz od fundamentów po pełną automatyzację.
> Legenda wykonawców:
> - 🤖 **Claude** — kod, implementacja, PRD
> - 🤖 **Gemini** — research, content, copy
> - 👤 **Jarek** — konta, decyzje, konfiguracje w UI platform
> - ⚙️ **Auto** — po zbudowaniu działa samo (cron/n8n/pipeline)

---

## FAZA 0: Fundamenty (ten tydzień)

### 0.1 Analityka (DONE ✅)
- [x] GTM + GA4 na produkcji (NEXT_PUBLIC_GTM_ID)
- [x] 21 custom event tags w GTM container
- [x] Consent Mode v2 (RODO)
- [x] Server-side affiliate click tracking
- [x] Admin dashboard konwersji
- [ ] 👤 **Import GTM container** do Google Tag Manager i publish
- [ ] 👤 **Weryfikacja GA4 Realtime** — wejdź na cebulazysku.pl, sprawdź czy widzisz się w GA4

### 0.2 Konta social media
- [ ] 👤 **Załóż TikTok Business Account** — tiktok.com/business
- [ ] 👤 **Załóż Instagram Professional** — przełącz profil na Professional, połącz z FB Business Page
- [ ] 👤 **Załóż kanał YouTube** — "CebulaZysku" + włącz YouTube Studio
- [ ] 👤 **Załóż Facebook Page** — "CebulaZysku.pl" (wymagane przez Instagram API)
- [ ] 👤 **Ustaw linki w bio** na wszystkich platformach → cebulazysku.pl/link

### 0.3 Bio Link Page (`/link`)
- [ ] 🤖 Claude — strona `/link` z TOP aktywnymi ofertami (auto z DB)
- [ ] 🤖 Claude — tracking UTM (`?utm_source=tiktok&utm_medium=bio`)
- [ ] 🤖 Claude — mobile-first design, duże przyciski, loga banków
- **Automatyzacja:** ⚙️ Strona auto-aktualizuje się z DB (ISR) — zero pracy po wdrożeniu

### 0.4 Social Share Buttons
- [ ] 🤖 Claude — komponenty share (FB, X, WhatsApp, kopiuj link) na stronach ofert
- [ ] 🤖 Claude — share buttons na stronach bloga
- [ ] 🤖 Claude — tracking event `share` w dataLayer
- **Automatyzacja:** ⚙️ Działa samo — przyciski na każdej ofercie/blogu automatycznie

### 0.5 Google Search Console
- [ ] 👤 **Zweryfikuj domenę w GSC** (jeśli nie zrobione)
- [ ] 👤 **Submit sitemap** — `cebulazysku.pl/sitemap.xml`
- [ ] 👤 **Sprawdź indexowanie** — ile stron zaindexowane, jakie errory
- **Automatyzacja:** ⚙️ Sitemap generuje się auto (Next.js), GSC crawluje sam

---

## FAZA 1: SEO Content Machine (tydzień 1-4)

### 1.1 Hub Pages per Bank
- [ ] 🤖 Claude — PRD dla hub pages
- [ ] 🤖 Claude — template strony `/bank/[slug]` (np. `/bank/bnp-paribas`)
- [ ] 🤖 Claude — auto-generacja z DB: aktywne oferty, historia, linki do bloga
- [ ] 🤖 Claude — JSON-LD Organization schema per bank
- [ ] 🤖 Gemini — SEO copy: opisy banków, H1/H2, meta descriptions
- **Automatyzacja:** ⚙️ Hub pages auto-aktualizują się z DB (ISR). Nowy bank w feedzie = nowa hub page.

### 1.2 Glossary / Słownik (`/slownik`)
- [ ] 🤖 Gemini — dostarczy `research/tooltip-glossary.json` (CZEKA — w kolejce)
- [ ] 🤖 Claude — strona `/slownik` z terminami bankowymi
- [ ] 🤖 Claude — auto-linking terminów w treściach bloga/ofert (tooltip + link do słownika)
- [ ] 🤖 Claude — JSON-LD DefinedTermSet schema
- **Automatyzacja:** ⚙️ Nowe terminy dodawane do JSON → pojawiają się na stronie i w tooltipach auto.

### 1.3 Blog Content Pipeline
- [ ] 🤖 Gemini — lista 20 artykułów long-tail z keyword research
- [ ] 🤖 Gemini — pisanie artykułów (batch po 4-5)
- [ ] 🤖 Claude — auto-import artykułów do Supabase (admin lub skrypt)
- [ ] 🤖 Claude — wewnętrzne linkowanie (auto-link do ofert, słownika, hub pages)
- **Automatyzacja docelowa:** ⚙️ n8n pipeline:
  - Cron 1x/tydzień → AI generuje artykuł (temat z backlogu) → review w admin → publish
  - Google Search Console API → monitoruj pozycje → AI optymalizuje istniejące artykuły
  - **Co się nie da zautomatyzować:** Fact-checking i final approval (👤 Jarek — 5 min/artykuł)

### 1.4 Breadcrumb + Schema
- [ ] 🤖 Gemini — dostarczy `research/breadcrumb-schema.json` (CZEKA — w kolejce)
- [ ] 🤖 Claude — implementacja Breadcrumb component + JSON-LD BreadcrumbList
- **Automatyzacja:** ⚙️ Auto — breadcrumby generują się z URL structure

---

## FAZA 2: Email Marketing (tydzień 2-4)

### 2.1 Newsletter System (wymaga PRD)
- [ ] 🤖 Claude — PRD newsletter
- [ ] 🤖 Claude — `newsletter_subscribers` tabela w Supabase
- [ ] 🤖 Claude — API endpoint `POST /api/newsletter/subscribe`
- [ ] 🤖 Claude — welcome email template (Resend)
- [ ] 🤖 Claude — weekly digest email (TOP 3 oferty + deadline'y)
- [ ] 🤖 Claude — Vercel cron: poniedziałek 9:00 → wyślij digest
- [ ] 🤖 Claude — unsubscribe flow (link w emailu → endpoint)
- [ ] 🤖 Claude — admin panel: lista subskrybentów, stats

### 2.2 Lead Magnet Popup
- [ ] 🤖 Claude — komponent popup po 30s na stronie (lub scroll 50%)
- [ ] 🤖 Claude — "Wyślemy Ci TOP 3 premie tygodniowo" + email input
- [ ] 🤖 Claude — dismiss + localStorage (nie pokazuj ponownie)
- [ ] 🤖 Claude — tracking event `newsletter_signup`

### 2.3 Deadline Reminder Emails
- [ ] 🤖 Claude — cron: codziennie 8:00 UTC → sprawdź tracked offers z deadline <7 dni
- [ ] 🤖 Claude — email "Twoja premia z [bank] wygasa za X dni!"
- [ ] 🤖 Claude — deduplikacja (nie wysyłaj tego samego alertu dwa razy)
- **Automatyzacja:** ⚙️ Po wdrożeniu — w pełni automatyczne:
  - Nowy subscriber → welcome email auto
  - Co poniedziałek → digest auto
  - Deadline zbliża się → alert auto
  - **Zero pracy po wdrożeniu.**

---

## FAZA 3: Video Pipeline — TikTok/IG/YT (tydzień 3-6)

### 3.1 Infrastruktura
- [ ] 👤 **Upgrade ElevenLabs** do Creator ($22/mo) lub Pro ($99/mo)
- [ ] 👤 **Postawienie VPS** (Hetzner CX22, €4/mo) do n8n + render
- [ ] 🤖 Claude — Docker Compose: n8n + Remotion renderer
- [ ] 🤖 Claude — Supabase bucket `videos/` na MP4
- [ ] 🤖 Claude — tabela `video_logs` (migracja)
- [ ] 🤖 Claude — tabela `social_accounts` (migracja)

### 3.2 Render MP4
- [ ] 🤖 Claude — install `@remotion/renderer`
- [ ] 🤖 Claude — nowy template `TikTokVideo.tsx` (50-58s, mocny hook, szybsze przejścia)
- [ ] 🤖 Claude — `HormoziCaptions.tsx` — napisy word-by-word:
  - Duża czcionka (biały + cień)
  - Aktywne słowo powiększone
  - Kwoty/banki w accent color
  - Zsynchronizowane z audio (timestamps z Whisper)
- [ ] 🤖 Claude — API endpoint `POST /api/render-video`
- [ ] 🤖 Claude — integracja Whisper API (word-level timestamps)

### 3.3 AI Skrypty
- [ ] 🤖 Claude — `tiktok-script.ts` — prompt generujący skrypty:
  - Input: oferta z DB (bank, kwota, warunki)
  - Output: {hook, body, cta, full_text} — max 140 słów
  - Warianty hooków (pytanie/szok/kontrowersja/historia)
  - Cebulowy humor, dynamiczny ton
- [ ] 🤖 Claude — A/B test: 3 warianty hooka per oferta → najlepszy wygrywa
- **Automatyzacja:** ⚙️ AI generuje unikalne skrypty per oferta — zero pisania ręcznego

### 3.4 TTS + Audio
- [ ] 🤖 Claude — regeneracja voiceover z `sanitizeForTTS()` fix (po upgrade ElevenLabs)
- [ ] 🤖 Claude — nowy flow: skrypt → sanitize → ElevenLabs → MP3 → Whisper → timestamps
- **Automatyzacja:** ⚙️ Pełna — skrypt → audio → timestamps bez interwencji

### 3.5 Social Publishing
- [ ] 👤 **TikTok Developer App** — zarejestruj na developers.tiktok.com, uzyskaj approval
- [ ] 👤 **Instagram/Facebook** — skonfiguruj Graph API w Meta Developer Console
- [ ] 👤 **YouTube** — włącz YouTube Data API v3 w Google Cloud Console
- [ ] 🤖 Claude — `social-publish.ts`:
  - `publishToTikTok()` — Content Posting API
  - `publishToInstagram()` — Graph API (Reels)
  - `publishToYouTube()` — Data API v3 (Shorts)
- [ ] 🤖 Claude — OAuth flow per platforma w admin panelu
- [ ] 🤖 Claude — admin `/admin/wideo` — lista wideo, statusy, podpięte konta

### 3.6 n8n Orkiestracja
- [ ] 🤖 Claude — webhook endpoint `/api/webhooks/n8n`
- [ ] 👤 **Konfiguracja n8n workflow** (z pomocą Claude):
  ```
  Cron 10:00 UTC → wybierz ofertę → wygeneruj skrypt → TTS → render → publish
  ```
- [ ] 🤖 Claude — error handling: retry 2x, email alert na failure
- [ ] 🤖 Claude — status tracking w `video_logs`
- **Automatyzacja:** ⚙️ Po konfiguracji — codziennie automatycznie:
  - 10:00 → nowe wideo wygenerowane i opublikowane na 3 platformach
  - **Jedyna ręczna praca:** Odnawianie tokenów OAuth co 60 dni (2 min)

---

## FAZA 4: Community & Seeding (tydzień 4-8)

### 4.1 Reddit / Wykop / Facebook
- [ ] 👤 **Załóż konta** na Reddit (r/polska, r/finanse), Wykop, FB grupy "Promocje bankowe"
- [ ] 👤 **Buduj reputację** — odpowiadaj na pytania o banki, premie, konta (bez spamu)
- [ ] 👤 **Dyskretnie linkuj** do CebulaZysku gdy naturalnie pasuje
- **Automatyzacja:** ❌ **Nie da się zautomatyzować.** Community wymaga autentyczności. Boty = ban.
- **Tip:** 15-20 min/dzień, 80% wartość, 20% promocja

### 4.2 Pepper.pl
- [ ] 👤 **Zgłaszaj najlepsze premie** jako deale na Pepper.pl
- [ ] 👤 **Link do CebulaZysku** w opisie deala (tracking UTM)
- **Automatyzacja:** ❌ Pepper wymaga ręcznego zgłaszania — ale:
  - ⚙️ Claude może przygotować szablon posta per oferta (auto-generowany w admin panelu)
  - 👤 Jarek kopiuje i wkleja na Pepper — 2 min/deal

### 4.3 Monitoring wzmianek
- [ ] 🤖 Claude — Google Alerts na "premia bankowa", "cebulazysku"
- **Automatyzacja:** ⚙️ Google Alerts → email → reagujesz gdy ktoś pyta o premie

---

## FAZA 5: Retencja i Gamifikacja (tydzień 6-10)

### 5.1 Referral Program (częściowo DONE ✅)
- [x] System kodów polecających
- [x] Odznaki za polecenia
- [ ] 🤖 Claude — "Zaproś znajomego" widget na dashboardzie (bardziej widoczny)
- [ ] 🤖 Claude — email "Podziel się z znajomym" z kodem referral
- **Automatyzacja:** ⚙️ Działa samo — user poleca, system liczy i nagradza

### 5.2 Gamifikacja (częściowo DONE ✅)
- [x] Streaki, odznaki, dashboard
- [ ] 🤖 Claude — push notification na streak break ("Wróć! Tracisz swój streak!")
- [ ] 🤖 Claude — monthly leaderboard w dashboardzie
- **Automatyzacja:** ⚙️ Cron sprawdza streaki, wysyła push/email auto

### 5.3 Tracker Improvements
- [ ] 🤖 Claude — reminder: push notification "Czy zrobiłeś przelew ten miesiąc?"
- [ ] 🤖 Claude — auto-detection: po X dniach bez aktywności → email "Potrzebujesz pomocy?"
- **Automatyzacja:** ⚙️ Cron-based — zero interwencji

---

## FAZA 6: Paid Ads (miesiąc 4+, po walidacji organicznego)

### 6.1 Przygotowanie
- [ ] 👤 **Google Ads** — załóż konto, podepnij do GTM (tag konwersji)
- [ ] 👤 **Meta Ads** — podepnij Pixel do GTM (ID pixela)
- [ ] 👤 **TikTok Ads** — podepnij Pixel do GTM (ID pixela)
- [ ] 🤖 Claude — dodaj conversion tagi do GTM container (Google Ads, Meta, TikTok)
- [ ] 🤖 Claude — landing page A/B test (wariant z kalkulatorem vs bez)

### 6.2 Kampanie
- [ ] 👤 **Google Ads:** Search campaigns na branded + long-tail queries
- [ ] 👤 **Meta Ads:** Lookalike audience z GA4 user data
- [ ] 👤 **TikTok Ads:** Spark Ads — boost najlepszych organicznych wideo
- **Automatyzacja:** ⚙️ Częściowa:
  - Retargeting audiences → auto z GA4/Pixel
  - Bidding → auto (Google Smart Bidding, Meta Advantage+)
  - **Nie da się zautomatyzować:** Tworzenie nowych kampanii, budżety, strategia (👤 Jarek)

---

## FAZA 7: Pełna Automatyzacja — "Perpetual Cebula Machine"

### 7.1 Auto-Content Pipeline (n8n)
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ Nowa oferta  │────▶│ AI generuje: │────▶│ Auto-publish │
│ w feedzie    │     │ • Blog post  │     │ • Blog (draft)│
│ (LeadStar    │     │ • TikTok     │     │ • TikTok     │
│  sync cron)  │     │ • Newsletter │     │ • IG Reels   │
└─────────────┘     │ • OG image   │     │ • YT Shorts  │
                    └──────────────┘     │ • Email blast │
                                         └─────────────┘
```
- [ ] 🤖 Claude — n8n workflow: nowa oferta → trigger content generation
- [ ] 🤖 Claude — AI blog post generator (draft → admin review → publish)
- [ ] 🤖 Claude — auto OG image via Canva API (mamy integrację)
- [ ] 🤖 Claude — auto email "Nowa oferta: [bank] daje [X] zł!"
- **Automatyzacja:** ⚙️ ~90% auto. Jedyne ręczne:
  - 👤 Blog post approval (5 min/artykuł) — opcjonalnie auto-publish po score check
  - 👤 Odnawianie tokenów OAuth co 60 dni

### 7.2 Auto-Optimization (n8n + AI)
- [ ] 🤖 Claude — cron: pobierz stats z social platforms → `video_logs.stats`
- [ ] 🤖 Claude — AI analizuje top-performing content → generuje lepsze skrypty
- [ ] 🤖 Claude — auto-repost: wideo >5k views → repost na inne platformy
- [ ] 🤖 Claude — SEO auto-audit: GSC API → słabe strony → AI poprawia meta/content
- **Automatyzacja:** ⚙️ Pełna — AI uczy się co działa i produkuje więcej tego

### 7.3 Auto-Discovery (nowe sieci afiliacyjne)
- [ ] 🤖 Claude — scraper: monitoruj strony banków pod nowe promocje (nie tylko z feedu)
- [ ] 🤖 Claude — alert: "Bank X uruchomił nową promocję — dodać do DB?"
- **Automatyzacja:** ⚙️ ~80% auto. Ręczne:
  - 👤 Potwierdzenie dodania oferty (1 min)
  - 👤 Negocjacja stawek z nowymi sieciami (ad hoc)

---

## Podsumowanie: Co wymaga pracy Jarka

### Jednorazowe (łącznie ~3-4h)
| Akcja | Czas | Kiedy |
|-------|------|-------|
| Import GTM container + sprawdzenie GA4 | 10 min | Teraz |
| Założenie TikTok Business | 15 min | Faza 0 |
| Założenie IG Professional + FB Page | 15 min | Faza 0 |
| Założenie kanału YouTube | 10 min | Faza 0 |
| Weryfikacja GSC + submit sitemap | 10 min | Faza 0 |
| Zakup VPS (Hetzner) | 15 min | Faza 3 |
| Upgrade ElevenLabs | 5 min | Faza 3 |
| TikTok Developer App | 20 min | Faza 3 |
| Meta Developer Console | 20 min | Faza 3 |
| Google Cloud (YouTube API) | 15 min | Faza 3 |
| Google Ads + Meta Ads konta | 30 min | Faza 6 |

### Cykliczne (po pełnej automatyzacji)
| Akcja | Częstotliwość | Czas |
|-------|---------------|------|
| Community (Reddit/Wykop/FB) | Codziennie | 15-20 min |
| Blog post approval | 1x/tydzień | 5 min |
| Pepper.pl deal posting | Przy nowej ofercie | 2 min |
| Odnawianie tokenów OAuth | Co 60 dni | 2 min |
| Review stats w GA4 / admin | 1x/tydzień | 10 min |
| **Total tygodniowo po automatyzacji** | | **~2.5h** |

### Co się NIE DA zautomatyzować
1. **Community engagement** — autentyczne odpowiedzi na forach (boty = ban)
2. **Strategiczne decyzje** — nowe kanały, budżety, pivot
3. **Negocjacje z sieciami** — nowe partnerstwa afiliacyjne
4. **Legal/compliance** — regulaminy, RODO updates
5. **Konfiguracja platform** — zakładanie kont, OAuth setup (jednorazowe)

### Co się DA zautomatyzować (i będzie po wdrożeniu)
| Proces | Obecny stan | Stan docelowy |
|--------|-------------|---------------|
| Sync ofert z feeda | ⚙️ Auto (cron) | ⚙️ Auto |
| AI opisy ofert | ⚙️ Auto (cron) | ⚙️ Auto |
| Quality check | ⚙️ Auto (cron) | ⚙️ Auto |
| Wideo produkcja | ❌ Brak | ⚙️ Auto (n8n → render → publish) |
| Social posting | ❌ Brak | ⚙️ Auto (3 platformy) |
| Newsletter | ❌ Brak | ⚙️ Auto (weekly + alerts) |
| Email reminders | ❌ Brak | ⚙️ Auto (deadline alerts) |
| Blog content | ❌ Ręczny | ⚙️ Semi-auto (AI draft → 👤 approve) |
| SEO monitoring | ❌ Brak | ⚙️ Auto (GSC API → AI optymalizacja) |
| OG images | ⚙️ Semi-auto (Canva API) | ⚙️ Auto |
| Performance analytics | ❌ Ręczny | ⚙️ Auto (fetch stats → AI wnioski) |
| Referral/gamifikacja | ⚙️ Auto | ⚙️ Auto |

---

## Timeline

| Faza | Zakres | Czas | Zależności od Jarka |
|------|--------|------|---------------------|
| 0 | Fundamenty | 2 dni | Konta social, GSC, GTM import |
| 1 | SEO Content | 2 tyg | Brak (Claude + Gemini) |
| 2 | Email Marketing | 1 tyg | Brak (Claude) |
| 3 | Video Pipeline | 2 tyg | VPS, ElevenLabs upgrade, Developer Apps |
| 4 | Community | Ongoing | 15 min/dzień (Jarek) |
| 5 | Retencja | 1 tyg | Brak (Claude) |
| 6 | Paid Ads | 1 tyg | Konta ads, budżet |
| 7 | Pełna automatyzacja | 2 tyg | n8n config |
