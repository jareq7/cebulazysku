// @author Claude Code (claude-opus-4-6) | 2026-03-18
// Affiliate routing: pick the best network link for an offer

interface AffiliateSource {
  network: string;
  affiliate_url: string | null;
  is_preferred: boolean;
}

/**
 * Given an offer's default affiliate URL and its affiliate_sources,
 * return the best URL and the network it came from.
 *
 * Priority:
 * 1. is_preferred source with a URL
 * 2. LeadStar (original affiliate_url from offer)
 * 3. Any other source with a URL (Conversand, TradeDoubler, etc.)
 * 4. Fallback to offer's affiliate_url
 */
export function resolveAffiliateUrl(
  defaultUrl: string,
  sources: AffiliateSource[]
): { url: string; network: string } {
  // 1. Preferred source
  const preferred = sources.find((s) => s.is_preferred && s.affiliate_url);
  if (preferred) {
    return { url: preferred.affiliate_url!, network: preferred.network };
  }

  // 2. LeadStar (default URL from offer)
  if (defaultUrl && defaultUrl !== "#") {
    return { url: defaultUrl, network: "leadstar" };
  }

  // 3. Any source with a URL
  const withUrl = sources.find((s) => s.affiliate_url);
  if (withUrl) {
    return { url: withUrl.affiliate_url!, network: withUrl.network };
  }

  // 4. Fallback
  return { url: defaultUrl || "#", network: "unknown" };
}
