import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  try {
    const supabase = createAdminClient();

    // Get summary stats
    const { data: summary, error: summaryError } = await supabase.rpc(
      "admin_get_user_summary"
    );

    if (summaryError) throw summaryError;

    // Get users with tracked offers stats
    const { data: users, error: usersError } = await supabase.rpc(
      "admin_get_users_with_stats"
    );

    if (usersError) throw usersError;

    return NextResponse.json({
      summary: summary?.[0] || {
        total_users: 0,
        new_last_7_days: 0,
        new_last_30_days: 0,
        users_tracking: 0,
        total_tracked_offers: 0,
      },
      users: users || [],
    });
  } catch (err) {
    console.error("Admin users error:", err);
    return NextResponse.json(
      { error: "Failed to load user stats" },
      { status: 500 }
    );
  }
}
