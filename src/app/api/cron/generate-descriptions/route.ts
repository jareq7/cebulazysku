import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateOfferContent } from "@/lib/generate-offer-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// 3 oferty × ~15s (Gemini + 4s opóźnienie) = ~45s — bezpiecznie w limicie 60s Vercel
const MAX_PER_RUN = 3;

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (process.env.VERCEL_ENV === "production" && !cronSecret) return true;
  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY nie jest ustawiony." }, { status: 400 });
  }

  const start = Date.now();
  const supabase = createAdminClient();

  // Pobierz aktywne oferty z feedu LeadStar które nie mają jeszcze wygenerowanych opisów
  const { data: offers, error } = await supabase
    .from("offers")
    .select("id, bank_name, offer_name, reward, leadstar_description_html, leadstar_benefits_html")
    .eq("is_active", true)
    .is("ai_generated_at", null)
    .not("leadstar_description_html", "is", null)
    .order("first_seen_at", { ascending: true })
    .limit(MAX_PER_RUN);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!offers || offers.length === 0) {
    return NextResponse.json({
      success: true,
      message: "Wszystkie oferty mają już wygenerowane opisy.",
      generated: 0,
      duration_ms: Date.now() - start,
    });
  }

  let generated = 0;
  let failed = 0;
  const details: { bank: string; status: "ok" | "failed" }[] = [];

  for (const offer of offers) {
    try {
      const content = await generateOfferContent(
        offer.bank_name,
        offer.offer_name,
        offer.reward || 0,
        offer.leadstar_description_html || "",
        offer.leadstar_benefits_html || ""
      );

      if (!content) {
        failed++;
        details.push({ bank: offer.bank_name, status: "failed" });
        continue;
      }

      const { error: updateError } = await supabase
        .from("offers")
        .update({
          short_description: content.short_description,
          full_description: content.full_description,
          pros: content.pros,
          cons: content.cons,
          faq: content.faq,
          conditions: content.conditions,
          ai_generated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", offer.id);

      if (updateError) {
        console.error(`Failed to save generated content for ${offer.id}:`, updateError);
        failed++;
        details.push({ bank: offer.bank_name, status: "failed" });
        continue;
      }

      generated++;
      details.push({ bank: offer.bank_name, status: "ok" });
    } catch (err) {
      console.error(`generateOfferContent exception for ${offer.id}:`, err);
      failed++;
      details.push({ bank: offer.bank_name, status: "failed" });
    }

    // Przerwa między wywołaniami Gemini (rate limit: 15 req/min na darmowym planie)
    if (offers.indexOf(offer) < offers.length - 1) {
      await new Promise((r) => setTimeout(r, 4000));
    }
  }

  return NextResponse.json({
    success: true,
    generated,
    failed,
    duration_ms: Date.now() - start,
    details,
  });
}

// Endpoint dostępny też z panelu admina (POST)
export async function POST(request: NextRequest) {
  return GET(request);
}
