import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateOfferContent } from "@/lib/generate-offer-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Hobby plan: 1 cron/dzień, 60s limit → 3 oferty bez double-checka (~15s każda)
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

  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";
  const limit = force ? 10 : MAX_PER_RUN;

  const start = Date.now();
  const supabase = createAdminClient();

  // Pobierz aktywne oferty z feedu LeadStar
  let query = supabase
    .from("offers")
    .select("id, bank_name, offer_name, reward, leadstar_description_html, leadstar_benefits_html, ai_generated_at")
    .eq("is_active", true)
    .not("leadstar_description_html", "is", null);

  if (force) {
    // Jeśli wymuszamy, bierzemy te najdawniej generowane lub wcale
    query = query.order("ai_generated_at", { ascending: true, nullsFirst: true });
  } else {
    // Standardowo tylko te które nie mają jeszcze opisu
    query = query.is("ai_generated_at", null).order("first_seen_at", { ascending: true });
  }

  const { data: offers, error } = await query.limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!offers || offers.length === 0) {
    return NextResponse.json({
      success: true,
      message: "Wszystkie oferty mają już aktualne opisy.",
      generated: 0,
      duration_ms: Date.now() - start,
    });
  }

  let generated = 0;
  let failed = 0;
  const details: { bank: string; status: "ok" | "failed"; error?: string }[] = [];

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
        details.push({ bank: offer.bank_name, status: "failed", error: "AI returned null" });
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
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`generateOfferContent exception for ${offer.id}:`, errMsg);
      failed++;
      details.push({ bank: offer.bank_name, status: "failed", error: errMsg });
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
    providers: {
      gemini: !!process.env.GEMINI_API_KEY,
      openrouter: !!process.env.OPENROUTER_API_KEY,
    },
    details,
  });
}

// Endpoint dostępny też z panelu admina (POST)
export async function POST(request: NextRequest) {
  return GET(request);
}
