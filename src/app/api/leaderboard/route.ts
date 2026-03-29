// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-29
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface LeaderboardEntry {
  rank: number;
  nickname: string;
  totalEarned: number;
  offersCompleted: number;
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Get all users who received payouts, aggregated
    const { data, error } = await supabase
      .from("tracked_offers")
      .select("user_id, payout_amount")
      .not("payout_received_at", "is", null)
      .not("payout_amount", "is", null);

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

    // Try to get nicknames from profiles
    const userIds = Array.from(userMap.keys());
    let nicknames = new Map<string, string>();
    try {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds);
      if (profiles) {
        for (const p of profiles) {
          if (p.display_name) {
            nicknames.set(p.id, p.display_name);
          }
        }
      }
    } catch {
      // profiles table might not exist — that's fine, use anonymous names
    }

    // Sort by total earned and take top 10
    const sorted = Array.from(userMap.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 10);

    const entries: LeaderboardEntry[] = sorted.map(([userId, stats], i) => ({
      rank: i + 1,
      nickname: nicknames.get(userId) || `Cebularz #${i + 1}`,
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
