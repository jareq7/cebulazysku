// @author Claude Code (claude-opus-4-6) | 2026-03-26
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  const supabase = createAdminClient();
  const format = request.nextUrl.searchParams.get("format");

  // Stats
  const { count: totalCount } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true });

  const { count: activeCount } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  const { count: pendingCount } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: unsubscribedCount } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true })
    .eq("status", "unsubscribed");

  // Recent subscribers
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, name, status, source, subscribed_at, unsubscribed_at, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (format === "csv") {
    const header = "email,name,status,source,subscribed_at,unsubscribed_at,created_at";
    const rows = (subscribers || []).map(
      (s) =>
        `${s.email},${s.name || ""},${s.status},${s.source || ""},${s.subscribed_at || ""},${s.unsubscribed_at || ""},${s.created_at}`
    );
    const csv = [header, ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({
    stats: {
      total: totalCount || 0,
      active: activeCount || 0,
      pending: pendingCount || 0,
      unsubscribed: unsubscribedCount || 0,
    },
    subscribers: subscribers || [],
  });
}
