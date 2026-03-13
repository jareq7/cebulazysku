import { askGemini } from "./gemini";

/**
 * Extracts the maximum cash bonus (premia) from a LeadStar offer
 * using Gemini Flash AI.
 *
 * Returns the reward amount in PLN, or null if it cannot be determined.
 */
export async function parseRewardFromDescription(
  programName: string,
  descriptionHtml: string,
  benefitsHtml: string
): Promise<number | null> {
  // Strip HTML tags for cleaner input
  const descPlain = stripHtml(descriptionHtml);
  const benPlain = stripHtml(benefitsHtml);

  const prompt = `Analizujesz ofertę bankową z polskiego programu afiliacyjnego.

NAZWA PROGRAMU: ${programName}

OPIS:
${descPlain.slice(0, 3000)}

KORZYŚCI:
${benPlain.slice(0, 2000)}

ZADANIE: Podaj MAKSYMALNĄ kwotę premii pieniężnej (bonus gotówkowy), jaką klient może otrzymać za założenie konta i spełnienie warunków promocji.

ZASADY:
- Szukaj TYLKO premii pieniężnych (gotówka, przelew na konto, zwrot za zakupy).
- NIE licz: oprocentowania konta oszczędnościowego, limitów wpływów, kwot wymaganych transakcji, wartości kart podarunkowych (chyba że to jedyna premia).
- Jeśli premia składa się z kilku części (np. 200 zł + 500 zł + 200 zł), zsumuj je.
- Jeśli jest premia za polecenie, NIE doliczaj jej do głównej premii.
- Jeśli nie ma żadnej premii pieniężnej, odpowiedz "0".

Odpowiedz TYLKO liczbą (bez "zł", bez spacji). Przykłady: 900, 650, 0`;

  try {
    const response = await askGemini(prompt);

    // Extract number from response
    const match = response.match(/(\d+)/);
    if (!match) return null;

    const amount = parseInt(match[1], 10);
    if (isNaN(amount) || amount < 0 || amount > 10000) return null;

    return amount;
  } catch (err) {
    console.error("parseRewardFromDescription error:", err);
    return null;
  }
}

function decodeHtmlEntities(html: string): string {
  const namedEntities: Record<string, string> = {
    "&nbsp;": " ", "&lt;": "<", "&gt;": ">", "&amp;": "&",
    "&quot;": '"', "&apos;": "'", "&ndash;": "–", "&mdash;": "—",
    "&bull;": "•", "&hellip;": "…", "&euro;": "€", "&reg;": "®",
    "&trade;": "™", "&copy;": "©",
  };
  return html
    .replace(/&[a-zA-Z]+;/g, (match) => namedEntities[match.toLowerCase()] ?? " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function stripHtml(html: string): string {
  if (!html) return "";
  return decodeHtmlEntities(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|li|ul|ol|h[1-6])[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
