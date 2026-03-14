/**
 * Unified AI client — tries providers in order:
 * 1. Gemini free tier (if GEMINI_API_KEY set)
 * 2. OpenRouter (if OPENROUTER_API_KEY set) — curated models sorted by cost
 *
 * Falls back to next provider/model on rate limit (429) or failure.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Gemini models — free tier
const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// OpenRouter — curated models tested for Polish JSON generation, cheapest first
const OPENROUTER_MODELS = [
  "meta-llama/llama-3.1-8b-instruct",        // $0.02+$0.05/M — tested, works
  "mistralai/mistral-small-3.1-24b-instruct", // $0.10+$0.30/M — good quality
  "google/gemini-2.0-flash-001",              // $0.10+$0.40/M — reliable
  "meta-llama/llama-4-scout",                 // $0.15+$0.40/M — newest llama
  "anthropic/claude-3.5-haiku",               // $0.80+$4.00/M — quality fallback
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
      errors.push("Gemini: all models exhausted (rate limit or error)");
    } catch (err) {
      errors.push(`Gemini: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // 2. Try OpenRouter (curated models, cheapest first)
  if (OPENROUTER_API_KEY) {
    try {
      const result = await tryOpenRouter(prompt, maxOutputTokens);
      if (result) return result;
      errors.push("OpenRouter: all models exhausted");
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

      if (res.status === 403) break;

      if (!res.ok) {
        const errBody = await res.text();
        console.warn(`[AI] Gemini ${model} error ${res.status}: ${errBody.slice(0, 200)}`);
        break;
      }

      const data: GeminiResponse = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) return text;
    }
  }

  return null;
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
        console.warn(`[AI] OpenRouter ${model}: rate limited, trying next`);
        await sleep(1000);
        continue;
      }

      if (!res.ok) {
        console.warn(`[AI] OpenRouter ${model}: HTTP ${res.status}`);
        continue;
      }

      const data: OpenRouterResponse = await res.json();

      if (data.error) {
        console.warn(`[AI] OpenRouter ${model}: ${data.error.message}`);
        continue;
      }

      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) {
        console.log(`[AI] OpenRouter ${model}: success`);
        return text;
      }
    } catch (err) {
      console.warn(`[AI] OpenRouter ${model} exception:`, err);
      continue;
    }
  }

  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Backward compatibility
export const askGemini = askAI;
