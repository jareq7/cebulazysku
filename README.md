# BankPremie – Zarabiaj na promocjach bankowych

Serwis do porównywania promocji bankowych i śledzenia postępów spełniania warunków.

## Stack technologiczny

- **Next.js 16** (App Router, SSR/SSG)
- **TailwindCSS v4** + **shadcn/ui**
- **TypeScript**
- **Lucide React** (ikony)
- **localStorage** (auth + tracker – mock, gotowy pod backend)

## Uruchomienie

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

## Struktura projektu

```
src/
├── app/
│   ├── page.tsx              # Landing page z ofertami
│   ├── layout.tsx            # Root layout z SEO
│   ├── providers.tsx         # Auth + Tracker providers
│   ├── sitemap.ts            # Dynamiczny sitemap XML
│   ├── robots.ts             # robots.txt
│   ├── logowanie/            # Strona logowania
│   ├── rejestracja/          # Strona rejestracji
│   ├── dashboard/            # Dashboard z trackerem
│   ├── oferta/[slug]/        # Szczegóły oferty bankowej
│   └── jak-to-dziala/        # Strona informacyjna
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── Navbar.tsx            # Nawigacja
│   ├── Footer.tsx            # Stopka
│   ├── OfferCard.tsx         # Karta oferty
│   └── ConditionTracker.tsx  # Tracker warunków
├── context/
│   ├── AuthContext.tsx       # Kontekst auth (localStorage)
│   └── TrackerContext.tsx    # Kontekst trackera postępów
├── data/
│   └── banks.ts             # Dane ofert bankowych
└── lib/
    └── utils.ts              # Utility functions
```

## Funkcjonalności

- **Landing page** – lista ofert z kwotami, trudnością, warunkami
- **Strona szczegółów oferty** – pełny opis, warunki, FAQ, zalety/wady
- **Rejestracja/Logowanie** – mock auth z localStorage
- **Dashboard** – przegląd śledzonych ofert, łączny potencjalny zarobek
- **Tracker warunków** – +/- per warunek per miesiąc, progress bary
- **SEO** – meta tagi, Open Graph, sitemap, robots.txt, JSON-LD ready
- **Responsywność** – mobile-first design

## Deploy

```bash
npm run build
```

Gotowy do deployu na Vercel / Netlify.

## Uwagi prawne

Serwis ma charakter informacyjny i nie stanowi doradztwa finansowego. Dane ofert są przykładowe i wymagają aktualizacji zgodnie z bieżącymi promocjami banków.
