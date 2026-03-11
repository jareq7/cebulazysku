const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_MODEL_FALLBACK = "gemini-3-flash-preview";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}

export async function askGemini(prompt: string, maxOutputTokens = 1024): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0,
      maxOutputTokens,
    },
  });

  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": GEMINI_API_KEY,
  };

  // Try primary model, fallback to newer model if quota error
  for (const model of [GEMINI_MODEL, GEMINI_MODEL_FALLBACK]) {
    // Retry up to 3 times with increasing delay for rate limits
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch(`${GEMINI_BASE}/${model}:generateContent`, {
        method: "POST",
        headers,
        body,
      });

      if (res.status === 429) {
        // Rate limited — wait and retry, or try fallback model
        if (attempt < 2) {
          await sleep(5000 * (attempt + 1));
          continue;
        }
        // After 3 retries, try fallback model
        if (model === GEMINI_MODEL) break;
      }

      if (res.status === 403) {
        // Forbidden — try fallback model
        if (model === GEMINI_MODEL) break;
      }

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Gemini API error ${res.status} (${model}): ${errBody}`);
      }

      const data: GeminiResponse = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return text.trim();
    }
  }

  throw new Error("All Gemini models failed");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
