// @author Claude Code (claude-opus-4-6) | 2026-03-14

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const filter = searchParams.get("filter") || "all"; // all | corrections | errors
    const offset = (page - 1) * limit;

    const supabase = createAdminClient();

    // Build query
    let query = supabase
      .from("ai_verification_logs")
      .select("*", { count: "exact" });

    if (filter === "corrections") {
      query = query.not("corrections", "eq", "{}");
    } else if (filter === "errors") {
      query = query.eq("verified", false);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Stats
    const { count: totalCount } = await supabase
      .from("ai_verification_logs")
      .select("*", { count: "exact", head: true });

    const { count: correctionsCount } = await supabase
      .from("ai_verification_logs")
      .select("*", { count: "exact", head: true })
      .not("corrections", "eq", "{}");

    const { count: errorsCount } = await supabase
      .from("ai_verification_logs")
      .select("*", { count: "exact", head: true })
      .eq("verified", false);

    return NextResponse.json({
      logs: data || [],
      total: count || 0,
      page,
      limit,
      stats: {
        total_verifications: totalCount || 0,
        with_corrections: correctionsCount || 0,
        with_corrections_pct: totalCount ? Math.round(((correctionsCount || 0) / totalCount) * 100) : 0,
        errors: errorsCount || 0,
      },
    });
  } catch (err) {
    console.error("Admin ai-logs GET error:", err);
    return NextResponse.json({ error: "Failed to load AI logs" }, { status: 500 });
  }
}
