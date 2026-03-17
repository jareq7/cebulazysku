// @author Gemini CLI (gemini-3-pro-preview) | 2026-03-14 — Refactored voiceover generator

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { sanitizeForTTS, numberToPolish } from '../src/lib/elevenlabs.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const force = args.includes('--force');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
if (!ELEVENLABS_API_KEY) {
  console.error('Set ELEVENLABS_API_KEY env var first');
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9'; // Daniel
const outDir = join(__dirname, '..', 'public', 'audio', 'voiceovers');
mkdirSync(outDir, { recursive: true });

function cleanBankName(name: string): string {
  return name
    .replace(/ S\.A\.$/g, '')
    .replace(/ S\.A$/g, '')
    .replace(/ Oddzia[łl] w Polsce$/g, '')
    .replace(/ Spółka Akcyjna$/g, '')
    .replace(/ Bank$/gi, '')
    .trim();
}

function generateScript(bankName: string, reward: number, conditions: any[], pros: string[]): string {
  const rewardText = numberToPolish(reward);
  const cleanedBank = cleanBankName(bankName);
  
  const conditionLines = (conditions || []).slice(0, 4).map((c, i) => {
    const label = sanitizeForTTS(c.label.toLowerCase());
    if (i === 0) return 'Po pierwsze: ' + label + '.';
    if (i === 1) return 'Po drugie: ' + label + '.';
    if (i === 2) return 'Po trzecie: ' + label + '.';
    return 'I jeszcze: ' + label + '.';
  });

  return [
    rewardText + ' złotych.',
    'Tyle możesz dostać za założenie konta w ' + cleanedBank + '.',
    '',
    'Żeby dostać premię, musisz spełnić kilka prostych warunków.',
    '',
    ...conditionLines,
    '',
    'To wszystko.',
    '',
    'Ale... wiesz jak to jest.',
    'Promocja trwa miesiąc. Masz swoje sprawy.',
    'I nagle okazuje się, że zapomniałeś o jednym warunku.',
    'Premia przepada. A mogłeś mieć ' + rewardText + ' złotych.',
    '',
    'Właśnie dlatego powstała Cebula Zysku.',
    '',
    'Rejestrujesz się za darmo.',
    'Wybierasz ofertę.',
    'I dostajesz swój osobisty tracker — widzisz dokładnie co już zrobiłeś i co zostało.',
    '',
    'Bez podawania danych bankowych. Bez logowania do banku.',
    'Po prostu zaznaczasz co zrobiłeś — a my pilnujemy, żebyś nie przegapił żadnego warunku.',
    '',
    'Krok po kroku. Bez stresu. Za darmo.',
    '',
    'Wejdź na cebulazysku pe el i zacznij obierać premie.',
  ].join(' ');
}

async function generateTTS(text: string) {
  const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + VOICE_ID, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.6, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error('ElevenLabs error (' + res.status + '): ' + errText.slice(0, 300));
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const { data: offers, error } = await supabase
  .from('offers')
  .select('slug, bank_name, reward, conditions, pros')
  .eq('is_active', true)
  .gt('reward', 0);

if (error) {
  console.error('Supabase error:', error);
  process.exit(1);
}

const eligible = offers.filter(o => Array.isArray(o.conditions) && o.conditions.length > 0);
console.log('Found ' + eligible.length + ' eligible offers (with conditions + reward > 0)');
if (force) console.log('Force mode enabled — will regenerate ALL voiceovers\n');

let generated = 0;
let skipped = 0;
let totalChars = 0;

for (const offer of eligible) {
  const outPath = join(outDir, offer.slug + '.mp3');

  if (!force && existsSync(outPath)) {
    console.log('⏭ ' + offer.slug + ' — already exists, skipping');
    skipped++;
    continue;
  }

  const script = generateScript(
    offer.bank_name,
    offer.reward,
    offer.conditions,
    offer.pros || []
  );

  console.log('\n🎙 ' + offer.slug + ' (' + offer.reward + ' zł)');
  console.log('  Script: ' + script.length + ' chars');
  totalChars += script.length;

  try {
    const buffer = await generateTTS(script);
    writeFileSync(outPath, buffer);
    console.log('  ✓ Saved (' + (buffer.length / 1024).toFixed(1) + ' KB)');
    generated++;

    if (generated < eligible.length) {
      await new Promise(r => setTimeout(r, 2000));
    }
  } catch (err) {
    console.error('  ✗ Error: ' + err.message);
    console.log('  Stopping to avoid burning quota.');
    break;
  }
}

console.log('\n--- Done ---');
console.log('Generated: ' + generated + ', Skipped: ' + skipped + ', Total chars used: ' + totalChars);
