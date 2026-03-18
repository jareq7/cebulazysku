// @author Claude Code (claude-opus-4-6) | 2026-03-18
// Fuzzy bank name matching between Conversand offers and DB offers

// Static mapping: Conversand patterns → normalized bank keys
const BANK_ALIASES: Record<string, string[]> = {
  "alior": ["alior", "alior bank"],
  "bnp": ["bnp", "bnp paribas", "bank bnp"],
  "mbank": ["mbank", "m bank"],
  "pekao": ["pekao", "bank pekao"],
  "millennium": ["millennium", "bank millennium"],
  "ing": ["ing", "ing bank"],
  "santander": ["santander", "bank santander"],
  "pkobp": ["pko", "pko bp", "pkobp", "powszechna kasa"],
  "velobank": ["velo", "velobank", "velo bank"],
  "citi": ["citi", "citibank", "citi handlowy", "bank handlowy"],
  "credit-agricole": ["credit agricole", "crédit agricole"],
  "nest": ["nest", "nest bank"],
  "toyota": ["toyota", "toyota bank"],
  "bnp-go": ["bnp go", "go online"],
};

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-ząćęłńóśźż0-9\s]/g, " ")
    .replace(/\b(s\.?a\.?|bank|konto|osobiste|promocja|w promocji|otworzyć|otwarte|na ciebie)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenOverlap(a: string, b: string): number {
  const tokensA = new Set(a.split(" ").filter(Boolean));
  const tokensB = new Set(b.split(" ").filter(Boolean));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let overlap = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) overlap++;
  }
  return overlap / Math.max(tokensA.size, tokensB.size);
}

interface DbOffer {
  id: string;
  bank_name: string;
  slug: string;
}

/**
 * Match a Conversand offer name to an existing DB offer.
 * Returns the matched offer or null.
 */
export function matchBankName(
  conversandName: string,
  dbOffers: DbOffer[]
): DbOffer | null {
  const normalized = normalize(conversandName);

  // 1. Try static aliases
  for (const [key, aliases] of Object.entries(BANK_ALIASES)) {
    const matchesConversand = aliases.some(
      (alias) => normalized.includes(alias)
    );
    if (!matchesConversand) continue;

    // Find DB offer matching this bank key
    const dbMatch = dbOffers.find((o) => {
      const dbNorm = normalize(o.bank_name);
      return aliases.some((alias) => dbNorm.includes(alias));
    });
    if (dbMatch) return dbMatch;
  }

  // 2. Fallback: token overlap > 0.5
  let bestMatch: DbOffer | null = null;
  let bestScore = 0;

  for (const offer of dbOffers) {
    const dbNorm = normalize(offer.bank_name);
    const score = tokenOverlap(normalized, dbNorm);
    if (score > bestScore && score > 0.5) {
      bestScore = score;
      bestMatch = offer;
    }
  }

  return bestMatch;
}
