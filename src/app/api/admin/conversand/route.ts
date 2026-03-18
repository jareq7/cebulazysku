// @author Claude Code (claude-opus-4-6) | 2026-03-18
// Admin Conversand API — proxies Conversand API + local stats

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllOffers, getBalance, getStatistics } from "@/lib/conversand";
import { matchBankName } from "@/lib/bank-name-matcher";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "overview";

  try {
    const supabase = createAdminClient();

    if (action === "overview") {
      // Fetch balance, offer count, and recent stats in parallel
      const [balance, conversandOffers, dbOffersResult, affiliateSourcesResult] = await Promise.all([
        getBalance().catch(() => ({ balance: 0, currency: "PLN", threshold: 0 })),
        getAllOffers().catch(() => []),
        supabase.from("offers").select("id, bank_name, slug, source").eq("is_active", true),
        supabase.from("affiliate_sources").select("offer_id, network, commission_amount, commission_type, affiliate_url, is_preferred").eq("network", "conversand"),
      ]);

      const dbOffers = dbOffersResult.data || [];
      const affiliateSources = affiliateSourcesResult.data || [];

      // Match Conversand offers to DB
      const matchableOffers = dbOffers.map((o) => ({ id: o.id, bank_name: o.bank_name, slug: o.slug }));
      const offerStatuses = conversandOffers.map((conv) => {
        const dbMatch = matchBankName(conv.name, matchableOffers);
        const source = affiliateSources.find((s) => s.offer_id === dbMatch?.id);
        return {
          id: conv.id,
          name: conv.name,
          payout: conv.payout,
          payout_type: conv.payout_type,
          currency: conv.currency,
          matched: !!dbMatch,
          matchedOfferId: dbMatch?.id || null,
          matchedSlug: dbMatch?.slug || null,
          hasAffiliateUrl: !!source?.affiliate_url,
          isPreferred: source?.is_preferred || false,
        };
      });

      return NextResponse.json({
        balance,
        conversandOfferCount: conversandOffers.length,
        matchedCount: offerStatuses.filter((o) => o.matched).length,
        unmatchedCount: offerStatuses.filter((o) => !o.matched).length,
        withUrlCount: offerStatuses.filter((o) => o.hasAffiliateUrl).length,
        offers: offerStatuses,
      });
    }

    if (action === "stats") {
      const dateStart = searchParams.get("date_start") || new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
      const dateStop = searchParams.get("date_stop") || new Date().toISOString().split("T")[0];

      const stats = await getStatistics(dateStart, dateStop);
      return NextResponse.json({ stats, dateStart, dateStop });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
