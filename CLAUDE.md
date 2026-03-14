# CebulaZysku.pl — Bank Affiliate Tracker

Portal pomagający użytkownikom porównywać promocje bankowe, otwierać konta przez linki afiliacyjne i śledzić warunki promocji (tracker). Nazwa nawiązuje do cebuli — każda warstwa to kolejny zysk, użytkownicy to "cebularze".

**Domena:** cebulazysku.pl | **Produkcja:** https://cebulazysku.pl | **Vercel projekt:** `cebulazysku.pl`

## Stack

- **Framework:** Next.js 15 (App Router, Server Components, ISR)
- **DB + Auth:** Supabase (PostgreSQL, RLS, email/password auth)
- **UI:** Tailwind CSS v4 + shadcn/ui + Lucide icons
- **Video:** Remotion (programmatic 9:16 video ads with voiceover)
- **TTS:** ElevenLabs (Polish voiceovers, Daniel voice)
- **AI:** Gemini free tier → OpenRouter (dynamic cheapest model) fallback
- **Email:** Resend.com
- **Hosting:** Vercel (auto-deploy on push to `main`)

## Workflow — OBOWIĄZKOWY

**Dla każdego nowego feature'a stosuj flow: PRD → Tasks → Code**

1. User opisuje co chce zrobić (brief)
2. Zadaj 3-5 pytań wyjaśniających z opcjami A/B/C/D
3. Zapisz PRD do `/tasks/prd-[feature].md` (szablon: `create-prd.md`)
4. Wygeneruj parent tasks, pokaż userowi, czekaj na "Go"
5. Rozbij na sub-tasks, zapisz do `/tasks/tasks-[feature].md` (szablon: `generate-tasks.md`)
6. Task 0.0 = "Create feature branch"
7. Implementuj, odznaczaj `- [ ]` → `- [x]` po każdym sub-tasku
8. NIE koduj niczego co nie jest w task liście

## Data Pipeline

```
LeadStar XML feed → /api/sync-offers (01:00 UTC daily)
    → parse-leadstar-conditions.ts (regex parser, no AI!)
    → Supabase DB (offers table)
    → /api/cron/generate-descriptions (02:00 UTC) — AI generates descriptions, pros/cons, FAQ
    → /api/cron/quality-check (03:00 UTC) — scrapes bank sites, verifies reward amounts
    → /api/cron/email-notifications (08:00 UTC) — deadline reminders, weekly digest
```

**CRITICAL: Conditions come from feed parser, NEVER from AI. AI only generates descriptions/pros/cons/FAQ.**

## Key Directories

```
src/
├── app/                         # Next.js pages + API routes
│   ├── api/
│   │   ├── sync-offers/         # LeadStar → Supabase sync
│   │   ├── cron/                # Scheduled jobs (AI descriptions, quality check, emails)
│   │   ├── admin/               # Admin API (auth, stats, offers, users, blog, push, sync)
│   │   ├── gamification/        # Streaks + achievements
│   │   ├── generate-voiceover/  # ElevenLabs TTS endpoint
│   │   ├── contact/             # Contact form
│   │   ├── referral/            # Referral program
│   │   ├── push/                # Web push subscriptions
│   │   └── notifications/       # Email preferences
│   ├── admin/                   # Admin panel (8 pages: dashboard, oferty, feed, sync, blog, push, users, messages)
│   ├── oferta/[slug]/           # Offer detail (SSR, JSON-LD, video player)
│   ├── dashboard/               # User dashboard (tracker, streaks, achievements, referral)
│   ├── onboarding/              # Bank selection wizard post-signup
│   ├── zaproszenie/[code]/      # Referral invitation redirect
│   ├── blog/                    # Blog listing + [slug] detail
│   └── (legal pages)            # polityka-prywatnosci, regulamin, o-nas, kontakt, jak-to-dziala
├── components/                  # React components
│   ├── ui/                      # shadcn/ui primitives
│   ├── ConditionTracker.tsx     # Per-offer condition tracker (+/- buttons per condition per month)
│   ├── OfferVideoPlayer.tsx     # Remotion inline video player
│   ├── OfferCard.tsx            # Offer card (logo, reward, difficulty, "Masz konto" badge)
│   ├── OfferFilters.tsx         # Filter by bank/difficulty/type, sort by reward
│   ├── Navbar.tsx / Footer.tsx  # Navigation
│   └── ...                      # DisclaimerBanner, JsonLd, ThemeToggle, etc.
├── context/                     # AuthContext, TrackerContext, UserBanksContext
├── lib/                         # Business logic
│   ├── offers.ts                # DB → frontend mapper (getActiveOffers, getOfferBySlug)
│   ├── leadstar.ts              # LeadStar API client
│   ├── parse-leadstar-conditions.ts  # Regex condition parser (12 types)
│   ├── generate-offer-content.ts     # AI description generation (Gemini prompt)
│   ├── ai-client.ts             # AI provider (Gemini + dynamic OpenRouter fallback)
│   ├── elevenlabs.ts            # ElevenLabs TTS + sanitizeForTTS()
│   ├── admin-auth.ts            # Admin auth middleware (x-admin-password header)
│   └── blog.ts                  # Blog post queries
├── remotion/                    # Video generation
│   ├── OfferVideo.tsx           # Main video (6 scenes, 70s, 9:16, proportional sync)
│   └── Root.tsx                 # Remotion composition root
├── data/                        # Types, constants, static fallback data
└── hooks/                       # Custom React hooks
public/
├── audio/voiceovers/            # Per-offer MP3s ({slug}.mp3)
├── audio/jingle.mp3             # Background music
├── bank-*.png                   # 9 bank logos (from img.leadmax.pl)
└── logo-icon.png                # CebulaZysku logo
scripts/
├── generate-all-voiceovers.mjs  # Batch voiceover generator
└── generate-test-voiceover.mjs  # Single voiceover test
tasks/                           # PRDs + task tracking files
docs/                            # 44 feature documentation files (see docs/README.md)
supabase/migrations/             # 18 SQL migration files
```

## Database Tables (Supabase)

| Table | Purpose |
|-------|---------|
| `offers` | Bank offers (from LeadStar sync). Key columns: `slug`, `bank_name` (NOT `institution`), `reward`, `conditions` JSONB, `affiliate_url`, `bank_logo`, `is_active`, `ai_generated_at`, `locked_fields`, `quality_flags` |
| `tracked_offers` | User ↔ offer tracking (user_id, offer_id, started_at) |
| `condition_progress` | Per-condition per-month counts |
| `user_achievements` | 13 achievement badges in 4 categories |
| `user_streaks` | Daily streak tracking |
| `user_banks` | Banks where user has accounts (for filtering) |
| `user_referrals` | Referral program (code, referrer, referred) |
| `blog_posts` | Dynamic blog posts (admin CRUD) |
| `contact_messages` | Contact form submissions |
| `push_subscriptions` | Web Push endpoints |
| `notification_preferences` | Email opt-in/out per type |
| `sync_log` | History of LeadStar syncs |
| `email_sends` | Email delivery deduplication |

## Vercel Crons

| Job | Time (UTC) | Endpoint |
|-----|-----------|----------|
| Sync offers | 01:00 | `/api/sync-offers` |
| AI descriptions | 02:00 | `/api/cron/generate-descriptions` |
| Quality check | 03:00 | `/api/cron/quality-check` |
| Email notifications | 08:00 | `/api/cron/email-notifications` |

## Dev Commands

```bash
npm run dev              # Next.js dev server (http://localhost:3000)
npm run build            # Production build
npx remotion studio      # Remotion Studio (video preview)
node scripts/generate-all-voiceovers.mjs  # Batch voiceover generation
```

## Important Rules

- **Conditions from feed parser, never AI.** `parse-leadstar-conditions.ts` extracts structured conditions from HTML. AI in `generate-offer-content.ts` generates ONLY descriptions/pros/cons/FAQ.
- **Bank logos:** use `img.leadmax.pl` URLs (from `bank_logo` DB column). Never `leadstar.pl/img/programs/` — requires auth, returns HTML.
- **Supabase column name:** `bank_name` (NOT `institution`).
- **ElevenLabs:** Daniel voice (`onwK4e9ZLuTAKqWW03F9`), free tier 10k chars/month. Always run through `sanitizeForTTS()` before sending ("5x" → "5 razy", "min." → "minimum").
- **Voiceover sync:** Proportional scene timing (percentage-based), not hardcoded timestamps.
- **Vercel:** Project `cebulazysku.pl` auto-deploys on push to `main`. Do NOT create duplicate projects.
- **Tone of voice:** "Cebulowy humor" — playful, warm, relatable. Users = "cebularze", offers = "cebulki do obrania".

## Project Status (March 2026)

**MVP is DONE.** All core features working in production:
- Landing page with offer filtering/sorting
- 15+ live bank offers (auto-synced from LeadStar daily)
- SSR offer detail pages with JSON-LD, video player
- Auth (email/password) + referral system
- Dashboard with condition tracker, streaks, achievements
- Admin panel (offers, users, blog, push, sync, messages)
- SEO (sitemap, robots, OG, canonical, structured data)
- PWA-ready with push notifications
- Email notifications (Resend)
- AI-generated descriptions (Gemini)
- Video ads with voiceovers (Remotion + ElevenLabs)

**Backlog:**
- Regenerate voiceovers with sanitizeForTTS() fix (after ElevenLabs quota reset)
- Unique videos per bank (colors, copy, TikTok subtitles)
- Server-side video rendering to MP4
- Mobile app (React Native, separate repo)
- White-label / multi-industry platform
