/**
 * Generate voiceovers for all active offers with conditions and reward > 0.
 * Run: ELEVENLABS_API_KEY=... node scripts/generate-all-voiceovers.mjs
 *
 * Uses the same script template as src/lib/elevenlabs.ts generateVoiceoverScript()
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
if (!ELEVENLABS_API_KEY) {
  console.error("Set ELEVENLABS_API_KEY env var first");
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const VOICE_ID = "onwK4e9ZLuTAKqWW03F9"; // Daniel
const outDir = join(__dirname, "..", "public", "audio", "voiceovers");
mkdirSync(outDir, { recursive: true });

// --- Number to Polish ---
function numberToPolish(n) {
  const hundreds = { 1: "sto", 2: "dwieście", 3: "trzysta", 4: "czterysta", 5: "pięćset", 6: "sześćset", 7: "siedemset", 8: "osiemset", 9: "dziewięćset" };
  const tens = { 2: "dwadzieścia", 3: "trzydzieści", 4: "czterdzieści", 5: "pięćdziesiąt", 6: "sześćdziesiąt", 7: "siedemdziesiąt", 8: "osiemdziesiąt", 9: "dziewięćdziesiąt" };
  const teens = { 10: "dziesięć", 11: "jedenaście", 12: "dwanaście", 13: "trzynaście", 14: "czternaście", 15: "piętnaście", 16: "szesnaście", 17: "siedemnaście", 18: "osiemnaście", 19: "dziewiętnaście" };
  const ones = { 1: "jeden", 2: "dwa", 3: "trzy", 4: "cztery", 5: "pięć", 6: "sześć", 7: "siedem", 8: "osiem", 9: "dziewięć" };
  if (n === 0) return "zero";
  if (n >= 1000) {
    const th = Math.floor(n / 1000);
    const rest = n % 1000;
    const thWord = th === 1 ? "tysiąc" : th < 5 ? `${ones[th]} tysiące` : `${ones[th]} tysięcy`;
    return rest > 0 ? `${thWord} ${numberToPolish(rest)}` : thWord;
  }
  const parts = [];
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

// --- Script generator ---
function generateScript(bankName, reward, conditions, pros) {
  const rewardText = numberToPolish(reward);
  const conditionLines = conditions.slice(0, 4).map((c, i) => {
    if (i === 0) return `Po pierwsze: ${c.label.toLowerCase()}.`;
    if (i === 1) return `Po drugie: ${c.label.toLowerCase()}.`;
    if (i === 2) return `Po trzecie: ${c.label.toLowerCase()}.`;
    return `I jeszcze: ${c.label.toLowerCase()}.`;
  });
  const topPro = pros[0] || "wygodne konto online";

  return [
    `${rewardText} złotych.`,
    `Tyle możesz dostać za założenie konta w ${bankName}.`,
    "",
    "Żeby dostać premię, musisz spełnić kilka prostych warunków.",
    "",
    ...conditionLines,
    "",
    "To wszystko.",
    "",
    "Ale... wiesz jak to jest.",
    "Promocja trwa miesiąc. Masz swoje sprawy.",
    "I nagle okazuje się, że zapomniałeś o jednym warunku.",
    `Premia przepada. A mogłeś mieć ${rewardText} złotych.`,
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
}

// --- ElevenLabs TTS ---
async function generateTTS(text) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.6, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ElevenLabs error (${res.status}): ${errText.slice(0, 300)}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// --- Main ---
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const { data: offers, error } = await supabase
  .from("offers")
  .select("slug, bank_name, reward, conditions, pros")
  .eq("is_active", true)
  .gt("reward", 0);

if (error) {
  console.error("Supabase error:", error);
  process.exit(1);
}

// Filter: must have conditions
const eligible = offers.filter(o => Array.isArray(o.conditions) && o.conditions.length > 0);
console.log(`Found ${eligible.length} eligible offers (with conditions + reward > 0)\n`);

let generated = 0;
let skipped = 0;
let totalChars = 0;

for (const offer of eligible) {
  const outPath = join(outDir, `${offer.slug}.mp3`);

  if (existsSync(outPath)) {
    console.log(`⏭ ${offer.slug} — already exists, skipping`);
    skipped++;
    continue;
  }

  const script = generateScript(
    offer.bank_name.replace(/ S\.A\.$/, "").replace(/ S\.A$/, ""),
    offer.reward,
    offer.conditions,
    offer.pros || []
  );

  console.log(`\n🎙 ${offer.slug} (${offer.reward} zł)`);
  console.log(`  Script: ${script.length} chars`);
  totalChars += script.length;

  try {
    const buffer = await generateTTS(script);
    writeFileSync(outPath, buffer);
    console.log(`  ✓ Saved (${(buffer.length / 1024).toFixed(1)} KB)`);
    generated++;

    // Rate limit: wait 2s between requests
    if (generated < eligible.length) {
      await new Promise(r => setTimeout(r, 2000));
    }
  } catch (err) {
    console.error(`  ✗ Error: ${err.message}`);
    console.log(`  Stopping to avoid burning quota.`);
    break;
  }
}

console.log(`\n--- Done ---`);
console.log(`Generated: ${generated}, Skipped: ${skipped}, Total chars used: ${totalChars}`);
