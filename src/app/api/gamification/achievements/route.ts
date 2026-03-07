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
      .from("user_achievements")
      .select("achievement_type, unlocked_at")
      .eq("user_id", user.id)
      .order("unlocked_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ achievements: data || [] });
  } catch (err) {
    console.error("Achievements GET error:", err);
    return NextResponse.json(
      { error: "Failed to get achievements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { achievement_type } = await request.json();

    if (!achievement_type) {
      return NextResponse.json(
        { error: "achievement_type is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("user_achievements")
      .upsert(
        {
          user_id: user.id,
          achievement_type,
          unlocked_at: new Date().toISOString(),
        },
        { onConflict: "user_id,achievement_type" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ achievement: data });
  } catch (err) {
    console.error("Achievements POST error:", err);
    return NextResponse.json(
      { error: "Failed to unlock achievement" },
      { status: 500 }
    );
  }
}
