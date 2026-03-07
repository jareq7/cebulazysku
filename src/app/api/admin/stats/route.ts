import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const [offersRes, activeRes, syncRes, messagesRes] = await Promise.all([
      supabase.from("offers").select("id", { count: "exact", head: true }),
      supabase
        .from("offers")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("sync_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
    ]);

    const lastSync = syncRes.data?.[0] || null;

    return NextResponse.json({
      totalOffers: offersRes.count || 0,
      activeOffers: activeRes.count || 0,
      unreadMessages: messagesRes.count || 0,
      lastSync: lastSync
        ? {
            created_at: lastSync.created_at,
            offers_found: lastSync.offers_found,
            offers_created: lastSync.offers_created,
            offers_updated: lastSync.offers_updated,
            offers_deactivated: lastSync.offers_deactivated,
            duration_ms: lastSync.duration_ms,
            errors: lastSync.errors?.length || 0,
          }
        : null,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    );
  }
}
