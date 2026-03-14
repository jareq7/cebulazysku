# CebulaZysku.pl — Bank Affiliate Tracker

Portal pomagający użytkownikom śledzić warunki promocji bankowych i nie przegapić premii.

## Stack

- **Framework:** Next.js 15 (App Router)
- **DB:** Supabase (PostgreSQL)
- **UI:** Tailwind CSS + shadcn/ui
- **Video:** Remotion (programmatic video generation)
- **TTS:** ElevenLabs (Polish voiceovers)
- **AI:** Gemini free tier → OpenRouter fallback
- **Hosting:** Vercel

## Architecture

### Data Pipeline

1. **Leadstar API** (`/api/sync-offers`) → syncs offers from affiliate network
2. **Condition Parser** (`src/lib/parse-leadstar-conditions.ts`) → extracts structured conditions from HTML (no AI)
3. **AI Enrichment** (`/api/cron/generate-descriptions`) → generates descriptions, pros/cons, FAQ only (never conditions)
4. **Video Ads** (`src/remotion/OfferVideo.tsx`) → 9:16 video with voiceover per offer

### Key Directories

```
src/
├── app/                    # Next.js pages + API routes
│   ├── api/
│   │   ├── sync-offers/    # Leadstar → Supabase sync
│   │   ├── cron/           # Scheduled jobs (AI descriptions, quality check, emails)
│   │   └── generate-voiceover/ # ElevenLabs TTS endpoint
│   ├── oferta/[slug]/      # Offer detail page (with video player)
│   └── zaproszenie/        # Referral/invitation pages
├── components/             # React components (ConditionTracker, OfferVideoPlayer, etc.)
├── lib/                    # Business logic
│   ├── offers.ts           # DB → frontend mapper
│   ├── leadstar.ts         # Leadstar API client
│   ├── elevenlabs.ts       # ElevenLabs TTS client
│   ├── ai-client.ts        # AI provider (Gemini + OpenRouter)
│   └── parse-leadstar-conditions.ts  # Condition parser
├── remotion/               # Video generation
│   ├── OfferVideo.tsx      # Main video component (6 scenes, 70s)
│   └── Root.tsx            # Remotion composition root
└── data/                   # Types, constants
public/
├── audio/
│   ├── jingle.mp3          # Background music (Suno)
│   └── voiceovers/         # Per-offer voiceover MP3s
├── bank-*.png              # Bank logos (from img.leadmax.pl)
└── logo-icon.png           # CebulaZysku logo
scripts/
└── generate-test-voiceover.mjs  # Test voiceover generator
```

## Dev Commands

```bash
npm run dev          # Next.js dev server
npx remotion studio  # Remotion Studio (video preview)
```

## Important Notes

- **Conditions come from feed parser, never AI.** AI only generates descriptions/pros/cons/FAQ.
- **Bank logos:** use `img.leadmax.pl` URLs (from `bank_logo` DB column). Never `leadstar.pl/img/programs/` — requires auth, returns HTML.
- **Supabase table `offers`:** bank name column is `bank_name` (not `institution`).
- **Voiceover sync:** use `ffmpeg silencedetect` to find pauses, map scene boundaries to those timestamps.
- **ElevenLabs:** Daniel voice (`onwK4e9ZLuTAKqWW03F9`) works on free tier. Rachel and other library voices require paid plan.

## Vercel Crons

| Job | Time (UTC) | Endpoint |
|-----|-----------|----------|
| Sync offers | 01:00 | `/api/sync-offers` |
| AI descriptions | 02:00 | `/api/cron/generate-descriptions` |
| Quality check | 03:00 | `/api/cron/quality-check` |
| Emails | 08:00 | `/api/cron/send-emails` |
