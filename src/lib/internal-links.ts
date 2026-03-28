// @author Claude Code (claude-opus-4-6) | 2026-03-26
// Internal linking engine — auto-links bank names and glossary terms in text content

const BANK_LINKS: { pattern: RegExp; slug: string }[] = [
  { pattern: /\bmBank\b/g, slug: "mbank" },
  { pattern: /\bING(?:\s+Bank(?:\s+Śląski)?)?\b/g, slug: "ing" },
  { pattern: /\bBNP\s+Paribas\b/gi, slug: "bnp-paribas" },
  { pattern: /\bSantander\b/gi, slug: "santander" },
  { pattern: /\bPKO\s+BP\b/gi, slug: "pko-bp" },
  { pattern: /\bPekao(?:\s+S\.A\.?)?\b/gi, slug: "pekao" },
  { pattern: /\bMillennium\b/gi, slug: "millennium" },
  { pattern: /\bVeloBank\b/gi, slug: "velobank" },
  { pattern: /\bAlior(?:\s+Bank)?\b/gi, slug: "alior" },
  { pattern: /\bCredit\s+Agricole\b/gi, slug: "credit-agricole" },
  { pattern: /\bCiti\s*(?:Handlowy|bank)?\b/gi, slug: "citi-handlowy" },
  { pattern: /\bNest\s+Bank\b/gi, slug: "nest-bank" },
];

const GLOSSARY_TERMS: { pattern: RegExp; anchor: string }[] = [
  { pattern: /\bBIK\b/g, anchor: "bik" },
  { pattern: /\bBFG\b/g, anchor: "bfg" },
  { pattern: /\bMCC\b/g, anchor: "mcc" },
  { pattern: /\bkarencj[ięaą]\b/gi, anchor: "karencja" },
  { pattern: /\bsprzedaż(?:y|ą)?\s+premiow(?:a|ej|ą)\b/gi, anchor: "sprzedaz-premiowa" },
  { pattern: /\blimit(?:u|em)?\s+debetow(?:y|ego|ym)\b/gi, anchor: "limit-debetowy" },
  { pattern: /\brotacj[ięaą]\s+bankow(?:a|ej|ą)\b/gi, anchor: "rotacja-bankowa" },
  { pattern: /\bBLIK\s+P2P\b/gi, anchor: "blik-p2p" },
  { pattern: /\bkart[ęyą]\s+wirtualn(?:a|ej|ą)\b/gi, anchor: "karta-wirtualna" },
  { pattern: /\bROR\b/g, anchor: "ror" },
];

/**
 * Auto-links bank names and glossary terms in plain text.
 * Returns text with markdown-style links [text](/url).
 *
 * Rules:
 * - Each bank/term is linked only ONCE (first occurrence)
 * - Text already inside [...] or (...) is not linked
 * - Short paragraphs (< 50 chars) are skipped
 */
export function autoLinkContent(text: string): string {
  if (!text || text.length < 50) return text;

  const linked = new Set<string>();

  // Process each paragraph separately
  const paragraphs = text.split("\n\n");
  const result = paragraphs.map((para) => {
    // Skip headings and very short lines
    if (para.trim().startsWith("#") || para.trim().length < 30) return para;

    let processed = para;

    // Link bank names (first occurrence only)
    for (const { pattern, slug } of BANK_LINKS) {
      if (linked.has(slug)) continue;
      const fresh = new RegExp(pattern.source, pattern.flags);
      const match = fresh.exec(processed);
      if (match) {
        // Don't link if already inside markdown link syntax
        const before = processed.slice(Math.max(0, match.index - 2), match.index);
        if (before.includes("[") || before.includes("(")) continue;

        processed =
          processed.slice(0, match.index) +
          `[${match[0]}](/bank/${slug})` +
          processed.slice(match.index + match[0].length);
        linked.add(slug);
      }
    }

    // Link glossary terms (first occurrence only)
    for (const { pattern, anchor } of GLOSSARY_TERMS) {
      if (linked.has(anchor)) continue;
      const fresh = new RegExp(pattern.source, pattern.flags);
      const match = fresh.exec(processed);
      if (match) {
        const before = processed.slice(Math.max(0, match.index - 2), match.index);
        if (before.includes("[") || before.includes("(")) continue;

        processed =
          processed.slice(0, match.index) +
          `[${match[0]}](/slownik#${anchor})` +
          processed.slice(match.index + match[0].length);
        linked.add(anchor);
      }
    }

    return processed;
  });

  return result.join("\n\n");
}
