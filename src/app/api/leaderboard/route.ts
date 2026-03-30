// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-29
// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-30 — W9 fix: auth, monthly filter, remove dead code, shared type
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LeaderboardEntry } from "@/data/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Auth check — only logged-in users can see the leaderboard (GDPR)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // Current month boundaries (UTC)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

    // Get payouts received this month only
    const { data, error } = await admin
      .from("tracked_offers")
      .select("user_id, payout_amount")
      .not("payout_received_at", "is", null)
      .not("payout_amount", "is", null)
      .gte("payout_received_at", monthStart)
      .lte("payout_received_at", monthEnd);

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({ entries: [], month: getCurrentMonth() });
    }

    // Aggregate per user
    const userMap = new Map<string, { total: number; count: number }>();
    for (const row of data) {
      const existing = userMap.get(row.user_id);
      if (existing) {
        existing.total += row.payout_amount || 0;
        existing.count++;
      } else {
        userMap.set(row.user_id, {
          total: row.payout_amount || 0,
          count: 1,
        });
      }
    }

    // Sort by total earned and take top 10
    const sorted = Array.from(userMap.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 10);

    const entries: LeaderboardEntry[] = sorted.map(([, stats], i) => ({
      rank: i + 1,
      nickname: `Cebularz #${i + 1}`,
      totalEarned: stats.total,
      offersCompleted: stats.count,
    }));

    return NextResponse.json({
      entries,
      month: getCurrentMonth(),
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ entries: [], month: getCurrentMonth() });
  }
}

function getCurrentMonth(): string {
  return new Date().toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
  });
}
