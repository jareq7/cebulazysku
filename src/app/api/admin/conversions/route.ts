// @author Claude Code (claude-opus-4-6) | 2026-03-17
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/admin-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");
  const since = new Date(Date.now() - days * 86400000).toISOString();

  try {
    // Total clicks in period
    const { count: totalClicks } = await supabase
      .from("affiliate_clicks")
      .select("*", { count: "exact", head: true })
      .gte("clicked_at", since);

    // Clicks per day (last N days)
    const { data: dailyRaw } = await supabase
      .from("affiliate_clicks")
      .select("clicked_at")
      .gte("clicked_at", since)
      .order("clicked_at", { ascending: true });

    const dailyClicks: Record<string, number> = {};
    (dailyRaw || []).forEach((row) => {
      const day = row.clicked_at.slice(0, 10);
      dailyClicks[day] = (dailyClicks[day] || 0) + 1;
    });

    // Fill missing days with 0
    const daily: { date: string; clicks: number }[] = [];
    const d = new Date(since);
    const today = new Date();
    while (d <= today) {
      const key = d.toISOString().slice(0, 10);
      daily.push({ date: key, clicks: dailyClicks[key] || 0 });
      d.setDate(d.getDate() + 1);
    }

    // Top offers by clicks
    const { data: clicksByOffer } = await supabase
      .from("affiliate_clicks")
      .select("offer_id")
      .gte("clicked_at", since);

    const offerCounts: Record<string, number> = {};
    (clicksByOffer || []).forEach((row) => {
      offerCounts[row.offer_id] = (offerCounts[row.offer_id] || 0) + 1;
    });

    const topOffers = Object.entries(offerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([offer_id, clicks]) => ({ offer_id, clicks }));

    // UTM source breakdown
    const { data: utmRaw } = await supabase
      .from("affiliate_clicks")
      .select("utm_source")
      .gte("clicked_at", since);

    const utmCounts: Record<string, number> = {};
    (utmRaw || []).forEach((row) => {
      const src = row.utm_source || "direct";
      utmCounts[src] = (utmCounts[src] || 0) + 1;
    });

    const utmSources = Object.entries(utmCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([source, clicks]) => ({ source, clicks }));

    return NextResponse.json({
      totalClicks: totalClicks || 0,
      daily,
      topOffers,
      utmSources,
      period: days,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
