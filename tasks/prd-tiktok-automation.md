# PRD: TikTok Viral Video Automation
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-18

## 1. Introduction
CebulaZysku.pl needs a scalable, automated top-of-funnel traffic source. This project implements a "Faceless" video production pipeline that automatically generates, renders, and publishes viral finance-related short-form videos (TikTok, Reels, Shorts) based on current bank offers and educational content.

## 2. Goals & Success Metrics
- **Scalability:** Produce 1 high-quality video daily with zero manual intervention.
- **Engagement:** Achieve average watch time > 40% on TikTok.
- **Conversion:** Drive traffic to `cebulazysku.pl` via links in bio (tracked via GTM).
- **Metric:** Reach 100k views across all platforms within the first 30 days.

## 3. User Stories
- As a **New User**, I want to see engaging, short videos explaining how to earn money from banks so that I can start "obieranie cebuli".
- As a **Cebularz**, I want to be notified about the best "Offer of the Day" via a viral video.
- As the **Owner**, I want the system to handle the entire content cycle from offer detection to publishing so I can focus on business growth.

## 4. Technical Architecture

### 4.1 Orchestration (Make.com)
- Central hub connecting all APIs via webhooks and scheduled triggers.
- Handles logic branching (e.g., if a video performs well, trigger a follow-up).

### 4.2 Content Generation (Claude 3.5 / Gemini)
- Inputs: Offer data (bank, reward, conditions), educational topics.
- Output: Structured JSON script (Hook, Body, CTA) + prompts for visual B-rolls.

### 4.3 Voice & Audio (ElevenLabs + Whisper)
- High-fidelity Polish voice clone.
- Word-level timestamps generation for synchronized captions.

### 4.4 Video Engine (Remotion)
- React-based rendering engine.
- Dynamic templates supporting:
  - Hormozi-style captions (word by word, animated).
  - Background video/image swapping.
  - Progress bars and countdowns.
  - Automated logo & watermark insertion.

### 4.5 Persistence & Publishing
- Storage: **Supabase Storage** for MP4 files and assets.
- Publishing: **Metricool / Ayrshare API** for multi-platform distribution.

## 5. Data Schema (Supabase)
New table: `social_video_logs`
- `id` (UUID)
- `offer_id` (FK to offers)
- `video_url` (Text)
- `platform` (Enum: tiktok, reels, shorts)
- `script` (JSON)
- `stats` (JSON: views, likes, shares)
- `created_at` (Timestamp)

## 6. Functional Requirements

### 6.1 Automated Scripting
- LLM must use a "Viral Persona" (energetic, persuasive, cebulowy humor).
- Scripts must be exactly 50-58 seconds long.

### 6.2 Visual Dynamic Backgrounds
- System must pull B-rolls from Pexels API or generate them via Runway/Pika based on keywords from the script.

### 6.3 Performance Feedback Loop
- Weekly cron job to fetch views/engagement from platform APIs.
- Results fed back to the LLM prompt to optimize future scripts.

## 7. Implementation Phases

### Phase 1: Remotion Template (1 week)
- Build the "Viral v1" React template with synchronized captions and split-screen support.

### Phase 2: Make.com Pipeline (1 week)
- Connect Offer DB -> LLM -> ElevenLabs -> Remotion Render.

### Phase 3: Auto-Publishing (1 week)
- Integration with Metricool API and initial posting tests.

### Phase 4: Data & Optimization (ongoing)
- Dashboard in Admin Panel to see video performance vs conversions.

## 8. Constraints & Risks
- **Platform Bans:** Avoid "spammy" patterns; ensure content variety.
- **Cost:** Monitor ElevenLabs and AWS Lambda (Remotion render) usage.
- **Copyright:** Use only royalty-free music and B-rolls.
