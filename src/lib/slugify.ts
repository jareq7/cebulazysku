// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-29
// Shared Polish text → slug normalization

/**
 * Convert Polish text to URL-safe slug.
 * Normalizes Polish diacritics, removes "bank " prefix and " s.a." suffix,
 * replaces non-alphanumeric chars with hyphens.
 */
export function polishSlugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+s\.a\.?$/i, "")
    .replace(/^bank\s+/i, "")
    .replace(/ś/g, "s")
    .replace(/ł/g, "l")
    .replace(/ó/g, "o")
    .replace(/ż/g, "z")
    .replace(/ź/g, "z")
    .replace(/ą/g, "a")
    .replace(/ę/g, "e")
    .replace(/ć/g, "c")
    .replace(/ń/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
