import { askGemini } from "./ai-client";

export interface ScrapeResult {
  reward: number | null;
  finalUrl: string;
  htmlLength: number;
  skipped?: "no_content" | "js_only";
}

/**
 * Podąża za linkiem afiliacyjnym (redirecty) i próbuje wyciągnąć kwotę premii
 * ze strony docelowej banku za pomocą Gemini AI.
 *
 * Używane jako fallback gdy feed LeadStar nie ma wystarczających danych
 * (reward = 0 lub puste opisy).
 */
export async function scrapeOfferPage(affiliateUrl: string): Promise<ScrapeResult | null> {
  try {
    // 1. Podążaj za redirectami żeby dostać końcowy URL banku
    const response = await fetch(affiliateUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "pl-PL,pl;q=0.9",
      },
      signal: AbortSignal.timeout(12000),
    });

    const finalUrl = response.url;
    const html = await response.text();
    const htmlLength = html.length;

    // 2. Sprawdź czy dostaliśmy realną treść (nie pusty shell JS-renderowanej apki)
    const strippedText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Jeśli mniej niż 500 znaków tekstu — prawdopodobnie JS SPA bez SSR
    if (strippedText.length < 500) {
      return { reward: null, finalUrl, htmlLength, skipped: "js_only" };
    }

    // 3. Ogranicz tekst do 6000 znaków dla Gemini (oszczędność tokenów)
    const textForAi = strippedText.slice(0, 6000);

    // 4. Zapytaj Gemini o kwotę premii
    const prompt = `Analizujesz stronę banku polskiego. Wyciągnij MAKSYMALNĄ kwotę premii pieniężnej (cash bonus) dla klienta otwierającego nowe konto.

TREŚĆ STRONY:
${textForAi}

ZASADY:
- Szukaj TYLKO premii gotówkowych (przelew, cashback, bonus na konto).
- NIE licz: oprocentowania, limitów wpływów, wartości kart podarunkowych.
- Jeśli premia ma kilka części, zsumuj je.
- Jeśli brak premii pieniężnej, odpowiedz "0".

Odpowiedz TYLKO liczbą całkowitą (bez "zł", bez spacji). Przykłady: 300, 900, 0`;

    const geminiResponse = await askGemini(prompt);
    const match = geminiResponse.match(/(\d+)/);
    if (!match) return { reward: null, finalUrl, htmlLength };

    const reward = parseInt(match[1], 10);
    if (isNaN(reward) || reward < 0 || reward > 10000) {
      return { reward: null, finalUrl, htmlLength };
    }

    return { reward, finalUrl, htmlLength };
  } catch (err) {
    console.error("scrapeOfferPage error:", err);
    return null;
  }
}
