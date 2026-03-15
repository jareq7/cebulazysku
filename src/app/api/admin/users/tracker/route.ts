// @author Claude Code (claude-opus-4-6) | 2026-03-15
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();

    // Get tracked offers with offer details
    const { data: tracked, error: trackedError } = await supabase
      .from("tracked_offers")
      .select("offer_id, started_at")
      .eq("user_id", userId);

    if (trackedError) throw trackedError;

    if (!tracked || tracked.length === 0) {
      return NextResponse.json({ offers: [] });
    }

    const offerIds = tracked.map((t) => t.offer_id);

    // Get offer details
    const { data: offers, error: offersError } = await supabase
      .from("offers")
      .select("id, bank_name, offer_name, reward, conditions, is_active")
      .in("id", offerIds);

    if (offersError) throw offersError;

    // Get condition progress
    const { data: progress, error: progressError } = await supabase
      .from("condition_progress")
      .select("offer_id, condition_id, month, count")
      .eq("user_id", userId)
      .in("offer_id", offerIds);

    if (progressError) throw progressError;

    // Combine data
    const result = (offers || []).map((offer) => {
      const track = tracked.find((t) => t.offer_id === offer.id);
      const offerProgress = (progress || []).filter((p) => p.offer_id === offer.id);
      return {
        ...offer,
        started_at: track?.started_at,
        progress: offerProgress,
      };
    });

    return NextResponse.json({ offers: result });
  } catch (err) {
    console.error("Admin user tracker error:", err);
    return NextResponse.json({ error: "Failed to load tracker" }, { status: 500 });
  }
}
