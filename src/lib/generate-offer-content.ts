import { askGemini } from "./gemini";

export interface GeneratedOfferContent {
  short_description: string;
  full_description: string;
  pros: string[];
  cons: string[];
  faq: { question: string; answer: string }[];
  conditions: {
    id: string;
    label: string;
    description: string;
    type: "transaction" | "deposit" | "login" | "setup" | "other";
    requiredCount: number;
    perMonth: boolean;
    monthsRequired: number;
  }[];
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|li|ul|ol|h[1-6])[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#?\w+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractJson(text: string): string {
  // Usuń markdown code block jeśli Gemini je doda
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  // Znajdź pierwszy { i ostatni }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text.trim();
}

export async function generateOfferContent(
  bankName: string,
  offerName: string,
  reward: number,
  descriptionHtml: string,
  benefitsHtml: string
): Promise<GeneratedOfferContent | null> {
  const descPlain = stripHtml(descriptionHtml).slice(0, 3000);
  const benPlain = stripHtml(benefitsHtml).slice(0, 2000);

  const prompt = `Jesteś copywriterem serwisu CebulaZysku.pl — agregatu promocji bankowych. Piszesz w tonie przystępnym, lekko humorystycznym, nawiązującym do cebuli i "obierania warstw zysku". Unikasz korporacyjnego żargonu. Tekst ma być zrozumiały dla każdego, nie tylko dla finansistów.

OFERTA DO OPISANIA:
Bank: ${bankName}
Nazwa oferty: ${offerName}
Premia: ${reward} zł
Opis z feedu: ${descPlain}
Warunki z feedu: ${benPlain}

ZADANIE: Wygeneruj treść do wyświetlenia na stronie oferty. Odpowiedz WYŁĄCZNIE poprawnym JSON (bez żadnego tekstu przed ani po), zgodnym z tym schematem:

{
  "short_description": "2-3 zdania zachęcające, max 220 znaków, wspomina premię ${reward} zł",
  "full_description": "3-4 akapity (każdy oddzielony \\n\\n), czytelny opis oferty: co to jest, jak działa, dla kogo, cebulowy akcent na koniec",
  "pros": ["zaleta 1", "zaleta 2", "zaleta 3"],
  "cons": ["wada 1", "wada 2"],
  "faq": [
    {"question": "Pytanie 1?", "answer": "Odpowiedź 1."},
    {"question": "Pytanie 2?", "answer": "Odpowiedź 2."},
    {"question": "Pytanie 3?", "answer": "Odpowiedź 3."}
  ],
  "conditions": [
    {
      "id": "cond_1",
      "label": "Krótka nazwa warunku",
      "description": "Szczegółowy opis co trzeba zrobić",
      "type": "transaction",
      "requiredCount": 5,
      "perMonth": true,
      "monthsRequired": 2
    }
  ]
}

ZASADY:
- short_description: zwięzłe, zachęcające, z kwotą premii
- full_description: przystępny język, cebulowy humor bez przesady, konkretne info
- pros: minimum 2, maksimum 5 prawdziwych zalet (nie wymyślaj)
- cons: minimum 1, maksimum 3 uczciwe wady (nie pomijaj warunków jeśli są wymagające)
- faq: 3-5 pytań które użytkownik mógłby zadać
- conditions: wyciągnij WSZYSTKIE warunki z sekcji "Warunki z feedu"; type to jedno z: "transaction" (transakcje kartą/BLIK), "deposit" (wpłata/przelew), "login" (logowanie do aplikacji), "setup" (założenie/aktywacja), "other"
- Jeśli brak danych do warunków, zwróć "conditions": []
- Odpowiedz TYLKO JSON, bez żadnych komentarzy`;

  try {
    const raw = await askGemini(prompt);
    const jsonStr = extractJson(raw);
    const parsed = JSON.parse(jsonStr) as GeneratedOfferContent;

    // Podstawowa walidacja
    if (
      typeof parsed.short_description !== "string" ||
      typeof parsed.full_description !== "string" ||
      !Array.isArray(parsed.pros) ||
      !Array.isArray(parsed.cons) ||
      !Array.isArray(parsed.faq) ||
      !Array.isArray(parsed.conditions)
    ) {
      console.error("generateOfferContent: invalid shape", parsed);
      return null;
    }

    // Sanitize
    return {
      short_description: parsed.short_description.slice(0, 300),
      full_description: parsed.full_description.slice(0, 3000),
      pros: parsed.pros.slice(0, 5).map((p) => String(p)),
      cons: parsed.cons.slice(0, 4).map((c) => String(c)),
      faq: parsed.faq.slice(0, 6).map((f) => ({
        question: String(f.question || ""),
        answer: String(f.answer || ""),
      })),
      conditions: parsed.conditions.slice(0, 10).map((c, i) => ({
        id: String(c.id || `cond_${i + 1}`),
        label: String(c.label || ""),
        description: String(c.description || ""),
        type: (["transaction", "deposit", "login", "setup", "other"].includes(c.type)
          ? c.type
          : "other") as GeneratedOfferContent["conditions"][0]["type"],
        requiredCount: Number(c.requiredCount) || 1,
        perMonth: Boolean(c.perMonth),
        monthsRequired: Number(c.monthsRequired) || 1,
      })),
    };
  } catch (err) {
    console.error("generateOfferContent error:", err);
    return null;
  }
}
