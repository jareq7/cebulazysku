# 🧅 CebulaZysku — Dokumentacja Projektu

> **Domena:** cebulazysku.pl  
> **Repozytorium:** https://github.com/jareq7/cebulazysku  
> **Deploy:** Vercel (automatyczny z brancha `main`)  
> **Data dokumentu:** 7 marca 2026 r.

---

## Spis treści

1. [Czym jest CebulaZysku?](#1-czym-jest-cebulazysku)
2. [Cel biznesowy](#2-cel-biznesowy)
3. [Architektura techniczna](#3-architektura-techniczna)
4. [Co zostało już zrobione](#4-co-zostało-już-zrobione)
5. [Co jeszcze przed nami — plan rozwoju](#5-co-jeszcze-przed-nami--plan-rozwoju)
6. [Szczegółowy opis zrealizowanych faz](#6-szczegółowy-opis-zrealizowanych-faz)
7. [Szczegółowy opis planowanych faz](#7-szczegółowy-opis-planowanych-faz)
8. [Struktura projektu](#8-struktura-projektu)
9. [Źródło danych — LeadStar XML](#9-źródło-danych--leadstar-xml)
10. [Decyzje architektoniczne](#10-decyzje-architektoniczne)
11. [Zmienne środowiskowe (docelowe)](#11-zmienne-środowiskowe-docelowe)
12. [Jak uruchomić projekt lokalnie](#12-jak-uruchomić-projekt-lokalnie)
13. [Uwagi prawne](#13-uwagi-prawne)

---

## 1. Czym jest CebulaZysku?

CebulaZysku to serwis internetowy, który **porównuje promocje bankowe** (głównie premie za otwarcie konta) i umożliwia użytkownikom:

- Przeglądanie aktualnych ofert z opisami w humorystycznym, „cebulowym" tonie
- Zakładanie kont bankowych przez linki afiliacyjne
- Śledzenie postępów w spełnianiu warunków promocji (tracker)
- Otrzymywanie przypomnień o zbliżających się terminach
- Zarządzanie swoim „portfolio cebulkowe" — które banki już ołupione, które jeszcze czekają

Nazwa nawiązuje do cebuli — **każda warstwa to kolejny zysk**, a użytkownicy to **cebularze** którzy obierają premie.

---

## 2. Cel biznesowy

### Model przychodów
- **Prowizje afiliacyjne** z programu partnerskiego LeadStar
- Każdy link do banku zawiera unikalny identyfikator afiliacyjny
- Gdy użytkownik kliknie link i otworzy konto, CebulaZysku otrzymuje prowizję od banku
- Użytkownik nie ponosi żadnych dodatkowych kosztów

### Kluczowe metryki
- Liczba kliknięć w linki afiliacyjne (CTR)
- Liczba otwartych kont (konwersja)
- Retencja użytkowników (powracający do trackera)
- Liczba zarejestrowanych użytkowników

### Przewaga konkurencyjna
- **Tracker warunków** — żaden podobny serwis nie oferuje narzędzia do śledzenia postępów
- **Humorystyczny ton** — wyróżnia się na tle korporacyjnych porównywarek
- **Automatyzacja** — oferty pobierane z XML LeadStar, opisy generowane AI
- **Powiadomienia** — użytkownik nie przegapi żadnego terminu

---

## 3. Architektura techniczna

### Obecny stack (Faza 0)
```
Frontend:     Next.js 16 (App Router, Server Components)
Styling:      TailwindCSS v4 + shadcn/ui
Ikony:        Lucide React
Język:        TypeScript
Auth:         Mock (localStorage) — do wymiany na Supabase
Tracker:      Mock (localStorage) — do wymiany na Supabase
Dane ofert:   Hardcoded w banks.ts — do wymiany na DB
Dark mode:    next-themes
Deploy:       Vercel (auto-deploy z GitHub)
```

### Docelowy stack (po wszystkich fazach)
```
Frontend:     Next.js 16 (App Router, Server Components, ISR)
Backend:      Supabase (PostgreSQL + Auth + Edge Functions)
Styling:      TailwindCSS v4 + shadcn/ui
Dane ofert:   LeadStar XML → Supabase DB → Next.js ISR
Opisy:        Claude API (generowanie unikalnych opisów)
Auth:         Supabase Auth (email/hasło, opcjonalnie Google)
Tracker:      Supabase DB (per user, real-time)
Powiadomienia: Resend.com (email) + Vercel Cron
Deploy:       Vercel (auto-deploy z GitHub)
Monitoring:   Vercel Analytics
```

---

## 4. Co zostało już zrobione

### ✅ Faza 0 — Rebranding na CebulaZysku
- Kompletna zmiana brandingu z „BankPremie" na „CebulaZysku"
- Nowa paleta kolorów: amber/orange (ciepłe cebulowe tony)
- Logo: emoji 🧅 + gradient amber→orange
- Cebulowy humor w całym messaging
- Dark mode z cebulowymi tonami
- 24 pliki zaktualizowane, build bez błędów

### ✅ Faza 1 (wcześniejsza) — Compliance
- Strony prawne: regulamin, polityka prywatności, o nas, kontakt
- DisclaimerBanner na stronie głównej
- Checkbox zgody przy rejestracji
- Footer z linkami do stron prawnych
- Informacja o modelu afiliacyjnym

### ✅ Faza 2 (wcześniejsza) — SEO
- Server Components gdzie to możliwe
- `generateMetadata` na każdej stronie
- JSON-LD (WebSite, FAQPage, BreadcrumbList, Article)
- Canonical URLs z domeną cebulazysku.pl
- `metadataBase` w root layout
- Dynamiczny sitemap.xml i robots.txt
- Open Graph meta tagi

### ✅ Faza 3 (wcześniejsza) — UX/UI
- Filtry i sortowanie ofert (OfferFilters)
- Data ostatniej aktualizacji ofert
- Wewnętrzne linkowanie (breadcrumbs, "Zobacz też")
- Custom not-found page
- Social proof section
- Dashboard z sugestiami łatwych ofert
- Responsywny design (mobile-first)

### ✅ Faza 4 (wcześniejsza) — Growth
- Blog infrastruktura (listing + post detail z JSON-LD)
- Dark mode (next-themes + ThemeToggle w Navbar)
- Placeholder tracking pixels (Google Ads, Meta Ads)
- Sitemap rozszerzony o blog i strony prawne

---

## 5. Co jeszcze przed nami — plan rozwoju

| Faza | Nazwa | Status | Priorytet |
|------|-------|--------|-----------|
| 0 | Rebranding CebulaZysku | ✅ Gotowe | — |
| 1 | Supabase + prawdziwy auth + DB tracker | 🔲 Do zrobienia | Wysoki |
| 2 | XML parser LeadStar + tabela ofert + cron | 🔲 Do zrobienia | Wysoki |
| 3 | Auto-generowanie opisów (AI + cebulowy ton) | 🔲 Do zrobienia | Wysoki |
| 4 | Filtr „mam konto" + onboarding | 🔲 Do zrobienia | Średni |
| 5 | System powiadomień email | 🔲 Do zrobienia | Średni |
| 6 | Gamifikacja + statystyki zarobków | 🔲 Do zrobienia | Niski |

---

## 6. Szczegółowy opis zrealizowanych faz

### Faza 0 — Rebranding

**Co zrobiono:**
- Zmieniono nazwę serwisu z „BankPremie" na „CebulaZysku" we **wszystkich** plikach
- Zaktualizowano domenę z `bankpremie.pl` na `cebulazysku.pl` we wszystkich URL-ach
- Nowa paleta kolorów CSS (oklch) — ciepłe odcienie amber/brąz w light mode, złoto-brązowe w dark mode
- Gradient logo: `from-amber-600 to-orange-500`
- Wszystkie `text-green-*` i `bg-green-*` zamienione na `text-amber-*` / `bg-amber-*` (poza semantycznym green-500 na checkmarkach)
- Cebulowy język w hero, CTA, sekcjach, badge'ach:
  - „Obierz premie bankowe warstwa po warstwie"
  - „Jak cebula — każda warstwa to kolejny zysk"
  - „🧅 ofert do ołupienia"
  - „Łupimy banki legalnie!"
  - „cebularze" (użytkownicy)

**Zmienione pliki (24):**
- `globals.css` — paleta kolorów light + dark
- `layout.tsx` — metadata, OG, metadataBase
- `page.tsx` — hero, stats, how-it-works, offers, social proof, trust, CTA
- `Navbar.tsx`, `Footer.tsx` — logo, linki, copyright
- `DisclaimerBanner.tsx` — treść disclaimera
- `OfferCard.tsx`, `OfferTrackingActions.tsx`, `ConditionTracker.tsx` — kolory
- `o-nas/page.tsx`, `regulamin/page.tsx`, `polityka-prywatnosci/page.tsx`, `kontakt/page.tsx` — branding
- `logowanie/page.tsx`, `rejestracja/page.tsx` — kolory, linki
- `jak-to-dziala/page.tsx` — kolory, ikony
- `oferta/[slug]/page.tsx` — kolory, URL-e canonical
- `blog/[slug]/page.tsx` — publisher name, URL-e
- `sitemap.ts`, `robots.ts` — domena
- `banks.ts` — kolor badge'a difficulty
- `blog.ts` — nazwa autora
- `README.md` — tytuł, opis

### Fazy 1–4 (wcześniejsze)

Zostały zrealizowane w poprzednich sesjach. Kluczowe deliverables:

**Strony prawne:**
- `/regulamin` — pełny regulamin serwisu
- `/polityka-prywatnosci` — polityka prywatności zgodna z RODO
- `/o-nas` — opis misji, modelu działania, wartości
- `/kontakt` — formularz kontaktowy + dane

**SEO:**
- Każda strona ma `generateMetadata` z tytułem, opisem i canonical URL
- JSON-LD na stronach ofert (FAQPage), blogu (Article), breadcrumbs (BreadcrumbList)
- Dynamiczny sitemap generowany z `banks.ts` i `blog.ts`

**UX/UI:**
- `OfferFilters` — filtrowanie po banku, trudności, sortowanie po premii/trudności
- Breadcrumbs na stronach ofert
- „Zobacz też inne oferty" — 3 powiązane oferty na stronie oferty
- Dashboard empty state z sugestiami łatwych ofert

**Growth:**
- `/blog` i `/blog/[slug]` — infrastruktura blogowa z SEO
- Dark mode via `next-themes` + `ThemeToggle`
- `TrackingPixels` component (placeholder dla Google Ads i Meta Pixel)

---

## 7. Szczegółowy opis planowanych faz

### Faza 1 — Supabase + Auth + DB Tracker

**Cel:** Zamiana mock auth/tracker na prawdziwy backend.

**Zakres:**
1. Utworzenie projektu Supabase
2. Schemat bazy danych:
   ```sql
   -- Tabela ofert (wypełniana z XML)
   offers (
     id, leadstar_id, institution, program_name, product,
     description_html, benefits_html, logo_url, affiliate_url,
     reward_amount, difficulty, conditions JSONB,
     generated_description, generated_short_description,
     is_active, created_at, updated_at
   )
   
   -- Użytkownicy (rozszerzenie Supabase Auth)
   user_profiles (
     id (FK → auth.users), display_name, created_at
   )
   
   -- Banki w których user ma konto
   user_banks (
     id, user_id, bank_name, has_account, created_at
   )
   
   -- Śledzone oferty
   user_tracked_offers (
     id, user_id, offer_id, started_at, completed_at, status
   )
   
   -- Postępy w warunkach
   user_condition_progress (
     id, user_id, offer_id, condition_id, month,
     current_count, required_count, is_done, updated_at
   )
   
   -- Kolejka powiadomień
   notifications (
     id, user_id, type, message, offer_id,
     scheduled_for, sent_at, is_read
   )
   ```
3. Integracja `@supabase/supabase-js` + `@supabase/ssr`
4. Wymiana `AuthContext` → Supabase Auth (email/hasło)
5. Wymiana `TrackerContext` → Supabase DB queries
6. Row Level Security (RLS) — user widzi tylko swoje dane
7. Migracja UI na nowe źródło danych

**Wymagane od właściciela:**
- Założenie projektu na supabase.com
- Podanie URL i anon key

### Faza 2 — XML Parser LeadStar

**Cel:** Automatyczne pobieranie ofert z feedu XML LeadStar.

**Źródło danych:**
```
URL: https://leadstar.pl/xml?pid=93050&code=9f3d50f263d704d90b38d3f6549b11cc&ha=4242926830
Format: XML
Aktualnie: 18 ofert (konta osobiste)
Banki: BNP Paribas, Pekao (x2), Santander (x3), Alior (x2), 
       Millennium, Citi Handlowy, mBank (x5), PKO BP, VeloBank (x2)
```

**Struktura jednej oferty w XML:**
```xml
<item>
  <id>6198</id>
  <branch_id>1</branch_id>
  <branch>Finanse</branch>
  <product_id>11</product_id>
  <product>konto osobiste</product>
  <institution>Bank BNP Paribas S.A.</institution>
  <program_name>Konto Osobiste w promocji „Smak korzyści"</program_name>
  <description><!-- HTML z krótkim opisem --></description>
  <benefits><!-- HTML z warunkami promocji --></benefits>
  <free_first>0</free_first>
  <logo>//img.leadmax.pl/logo/xxx.png</logo>
  <url>https://prostodo.pl/c?zid=...&tid=6198&ha=...&r=...</url>
</item>
```

**Zakres implementacji:**
1. API Route `/api/sync-offers` — parser XML → upsert do Supabase
2. Vercel Cron Job — uruchamia sync co 6 godzin
3. Mapowanie pól XML → schemat DB:
   - `id` → `leadstar_id`
   - `institution` → `institution`
   - `program_name` → `program_name`
   - `description` → `description_html`
   - `benefits` → `benefits_html`
   - `logo` → `logo_url`
   - `url` → `affiliate_url`
   - `free_first` → `is_free_first_year`
4. Parsowanie `benefits` HTML → ekstrakcja warunków (kwota premii, kroki do spełnienia, terminy)
5. Logika deaktywacji — oferty usunięte z feedu → `is_active = false`
6. Strony ofert generowane dynamicznie z DB (ISR, revalidate co 1h)
7. Usunięcie hardcoded `banks.ts`

### Faza 3 — Auto-generowanie opisów AI

**Cel:** Unikalne, czytelne opisy ofert w cebulowym tonie, generowane automatycznie z surowych danych XML.

**Podejście:**
- Przy nowej/zmienionej ofercie → trigger generowania opisów
- **Claude API** (user ma Claude Pro) z promptem:
  ```
  Jesteś copywriterem serwisu CebulaZysku. Pisz w humorystycznym, 
  przystępnym tonie nawiązującym do cebuli i obierania warstw zysku.
  
  Na podstawie poniższych surowych danych z banku, napisz:
  1. Krótki opis (2-3 zdania, max 200 znaków)
  2. Pełny opis (3-5 akapitów, przystępny język)
  3. Lista warunków (jako JSON z polami: label, description, type, requiredCount)
  4. Lista zalet (3-5 punktów)
  5. Lista wad (1-3 punktów)
  
  Surowe dane: [XML description + benefits]
  ```
- Wygenerowane opisy zapisywane w DB (`generated_description`, `generated_short_description`)
- Regeneracja tylko gdy oferta się zmieni (porównanie hash benefits)
- Rate limiting — max 5 generacji na minutę

**Alternatywa:** Jeśli API Claude niedostępne, fallback na template engine z wariacjami.

### Faza 4 — Filtr „mam konto" + Onboarding

**Cel:** Użytkownik oznacza banki w których już ma konto → personalizacja ofert.

**Zakres:**
1. Ekran onboardingu po rejestracji:
   - „W których bankach masz już konto?" — grid z logo banków + checkboxy
   - Zapisywane do tabeli `user_banks`
2. Logika filtrowania:
   - Oferty na **nowe konto** w bankach z `has_account = true` → **ukryte**
   - Inne promocje tego banku (karty, lokaty) → **nadal widoczne**
3. Sekcja w ustawieniach profilu — edycja listy banków
4. Badge „Masz już konto" na kartach ofert dla oznaczonych banków

### Faza 5 — System powiadomień email

**Cel:** Użytkownik dostaje maile przypominające o warunkach do spełnienia.

**Technologia:** Resend.com (darmowe 100 emaili/dzień)

**Typy powiadomień:**
| Typ | Trigger | Treść |
|-----|---------|-------|
| Deadline reminder | 7/3/1 dzień przed terminem warunku | „Hej cebularzu! Za 3 dni mija termin na wpłatę 1000 zł w Santanderze. Nie daj się obrać!" |
| Nowa oferta | Nowa oferta pasująca do profilu | „Nowa cebulka do obrania! Alior daje 1000 zł za konto." |
| Gratulacje | Wszystkie warunki spełnione | „Brawo! Obrana cebulka w mBanku — 720 zł leci na konto! 🧅💰" |
| Podsumowanie tygodniowe | Co poniedziałek | „Twój cebulowy raport: 3 oferty w trakcie, 1250 zł do obrania" |

**Implementacja:**
1. Vercel Cron Job — codziennie o 9:00 sprawdza deadliny vs. postępy
2. Resend API — wysyłka emaili HTML
3. Tabela `notifications` — kolejka + logi wysyłek
4. Ustawienia użytkownika — opt-in/opt-out per typ powiadomienia
5. Unsubscribe link w każdym mailu

### Faza 6 — Gamifikacja + Statystyki

**Cel:** Motywacja użytkowników do dalszego korzystania.

**Zakres:**
1. **Statystyki na dashboardzie:**
   - Łącznie obrane: X zł z Y banków
   - W trakcie: X ofert, potencjalnie X zł
   - Ranking miesięczny
2. **Odznaki/Achievementy:**
   - 🧅 Pierwsza Cebulka — obrałeś pierwszą premię
   - 🧅🧅 Cebularz — 3 premie odebrane
   - 🧅🧅🧅 Cebulowy Baron — 5+ premii
   - 💰 Tysiącznik — łącznie >1000 zł
   - ⚡ Błyskawica — spełnił warunki w <50% czasu
3. **Status wypłaty** — user oznacza „premia wpłynęła" → statystyki realnych zarobków
4. **Publiczny ranking** (opcjonalny, opt-in) — „Top cebularze miesiąca"

---

## 8. Struktura projektu

### Obecna struktura (po Fazie 0)
```
bank-afiliacje/
├── docs/
│   └── DOKUMENTACJA.md          # Ten dokument
├── public/                       # Statyczne pliki
├── src/
│   ├── app/
│   │   ├── globals.css           # Tailwind + paleta kolorów cebulowa
│   │   ├── layout.tsx            # Root layout + metadata cebulazysku.pl
│   │   ├── page.tsx              # Landing page z hero + ofertami
│   │   ├── providers.tsx         # Auth + Tracker + Theme providers
│   │   ├── sitemap.ts            # Dynamiczny sitemap XML
│   │   ├── robots.ts             # robots.txt
│   │   ├── not-found.tsx         # Custom 404
│   │   ├── blog/
│   │   │   ├── page.tsx          # Lista postów blogowych
│   │   │   └── [slug]/page.tsx   # Post blogowy z JSON-LD
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard użytkownika z trackerem
│   │   ├── jak-to-dziala/
│   │   │   └── page.tsx          # Strona informacyjna
│   │   ├── kontakt/
│   │   │   └── page.tsx          # Formularz kontaktowy
│   │   ├── logowanie/
│   │   │   └── page.tsx          # Strona logowania
│   │   ├── o-nas/
│   │   │   └── page.tsx          # O serwisie
│   │   ├── oferta/
│   │   │   └── [slug]/page.tsx   # Szczegóły oferty bankowej
│   │   ├── polityka-prywatnosci/
│   │   │   └── page.tsx          # Polityka prywatności
│   │   ├── regulamin/
│   │   │   └── page.tsx          # Regulamin
│   │   └── rejestracja/
│   │       └── page.tsx          # Rejestracja
│   ├── components/
│   │   ├── ui/                   # shadcn/ui (button, card, badge, input, etc.)
│   │   ├── ConditionTracker.tsx  # Tracker warunków per oferta
│   │   ├── DisclaimerBanner.tsx  # Banner informacyjny
│   │   ├── Footer.tsx            # Stopka z nawigacją
│   │   ├── JsonLd.tsx            # Komponent JSON-LD
│   │   ├── Navbar.tsx            # Nawigacja + ThemeToggle
│   │   ├── OfferCard.tsx         # Karta oferty na liście
│   │   ├── OfferFilters.tsx      # Filtry i sortowanie ofert
│   │   ├── OfferTrackingActions.tsx # Akcje trackingu na stronie oferty
│   │   ├── ThemeToggle.tsx       # Przełącznik dark/light mode
│   │   └── TrackingPixels.tsx    # Placeholder Google/Meta pixel
│   ├── context/
│   │   ├── AuthContext.tsx       # Mock auth (localStorage) — do wymiany
│   │   └── TrackerContext.tsx    # Mock tracker (localStorage) — do wymiany
│   ├── data/
│   │   ├── banks.ts             # Hardcoded oferty — do wymiany na DB
│   │   └── blog.ts              # Dane blogowe
│   └── lib/
│       └── utils.ts             # cn() utility
├── tasks/
│   ├── prd-bankpremie-v2.md     # Product Requirements Document
│   └── tasks-bankpremie-v2.md   # Task breakdown
├── netlify.toml                  # Config Netlify (nieużywany, deploy na Vercel)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

### Docelowa struktura (po wszystkich fazach)
```
src/
├── app/
│   ├── api/
│   │   ├── sync-offers/route.ts    # NOWE: Cron endpoint — sync XML → DB
│   │   └── generate-desc/route.ts  # NOWE: Trigger generowania opisów AI
│   ├── auth/
│   │   ├── callback/route.ts       # NOWE: Supabase auth callback
│   │   └── confirm/route.ts        # NOWE: Email confirmation
│   ├── onboarding/
│   │   └── page.tsx                # NOWE: „W których bankach masz konto?"
│   └── ustawienia/
│       └── page.tsx                # NOWE: Profil użytkownika
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # NOWE: Browser Supabase client
│   │   ├── server.ts               # NOWE: Server Supabase client
│   │   └── middleware.ts            # NOWE: Auth middleware
│   ├── leadstar/
│   │   └── parser.ts               # NOWE: XML parser
│   ├── ai/
│   │   └── generate-description.ts # NOWE: Claude API integration
│   └── email/
│       └── send.ts                 # NOWE: Resend.com integration
└── ...
```

---

## 9. Źródło danych — LeadStar XML

### Feed URL
```
https://leadstar.pl/xml?pid=93050&code=9f3d50f263d704d90b38d3f6549b11cc&ha=4242926830
```

### Aktualne oferty (stan na 7.03.2026)

| # | Bank | Program | Premia |
|---|------|---------|--------|
| 1 | BNP Paribas | Konto Osobiste „Smak korzyści" | do 300 zł |
| 2 | Bank Pekao | Konto Przekorzystne | do 450 zł |
| 3 | Bank Pekao | Konto Przekorzystne dla Młodych | do 450 zł |
| 4 | Santander | Konto Santander | do 800 zł |
| 5 | Santander | Konto Santander dla młodych | do 800 zł |
| 6 | Santander | Konto Santander dla studenta | do 800 zł |
| 7 | Alior Bank | Alior Konto Plus | do 1000 zł |
| 8 | Alior Bank | Alior Konto | do 1000 zł |
| 9 | Millennium | Konto 360° | do 900 zł |
| 10 | Citi Handlowy | CitiKonto | do 650 zł |
| 11 | mBank | eKonto dla młodych (18-24) | do 620 zł |
| 12 | mBank | eKonto dla młodych (do wyboru) | — |
| 13 | mBank | eKonto z zyskiem | do 720 zł |
| 14 | mBank | eKonto dla młodych (13-17) | do 210 zł |
| 15 | mBank | mKonto Intensive | do 720 zł |
| 16 | PKO BP | Konto Za Zero | cashback Allegro |
| 17 | VeloBank | VeloKonto | 6,5% + cashback |
| 18 | VeloBank | VeloKonto dla młodych | 6% + cashback |

### Pola XML per oferta
| Pole | Typ | Opis |
|------|-----|------|
| `id` | int | Unikalny ID oferty w LeadStar |
| `branch_id` | int | ID branży (1 = Finanse) |
| `branch` | string | Nazwa branży |
| `product_id` | int | ID produktu (11 = konto osobiste) |
| `product` | string | Typ produktu |
| `institution` | string | Nazwa banku |
| `program_name` | string | Nazwa programu/promocji |
| `description` | HTML | Krótki opis z bullet pointami |
| `benefits` | HTML | Szczegółowe warunki promocji |
| `free_first` | 0/1 | Czy konto bezpłatne w pierwszym okresie |
| `logo` | URL | Logo banku (bez protokołu) |
| `url` | URL | Link afiliacyjny (do przekierowania usera) |

---

## 10. Decyzje architektoniczne

### Dlaczego Supabase?
- Darmowy tier wystarczający na start (500MB DB, 50K auth users)
- Natywna integracja z Next.js (SSR, Server Components)
- Auth out-of-the-box (email, Google, magic links)
- Row Level Security — dane usera chronione na poziomie DB
- Realtime subscriptions — przyszłość (live updates trackera)
- Edge Functions — logika backendowa bez oddzielnego serwera

### Dlaczego Claude API do opisów?
- User ma Claude Pro (dostęp do API)
- Jakość generowanego tekstu w języku polskim — lepsza niż GPT dla polskiego kontekstu
- Możliwość fine-tuning promptu pod „cebulowy" ton
- Cache'owanie w DB — raz wygenerowany opis nie wymaga ponownego wywołania API

### Dlaczego ISR (Incremental Static Regeneration)?
- Oferty zmieniają się rzadko (co kilka tygodni)
- Statyczne strony = szybkość + SEO
- Revalidacja co 1h — nowe oferty pojawiają się automatycznie
- Fallback na SSR dla nowych ofert (blocking: false)

### Dlaczego Vercel?
- Natywna obsługa Next.js (ten sam twórca)
- Auto-deploy z GitHub
- Edge Network — szybkie dostarczanie w Polsce
- Cron Jobs — wbudowane, bez dodatkowej infrastruktury
- Darmowy tier wystarczający na start

### Dlaczego Resend.com do emaili?
- 100 emaili/dzień za darmo — wystarczy na start
- Proste API, gotowe React Email templates
- Custom domena (cebulazysku.pl) po konfiguracji DNS
- Dobry deliverability

---

## 11. Zmienne środowiskowe (docelowe)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# LeadStar
LEADSTAR_XML_URL=https://leadstar.pl/xml?pid=93050&code=...&ha=...

# Claude API (do generowania opisów)
ANTHROPIC_API_KEY=sk-ant-...

# Resend (emailing)
RESEND_API_KEY=re_...

# Cron secret (zabezpieczenie endpointów cron)
CRON_SECRET=random-string-here

# App
NEXT_PUBLIC_APP_URL=https://cebulazysku.pl
```

---

## 12. Jak uruchomić projekt lokalnie

```bash
# Klonowanie
git clone https://github.com/jareq7/cebulazysku.git
cd cebulazysku

# Instalacja zależności
npm install

# Uruchomienie deweloperskie
npm run dev
# → http://localhost:3000

# Build produkcyjny
npm run build
npm start
```

### Wymagania
- Node.js 18+
- npm 9+

---

## 13. Uwagi prawne

- Serwis ma charakter **wyłącznie informacyjny** i nie stanowi doradztwa finansowego
- Przedstawione oferty mogą ulec zmianie — szczegóły na stronach banków
- Serwis utrzymuje się z **prowizji afiliacyjnych** — kliknięcie linku i otwarcie konta może skutkować prowizją dla serwisu
- Prowizje **nie wpływają** na kolejność prezentacji ofert
- Korzystanie z linków afiliacyjnych nie wiąże się z dodatkowymi kosztami dla użytkownika
- Dane osobowe przetwarzane zgodnie z **RODO** — szczegóły w Polityce prywatności
- Wszystkie prezentowane banki są **licencjonowane** i objęte **Bankowym Funduszem Gwarancyjnym** (BFG)

---

## Kontakt

- **Email:** kontakt@cebulazysku.pl
- **GitHub:** https://github.com/jareq7/cebulazysku
- **Domena:** https://cebulazysku.pl

---

*Dokument wygenerowany 7 marca 2026 r. Będzie aktualizowany wraz z postępem prac.*
