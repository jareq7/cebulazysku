## Relevant Files

- `src/remotion/OfferVideo.tsx` - Główny komponent wideo (6 scen, sync z voiceoverem)
- `src/remotion/Root.tsx` - Remotion Composition root
- `src/components/OfferVideoPlayer.tsx` - Player wrapper na stronach ofert
- `src/lib/elevenlabs.ts` - ElevenLabs TTS client + script generator
- `src/app/api/generate-voiceover/route.ts` - API endpoint generowania voiceover
- `src/app/oferta/[slug]/page.tsx` - Strona oferty (embeds player)
- `scripts/generate-test-voiceover.mjs` - Skrypt testowy voiceover
- `public/bank-*.png` - Loga banków (9 szt.)
- `public/audio/jingle.mp3` - Muzyka tła
- `public/audio/voiceovers/*.mp3` - Voiceover per oferta

### Notes

- Voiceover sync wymaga ffmpeg (`silencedetect=noise=-28dB:d=0.5`)
- ElevenLabs free tier: tylko premade voices (Daniel)
- Bank logos muszą być lokalne (staticFile), nie z zewnętrznych URL-i

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`.

## Tasks

- [x] 1.0 Setup Remotion video pipeline
  - [x] 1.1 Zainstalować Remotion + @remotion/player
  - [x] 1.2 Stworzyć OfferVideo.tsx z 6 scenami
  - [x] 1.3 Stworzyć Root.tsx z Composition
  - [x] 1.4 Stworzyć OfferVideoPlayer.tsx wrapper
  - [x] 1.5 Osadzić player na stronie oferty

- [x] 2.0 Bank logos
  - [x] 2.1 Pobrać loga z img.leadmax.pl dla wszystkich 9 banków
  - [x] 2.2 Stworzyć LOGO_MAP (hash URL → lokalny plik)
  - [x] 2.3 Komponent BankLogo z fallbackiem na literę

- [x] 3.0 Voiceover (ElevenLabs)
  - [x] 3.1 Stworzyć ElevenLabs client (`src/lib/elevenlabs.ts`)
  - [x] 3.2 Stworzyć `generateVoiceoverScript()` z `numberToPolish()`
  - [x] 3.3 Stworzyć test script (`scripts/generate-test-voiceover.mjs`)
  - [x] 3.4 Wygenerować test voiceover dla mBank
  - [x] 3.5 Stworzyć API endpoint `/api/generate-voiceover`

- [x] 4.0 Synchronizacja voiceover ↔ sceny
  - [x] 4.1 Zmierzyć pauzy w voiceoverze (ffmpeg silencedetect)
  - [x] 4.2 Zmapować granice scen na timestamps pauz
  - [x] 4.3 Dostosować wewnętrzne timingi tekstu w każdej scenie

- [x] 5.0 Muzyka tła
  - [x] 5.1 Wgrać jingle z Suno do `public/audio/jingle.mp3`
  - [x] 5.2 Dodać komponent Audio z dynamicznym offsetem per bank
  - [x] 5.3 Ustawić volume (0.08 z voiceoverem, 0.25 bez)

- [ ] 6.0 Generowanie voiceover dla wszystkich ofert
  - [ ] 6.1 Wygenerować voiceover dla każdej aktywnej oferty via API
  - [ ] 6.2 Zmierzyć pauzy i dostosować timingi per oferta
  - [ ] 6.3 Podpiąć voiceoverUrl w danych oferty (Supabase lub props)

- [ ] 7.0 Server-side rendering do MP4 (opcjonalnie)
  - [ ] 7.1 Setup @remotion/renderer
  - [ ] 7.2 API endpoint renderowania MP4
  - [ ] 7.3 Upload do storage (Supabase/S3)
