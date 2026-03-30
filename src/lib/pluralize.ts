// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-29
// Polish pluralization rules

/**
 * Polish pluralization: picks correct form based on count.
 * Rules:
 * - 1 → singular (e.g. "oferta")
 * - 2-4, 22-24, 32-34... → few (e.g. "oferty")
 * - 0, 5-21, 25-31... → many (e.g. "ofert")
 */
export function pluralize(
  count: number,
  singular: string,
  few: string,
  many: string
): string {
  const abs = Math.abs(count);
  if (abs === 1) return singular;

  const lastTwo = abs % 100;
  const lastOne = abs % 10;

  // 5-21 always "many"
  if (lastTwo >= 5 && lastTwo <= 21) return many;
  // 2-4 → "few"
  if (lastOne >= 2 && lastOne <= 4) return few;
  // everything else → "many"
  return many;
}
