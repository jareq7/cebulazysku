/**
 * Generate a test voiceover for the default mBank offer.
 * Run: node scripts/generate-test-voiceover.mjs
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error("Set ELEVENLABS_API_KEY env var first");
  process.exit(1);
}

// Daniel — Steady Broadcaster (professional, calm)
const VOICE_ID = "onwK4e9ZLuTAKqWW03F9";

const script = [
  "Siedemset dwadzieścia złotych.",
  "Tyle możesz dostać za założenie konta w mBanku.",
  "",
  "Żeby dostać premię, musisz spełnić kilka prostych warunków.",
  "",
  "Po pierwsze: otwórz konto online. To dosłownie kilka minut.",
  "Po drugie: wykonaj cztery transakcje kartą.",
  "I po trzecie: ustaw przelew cykliczny.",
  "",
  "To wszystko.",
  "",
  "Ale... wiesz jak to jest.",
  "Promocja trwa miesiąc. Masz swoje sprawy.",
  "I nagle okazuje się, że zapomniałeś o jednym warunku.",
  "Premia przepada. A mogłeś mieć siedemset dwadzieścia złotych.",
  "",
  "Właśnie dlatego powstała Cebula Zysku.",
  "",
  "Rejestrujesz się za darmo.",
  "Wybierasz ofertę.",
  "I dostajesz swój osobisty tracker — widzisz dokładnie co już zrobiłeś i co zostało.",
  "",
  "Bez podawania danych bankowych. Bez logowania do banku.",
  "Po prostu zaznaczasz co zrobiłeś — a my pilnujemy, żebyś nie przegapił żadnego warunku.",
  "",
  "Krok po kroku. Bez stresu. Za darmo.",
  "",
  "Wejdź na cebulazysku pe el i zacznij obierać premie.",
].join(" ");

console.log("Script:", script);
console.log(`\nCharacters: ${script.length}`);
console.log("Generating voiceover...");

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "xi-api-key": ELEVENLABS_API_KEY,
  },
  body: JSON.stringify({
    text: script,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.6,
      similarity_boost: 0.75,
    },
  }),
});

if (!res.ok) {
  const errText = await res.text();
  console.error(`ElevenLabs error (${res.status}):`, errText.slice(0, 500));
  process.exit(1);
}

const arrayBuffer = await res.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

const outDir = join(__dirname, "..", "public", "audio", "voiceovers");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "test-mbank.mp3");
writeFileSync(outPath, buffer);

console.log(`\nSaved to ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
