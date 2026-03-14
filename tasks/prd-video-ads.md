# PRD: Video Ads dla Ofert Bankowych

## Introduction/Overview

Moduł generowania profesjonalnych wideo-reklam (9:16, vertical) dla każdej oferty bankowej na CebulaZysku.pl. Wideo jest osadzone na stronach szczegółów ofert i ma za zadanie w przystępny sposób wytłumaczyć użytkownikowi warunki promocji oraz zachęcić do rejestracji na platformie.

**Problem:** Użytkownicy nie rozumieją warunków promocji bankowych lub zapominają je spełnić w terminie. Wideo tłumaczy to w prosty sposób i pokazuje jak CebulaZysku pomaga śledzić postęp.

## Goals

1. Wygenerować profesjonalne wideo z lektorem dla każdej aktywnej oferty
2. Zsynchronizować lektor z animacjami scen
3. Pokazać mockup trackera warunków jako kluczową wartość platformy
4. Zbić obiekcje użytkowników (bezpieczeństwo, koszt, prostota)
5. Zachęcić do rejestracji (CTA)

## Architecture

### Stack

- **Remotion** — programmatic React-based video generation (1080×1920, 30fps, ~70s)
- **@remotion/player** — inline playback on offer pages
- **ElevenLabs** — Polish TTS (`eleven_multilingual_v2`, voice: Daniel `onwK4e9ZLuTAKqWW03F9`)
- **ffmpeg** — audio analysis (silence detection for scene sync)
- **Suno** — background music jingle

### Key Files

| Element | Plik |
|---------|------|
| Główny komponent wideo (6 scen) | `src/remotion/OfferVideo.tsx` |
| Remotion Composition root | `src/remotion/Root.tsx` |
| Player wrapper na stronie oferty | `src/components/OfferVideoPlayer.tsx` |
| ElevenLabs TTS client + script generator | `src/lib/elevenlabs.ts` |
| API endpoint generowania voiceover | `src/app/api/generate-voiceover/route.ts` |
| Skrypt testowy (mBank voiceover) | `scripts/generate-test-voiceover.mjs` |
| Strona oferty (embeds player) | `src/app/oferta/[slug]/page.tsx` |

### Assets (public/)

| Plik | Opis |
|------|------|
| `bank-{slug}.png` | Loga banków (9 szt.) pobrane z `img.leadmax.pl` |
| `audio/jingle.mp3` | Muzyka tła z Suno (~2 min) |
| `audio/voiceovers/*.mp3` | Voiceover per oferta |
| `logo-icon.png` | Logo CebulaZysku (watermark) |

### Data Flow

1. Oferta z Supabase → `bankName`, `reward`, `conditions`, `bankLogo` (URL `//img.leadmax.pl/logo/{hash}.png`)
2. `generateVoiceoverScript()` → generuje polski skrypt lektora z `numberToPolish()`
3. ElevenLabs API → MP3 voiceover
4. `ffmpeg silencedetect` → timestamps pauz w audio
5. Scene boundaries w `OfferVideo.tsx` mapowane na timestamps
6. `@remotion/player` renderuje wideo inline na stronie oferty

## Functional Requirements

1. Wideo 9:16 (1080×1920) @ 30fps, ~70 sekund
2. 6 scen zsynchronizowanych z lektorem:
   - **Intro** — kwota premii z animacją licznika + logo CebulaZysku
   - **Bank** — logo banku + nazwa oferty
   - **Warunki** — lista warunków z checkboxami (po kolei)
   - **Problem** — "Ale zapomniałeś..." empatia z użytkownikiem
   - **Tracker** — mockup trackera CebulaZysku + zbijanie obiekcji
   - **CTA** — "Obierz X zł" + cebulazysku.pl
3. Watermark logo CebulaZysku przez cały film (prawy górny róg)
4. Muzyka tła z różnym fragmentem per bank (hash nazwy → offset)
5. Volume muzyki 0.08 gdy jest voiceover, 0.25 bez
6. Bank logo z lokalnych plików (`LOGO_MAP` hash → `staticFile()`)
7. Fallback logo: litera na zielonym tle

## Non-Goals (Out of Scope)

- Server-side rendering wideo do plików MP4 (na razie tylko @remotion/player)
- Automatyczne generowanie voiceover przy sync ofert (na razie ręczne/API)
- Różne formaty wideo (tylko 9:16 vertical)

## Technical Notes

- **ElevenLabs free tier:** Tylko premade voices (Daniel). Library voices (Rachel) zwracają 402. Limit: 10k znaków/mies.
- **Bank logos:** URL `leadstar.pl/img/programs/` wymaga auth — NIGDY nie używać. Tylko `img.leadmax.pl/logo/`.
- **Kolumna DB:** `bank_name` (nie `institution`).
- **Narracja:** Spokojny, profesjonalny ton. NIE jak baner HTML5. Tłumaczy jak przedszkolakowi.

### Sanityzacja TTS

ElevenLabs czyta skróty dosłownie! Funkcja `sanitizeForTTS()` (w `elevenlabs.ts` i `generate-all-voiceovers.mjs`) zamienia:
- `5x` → `5 razy` (inaczej czyta "kracht")
- `min.` → `minimum` (inaczej czyta "min")
- `mies.` → `miesięcznie`, `zł` → `złotych`, `r.` → `roku`, itd.

### Synchronizacja scen z lektorem

**Problem:** Każdy voiceover ma inną długość (62–70s). Hardcoded timestamps z jednego voiceover nie pasują do innych.

**Rozwiązanie:** Proporcjonalne timingi scen oparte na średniej ~66s:

| Scena | % | Sekundy | Lektor |
|-------|---|---------|--------|
| Intro | 0–9% | 0–6s | "X złotych. Tyle możesz dostać..." |
| Bank | 9–15% | 6–10s | "Żeby dostać premię..." |
| Warunki | 15–35% | 10–23s | "Po pierwsze... To wszystko." |
| Problem | 35–57% | 23–37.5s | "Ale... Premia przepada." |
| Tracker | 57–92% | 37.5–61s | "Cebula Zysku... tracker..." |
| CTA | 92–100% | 61–70s | "Wejdź na cebulazysku.pl" |

Proporcje działają ponieważ wszystkie voiceovers używają tego samego szablonu skryptu — różnią się tylko nazwą banku i warunkami, więc struktura narracji jest proporcjonalnie spójna.

**Debug:** `ffmpeg -i voiceover.mp3 -af silencedetect=noise=-28dB:d=0.5 -f null - 2>&1 | grep silence`

### Procedura generowania voiceover

1. Sprawdź czy `sanitizeForTTS()` obsługuje wszystkie skróty w warunkach oferty
2. Uruchom: `ELEVENLABS_API_KEY=... NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node scripts/generate-all-voiceovers.mjs`
3. Script skipuje istniejące MP3, zatrzymuje się przy błędzie quota
4. Pliki lądują w `public/audio/voiceovers/{slug}.mp3`
5. Strona oferty automatycznie podpina voiceoverUrl (server-side `existsSync` check)
6. Commit + push → deploy na Vercel (projekt `cebulazysku.pl`)

### Dodawanie nowego banku

1. Pobierz logo: `curl -sL "https://img.leadmax.pl/logo/{hash}.png" -o public/bank-{slug}.png`
2. Sprawdź: `file public/bank-{slug}.png` (musi być PNG, nie HTML!)
3. Dodaj hash do `LOGO_MAP` w `src/remotion/OfferVideo.tsx`

## Success Metrics

- Użytkownik ogląda wideo do końca (retention > 50%)
- Zwiększenie konwersji rejestracji na stronach ofert
- Pozytywny feedback na temat zrozumiałości warunków
