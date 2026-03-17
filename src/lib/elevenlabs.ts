/**
 * ElevenLabs Text-to-Speech client for Polish voiceover generation.
 * Uses multilingual_v2 model for natural Polish speech.
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const BASE_URL = "https://api.elevenlabs.io/v1";

// Daniel — Steady Broadcaster, professional and calm. Works well with Polish.
const DEFAULT_VOICE_ID = "onwK4e9ZLuTAKqWW03F9";

export interface VoiceoverOptions {
  text: string;
  voiceId?: string;
  stability?: number; // 0-1, higher = more consistent
  similarityBoost?: number; // 0-1, higher = closer to original voice
}

/**
 * Generate speech audio from text.
 * Returns MP3 buffer ready to use in Remotion.
 */
export async function generateVoiceover({
  text,
  voiceId = DEFAULT_VOICE_ID,
  stability = 0.5,
  similarityBoost = 0.75,
}: VoiceoverOptions): Promise<Buffer> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set");
  }

  const res = await fetch(`${BASE_URL}/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ElevenLabs TTS failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * List available voices (useful for picking the best Polish voice).
 */
export async function listVoices(): Promise<{ voice_id: string; name: string; labels: Record<string, string> }[]> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set");
  }

  const res = await fetch(`${BASE_URL}/voices`, {
    headers: { "xi-api-key": ELEVENLABS_API_KEY },
  });

  if (!res.ok) {
    throw new Error(`ElevenLabs voices list failed (${res.status})`);
  }

  const data = await res.json();
  return data.voices;
}

/**
 * Generate voiceover script for an offer video.
 * Returns text optimized for TTS (~25 seconds of speech for 30s video).
 * Numbers written as words for natural Polish pronunciation.
 */
export function sanitizeForTTS(text: string): string {
  let t = text;

  // 1. Złożone skróty najpierw (wielowyrazowe)
  t = t.replace(/\bz[łl]\/mies\./gi, 'złotych miesięcznie');
  t = t.replace(/\/mies\./gi, ' miesięcznie');
  t = t.replace(/\/mc/gi, ' na miesiąc');

  // 2. Skróty z kropką
  t = t.replace(/\bmin\.\s*/gi, 'minimum ');
  t = t.replace(/\bmaks\.\s*/gi, 'maksimum ');
  t = t.replace(/\bmies\.\s*/gi, 'miesięcznie ');
  t = t.replace(/\bnr\.?\s*/gi, 'numer ');
  t = t.replace(/\btys\.\s*/gi, 'tysięcy ');
  t = t.replace(/\br\.\s*/gi, 'roku ');
  t = t.replace(/\bnp\.\s*/gi, 'na przykład ');
  t = t.replace(/\btj\.\s*/gi, 'to jest ');
  t = t.replace(/\bok\.\s*/gi, 'około ');
  t = t.replace(/\bwg\b\.?\s*/gi, 'według ');
  t = t.replace(/\bpkt\.?\s*/gi, 'punktów ');
  t = t.replace(/\btel\.\s*/gi, 'telefon ');
  t = t.replace(/\bkwot[aę]?\s*/gi, (match) => match); // keep as-is, just in case
  t = t.replace(/\bmax\.\s*/gi, 'maksimum ');
  t = t.replace(/\bos\.\s*/gi, 'osobiste ');
  t = t.replace(/\bwył\.\s*/gi, 'wyłącznie ');

  // 3. Specyficzne dla liczb
  t = t.replace(/(\d+)x\b/g, '$1 razy');
  // Duże liczby z separatorem — "2 500" → "2500" (normalize for reading)
  t = t.replace(/(\d)\s(\d{3})\b/g, '$1$2');

  // 4. Samodzielne "zł" (uważnie, aby nie zepsuć słów)
  t = t.replace(/(^|\s)z[łl](\s|$|,|\.)/gi, '$1złotych$2');

  // 5. Cleanup
  return t.replace(/\s+/g, ' ').trim();
}

export function generateVoiceoverScript(
  bankName: string,
  reward: number,
  conditions: { label: string }[],
  pros: string[]
): string {
  const rewardText = numberToPolish(reward);

  // Explain each condition naturally
  const conditionLines = conditions.slice(0, 4).map((c, i) => {
    const label = sanitizeForTTS(c.label.toLowerCase());
    if (i === 0) return `Po pierwsze: ${label}.`;
    if (i === 1) return `Po drugie: ${label}.`;
    if (i === 2) return `Po trzecie: ${label}.`;
    return `I jeszcze: ${label}.`;
  });

  const topPro = pros[0] || "wygodne konto online";

  return [
    `Chcesz obrać ${rewardText} złotych premii w ${bankName}?`,
    "",
    "To prostsze niż myślisz.",
    "",
    ...conditionLines,
    "",
    "To wszystko.",
    "",
    `A żebyś nie zapomniał o żadnym warunku, na Cebuli Zysku masz swój tracker.`,
    `Widzisz dokładnie co już zrobiłeś i co zostało do zrobienia.`,
    "Krok po kroku, bez stresu.",
    "",
    topPro ? `A do tego: ${topPro.toLowerCase()}.` : "",
    "",
    "Wejdź na cebulazysku.pl i zacznij obierać premie!",
  ].filter(Boolean).join(" ");
}

export function numberToPolish(n: number): string {
  const hundreds: Record<number, string> = {
    1: "sto", 2: "dwieście", 3: "trzysta", 4: "czterysta",
    5: "pięćset", 6: "sześćset", 7: "siedemset", 8: "osiemset", 9: "dziewięćset",
  };
  const tens: Record<number, string> = {
    2: "dwadzieścia", 3: "trzydzieści", 4: "czterdzieści",
    5: "pięćdziesiąt", 6: "sześćdziesiąt", 7: "siedemdziesiąt",
    8: "osiemdziesiąt", 9: "dziewięćdziesiąt",
  };
  const teens: Record<number, string> = {
    10: "dziesięć", 11: "jedenaście", 12: "dwanaście", 13: "trzynaście",
    14: "czternaście", 15: "piętnaście", 16: "szesnaście", 17: "siedemnaście",
    18: "osiemnaście", 19: "dziewiętnaście",
  };
  const ones: Record<number, string> = {
    1: "jeden", 2: "dwa", 3: "trzy", 4: "cztery",
    5: "pięć", 6: "sześć", 7: "siedem", 8: "osiem", 9: "dziewięć",
  };

  if (n === 0) return "zero";
  if (n >= 1000) {
    const th = Math.floor(n / 1000);
    const rest = n % 1000;
    const thWord = th === 1 ? "tysiąc" : th < 5 ? `${ones[th]} tysiące` : `${ones[th]} tysięcy`;
    return rest > 0 ? `${thWord} ${numberToPolish(rest)}` : thWord;
  }

  const parts: string[] = [];
  const h = Math.floor(n / 100);
  if (h > 0) parts.push(hundreds[h]);

  const remainder = n % 100;
  if (remainder >= 10 && remainder <= 19) {
    parts.push(teens[remainder]);
  } else {
    const t = Math.floor(remainder / 10);
    const o = remainder % 10;
    if (t > 0) parts.push(tens[t]);
    if (o > 0) parts.push(ones[o]);
  }

  return parts.join(" ");
}
