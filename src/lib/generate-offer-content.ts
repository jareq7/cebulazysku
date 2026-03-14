import { askGemini } from "./ai-client";

export interface GeneratedOfferContent {
  short_description: string;
  full_description: string;
  pros: string[];
  cons: string[];
  faq: { question: string; answer: string }[];
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

  const prompt = `Jesteś senior copywriterem serwisu CebulaZysku.pl. Twoim zadaniem jest stworzenie soczystego, konkretnego i niezwykle czytelnego opisu promocji bankowej.

TONE OF VOICE:
- Przystępny, humorystyczny, "cebulowy" (nawiązania do obierania warstw zysku, łupienia banków).
- Poziom humoru: 7/10 (śmiesznie, ale konkretnie i profesjonalnie przy liczbach).
- Zero korporacyjnego bełkotu i lania wody.

STRUKTURA OPISU (full_description):
Musisz użyć dokładnie tej struktury i formatowania Markdown:

1. **Szybki strzał (TL;DR)**: Jedno pogrubione zdanie z kwotą premii.
   Przykład: **Zgarnij równe ${reward} zł** za otwarcie konta i kilka prostych ruchów kartą.

2. **Dla kogo ta cebulka?**: Lista punktowa (kto może skorzystać, a kto jest wykluczony - np. powracający klienci).
   Użyj formatu:
   - Nowi klienci (brak konta od [data])
   - Osoby pełnoletnie
   - Fani darmowej kasy

3. **Kluczowe kroki**: Skondensowana lista etapów prowadzących do wypłaty.
   Użyj formatu:
   - **Krok 1**: Załóż konto z linku poniżej.
   - **Krok 2**: Wpłać min. [kwota] zł.
   - **Krok 3**: Zapłać min. [X] razy kartą.

4. **Cebulowy werdykt**: 2-3 zdania podsumowania, czy warto i jak bardzo to jest opłacalne.

OFERTA DO OPISANIA:
Bank: ${bankName}
Nazwa oferty: ${offerName}
Premia: ${reward} zł
Surowe dane z feedu:
Opis: ${descPlain}
Warunki: ${benPlain}

ZADANIE: Odpowiedz WYŁĄCZNIE poprawnym JSON (bez markdownu na zewnątrz), zgodnym z tym schematem:

{
  "short_description": "2 zdania zachęcające, max 200 znaków, wspomina premię ${reward} zł",
  "full_description": "Opis w strukturze opisanej wyżej, używający \\n\\n do oddzielania sekcji i Markdown (**bold**, - listy).",
  "pros": ["max 5 konkretnych zalet"],
  "cons": ["max 3 uczciwe wady"],
  "faq": [{"question": "...", "answer": "..."}]
}

ZASADY:
- Kwoty i najważniejsze terminy ZAWSZE pogrubiaj (**kwota**).
- W sekcji "Kluczowe kroki" podawaj konkretne kwoty i liczby z feedu.
- NIE generuj warunków (conditions) - one są już na stronie, Ty piszesz opis.
- Jeśli w feedzie nie ma daty karencji dla powracających klientów, napisz "Sprawdź szczegóły w regulaminie".`;

  try {
    const raw = await askGemini(prompt, 3000);
    const jsonStr = extractJson(raw);
    const parsed = JSON.parse(jsonStr) as GeneratedOfferContent;

    // Podstawowa walidacja
    if (
      typeof parsed.short_description !== "string" ||
      typeof parsed.full_description !== "string" ||
      !Array.isArray(parsed.pros) ||
      !Array.isArray(parsed.cons) ||
      !Array.isArray(parsed.faq)
    ) {
      console.error("generateOfferContent: invalid shape", parsed);
      return null;
    }

    return sanitize(parsed);
  } catch (err) {
    console.error("generateOfferContent error:", err);
    return null;
  }
}

function sanitize(parsed: GeneratedOfferContent): GeneratedOfferContent {
  return {
    short_description: parsed.short_description.slice(0, 300),
    full_description: parsed.full_description.slice(0, 3000),
    pros: parsed.pros.slice(0, 5).map((p) => String(p)),
    cons: parsed.cons.slice(0, 4).map((c) => String(c)),
    faq: parsed.faq.slice(0, 6).map((f) => ({
      question: String(f.question || ""),
      answer: String(f.answer || ""),
    })),
  };
}

async function verifyOfferContent(
  draft: GeneratedOfferContent,
  bankName: string,
  offerName: string,
  reward: number,
  descPlain: string,
  benPlain: string
): Promise<GeneratedOfferContent | null> {
  const verifyPrompt = `Jesteś redaktorem CebulaZysku.pl. Sprawdź poniższy opis oferty bankowej i popraw ewentualne błędy.

DANE ŹRÓDŁOWE:
Bank: ${bankName}
Nazwa oferty: ${offerName}
Premia: ${reward} zł
Opis z feedu: ${descPlain}
Warunki z feedu: ${benPlain}

WYGENEROWANY OPIS DO WERYFIKACJI:
${JSON.stringify(draft, null, 2)}

SPRAWDŹ I POPRAW:
1. Czy kwota premii (${reward} zł) jest podana poprawnie wszędzie gdzie się pojawia?
2. Czy warunki (conditions) są zgodne z "Warunki z feedu"? Czy żadnego nie pominięto?
3. Czy pros/cons są oparte na faktach z feedu, a nie wymyślone?
4. Czy short_description mieści się w 220 znakach?

Jeśli wszystko się zgadza — zwróć dokładnie ten sam JSON bez zmian.
Jeśli są błędy — zwróć poprawiony JSON.
Odpowiedz WYŁĄCZNIE poprawnym JSON (bez tekstu przed ani po), zachowując dokładnie ten sam schemat.`;

  try {
    const raw = await askGemini(verifyPrompt, 3000);
    const jsonStr = extractJson(raw);
    const parsed = JSON.parse(jsonStr) as GeneratedOfferContent;

    if (
      typeof parsed.short_description !== "string" ||
      typeof parsed.full_description !== "string" ||
      !Array.isArray(parsed.pros) ||
      !Array.isArray(parsed.cons) ||
      !Array.isArray(parsed.faq)
    ) {
      console.warn("verifyOfferContent: invalid shape, using draft");
      return null;
    }

    return sanitize(parsed);
  } catch (err) {
    console.warn("verifyOfferContent failed, using draft:", err);
    return null;
  }
}
