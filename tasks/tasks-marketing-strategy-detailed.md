# Tasks: Strategia Marketingowa — Szczegółowy Rozkład

> @author Claude Code (claude-opus-4-6) | 2026-03-25
> Każdy punkt strategii (`docs/strategia-marketingowa.md`) rozbity na taski i subtaski.
> Legenda: 🤖 Claude | 🤖 Gemini | 👤 Jarek | ⚙️ Auto (po wdrożeniu)

---

## §1. POZYCJONOWANIE I PERSONA

### 1.1 Brand Positioning — materiały
- [ ] 🤖 Gemini — napisz brand book (1-2 strony): misja, wizja, tone of voice, "cebulowy humor" guidelines
  - [ ] Zdefiniuj 5 słów-kluczy opisujących markę (np. sprytny, transparentny, pomocny)
  - [ ] Przykłady dobrego i złego tonu komunikacji (do/don't)
  - [ ] Zapisz do `docs/brand-book.md`
- [ ] 🤖 Gemini — przygotuj one-liner, elevator pitch (30s), tagline w 3 wariantach
  - [ ] Warianty: formalny, cebulowy humor, Gen-Z
  - [ ] Zapisz do `research/brand-messaging.md`
- [ ] 👤 Jarek — wybierz finalny tagline i tone of voice

### 1.2 Persona "Sprytny Cebularz" — walidacja
- [ ] 🤖 Claude — dodaj persona info do strony `/o-nas` (lub nowej sekcji "Dla kogo?")
  - [ ] Sekcja "Dla kogo jest CebulaZysku?" z opisem profilu użytkownika
  - [ ] Tekst nawiązujący do bólów (zapominanie warunków, regulaminy, deadline'y)
- [ ] 🤖 Gemini — przygotuj 3 warianty hero copy na landing page targetowane na Sprytnego Cebularza
  - [ ] Wariant A: fokus na oszczędności ("Zarabiaj na bankach")
  - [ ] Wariant B: fokus na narzędzie ("Tracker śledzi za Ciebie")
  - [ ] Wariant C: fokus na społeczność ("Dołącz do cebularzy")
  - [ ] Zapisz do `research/hero-copy-variants.md`
- [ ] 🤖 Claude — A/B test hero copy (analytics event `hero_variant_view` + `hero_cta_click`)

### 1.3 Persona "Bankowy Noob" — content
- [ ] 🤖 Gemini — przygotuj 5 artykułów blogowych targetowanych na Nooba:
  - [ ] "Pierwsze konto bankowe — co wybrać w 2026?"
  - [ ] "Czy otwarcie konta to bezpieczne? Obalamy 5 mitów"
  - [ ] "Premia za konto — co to jest i jak ją dostać (krok po kroku)"
  - [ ] "Jakie opłaty mogą Cię zaskoczyć przy nowym koncie?"
  - [ ] "BIK a pierwsze konto — czy bank mnie sprawdzi?"
- [ ] 🤖 Claude — dedykowana landing page `/pierwsze-konto` z uproszczonym UI
  - [ ] Filtr: tylko oferty "Łatwa" trudność
  - [ ] Język prostszy niż na głównej (bez żargonu)
  - [ ] CTA: "Wybierz swoje pierwsze konto z premią"

---

## §2. LEJEK MARKETINGOWY

### 2.1 TOFU — Awareness (pozyskanie ruchu)
- [ ] 🤖 Claude — landing page `/link` (bio link page dla social media)
  - [ ] Pobierz TOP 5 aktywnych ofert z DB (sortuj po reward DESC)
  - [ ] Każda oferta: logo banku + nazwa + kwota + przycisk "Sprawdź"
  - [ ] Tracking UTM: `?utm_source={platform}&utm_medium=bio`
  - [ ] Mobile-first: duże przyciski (min 48px touch target)
  - [ ] Branding CebulaZysku na górze (logo + tagline)
  - [ ] ISR — auto-refresh co 1h
- [ ] 🤖 Claude — social share buttons na stronach ofert i bloga
  - [ ] Facebook Share (SDK share dialog)
  - [ ] X/Twitter (intent URL z pre-filled tekstem)
  - [ ] WhatsApp (wa.me link z deeplink do oferty)
  - [ ] "Kopiuj link" z clipboard API + toast "Skopiowano!"
  - [ ] dataLayer event `share` z parametrami {method, content_type, item_id}
  - [ ] Umieść: pod opisem oferty + pod artykułem bloga
- [ ] 🤖 Claude — OG images weryfikacja i fix
  - [ ] Sprawdź każdą ofertę: czy ma `og:image` w meta tagach
  - [ ] Sprawdź wymiary (1200×630), czytelność tekstu na miniaturze
  - [ ] Jeśli brak — wygeneruj via Canva API lub fallback na template
  - [ ] Testuj: Facebook Sharing Debugger, Twitter Card Validator

### 2.2 MOFU — Interest (budowanie zainteresowania)
- [ ] 🤖 Claude — kalkulator premii na landing page
  - [ ] Formularz: "Ile miesięcznie przelewasz na konto?" (slider 1k-15k)
  - [ ] Wynik: "Możesz zarobić X zł na premiach bankowych w 2026"
  - [ ] Lista pasujących ofert z matchem do kwoty przelewu
  - [ ] dataLayer event `calculator_result` z {amount, matching_offers}
- [ ] 🤖 Gemini — seria artykułów blogowych "Jak zarobić X zł":
  - [ ] "Jak zarobić 1000 zł na premiach bankowych — plan na 3 miesiące"
  - [ ] "Jak zarobić 3000 zł na bankach — kompletny poradnik"
  - [ ] "Jak zarobić 5000 zł na premiach w 2026 — strategia cebularza"
  - [ ] Każdy z konkretnymi ofertami, krokami, timeline'em
- [ ] 🤖 Claude — newsletter signup (patrz §3.3 Email)
- [ ] 🤖 Claude — "Ile mogę zarobić?" CTA button na landing page → scroll do kalkulatora

### 2.3 BOFU — Conversion (konwersja na kliknięcie afiliacyjne)
- [ ] 🤖 Claude — ranking page `/ranking` (lub ulepszenie istniejącej strony głównej)
  - [ ] "TOP 10 premii bankowych — marzec 2026" (auto-generowany z DB)
  - [ ] Sortowanie: po kwocie, po deadline, po trudności
  - [ ] Deadline badge: "Zostało X dni!" (czerwony gdy <7 dni)
  - [ ] ISR z revalidate co 1h
  - [ ] JSON-LD ItemList schema
- [ ] 🤖 Claude — porównywarka filtrowana
  - [ ] Filtr po banku (multi-select)
  - [ ] Filtr po minimalnej kwocie premii
  - [ ] Filtr po typie konta (osobiste/firmowe)
  - [ ] Filtr "Nie mam jeszcze konta w tym banku" (integracja z user_banks)
  - [ ] URL params: `/oferty?bank=bnp,mbank&min=200` (sharable)
- [ ] 🤖 Claude — CTA optymalizacja na stronach ofert
  - [ ] A/B test: "Otwórz konto" vs "Zacznij zarabiać" vs "Zgarnij [X] zł"
  - [ ] Sticky CTA button na mobile (fixed bottom)
  - [ ] Trust signals obok CTA: "Bezpłatne", "Bez zobowiązań", "2 min"
  - [ ] dataLayer event `cta_variant_click` z {variant, offer_id}

### 2.4 Retention (utrzymanie użytkownika)
- [ ] 🤖 Claude — ulepszony dashboard tracker
  - [ ] Progress bar: "Zrealizowałeś 3/5 warunków — zostało 2!"
  - [ ] Kalendarz warunków: "W tym miesiącu musisz: 5 transakcji kartą, przelew 1000 zł"
  - [ ] Integracja z push notifications
- [ ] 🤖 Claude — email reminders (patrz §3.3 Deadline Alerts)
- [ ] 🤖 Claude — referral program widoczność (patrz §5 Retencja)
- [ ] 🤖 Claude — gamifikacja rozszerzenia (patrz §5 Retencja)

---

## §3. KANAŁY I TAKTYKI

### 3.1 SEO

#### 3.1.1 Klasteryzacja treści — Hub Pages per Bank
- [ ] 🤖 Claude — PRD dla hub pages (`tasks/prd-hub-pages.md`)
- [ ] 🤖 Claude — strona `/bank/[slug]` (dynamic route)
  - [ ] Template: hero z logiem banku + nazwa + rating
  - [ ] Sekcja "Aktywne oferty" — auto z DB (filtr bank_name)
  - [ ] Sekcja "Historia ofert" — archiwalne oferty tego banku
  - [ ] Sekcja "Poradniki" — linki do blogów o tym banku
  - [ ] Sekcja "Opinie" (placeholder na przyszłość)
  - [ ] JSON-LD Organization schema (bank) + BreadcrumbList
  - [ ] Meta tags: "Premie bankowe [Bank] 2026 — aktualne oferty i warunki"
  - [ ] ISR revalidate co 1h
- [ ] 🤖 Claude — automatyczne tworzenie hub pages z DB
  - [ ] Query: `SELECT DISTINCT bank_name FROM offers`
  - [ ] generateStaticParams → hub page per bank
  - [ ] Sitemap: dodaj `/bank/*` URLs
- [ ] 🤖 Gemini — SEO copy per bank (5 banków priorytetowych)
  - [ ] BNP Paribas — opis, USP, historia ofert
  - [ ] mBank — opis, USP, historia ofert
  - [ ] ING — opis, USP, historia ofert
  - [ ] Santander — opis, USP, historia ofert
  - [ ] PKO BP — opis, USP, historia ofert
  - [ ] Zapisz do `research/bank-seo-copy.json`
- [ ] 🤖 Claude — internal linking: auto-link nazw banków w blogach → hub page

#### 3.1.2 Long-tail Blog Articles
- [ ] 🤖 Gemini — keyword research: 20 long-tail keywords z volumem
  - [ ] "jak zdobyć premię [bank] 2026" — per bank (×5)
  - [ ] "warunki promocji [bank] krok po kroku" — per bank (×5)
  - [ ] "premia za konto [bank] ile można zarobić" — per bank (×5)
  - [ ] Generic: "ile premii bankowych można mieć jednocześnie"
  - [ ] Generic: "czy premia bankowa jest opodatkowana"
  - [ ] Generic: "najlepsze promocje bankowe marzec/kwiecień 2026"
  - [ ] Generic: "rotacja bankowa — jak zarabiać co rok"
  - [ ] Generic: "premia bankowa a BIK — czy to wpływa na scoring"
  - [ ] Zapisz do `research/seo-keyword-list.md`
- [ ] 🤖 Gemini — napisz artykuły (batch 1: 5 artykułów)
  - [ ] Każdy 1500-2500 słów, SEO-optymalizowany (H2/H3, keyword density, internal links)
  - [ ] Zawsze z sekcją "Krok po kroku" i "FAQ"
  - [ ] CTA do trackera: "Śledź warunki w CebulaZysku"
- [ ] 🤖 Gemini — napisz artykuły (batch 2: 5 artykułów)
- [ ] 🤖 Gemini — napisz artykuły (batch 3: 5 artykułów)
- [ ] 🤖 Gemini — napisz artykuły (batch 4: 5 artykułów)
- [ ] 🤖 Claude — import artykułów do Supabase (blog_posts)
  - [ ] Skrypt batch import z Markdown → HTML → DB
  - [ ] Auto-generacja slug, meta description, OG image
- [ ] 🤖 Claude — internal linking engine
  - [ ] Skanuj tekst bloga, znajdź nazwy banków → link do hub page
  - [ ] Znajdź terminy ze słownika → link do `/slownik#termin`
  - [ ] Znajdź wzmianki o ofertach → link do `/oferta/[slug]`

#### 3.1.3 FAQ Schema na stronach ofert
- [ ] 🤖 Claude — komponent `OfferFAQ.tsx`
  - [ ] Generuj FAQ z AI (5 pytań per oferta) — albo pobierz z DB jeśli istnieje
  - [ ] Accordion UI (expand/collapse)
  - [ ] JSON-LD FAQPage schema
  - [ ] Pytania: "Jak zdobyć premię?", "Ile trwa?", "Jakie warunki?", "Czy jest opłata?", "Co po promocji?"
- [ ] 🤖 Claude — dodaj FAQ do każdej strony `/oferta/[slug]`
- [ ] 🤖 Claude — FAQ na stronach bloga (3 pytania per artykuł)

#### 3.1.4 Artykuły porównawcze
- [ ] 🤖 Gemini — napisz 5 artykułów "X vs Y":
  - [ ] "BNP Paribas vs mBank — która premia lepsza w 2026?"
  - [ ] "ING vs Santander — porównanie premii"
  - [ ] "Konto dla młodych — najlepsze premie 2026 (ranking)"
  - [ ] "Konto firmowe z premią — TOP 3 oferty"
  - [ ] "Premia 500 zł vs 300 zł — czy więcej zawsze znaczy lepiej?"
- [ ] 🤖 Claude — strona `/porownanie/[slug]` (dynamic route)
  - [ ] Tabela porównawcza: Bank A vs Bank B (kwota, warunki, trudność, deadline)
  - [ ] Automatyczna generacja z DB: wybierz 2 oferty → porównaj
  - [ ] Verdict sekcja: "Nasza rekomendacja"
  - [ ] JSON-LD Table schema

#### 3.1.5 Glossary / Słownik
- [ ] 🤖 Gemini — `research/tooltip-glossary.json` z 20+ terminami
  - [ ] BIK, BFG, MCC, karencja, sprzedaż premiowa, wpływ, limit debetowy
  - [ ] Okres rozliczeniowy, karta wirtualna, rotacja bankowa, ROR, BLIK P2P
  - [ ] Prowizja, spread walutowy, konto oszczędnościowe, lokata, scoring
  - [ ] Dodaj: opisy trudności ("Łatwa" / "Średnia" / "Trudna")
- [ ] 🤖 Claude — strona `/slownik` (glossary page)
  - [ ] Alfabetyczna lista terminów z definicjami
  - [ ] Wyszukiwarka/filtr
  - [ ] JSON-LD DefinedTermSet schema
  - [ ] Każdy termin ma anchor link (`/slownik#bik`)
- [ ] 🤖 Claude — tooltip komponent `GlossaryTooltip.tsx`
  - [ ] Hover/click na podkreślony termin → tooltip z definicją
  - [ ] Link "Czytaj więcej" → `/slownik#termin`
  - [ ] Auto-scan tekstu bloga/ofert → wstaw tooltip przy pierwszym wystąpieniu
- [ ] 🤖 Claude — sitemap: dodaj `/slownik` do sitemap.xml

---

### 3.2 Social Media (TikTok + IG Reels + YT Shorts)

#### 3.2.1 Konta i profile
- [ ] 👤 Jarek — załóż TikTok Business Account
  - [ ] Nazwa: @cebulazysku lub @cebulazysku.pl
  - [ ] Bio: tagline + "Link poniżej 👇"
  - [ ] Link w bio → cebulazysku.pl/link?utm_source=tiktok&utm_medium=bio
  - [ ] Zdjęcie profilowe: logo CebulaZysku
- [ ] 👤 Jarek — załóż Instagram Professional Account
  - [ ] Nazwa: @cebulazysku.pl
  - [ ] Bio: tagline + "Sprawdź premie 👇"
  - [ ] Link w bio → cebulazysku.pl/link?utm_source=instagram&utm_medium=bio
  - [ ] Połącz z Facebook Business Page
- [ ] 👤 Jarek — załóż kanał YouTube
  - [ ] Nazwa: CebulaZysku
  - [ ] Opis kanału: 2-3 zdania o tematyce
  - [ ] Link w opisie → cebulazysku.pl/link?utm_source=youtube&utm_medium=bio
  - [ ] Włącz YouTube Studio, upload banner
- [ ] 👤 Jarek — załóż Facebook Business Page
  - [ ] Nazwa: CebulaZysku.pl
  - [ ] Wymagane przez Instagram Graph API i Meta Ads

#### 3.2.2 Content pipeline — Hack/Loophole (3x/tyg)
- [ ] 🤖 Claude — template skryptu "Hack" w `tiktok-script.ts`
  - [ ] Struktura: Hook kontrowersyjny (3s) → "Oto jak" (5s) → Kroki (20s) → CebulaZysku demo (15s) → CTA (5s)
  - [ ] Prompt: generuj z danych oferty (bank, kwota, top 3 warunki)
  - [ ] Max 140 słów, naturalny polski, "cebulowy" ton
- [ ] 🤖 Gemini — przygotuj 15 gotowych skryptów Hack (na 5 tygodni)
  - [ ] 3 per bank × 5 banków
  - [ ] Warianty hooków: pytanie, szok, prowokacja
  - [ ] Zapisz do `research/tiktok-scripts-hack.md`

#### 3.2.3 Content pipeline — Storytime (2x/tyg)
- [ ] 🤖 Claude — template skryptu "Storytime" w `tiktok-script.ts`
  - [ ] Struktura: "Opowiem Ci historię..." (3s) → Problem (10s) → Odkrycie CebulaZysku (15s) → Rezultat (15s) → CTA (5s)
  - [ ] Pierwsza osoba, emocjonalny, relatable
- [ ] 🤖 Gemini — przygotuj 10 skryptów Storytime
  - [ ] "Byłem bankowym noobie..."
  - [ ] "Mój znajomy powiedział mi o tym tricku..."
  - [ ] "Otworzyłem 4 konta w 3 miesiące — oto co się stało"
  - [ ] Etc.
  - [ ] Zapisz do `research/tiktok-scripts-storytime.md`

#### 3.2.4 Content pipeline — Challenge/Checklist (1x/tyg)
- [ ] 🤖 Claude — template skryptu "Challenge" w `tiktok-script.ts`
  - [ ] Format serialowy: "Wyzwanie 3000 zł — Tydzień X"
  - [ ] Progress update: co się udało, ile zarobiłem, co następne
  - [ ] Buduje followership (chcesz zobaczyć kolejny odcinek)
- [ ] 🤖 Gemini — zaplanuj 12-tygodniowy challenge script arc
  - [ ] Tydzień 1: "Zaczynam od zera"
  - [ ] Tydzień 4: "Pierwsza premia wpłynęła!"
  - [ ] Tydzień 8: "Mam już 1500 zł"
  - [ ] Tydzień 12: "3000 zł — cel osiągnięty!"
  - [ ] Zapisz do `research/tiktok-challenge-arc.md`

#### 3.2.5 Content pipeline — Edukacja (1x/tyg)
- [ ] 🤖 Claude — template skryptu "Edukacja" w `tiktok-script.ts`
  - [ ] Format: pytanie → odpowiedź z kontekstem → CTA
  - [ ] Ton: autorytatywny ale przystępny
- [ ] 🤖 Gemini — przygotuj 10 tematów edukacyjnych
  - [ ] "Co to jest BIK i dlaczego banki sprawdzają?"
  - [ ] "Czy premie bankowe są opodatkowane?"
  - [ ] "Co to jest MCC i dlaczego ma znaczenie?"
  - [ ] "Czym się różni konto osobiste od oszczędnościowego?"
  - [ ] "Jak działa karencja i dlaczego o niej pamiętać?"
  - [ ] Etc.
  - [ ] Zapisz do `research/tiktok-scripts-education.md`

#### 3.2.6 Produkcja wideo (Remotion + ElevenLabs + Whisper)
- [ ] 🤖 Claude — `TikTokVideo.tsx` — nowy template Remotion (9:16, 1080×1920)
  - [ ] 50-58s (nie 70s jak obecne)
  - [ ] Sceny: Hook (3s) → Problem (5s) → Rozwiązanie (15s) → Demo/Proof (15s) → CTA (5s)
  - [ ] Dynamiczne tło (gradient animowany lub B-roll z Pexels)
  - [ ] Logo CebulaZysku watermark (prawy górny róg, 10% opacity)
  - [ ] SFX: cash register, whoosh na key moments
- [ ] 🤖 Claude — `HormoziCaptions.tsx` — napisy word-by-word
  - [ ] Czcionka: bold, duża (min 60px), biała z cieniem
  - [ ] Aktywne słowo: scale 1.2× + accent color (#FFCC00)
  - [ ] Keywords (kwoty, nazwy banków): wyróżnione innym kolorem (#00FF88)
  - [ ] Sync z Whisper word-level timestamps
  - [ ] Max 3-4 słowa widoczne jednocześnie
- [ ] 🤖 Claude — `POST /api/render-video` endpoint
  - [ ] Input: offer_id + script variant
  - [ ] Flow: script → sanitizeForTTS → ElevenLabs → MP3 → Whisper timestamps → Remotion render → MP4
  - [ ] Upload MP4 do Supabase Storage `videos/`
  - [ ] Zapisz do `video_logs` tabeli
- [ ] 🤖 Claude — Whisper API integracja (`src/lib/whisper.ts`)
  - [ ] `POST /v1/audio/transcriptions` z `timestamp_granularities=["word"]`
  - [ ] Parsuj response → `[{word, start, end}, ...]`
  - [ ] Cache timestamps w DB (nie wywołuj Whisper ponownie dla tego samego audio)
- [ ] 🤖 Claude — migracja DB: `video_logs` + `social_accounts` (patrz PRD)
- [ ] 👤 Jarek — upgrade ElevenLabs do Creator plan ($22/mo, 100k chars)

#### 3.2.7 Zasady publikacji
- [ ] 🤖 Claude — auto-generacja napisów (caption) per platforma
  - [ ] TikTok: max 2200 znaków, hashtagi na końcu
  - [ ] Instagram: max 2200 znaków, hashtagi w komentarzu (osobno)
  - [ ] YouTube: tytuł z #Shorts, opis z linkami
- [ ] 🤖 Claude — hashtag set per typ contentu
  - [ ] Stałe: #premiebankowe #zarabianienabankach #cebulazysku #pieniądze #oszczędzanie
  - [ ] Per typ: #lifehack (Hack), #storytime (Story), #wyzwanie (Challenge), #edukacja (Edu)
  - [ ] Trending hashtagi: rotuj co tydzień (pobieraj z TikTok Creative Center)
- [ ] 🤖 Claude — scheduling: optymalne godziny publikacji
  - [ ] TikTok PL: 7-9, 12-13, 18-21
  - [ ] IG Reels: 8-10, 17-19
  - [ ] YT Shorts: 12-14, 19-21
  - [ ] Konfiguracja w n8n workflow

#### 3.2.8 Publikacja na platformy
- [ ] 👤 Jarek — zarejestruj TikTok Developer App (developers.tiktok.com)
  - [ ] Wnioskuj o Content Posting API access
  - [ ] Czekaj na approval (3-5 dni roboczych)
- [ ] 👤 Jarek — skonfiguruj Meta Developer App
  - [ ] Włącz Instagram Graph API
  - [ ] Dodaj Instagram Professional Account jako test user
- [ ] 👤 Jarek — skonfiguruj Google Cloud project
  - [ ] Włącz YouTube Data API v3
  - [ ] Utwórz OAuth2 credentials (web application)
- [ ] 🤖 Claude — `social-publish.ts` — unified publisher
  - [ ] `publishToTikTok(videoUrl, caption, hashtags)` — Content Posting API
  - [ ] `publishToInstagram(videoUrl, caption, hashtags)` — Graph API Reels
  - [ ] `publishToYouTube(videoUrl, title, description, tags)` — Data API v3
  - [ ] Error handling: retry 2×, log failure reason
  - [ ] Rate limit awareness per platform
- [ ] 🤖 Claude — OAuth flow per platforma w admin panelu
  - [ ] Admin `/admin/social` — przycisk "Połącz TikTok/IG/YT"
  - [ ] Token storage w `social_accounts` (encrypted)
  - [ ] Auto-refresh token przed expiry
  - [ ] Status badge: 🟢 Connected / 🔴 Expired

#### 3.2.9 n8n Orkiestracja
- [ ] 👤 Jarek — kup VPS (Hetzner CX22, ~€4/mo)
- [ ] 🤖 Claude — Docker Compose: n8n + Chromium (dla Remotion)
  - [ ] `docker-compose.yml` z volumes, restart policy, basic auth
  - [ ] Healthcheck endpoint
  - [ ] Reverse proxy (Caddy/nginx) z SSL
- [ ] 🤖 Claude — n8n workflow "Daily Video Pipeline"
  - [ ] Cron trigger: 10:00 UTC (pon-pt)
  - [ ] Step 1: HTTP GET → `/api/webhooks/n8n?action=next-offer` → wybierz ofertę
  - [ ] Step 2: HTTP POST → `/api/render-video` z offer_id
  - [ ] Step 3: Poll status (co 30s) aż `video_logs.status = rendered`
  - [ ] Step 4: HTTP POST → `/api/publish-video` → publish na 3 platformy
  - [ ] Step 5: Zapisz wynik do DB
  - [ ] Error branch: email alert do Jarka
- [ ] 🤖 Claude — webhook endpoint `/api/webhooks/n8n`
  - [ ] Auth: shared secret w header
  - [ ] Actions: `next-offer`, `render-status`, `publish`
  - [ ] Round-robin ofert (nie powtarzaj tej samej w ciągu 7 dni)

---

### 3.3 Email Marketing (Newsletter)

#### 3.3.1 Infrastruktura
- [ ] 🤖 Claude — PRD newsletter (`tasks/prd-newsletter.md`)
- [ ] 🤖 Claude — migracja DB: `newsletter_subscribers` tabela
  - [ ] Kolumny: id, email, name, subscribed_at, unsubscribed_at, source, status
  - [ ] Constraint: unique on email
- [ ] 🤖 Claude — API: `POST /api/newsletter/subscribe`
  - [ ] Double opt-in: wyślij email z linkiem potwierdzającym
  - [ ] Walidacja email (format + disposable email blocker)
  - [ ] Rate limit: max 5 subscriptions/IP/hour
- [ ] 🤖 Claude — API: `GET /api/newsletter/confirm?token=xxx`
  - [ ] Potwierdź subskrypcję, ustaw status = active
  - [ ] Redirect na /newsletter/potwierdzenie (thank you page)
- [ ] 🤖 Claude — API: `GET /api/newsletter/unsubscribe?token=xxx`
  - [ ] Ustaw status = unsubscribed
  - [ ] Redirect na /newsletter/wypisano (confirmation page)
- [ ] 🤖 Claude — admin panel: `/admin/newsletter`
  - [ ] Lista subskrybentów (email, data, source, status)
  - [ ] Stats: total, active, unsubscribed, open rate, CTR
  - [ ] Export CSV

#### 3.3.2 Welcome Email
- [ ] 🤖 Claude — template HTML (Resend)
  - [ ] Subject: "Witaj w CebulaZysku! 🧅 Oto jak zarobić pierwszą premię"
  - [ ] Treść: powitanie + 3 kroki do pierwszej premii + TOP 1 oferta + CTA
  - [ ] Branding: logo, kolory, footer z linkiem unsubscribe
- [ ] 🤖 Gemini — copywriting welcome email (3 warianty do A/B testu)

#### 3.3.3 Weekly Digest
- [ ] 🤖 Claude — Vercel cron: poniedziałek 09:00 UTC
  - [ ] Query: TOP 3 aktywne oferty (sortuj po reward)
  - [ ] Per oferta: bank + kwota + ile dni zostało + link afiliacyjny
  - [ ] Deduplikacja: `email_sends` tabela (nie wysyłaj duplikatów)
- [ ] 🤖 Claude — template HTML weekly digest
  - [ ] Subject: "TOP 3 premie bankowe w tym tygodniu [dd.mm]"
  - [ ] Sekcja "Zbliżające się deadline'y" (oferty <14 dni do końca)
  - [ ] CTA: "Zobacz wszystkie oferty na CebulaZysku"

#### 3.3.4 Deadline Alert Emails
- [ ] 🤖 Claude — Vercel cron: codziennie 08:00 UTC
  - [ ] Query: tracked_offers WHERE deadline BETWEEN now AND now+7 days
  - [ ] Wyślij alert: "Twoja premia z [bank] wygasa za X dni!"
  - [ ] Drugi alert na 3 dni przed (jeśli nie zrealizowane)
  - [ ] Deduplikacja: nie wysyłaj tego samego alertu ponownie
- [ ] 🤖 Claude — template HTML deadline alert
  - [ ] Subject: "⏰ Zostało X dni na premię z [bank]!"
  - [ ] Treść: co jeszcze musisz zrobić (lista niespełnionych warunków)
  - [ ] CTA: "Sprawdź swój tracker"

#### 3.3.5 New Offer Email
- [ ] 🤖 Claude — trigger: po `sync-offers` gdy nowa oferta >300 zł
  - [ ] Wyślij do active subscribers
  - [ ] Subject: "Nowa premia: [bank] daje [X] zł!"
  - [ ] Treść: kwota + warunki (3 główne) + trudność + CTA
- [ ] 🤖 Claude — rate limit: max 2 new offer emails/tydzień (żeby nie spamować)

#### 3.3.6 Win Story Email (miesięczna)
- [ ] 🤖 Gemini — napisz 6 case study "Jak użytkownik X zarobił Y zł"
  - [ ] Bazuj na realnych scenariuszach (ile ofert, ile czasu, jakie warunki)
  - [ ] Tone: inspirujący, konkretny, z liczbami
  - [ ] Zapisz do `research/win-stories.md`
- [ ] 🤖 Claude — cron: 1. dnia miesiąca → wyślij win story
- [ ] 🤖 Claude — template HTML win story

#### 3.3.7 Lead Magnet
- [ ] 🤖 Claude — komponent `NewsletterPopup.tsx`
  - [ ] Trigger: po 30s na stronie LUB po scroll 50%
  - [ ] Copy: "Wyślemy Ci TOP 3 premie bankowe co poniedziałek"
  - [ ] Input: email + przycisk "Zapisz się"
  - [ ] Dismiss: X button + localStorage key `newsletter_popup_dismissed`
  - [ ] Nie pokazuj: jeśli user zalogowany i już subskrybuje
  - [ ] Nie pokazuj: jeśli dismissed w ciągu 30 dni
  - [ ] dataLayer event: `newsletter_popup_shown`, `newsletter_signup`
- [ ] 🤖 Gemini — PDF lead magnet: "Przewodnik Cebularza — jak zarobić 5000 zł na bankach w 2026"
  - [ ] 10-15 stron, praktyczny poradnik
  - [ ] Sekcje: Czym są premie, Jak wybrać, Krok po kroku, Pułapki, CebulaZysku
  - [ ] Design: Canva template
  - [ ] Dostarczany po zapisie do newslettera (link w welcome email)

#### 3.3.8 Zbieranie emaili — dodatkowe punkty
- [ ] 🤖 Claude — checkbox "Zapisz się na newsletter" przy rejestracji użytkownika
  - [ ] Domyślnie odznaczony (RODO)
  - [ ] Jeśli zaznaczony → dodaj do `newsletter_subscribers` po rejestracji
- [ ] 🤖 Claude — inline signup form na dole każdego artykułu blogowego
  - [ ] "Podobał Ci się artykuł? Zapisz się na cotygodniowy digest!"
  - [ ] Kompaktowy formularz (email + button)

---

### 3.4 Community & Seeding

#### 3.4.1 Reddit
- [ ] 👤 Jarek — załóż konto na Reddit (jeśli nie masz)
- [ ] 👤 Jarek — dołącz do r/polska, r/finanse, r/oszczedzanie
- [ ] 👤 Jarek — buduj karmę: odpowiadaj na pytania (bez spamu, bez linków na start)
  - [ ] Cel: 100+ karma przed pierwszym linkiem
  - [ ] Odpowiadaj na: "jaki bank wybrać?", "najlepsza premia?", "jak otworzyć konto?"
- [ ] 👤 Jarek — po 2 tygodniach: naturalnie linkuj CebulaZysku gdy pasuje
  - [ ] Wzór: "Ja używam [cebulazysku.pl](url) do śledzenia warunków — działa ok"
  - [ ] Nigdy: "Sprawdźcie CebulaZysku!!!" (ban)
- [ ] 🤖 Gemini — przygotuj 10 szablonów odpowiedzi na typowe pytania na Reddit
  - [ ] Zapisz do `research/reddit-answer-templates.md`

#### 3.4.2 Wykop
- [ ] 👤 Jarek — załóż/odśwież konto na Wykop
- [ ] 👤 Jarek — aktywność w tagach: #oszczędzanie, #banki, #promocje, #finanse
- [ ] 👤 Jarek — postuj wartościowe treści (poradniki, porównania)
  - [ ] Link do artykułów blogowych CebulaZysku (nie do landing page)
- [ ] 🤖 Gemini — przygotuj 5 postów na Wykop (gotowe do wklejenia)
  - [ ] Zapisz do `research/wykop-posts.md`

#### 3.4.3 Facebook Grupy
- [ ] 👤 Jarek — dołącz do grup: "Promocje bankowe", "Oszczędzanie pieniędzy", "Sprytne oszczędzanie"
- [ ] 👤 Jarek — odpowiadaj na pytania, dziel się wiedzą (80/20 reguła)
- [ ] 👤 Jarek — udostępniaj artykuły blogowe CebulaZysku (gdy adekwatne)
- [ ] 🤖 Gemini — przygotuj 5 postów do grup FB (gotowe do wklejenia)
  - [ ] Zapisz do `research/facebook-group-posts.md`

#### 3.4.4 Pepper.pl
- [ ] 👤 Jarek — załóż konto na Pepper.pl
- [ ] 👤 Jarek — zgłaszaj premie bankowe >300 zł jako deale
  - [ ] Format: "Premia [X] zł za konto w [bank] — [warunki w skrócie]"
  - [ ] Link: afiliacyjny (z CebulaZysku UTM)
  - [ ] Opis: krok po kroku jak zdobyć premię
- [ ] 🤖 Claude — auto-generuj szablon posta Pepper w admin panelu
  - [ ] Przycisk "Kopiuj post na Pepper" na stronie oferty w adminie
  - [ ] Template: tytuł + opis + warunki + link

#### 3.4.5 Monitoring wzmianek
- [ ] 👤 Jarek — ustaw Google Alerts na:
  - [ ] "cebulazysku"
  - [ ] "premia bankowa"
  - [ ] "premie bankowe 2026"
  - [ ] "jak zarobić na bankach"
- [ ] ⚙️ Auto — Google Alerts → email → reaguj gdy ktoś pyta o premie

---

### 3.5 Paid Ads (Faza 2 — po walidacji organic)

#### 3.5.1 Warunki uruchomienia (gate)
- [ ] ⚙️ Osiągnij >5% conversion rate na landing page (CTR affiliate link)
- [ ] ⚙️ Zbierz 3 miesiące danych w GA4
- [ ] ⚙️ Oblicz CPA (koszt pozyskania kliknięcia afiliacyjnego)
- [ ] 👤 Jarek — decyzja go/no-go na paid ads na podstawie danych

#### 3.5.2 Google Ads
- [ ] 👤 Jarek — załóż konto Google Ads
- [ ] 🤖 Claude — dodaj Google Ads conversion tag do GTM container
  - [ ] Conversion: affiliate_click event
  - [ ] Remarketing tag: all pages
- [ ] 👤 Jarek — kampania Search: branded keywords ("cebulazysku")
  - [ ] Budget: 100 PLN/mies. (ochrona brandu)
- [ ] 👤 Jarek — kampania Search: long-tail ("premia konto bankowe", "jak zarobić na bankach")
  - [ ] Budget: 400 PLN/mies.
  - [ ] Negative keywords: "kredyt", "pożyczka", "hipoteka"
- [ ] 🤖 Gemini — przygotuj 10 ad copy wariantów (headline + description)
  - [ ] Zapisz do `research/google-ads-copy.md`

#### 3.5.3 Meta Ads
- [ ] 👤 Jarek — załóż Meta Ads konto
- [ ] 🤖 Claude — dodaj Meta Pixel do GTM container
- [ ] 👤 Jarek — kampania: Lookalike audience z GA4 users
  - [ ] Budget: 500 PLN/mies.
  - [ ] Kreacja: video ads (z pipeline'u TikTok) + static image
  - [ ] Cel: traffic → cebulazysku.pl/link
- [ ] 🤖 Gemini — przygotuj 5 kreacji reklamowych (copy + CTA)

#### 3.5.4 TikTok Ads
- [ ] 👤 Jarek — załóż TikTok Ads konto (jeśli osobne od Business)
- [ ] 🤖 Claude — dodaj TikTok Pixel do GTM container
- [ ] 👤 Jarek — Spark Ads: boost najlepszych organicznych wideo (>1k views)
  - [ ] Budget: 300 PLN/mies.
  - [ ] Cel: video views + traffic
- [ ] 👤 Jarek — monitoruj ROAS co tydzień, wyłącz kampanie <2× ROAS

---

## §4. CONTENT CALENDAR (pierwszy miesiąc)

### Tydzień 1: Fundamenty
- [ ] Pon — 🤖 Gemini — artykuł blog: "Ranking premii bankowych — marzec 2026"
- [ ] Pon — 🤖 Claude — opublikuj artykuł na blogu
- [ ] Wt — 🤖 Claude — wygeneruj TikTok Hack video: "500 zł od banku w 5 minut"
- [ ] Wt — ⚙️ Auto — opublikuj na TikTok + IG + YT (pipeline)
- [ ] Śr — 🤖 Gemini — artykuł blog: "Jak krok po kroku zdobyć premię z BNP Paribas"
- [ ] Śr — 🤖 Claude — opublikuj artykuł
- [ ] Czw — 🤖 Claude — wygeneruj TikTok Storytime: "Zarobiłem 2400 zł na bankach w 3 miesiące"
- [ ] Czw — ⚙️ Auto — opublikuj na TikTok + IG + YT
- [ ] Pt — 🤖 Claude — setup newsletter + welcome email
- [ ] Pt — 🤖 Claude — wyślij testowy welcome email

### Tydzień 2: Skalowanie
- [ ] Pon — 🤖 Claude — wyślij pierwszy weekly digest (newsletter)
- [ ] Wt — 🤖 Claude — TikTok Hack: "Ta apka śledzi warunki za Ciebie"
- [ ] Śr — 🤖 Gemini — artykuł blog: "Co to jest BIK — kompletny przewodnik"
- [ ] Śr — 🤖 Claude — opublikuj artykuł
- [ ] Czw — 🤖 Claude — TikTok Challenge: "Wyzwanie 3000 zł — tydzień 1"
- [ ] Pt — 👤 Jarek — pierwszy post na Reddit/Wykop (wartościowa odpowiedź)

### Tydzień 3: Rozszerzenie
- [ ] Pon — 🤖 Claude — weekly digest #2
- [ ] Wt — 🤖 Claude — TikTok Edukacja: "Co to jest BIK?"
- [ ] Śr — 🤖 Gemini — artykuł porównawczy: "BNP vs mBank — która premia lepsza?"
- [ ] Czw — 🤖 Claude — TikTok Challenge: "Wyzwanie 3000 zł — tydzień 2"
- [ ] Pt — 👤 Jarek — post na Pepper.pl (najlepsza aktualna oferta)

### Tydzień 4: Optymalizacja
- [ ] 🤖 Claude — analiza TikTok metrics: które hooki najlepsze (retention rate)
- [ ] 🤖 Claude — A/B test email subject lines (weekly digest)
- [ ] 🤖 Claude — double down na najlepszy format wideo
- [ ] 🤖 Claude — repost best-of wideo na YouTube Shorts (jeśli jeszcze nie tam)
- [ ] 👤 Jarek — review analytics w GA4: co działa, co nie
- [ ] 👤 Jarek — decyzja: skalować to co działa czy pivotować

---

## §5. METRYKI I KPI

### 5.1 Tracking setup
- [ ] 👤 Jarek — import GTM container (21 tagów) do Google Tag Manager
- [ ] 👤 Jarek — publikuj GTM container
- [ ] 👤 Jarek — weryfikuj GA4 Realtime — czy widać dane
- [ ] 🤖 Claude — weryfikuj czy wszystkie 21 eventów strzelają poprawnie
  - [ ] page_view, offer_view, affiliate_click, share, calculator_result
  - [ ] newsletter_signup, newsletter_popup_shown, cta_variant_click
  - [ ] registration, login, tracker_start, condition_toggle
  - [ ] streak_check, achievement_unlock, referral_share
  - [ ] blog_view, video_play, video_complete, search, filter_change, scroll_depth
- [ ] 🤖 Claude — GA4 custom dimensions setup guide
  - [ ] offer_id, bank_name, reward_amount, difficulty, utm_source, utm_medium
  - [ ] Zapisz instrukcję do `docs/ga4-setup-guide.md`

### 5.2 Dashboard KPI w admin panelu
- [ ] 🤖 Claude — rozbuduj `/admin/konwersje` o nowe metryki:
  - [ ] Organic sessions (GA4 API lub ręczne)
  - [ ] Social followers (z platform API)
  - [ ] Email subscribers (z `newsletter_subscribers`)
  - [ ] Affiliate clicks trend (wykres liniowy, ostatnie 30 dni)
  - [ ] Registered users trend
  - [ ] Revenue estimate (affiliate clicks × avg CPA)

### 5.3 Monitoring narzędzia
- [ ] 👤 Jarek — ustaw Google Search Console property (jeśli nie zrobione)
- [ ] 👤 Jarek — submit sitemap.xml w GSC
- [ ] 👤 Jarek — ustaw Resend dashboard alerts (bounce rate >5%)
- [ ] 🤖 Claude — API integration: GSC → admin panel (indexing status, top queries)
  - [ ] `/admin/seo` — strona z danymi z Google Search Console
  - [ ] Top queries, top pages, indexing issues

---

## §6. BUDŻET

### 6.1 Faza 1: Organiczny (miesiąc 1-3)
- [ ] 👤 Jarek — upgrade ElevenLabs Creator ($22/mo = ~99 PLN)
- [ ] 👤 Jarek — kup VPS Hetzner CX22 (~€4/mo = ~20 PLN)
- [ ] 👤 Jarek — Canva Pro (~55 PLN/mo) — jeśli nie masz
- [ ] Total: ~175 PLN/mies.

### 6.2 Faza 2: Growth + Paid (miesiąc 4+)
- [ ] 👤 Jarek — decyzja: czy uruchomić paid ads (na podstawie danych z Fazy 1)
- [ ] 👤 Jarek — alokacja budżetu: Google 500 + Meta 500 + TikTok 300 PLN
- [ ] Total: ~1475 PLN/mies.

---

## §7. PRIORYTETY IMPLEMENTACYJNE

### 7.1 Newsletter system (Priorytet 1 — blokuje email marketing)
- [ ] 🤖 Claude — PRD (`tasks/prd-newsletter.md`)
- [ ] 🤖 Claude — tasks breakdown (`tasks/tasks-newsletter.md`)
- [ ] 🤖 Claude — implementacja (patrz §3.3 powyżej)

### 7.2 Social share buttons (Priorytet 2 — blokuje organiczny sharing)
- [ ] 🤖 Claude — implementacja (patrz §2.1 TOFU)

### 7.3 TikTok video pipeline (Priorytet 3 — blokuje social content)
- [ ] 🤖 Claude — tasks breakdown z PRD (`tasks/prd-tiktok-pipeline.md`)
- [ ] 🤖 Claude — implementacja (patrz §3.2.6-3.2.9)

### 7.4 Lead magnet popup (Priorytet 4 — blokuje listę subskrybentów)
- [ ] 🤖 Claude — implementacja (patrz §3.3.7)

### 7.5 Hub pages per bank (Priorytet 5 — blokuje SEO klasteryzację)
- [ ] 🤖 Claude — PRD + implementacja (patrz §3.1.1)

### 7.6 Glossary /slownik (Priorytet 6 — blokuje SEO + internal linking)
- [ ] 🤖 Claude — implementacja (patrz §3.1.5)

### 7.7 Bio link page /link (Priorytet 7 — blokuje social → site traffic)
- [ ] 🤖 Claude — implementacja (patrz §2.1 TOFU)

---

## §8. QUICK WINS (ten tydzień)

### 8.1 Bio link page `/link`
- [ ] 🤖 Claude — implementacja strony (patrz §2.1 szczegóły)
- [ ] Czas: ~1h

### 8.2 Social share buttons
- [ ] 🤖 Claude — implementacja (patrz §2.1 szczegóły)
- [ ] Czas: ~1h

### 8.3 OG images audit
- [ ] 🤖 Claude — sprawdź wszystkie oferty: czy mają poprawne og:image
- [ ] 🤖 Claude — fix brakujące/złe OG images
- [ ] Czas: ~30min

### 8.4 Google Search Console
- [ ] 👤 Jarek — weryfikacja domeny w GSC
- [ ] 👤 Jarek — submit sitemap
- [ ] 👤 Jarek — sprawdź Coverage report
- [ ] Czas: ~10min

### 8.5 Konta social media
- [ ] 👤 Jarek — TikTok (15 min)
- [ ] 👤 Jarek — Instagram + FB Page (15 min)
- [ ] 👤 Jarek — YouTube (10 min)
- [ ] 👤 Jarek — ustawienie linków w bio na wszystkich platformach

---

## §9. RYZYKA — AKCJE MITYGACYJNE

### 9.1 Google zmienia algorytm
- [ ] 🤖 Claude — dywersyfikacja: upewnij się że >30% ruchu z kanałów nie-SEO
- [ ] 🤖 Claude — newsletter jako owned channel (nie zależy od Google)
- [ ] 🤖 Claude — social presence (TikTok/IG/YT) jako backup traffic source

### 9.2 TikTok banuje AI content
- [ ] 🤖 Claude — upewnij się że TTS jest wysokiej jakości (Daniel voice, ElevenLabs Creator)
- [ ] 🤖 Claude — każdy skrypt unikalny (nie copy-paste template)
- [ ] 🤖 Claude — Hormozi captions wyglądają profesjonalnie (nie jak spam)
- [ ] 👤 Jarek — backup: nagrywaj ręcznie 1 wideo/tydzień (personal touch)

### 9.3 LeadStar zmienia stawki
- [ ] 🤖 Claude — multi-source affiliates (Conversand jako backup) — DONE ✅
- [ ] 👤 Jarek — szukaj nowych sieci afiliacyjnych (co kwartał review)
- [ ] 🤖 Claude — alert: jeśli CPA spada >20% → email do Jarka

### 9.4 Niska konwersja organic
- [ ] 🤖 Claude — A/B testing landing pages (kalkulator, hero copy, CTA)
- [ ] 🤖 Claude — heatmap analysis (Hotjar free tier lub clarity.microsoft.com)
- [ ] 🤖 Claude — retargeting setup (Meta Pixel, Google Ads remarketing)

### 9.5 Wypalenie contentu
- [ ] 🤖 Claude — AI pipeline automatyzuje 90% produkcji
- [ ] 🤖 Claude — content backlog: zawsze 2 tygodnie materiału do przodu
- [ ] 🤖 Claude — rotacja formatów (Hack → Story → Challenge → Edu → repeat)

---

## PODSUMOWANIE STATYSTYK

| Kategoria | Tasków | Subtasków | 🤖 Claude | 🤖 Gemini | 👤 Jarek | ⚙️ Auto |
|-----------|--------|-----------|-----------|-----------|----------|---------|
| §1 Pozycjonowanie | 3 | 13 | 4 | 6 | 1 | 0 |
| §2 Lejek | 4 | 35 | 30 | 4 | 0 | 1 |
| §3.1 SEO | 5 | 42 | 28 | 14 | 0 | 0 |
| §3.2 Social Media | 9 | 58 | 35 | 8 | 12 | 3 |
| §3.3 Email | 8 | 38 | 32 | 4 | 0 | 2 |
| §3.4 Community | 5 | 22 | 2 | 4 | 15 | 1 |
| §3.5 Paid Ads | 4 | 18 | 4 | 3 | 11 | 0 |
| §4 Calendar | 4 | 22 | 13 | 4 | 3 | 2 |
| §5 Metryki | 3 | 12 | 7 | 0 | 4 | 1 |
| §6 Budżet | 2 | 5 | 0 | 0 | 5 | 0 |
| §7 Priorytety | 7 | 7 | 7 | 0 | 0 | 0 |
| §8 Quick Wins | 5 | 10 | 5 | 0 | 5 | 0 |
| §9 Ryzyka | 5 | 14 | 11 | 0 | 2 | 1 |
| **TOTAL** | **64** | **~296** | **~178** | **~47** | **~58** | **~11** |
