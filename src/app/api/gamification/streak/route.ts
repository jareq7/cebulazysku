import { NextResponse } from "next/server";
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

    const { data: streak } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({
      streak: streak || {
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null,
      },
    });
  } catch (err) {
    console.error("Streak GET error:", err);
    return NextResponse.json(
      { error: "Failed to get streak" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split("T")[0];

    // Get existing streak
    const { data: existing } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!existing) {
      // First activity ever
      const { data, error } = await supabase
        .from("user_streaks")
        .insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: today,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ streak: data, newStreak: true });
    }

    // Already logged today
    if (existing.last_activity_date === today) {
      return NextResponse.json({ streak: existing, newStreak: false });
    }

    // Check if yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newCurrent: number;
    if (existing.last_activity_date === yesterdayStr) {
      // Continue streak
      newCurrent = existing.current_streak + 1;
    } else {
      // Streak broken, start fresh
      newCurrent = 1;
    }

    const newLongest = Math.max(existing.longest_streak, newCurrent);

    const { data, error } = await supabase
      .from("user_streaks")
      .update({
        current_streak: newCurrent,
        longest_streak: newLongest,
        last_activity_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ streak: data, newStreak: true });
  } catch (err) {
    console.error("Streak POST error:", err);
    return NextResponse.json(
      { error: "Failed to update streak" },
      { status: 500 }
    );
  }
}
