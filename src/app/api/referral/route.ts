import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Generate a short unique code from user ID
function generateCode(userId: string): string {
  // Take first 8 chars of UUID and make it uppercase
  return userId.replace(/-/g, "").slice(0, 8).toUpperCase();
}

// GET — get my referral code (creates one if doesn't exist)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();

    // Check if code already exists
    const { data: existing } = await admin
      .from("user_referrals")
      .select("code")
      .eq("referrer_id", user.id)
      .is("referred_id", null)
      .limit(1)
      .single();

    if (existing) {
      return NextResponse.json({ code: existing.code });
    }

    // Create new code
    const code = generateCode(user.id);
    await admin.from("user_referrals").insert({
      referrer_id: user.id,
      code,
    });

    return NextResponse.json({ code });
  } catch (err) {
    console.error("referral GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST — register referral (called during registration with ?ref=CODE)
export async function POST(request: NextRequest) {
  try {
    const { code, newUserId } = await request.json();
    if (!code || !newUserId) {
      return NextResponse.json({ error: "Missing code or newUserId" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Find the referral row for this code (unregistered slot)
    const { data: referral } = await admin
      .from("user_referrals")
      .select("id, referrer_id")
      .eq("code", code)
      .is("referred_id", null)
      .single();

    if (!referral) {
      return NextResponse.json({ error: "Invalid or used code" }, { status: 404 });
    }

    // Don't allow self-referral
    if (referral.referrer_id === newUserId) {
      return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
    }

    await admin
      .from("user_referrals")
      .update({ referred_id: newUserId, registered_at: new Date().toISOString() })
      .eq("id", referral.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("referral POST error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
