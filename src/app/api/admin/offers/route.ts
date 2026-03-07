import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("offers")
      .select(
        "id, slug, bank_name, offer_name, short_description, full_description, reward, difficulty, source, is_active, leadstar_id, affiliate_url, leadstar_description_html, leadstar_benefits_html, updated_at"
      )
      .order("bank_name", { ascending: true });

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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const allowedFields = [
      "short_description",
      "full_description",
      "reward",
      "difficulty",
      "is_active",
      "featured",
      "monthly_fee",
      "free_if",
      "deadline",
    ];

    const safeUpdates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in updates) {
        safeUpdates[key] = updates[key];
      }
    }

    safeUpdates.updated_at = new Date().toISOString();

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("offers")
      .update(safeUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ offer: data });
  } catch (err) {
    console.error("Admin offers PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update offer" },
      { status: 500 }
    );
  }
}
