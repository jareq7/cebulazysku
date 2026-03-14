import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";
import { parseLeadstarConditions } from "@/lib/parse-leadstar-conditions";

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
        "id, slug, bank_name, offer_name, reward, short_description, difficulty, is_active, source, affiliate_url, leadstar_id, leadstar_product_id, is_business, for_young, leadstar_description_html, leadstar_benefits_html, locked_fields, quality_flags, conditions, first_seen_at, updated_at, ai_generated_at"
      )
      .order("bank_name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ offers: data || [] });
  } catch (err) {
    console.error("Admin feed GET error:", err);
    return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, locked_fields, conditions, unlock_conditions, ...fieldUpdates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Pola które można edytować przez feed viewer
    const editableFields = [
      "bank_name",
      "offer_name",
      "reward",
      "short_description",
      "difficulty",
      "is_active",
    ];

    const safeUpdates: Record<string, unknown> = {};
    for (const key of editableFields) {
      if (key in fieldUpdates) {
        safeUpdates[key] = fieldUpdates[key];
      }
    }

    // locked_fields — lista pól chronionych przed sync
    if (Array.isArray(locked_fields)) {
      safeUpdates.locked_fields = locked_fields;
    }

    // Conditions — ręczna edycja warunków
    if (Array.isArray(conditions)) {
      safeUpdates.conditions = conditions;
      // Auto-lock conditions to prevent sync overwrite
      const { data: current } = await supabase
        .from("offers")
        .select("locked_fields")
        .eq("id", id)
        .single();
      const currentLocked: string[] = current?.locked_fields || [];
      if (!currentLocked.includes("conditions")) {
        safeUpdates.locked_fields = [...currentLocked, "conditions"];
      }
    }

    // Unlock conditions — remove lock and reparse from feed
    if (unlock_conditions) {
      const { data: current } = await supabase
        .from("offers")
        .select("locked_fields, leadstar_benefits_html")
        .eq("id", id)
        .single();
      const currentLocked: string[] = current?.locked_fields || [];
      safeUpdates.locked_fields = currentLocked.filter((f: string) => f !== "conditions");
      if (current?.leadstar_benefits_html) {
        safeUpdates.conditions = parseLeadstarConditions(current.leadstar_benefits_html);
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    safeUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("offers")
      .update(safeUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ offer: data });
  } catch (err) {
    console.error("Admin feed PATCH error:", err);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}
