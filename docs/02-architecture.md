# 2. Architektura techniczna

[← Powrót do spisu treści](./README.md)

---

## Obecny stack (Faza 0)

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

## Docelowy stack (po wszystkich fazach)

```
Frontend:     Next.js 16 (App Router, Server Components, ISR)
Backend:      Supabase (PostgreSQL + Auth + Edge Functions)
Mobile:       React Native (Expo) — osobne repo
Styling:      TailwindCSS v4 + shadcn/ui
Dane ofert:   LeadStar XML → Supabase DB → Next.js ISR
Opisy:        Claude API (generowanie unikalnych opisów)
Auth:         Supabase Auth (email/hasło, opcjonalnie Google)
Tracker:      Supabase DB (per user, real-time)
Powiadomienia: Resend.com (email) + Expo Push (mobile)
Deploy:       Vercel (auto-deploy z GitHub)
Monitoring:   Vercel Analytics
White-label:  Konfiguracja per tenant (domena, branding, branża)
```

---

## Struktura projektu — obecna (po Fazie 0)

```
bank-afiliacje/
├── docs/
│   ├── README.md                 # Indeks dokumentacji
│   ├── 01-overview.md            # Przegląd projektu
│   ├── 02-architecture.md        # Ten dokument
│   ├── ...                       # Pozostałe docs
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
│       └── utils.ts              # cn() utility
├── tasks/
│   ├── prd-bankpremie-v2.md     # Product Requirements Document
│   └── tasks-bankpremie-v2.md   # Task breakdown
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## Struktura projektu — docelowa (po wszystkich fazach)

```
src/
├── app/
│   ├── api/
│   │   ├── sync-offers/route.ts    # Cron endpoint — sync XML → DB
│   │   ├── generate-desc/route.ts  # Trigger generowania opisów AI
│   │   └── cron/
│   │       ├── check-deadlines/route.ts  # Cron sprawdzający deadliny
│   │       └── weekly-summary/route.ts   # Cron tygodniowego podsumowania
│   ├── auth/
│   │   ├── callback/route.ts       # Supabase auth callback
│   │   └── confirm/route.ts        # Email confirmation
│   ├── (admin)/                    # Route group — panel admina
│   │   ├── layout.tsx              # Admin layout z sidebar
│   │   ├── admin/page.tsx          # Dashboard admina (statystyki)
│   │   ├── admin/offers/page.tsx   # Zarządzanie ofertami
│   │   ├── admin/users/page.tsx    # Zarządzanie użytkownikami
│   │   ├── admin/blog/page.tsx     # Zarządzanie blogiem
│   │   ├── admin/notifications/page.tsx # Kolejka powiadomień
│   │   └── admin/settings/page.tsx # Ustawienia serwisu
│   ├── onboarding/
│   │   └── page.tsx                # „W których bankach masz konto?"
│   └── ustawienia/
│       └── page.tsx                # Profil użytkownika
├── components/
│   ├── gamification/
│   │   ├── StreakCounter.tsx        # Licznik streaka z animacją 🔥
│   │   ├── AchievementBadge.tsx    # Odznaka z animacją unlock
│   │   ├── ConfettiCelebration.tsx # Konfetti po spełnieniu warunku
│   │   └── ProgressTimeline.tsx    # Timeline postępu oferty
│   └── admin/
│       ├── AdminSidebar.tsx        # Nawigacja panelu admina
│       ├── StatsCard.tsx           # Karta statystyk
│       └── OfferEditor.tsx         # Edytor ofert (override AI)
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── server.ts               # Server Supabase client
│   │   └── middleware.ts            # Auth middleware (user + admin roles)
│   ├── leadstar/
│   │   └── parser.ts               # XML parser
│   ├── ai/
│   │   └── generate-description.ts # Claude API integration
│   ├── email/
│   │   └── send.ts                 # Resend.com integration
│   ├── gamification/
│   │   ├── achievements.ts         # Logika odznak i achievementów
│   │   ├── streaks.ts              # Logika streaków
│   │   └── referrals.ts            # System poleceń
│   └── tenant/
│       ├── config.ts               # White-label konfiguracja per tenant
│       ├── theme.ts                # Dynamiczny theming per branża
│       └── types.ts                # Typy tenant/branża
└── ...

# Osobne repo — aplikacja mobilna
cebulazysku-mobile/                 # React Native (Expo)
├── app/                            # Expo Router
│   ├── (tabs)/
│   │   ├── index.tsx               # Dashboard mobilny
│   │   ├── offers.tsx              # Lista ofert
│   │   ├── track.tsx               # Quick Track
│   │   └── profile.tsx             # Profil + odznaki
│   ├── offer/[id].tsx              # Szczegóły oferty
│   └── login.tsx                   # Logowanie (Supabase Auth)
├── components/                     # Komponenty mobilne
├── lib/                            # Supabase client, notifications, offline sync
└── app.json                        # Expo config
```

---

## Zmienne środowiskowe (docelowe)

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

# White-label / tenant
NEXT_PUBLIC_TENANT_ID=cebulazysku
NEXT_PUBLIC_APP_URL=https://cebulazysku.pl
```

---

## Jak uruchomić projekt lokalnie

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
