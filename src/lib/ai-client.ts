/**
 * Unified AI client — tries providers in order of cost (cheapest first):
 * 1. Gemini free tier (if GEMINI_API_KEY set)
 * 2. OpenRouter (if OPENROUTER_API_KEY set) — auto-picks cheapest model
 *
 * Falls back to next provider on rate limit (429) or failure.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Gemini models — free tier
const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// OpenRouter models — sorted by cost (cheapest first)
// Prices are per 1M tokens (input+output combined estimate)
const OPENROUTER_MODELS = [
  "google/gemini-2.0-flash-exp:free",       // free
  "meta-llama/llama-3.1-8b-instruct:free",  // free
  "mistralai/mistral-small-3.1-24b-instruct:free", // free
  "google/gemini-2.0-flash-001",            // $0.10/M
  "meta-llama/llama-4-scout",               // $0.15/M
  "anthropic/claude-3.5-haiku",             // $1/M (fallback quality)
];

interface OpenRouterResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string; code?: number };
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

export async function askAI(prompt: string, maxOutputTokens = 1024): Promise<string> {
  const errors: string[] = [];

  // 1. Try Gemini free tier first
  if (GEMINI_API_KEY) {
    try {
      const result = await tryGemini(prompt, maxOutputTokens);
      if (result) return result;
    } catch (err) {
      errors.push(`Gemini: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // 2. Try OpenRouter (cheapest models first)
  if (OPENROUTER_API_KEY) {
    try {
      const result = await tryOpenRouter(prompt, maxOutputTokens);
      if (result) return result;
    } catch (err) {
      errors.push(`OpenRouter: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  throw new Error(`All AI providers failed: ${errors.join("; ")}`);
}

async function tryGemini(prompt: string, maxOutputTokens: number): Promise<string | null> {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0, maxOutputTokens },
  });

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetch(`${GEMINI_BASE}/${model}:generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY!,
        },
        body,
      });

      if (res.status === 429) {
        if (attempt === 0) {
          await sleep(3000);
          continue;
        }
        break; // try next model
      }

      if (res.status === 403) break; // try next model

      if (!res.ok) {
        const errBody = await res.text();
        console.warn(`Gemini ${model} error ${res.status}: ${errBody.slice(0, 200)}`);
        break;
      }

      const data: GeminiResponse = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) return text;
    }
  }

  return null; // all Gemini models failed, try next provider
}

async function tryOpenRouter(prompt: string, maxOutputTokens: number): Promise<string | null> {
  for (const model of OPENROUTER_MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://cebulazysku.pl",
          "X-Title": "CebulaZysku",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: maxOutputTokens,
          temperature: 0,
        }),
      });

      if (res.status === 429) {
        await sleep(2000);
        continue; // try next model
      }

      if (!res.ok) {
        console.warn(`OpenRouter ${model} error ${res.status}`);
        continue;
      }

      const data: OpenRouterResponse = await res.json();

      if (data.error) {
        console.warn(`OpenRouter ${model}: ${data.error.message}`);
        continue;
      }

      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (err) {
      console.warn(`OpenRouter ${model} exception:`, err);
      continue;
    }
  }

  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Backward compatibility — drop-in replacement for askGemini
export const askGemini = askAI;
