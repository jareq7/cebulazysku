# 2. Architektura techniczna

[← Powrót do spisu treści](./README.md)

---

## Aktualny stack (marzec 2026)

```
Frontend:     Next.js 15 (App Router, Server Components, ISR)
Styling:      TailwindCSS v4 + shadcn/ui + Lucide icons
Język:        TypeScript
Auth:         Supabase Auth (email/password, OAuth ready)
DB:           Supabase (PostgreSQL, RLS, 18 migracji)
Dane ofert:   LeadStar XML → sync → Supabase DB → ISR
AI opisy:     Gemini free tier → OpenRouter (dynamic cheapest) fallback
Parser:       parse-leadstar-conditions.ts (regex, bez AI)
Video:        Remotion (9:16, 1080×1920, 30fps, ~70s per offer)
TTS:          ElevenLabs (Daniel voice, Polish, free tier 10k chars/month)
Email:        Resend.com (deadline reminders, weekly digest)
Push:         Web Push (VAPID, service worker)
Dark mode:    next-themes
PWA:          manifest.json + sw.js
Deploy:       Vercel (auto-deploy z GitHub, projekt cebulazysku.pl)
Cron:         Vercel Cron Jobs (4 joby: sync, AI, quality, email)
```

---

## Data Pipeline

```
LeadStar XML feed
    ↓ (cron 01:00 UTC)
/api/sync-offers
    ↓ parse-leadstar-conditions.ts (regex parser, 12 typów warunków)
    ↓ upsert do Supabase (offers table)
    ↓ soft delete ofert nieobecnych w feedzie (is_active = false)
    ↓ log do sync_log
    ↓
/api/cron/generate-descriptions (cron 02:00 UTC)
    ↓ Gemini → short_description, full_description, pros, cons, faq
    ↓ NIGDY conditions (te z parsera!)
    ↓
/api/cron/quality-check (cron 03:00 UTC)
    ↓ scraping stron banków, porównanie reward z bazą
    ↓ flagi: reward_mismatch, page_unreachable
    ↓
/api/cron/email-notifications (cron 08:00 UTC)
    ↓ Resend → deadline reminders (7/3/1 dzień), weekly digest (poniedziałki)
```

---

## Struktura projektu

```
cebulazysku.pl/
├── CLAUDE.md                    # Instrukcje dla Claude Code
├── GEMINI.md                    # Instrukcje dla Gemini CLI
├── create-prd.md                # Szablon generowania PRD
├── generate-tasks.md            # Szablon generowania tasków
├── vercel.json                  # Konfiguracja Vercel Cron Jobs
├── docs/                        # 44 pliki dokumentacji tematycznej
├── tasks/                       # PRD + task tracking per feature
├── supabase/migrations/         # 18 migracji SQL
├── scripts/
│   ├── generate-all-voiceovers.mjs  # Batch voiceover generator
│   └── generate-test-voiceover.mjs  # Single voiceover test
├── public/
│   ├── audio/voiceovers/        # Per-offer MP3s ({slug}.mp3)
│   ├── audio/jingle.mp3         # Background music (~4m18s)
│   ├── bank-*.png               # 9 bank logos (Alior, BNP, Citi, mBank, Millennium, Pekao, PKO, Santander, VeloBank)
│   ├── logo-icon.png            # CebulaZysku logo
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker
└── src/
    ├── app/
    │   ├── layout.tsx           # Root layout + metadata cebulazysku.pl
    │   ├── page.tsx             # Landing page (hero, stats, offers, social proof, CTA)
    │   ├── providers.tsx        # Auth + Tracker + UserBanks + Theme providers
    │   ├── sitemap.ts           # Dynamic sitemap XML
    │   ├── robots.ts            # robots.txt
    │   ├── not-found.tsx        # Custom 404
    │   ├── middleware.ts        # Auth middleware
    │   ├── api/                 # 22 API routes (sync, cron, admin, gamification, etc.)
    │   ├── admin/               # 8 admin pages (dashboard, oferty, feed, sync, blog, push, users, messages)
    │   ├── oferta/[slug]/       # Offer detail (SSR, JSON-LD, video, breadcrumbs, "Zobacz też")
    │   ├── dashboard/           # User dashboard (tracker, streaks, achievements, referral, "moje banki")
    │   ├── onboarding/          # Bank selection wizard post-signup
    │   ├── zaproszenie/[code]/  # Referral invitation redirect
    │   ├── blog/ + blog/[slug]/ # Blog listing + detail (ISR, JSON-LD Article)
    │   ├── ranking/             # User leaderboard
    │   └── (strony prawne/info) # polityka-prywatnosci, regulamin, o-nas, kontakt, jak-to-dziala, logowanie, rejestracja
    ├── components/
    │   ├── ui/                  # shadcn/ui (button, card, badge, input, label, checkbox, select, tabs, dropdown, avatar, progress, separator, sheet)
    │   ├── ConditionTracker.tsx # Per-offer tracker (+/- per condition per month)
    │   ├── OfferVideoPlayer.tsx # Remotion @remotion/player inline video
    │   ├── OfferCard.tsx        # Offer card (logo, reward, difficulty, "Masz konto" badge, lastUpdated)
    │   ├── OfferFilters.tsx     # Filter: bank, difficulty, type | Sort: reward, difficulty
    │   ├── OfferTrackingActions.tsx # Track/untrack buttons on offer detail
    │   ├── Navbar.tsx           # Navigation + ThemeToggle + mobile menu
    │   ├── Footer.tsx           # Footer links (nawigacja + prawne)
    │   ├── DisclaimerBanner.tsx # Legal disclaimer banner
    │   ├── JsonLd.tsx           # JSON-LD structured data (WebSite, FAQPage, BreadcrumbList, Article)
    │   ├── Breadcrumbs.tsx      # Breadcrumb navigation
    │   ├── ThemeToggle.tsx      # Dark/light mode switch
    │   ├── StreakBadge.tsx      # Daily streak display
    │   ├── AchievementsList.tsx # User achievements/badges
    │   ├── PushNotificationToggle.tsx # Enable/disable push
    │   ├── SocialAuthButtons.tsx     # Google/Facebook/Apple login buttons
    │   ├── ServiceWorkerRegister.tsx # PWA service worker registration
    │   ├── InstallPrompt.tsx        # PWA install prompt
    │   └── TrackingPixels.tsx       # GA4, Meta Pixel (conditional on env vars)
    ├── context/
    │   ├── AuthContext.tsx       # Supabase Auth state
    │   ├── TrackerContext.tsx    # Offer tracking state
    │   └── UserBanksContext.tsx  # User's bank list
    ├── lib/
    │   ├── offers.ts            # DB → frontend mapper (getActiveOffers, getOfferBySlug)
    │   ├── leadstar.ts          # LeadStar API client
    │   ├── parse-leadstar-conditions.ts  # Regex condition parser (12 types)
    │   ├── generate-offer-content.ts     # AI prompt for descriptions
    │   ├── ai-client.ts         # Gemini + dynamic OpenRouter fallback
    │   ├── elevenlabs.ts        # ElevenLabs TTS + sanitizeForTTS()
    │   ├── admin-auth.ts        # verifyAdmin() middleware
    │   ├── admin-fetch.ts       # Frontend helper (auto x-admin-password header)
    │   ├── blog.ts              # Blog post queries
    │   ├── email-templates.ts   # Email HTML templates
    │   └── supabase/            # Supabase client (browser + server)
    ├── remotion/
    │   ├── OfferVideo.tsx       # Main video (6 scenes, ~70s, proportional sync, LOGO_MAP)
    │   └── Root.tsx             # Remotion composition root
    ├── data/
    │   ├── banks.ts             # BankOffer type + static fallback data + condition types
    │   └── blog.ts              # BlogPost type + static fallback
    └── hooks/
        └── useOffers.ts         # Client-side offer fetching hook
```

---

## Baza danych (Supabase)

### Tabele (18 migracji)

| # | Migracja | Tabela/zmiana |
|---|----------|---------------|
| 001 | tracker_tables | `tracked_offers`, `condition_progress` |
| 002 | offers_table | `offers` (core) |
| 003 | contact_messages | `contact_messages` |
| 004 | blog_posts | `blog_posts` |
| 005 | gamification | `user_achievements`, `user_streaks` |
| 006 | push_subscriptions | `push_subscriptions` |
| 007 | admin_user_stats | Admin views |
| 008 | offer_banner | `offers.banner_url` column |
| 009 | offer_for_young | `offers.for_young` column |
| 010 | notification_preferences | `notification_preferences` |
| 011 | quality_flags | `offers.quality_flags`, `locked_fields`, `checked_reward` |
| 012 | first_seen_at | `offers.first_seen_at` |
| 013 | ai_descriptions | `offers.ai_generated_at` + index |
| 014 | user_banks | `user_banks` |
| 015 | email_sends | `email_sends` |
| 016 | payout_tracking | Payout status fields |
| 017 | referrals | `user_referrals` |
| 018 | offer_type_preferences | Offer type preferences |

### Kluczowe kolumny tabeli `offers`

```
id, slug, bank_name, program_name, reward, conditions (JSONB),
affiliate_url, bank_logo, description_html, benefits_html,
short_description, full_description, pros, cons, faq,
is_active, source, difficulty, offer_type,
ai_generated_at, locked_fields, quality_flags,
checked_reward, last_checked_at, first_seen_at,
banner_url, for_young, created_at, updated_at
```

**Uwaga:** kolumna z nazwą banku to `bank_name`, NIE `institution`.

---

## Zmienne środowiskowe

```env
# Supabase (wymagane)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# LeadStar feed (wymagane dla sync)
LEADSTAR_FEED_URL=https://leadstar.pl/xml?pid=...&code=...&ha=...

# AI (wymagane dla generowania opisów)
GEMINI_API_KEY=AIzaSy...
OPENROUTER_API_KEY=sk-or-... (opcjonalny fallback)

# Cron security
SYNC_SECRET=...
CRON_SECRET=...

# Admin
ADMIN_PASSWORD=...

# Email (opcjonalne)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=...

# Analytics (opcjonalne)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
NEXT_PUBLIC_GSC_VERIFICATION=...
NEXT_PUBLIC_META_PIXEL_ID=...

# Video/TTS (opcjonalne)
ELEVENLABS_API_KEY=sk_...

# Push notifications (opcjonalne)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

---

## Jak uruchomić lokalnie

```bash
git clone https://github.com/jareq7/cebulazysku.git
cd cebulazysku
npm install
cp .env.example .env.local  # uzupełnij zmienne
npm run dev                  # → http://localhost:3000
```

### Wymagania
- Node.js 18+
- npm 9+
