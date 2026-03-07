import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("sync_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ logs: data || [] });
  } catch (err) {
    console.error("Admin sync logs error:", err);
    return NextResponse.json(
      { error: "Failed to load sync logs" },
      { status: 500 }
    );
  }
}
