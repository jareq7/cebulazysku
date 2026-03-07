import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("offers")
      .select(
        "id, slug, bank_name, offer_name, source, is_active, leadstar_id, affiliate_url, updated_at"
      )
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ offers: data || [] });
  } catch (err) {
    console.error("Admin offers error:", err);
    return NextResponse.json(
      { error: "Failed to load offers" },
      { status: 500 }
    );
  }
}
