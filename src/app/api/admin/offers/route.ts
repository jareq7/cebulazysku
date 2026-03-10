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

    const { data, error } = await supabase
      .from("offers")
      .select(
        "id, slug, bank_name, offer_name, short_description, full_description, reward, difficulty, source, is_active, leadstar_id, affiliate_url, leadstar_description_html, leadstar_benefits_html, banner_url, for_young, updated_at"
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
  const authError = verifyAdmin(request);
  if (authError) return authError;

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
      "banner_url",
      "for_young",
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
