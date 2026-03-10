import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code === "PGRST116") {
      // No row yet — return defaults
      return NextResponse.json({
        preferences: {
          email_new_offers: true,
          email_deadline_reminders: true,
          email_weekly_summary: false,
          push_new_offers: true,
          push_condition_reminders: true,
          push_streak_reminders: true,
          hide_young_offers: false,
        },
      });
    }

    if (error) throw error;

    return NextResponse.json({ preferences: data });
  } catch (err) {
    console.error("Notification preferences GET error:", err);
    return NextResponse.json(
      { error: "Failed to get preferences" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const allowedFields = [
      "email_new_offers",
      "email_deadline_reminders",
      "email_weekly_summary",
      "push_new_offers",
      "push_condition_reminders",
      "push_streak_reminders",
      "hide_young_offers",
    ];

    const updates: Record<string, unknown> = { user_id: user.id };
    for (const key of allowedFields) {
      if (key in body) {
        updates[key] = body[key];
      }
    }
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("notification_preferences")
      .upsert(updates, { onConflict: "user_id" })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ preferences: data });
  } catch (err) {
    console.error("Notification preferences PUT error:", err);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}
