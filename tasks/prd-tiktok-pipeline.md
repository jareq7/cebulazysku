# PRD: Autonomiczny Pipeline Wideo — TikTok / IG Reels / YT Shorts

## Introduction/Overview

Pełna automatyzacja produkcji i publikacji krótkich wideo (9:16, 50-70s) na TikTok, Instagram Reels i YouTube Shorts. Pipeline codziennie generuje wideo z ofertą bankową: AI pisze skrypt → ElevenLabs generuje voiceover → Remotion renderuje MP4 z napisami Hormozi-style → n8n publikuje na 3 platformy.

**Problem:** Ręczna produkcja wideo jest nieekonomiczna przy 1-2 filmach dziennie. Automatyzacja pozwala na ciągły content marketing bez ludzkiego wysiłku.

**Cel biznesowy:** Zwiększenie ruchu organicznego z social media → więcej kliknięć afiliacyjnych → wyższe przychody CPA.

## Goals

1. Codziennie automatycznie generować 1-2 wideo (docelowo 2/dzień)
2. Publikować na TikTok + Instagram Reels + YouTube Shorts jednocześnie
3. Napisy Hormozi-style (słowo po słowie, duża czcionka, kolorowe keywords)
4. Tracking wyników (views, likes, clicks) z feedbackiem do optymalizacji skryptów
5. Zero interwencji ludzkiej w standardowym cyklu (fully autonomous)

## Architecture

### Stack (istniejące narzędzia)

| Narzędzie | Rola | Status |
|-----------|------|--------|
| **Remotion** | Renderowanie React → MP4 (9:16, 1080×1920) | ✅ Mamy (`OfferVideo.tsx`) |
| **ElevenLabs** | Polski TTS (Daniel voice) | ✅ Mamy (`elevenlabs.ts`) |
| **Gemini / OpenRouter** | Generowanie skryptów wideo | ✅ Mamy (`ai-client.ts`) |
| **Supabase** | DB + Storage (MP4, logi) | ✅ Mamy |
| **Vercel** | API endpoints (render trigger, webhooks) | ✅ Mamy |
| **n8n** | Orkiestracja pipeline'u (cron → render → publish) | 🆕 Do postawienia |

### Nowe narzędzia (do dodania)

| Narzędzie | Rola | Koszt |
|-----------|------|-------|
| **n8n Community** | Self-hosted orkiestrator (Docker) | Darmowy |
| **@remotion/renderer** | Server-side render MP4 | Darmowy (self-hosted) |
| **Whisper API (OpenAI)** | Word-level timestamps do napisów | ~$0.006/min |
| **Pexels API** | B-roll stocki (opcjonalnie) | Darmowy |
| **TikTok Content Posting API** | Bezpośrednia publikacja | Darmowy (wymaga Business Account) |
| **Instagram Graph API** | Publikacja Reels | Darmowy (wymaga FB Business) |
| **YouTube Data API v3** | Publikacja Shorts | Darmowy (quota 10k/dzień) |

### Data Flow

```
n8n cron (10:00 UTC) → wybierz ofertę z DB
  → Gemini: wygeneruj skrypt TikTok (hook + body + CTA, 50-58s)
  → ElevenLabs: TTS → MP3
  → Whisper: word-level timestamps → JSON
  → Remotion: render MP4 (sceny + napisy + B-roll)
  → Supabase Storage: upload MP4
  → TikTok API: publish
  → Instagram API: publish Reel
  → YouTube API: publish Short
  → DB: zapisz log (video_id, platform, stats)
```

### Key Files (nowe)

| Element | Plik |
|---------|------|
| Remotion TikTok template (napisy, hook) | `src/remotion/TikTokVideo.tsx` |
| Remotion captions component | `src/remotion/HormoziCaptions.tsx` |
| Render API endpoint | `src/app/api/render-video/route.ts` |
| Publish API endpoint | `src/app/api/publish-video/route.ts` |
| Whisper timestamps client | `src/lib/whisper.ts` |
| TikTok skrypt generator (AI prompt) | `src/lib/tiktok-script.ts` |
| Social platform clients | `src/lib/social-publish.ts` |
| n8n webhook handler | `src/app/api/webhooks/n8n/route.ts` |
| Video logs migration | `supabase/migrations/027_video_pipeline.sql` |
| Admin — widok wideo | `src/app/admin/wideo/page.tsx` |

## Database Schema

### Tabela: `video_logs`

```sql
CREATE TABLE video_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id TEXT REFERENCES offers(id),
  script JSONB NOT NULL,           -- {hook, body, cta, full_text}
  voiceover_url TEXT,              -- Supabase Storage path
  video_url TEXT,                  -- Supabase Storage path
  captions JSONB,                  -- [{word, start, end}, ...]
  duration_seconds NUMERIC,
  platforms JSONB DEFAULT '[]',    -- [{platform, post_id, url, published_at}]
  stats JSONB DEFAULT '{}',       -- {views, likes, shares, comments} — updated by cron
  status TEXT DEFAULT 'pending',   -- pending, rendering, rendered, published, failed
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);
```

### Tabela: `social_accounts`

```sql
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,          -- tiktok, instagram, youtube
  account_name TEXT,
  access_token TEXT,               -- encrypted
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',    -- platform-specific (page_id, channel_id)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Functional Requirements

### Faza 1: Render MP4 (fundament)

1.1. Zainstalować `@remotion/renderer` i skonfigurować server-side rendering
1.2. API endpoint `POST /api/render-video` — przyjmuje `offer_id`, renderuje MP4, uploaduje do Supabase Storage
1.3. Nowy template `TikTokVideo.tsx` — zoptymalizowany pod social media:
  - Krótszy (50-58s vs 70s obecne)
  - Mocniejszy hook (pierwsze 3 sekundy)
  - Hormozi-style napisy (duża czcionka, słowo po słowie, kolorowe keywords)
  - Dynamiczniejsze animacje (szybsze przejścia, efekty zoom)
  - SFX (cash register, whoosh) na kluczowych momentach
1.4. Component `HormoziCaptions.tsx` — animowane napisy:
  - Word-by-word reveal zsynchronizowany z audio
  - Aktywne słowo: duże, bold, accent color
  - Keywords (kwoty, nazwy banków): wyróżnione kolorem
  - Płynne animacje (scale + opacity)

### Faza 2: AI Skrypty + Voiceover

2.1. `tiktok-script.ts` — AI prompt generujący skrypt TikTok:
  - Persona: młody, dynamiczny, "cebulowy humor"
  - Struktura: Hook (3s) → Problem (5s) → Rozwiązanie (15s) → Proof/Tracker (15s) → CTA (5s)
  - Max 140 słów (= ~55 sekund po TTS)
  - Warianty hooków (pytanie, szok, kontrowersja, historia)
  - Dane z oferty: bank_name, reward, top 3 conditions
2.2. ElevenLabs TTS z `sanitizeForTTS()` — generowanie MP3
2.3. Whisper API — ekstrakcja word-level timestamps z MP3:
  - `POST /v1/audio/transcriptions` z `timestamp_granularities=["word"]`
  - Wynik → JSONB `captions` w `video_logs`
2.4. Zapis do Supabase Storage bucket `videos/`

### Faza 3: n8n Orkiestracja

3.1. Docker Compose setup n8n (self-hosted, persisted data)
3.2. Workflow "Daily Video Pipeline":
  - Cron trigger: 10:00 UTC (poniedziałek-piątek)
  - HTTP Request → `POST /api/webhooks/n8n` z auth
  - Endpoint wybiera kolejną ofertę (round-robin lub priorytet)
  - Wywołuje sekwencję: script → TTS → timestamps → render → publish
  - Error handling: retry 2x, Slack/email alert na failure
3.3. Webhook handler `/api/webhooks/n8n/route.ts` — autoryzacja + orchestration
3.4. Status tracking w `video_logs.status` (pending → rendering → rendered → published → failed)

### Faza 4: Multi-Platform Publishing

4.1. `social-publish.ts` — unified publisher:
  - `publishToTikTok(videoUrl, caption, hashtags)`
  - `publishToInstagram(videoUrl, caption, hashtags)`
  - `publishToYouTube(videoUrl, title, description, tags)`
4.2. TikTok Content Posting API:
  - Wymaga: TikTok Business Account + Developer App
  - OAuth2 flow → token w `social_accounts`
  - Upload wideo → create post
4.3. Instagram Graph API (Reels):
  - Wymaga: Facebook Business Page + Instagram Professional Account
  - Upload via `ig_user/media` → `ig_user/media_publish`
4.4. YouTube Data API v3 (Shorts):
  - Wymaga: Google Cloud project + OAuth2
  - Upload via `videos.insert` z `#Shorts` w tytule
4.5. Admin UI `/admin/wideo` — zarządzanie kontami social:
  - Lista podpiętych kont z statusem tokena
  - Przycisk "Połącz" per platforma (OAuth flow)
  - Historia opublikowanych wideo (tabela z podglądem)

### Faza 5: Analytics Feedback Loop

5.1. Vercel cron (raz dziennie, 20:00 UTC) — pobierz stats z platform API:
  - Views, likes, shares, comments per wideo
  - Zapisz do `video_logs.stats`
5.2. Admin dashboard — wykresy engagement per wideo/platforma
5.3. AI feedback — top-performing hooki jako context do generowania nowych skryptów
5.4. Auto-repost: jeśli wideo ma >10k views na TikTok, automatycznie repostuj na inne platformy z lekką modyfikacją

## Non-Goals (Out of Scope)

- Live streaming
- AI Avatar / deepfake prezenter (na razie faceless)
- Płatna promocja (boost) z poziomu pipeline'u
- Osobny kanał per bank (jeden kanał CebulaZysku)
- Edycja wideo w admin panelu (wideo jest auto-generowane, bez ręcznej edycji)

## Risks & Mitigations

| Ryzyko | Mitygacja |
|--------|-----------|
| TikTok API rate limits / review process | Testowe konto + gradual ramp-up (1/dzień → 2/dzień) |
| ElevenLabs limit chars | Upgrade do Creator plan ($22/mo, 100k chars) |
| Remotion render czas (30-60s per video) | Render w tle (n8n async), nie blokuje Vercel |
| Platformy banują AI content | Wysoka jakość TTS + unikalne skrypty + Hormozi captions = nie wygląda jak spam |
| n8n downtime | Healthcheck + restart policy w Docker |

## ElevenLabs Plan

Przy 2 wideo/dzień × 140 słów × ~5 chars/słowo = ~1400 chars/wideo × 60 wideo/miesiąc = **~84k chars/miesiąc**.
Potrzebny: **Creator plan** ($22/mo, 100k chars) lub **Pro** ($99/mo, 500k chars).

## n8n Setup

```yaml
# docker-compose.yml (na VPS lub lokalnie)
version: '3'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - WEBHOOK_URL=https://n8n.cebulazysku.pl
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped

volumes:
  n8n_data:
```

## Success Criteria

1. Pipeline generuje i publikuje 1 wideo/dzień bez interwencji ludzkiej
2. Wideo ma napisy Hormozi-style zsynchronizowane z audio
3. Publikacja na 3 platformy jednocześnie (TikTok + IG + YT)
4. Średni view count >500 w pierwszym miesiącu
5. Admin panel pokazuje historię wideo ze statusem i statystykami
6. Fallback: jeśli render lub publikacja failuje, alert + retry

## Timeline

| Faza | Zakres | Szacunek |
|------|--------|----------|
| 1 | Render MP4 (Remotion server-side + API) | 2 dni |
| 2 | AI Skrypty + Voiceover + Whisper timestamps | 1.5 dnia |
| 3 | n8n setup + orkiestracja | 1 dzień |
| 4 | Multi-platform publishing (TikTok, IG, YT) | 2 dni |
| 5 | Analytics feedback loop + admin UI | 1.5 dnia |
| **Total** | | **~8 dni** |

## Dependencies

- ElevenLabs plan upgrade (Creator $22/mo)
- TikTok Business Account + Developer App approval
- Instagram Professional Account + Facebook Business Page
- YouTube channel + Google Cloud project
- VPS lub lokalna maszyna do n8n (Docker)
- Whisper API key (OpenAI)
