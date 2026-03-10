import { NextRequest, NextResponse } from "next/server";
import { fetchLeadStarOffers } from "@/lib/leadstar";
import { parseRewardFromDescription } from "@/lib/parse-reward";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not set" },
      { status: 500 }
    );
  }

  try {
    const supabase = createAdminClient();
    const leadstarOffers = await fetchLeadStarOffers();

    const results = [];

    for (const ls of leadstarOffers) {
      const parsed = await parseRewardFromDescription(
        ls.programName || ls.product,
        ls.description || "",
        ls.benefits || ""
      );

      // Get current reward from DB
      const { data: existing } = await supabase
        .from("offers")
        .select("reward")
        .eq("leadstar_id", ls.id)
        .single();

      const currentReward = existing?.reward ?? 0;
      const match = parsed === currentReward;

      results.push({
        leadstar_id: ls.id,
        bank: ls.institution,
        program: ls.programName?.slice(0, 60),
        ai_parsed: parsed,
        db_current: currentReward,
        match: match ? "✅" : "❌",
        diff: match ? 0 : (parsed ?? 0) - currentReward,
      });
    }

    const mismatches = results.filter((r) => r.match === "❌");

    return NextResponse.json({
      total: results.length,
      matches: results.length - mismatches.length,
      mismatches: mismatches.length,
      results,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
