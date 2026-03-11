import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";
import { parseRewardFromDescription } from "@/lib/parse-reward";
import { scrapeOfferPage } from "@/lib/scrape-offer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Przetwarza max N ofert z reward=0 przez Gemini AI + scraping
// Wywoływany ręcznie z panelu admina, osobno od sync feedu
const MAX_PER_RUN = 8;

export async function POST(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  const hasGemini = !!process.env.GEMINI_API_KEY;
  if (!hasGemini) {
    return NextResponse.json({ error: "GEMINI_API_KEY nie jest ustawiony." }, { status: 400 });
  }

  const start = Date.now();
  const supabase = createAdminClient();

  // Pobierz oferty z reward=0, max MAX_PER_RUN
  const { data: offers, error } = await supabase
    .from("offers")
    .select("id, bank_name, offer_name, leadstar_description_html, leadstar_benefits_html, affiliate_url, quality_flags, locked_fields")
    .eq("is_active", true)
    .or("reward.eq.0,reward.is.null")
    .limit(MAX_PER_RUN);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!offers || offers.length === 0) {
    return NextResponse.json({ success: true, message: "Wszystkie aktywne oferty mają już uzupełnione kwoty.", processed: 0 });
  }

  let enriched = 0;
  let scraped = 0;
  let failed = 0;
  const details: { bank: string; reward: number | null; method: string }[] = [];

  for (const offer of offers) {
    const lockedFields: string[] = offer.locked_fields || [];
    if (lockedFields.includes("reward")) continue;

    let reward: number | null = null;
    let method = "none";

    // 1. Próba Gemini z opisu w feedzie
    if (offer.leadstar_description_html || offer.leadstar_benefits_html) {
      try {
        reward = await parseRewardFromDescription(
          offer.offer_name || "",
          offer.leadstar_description_html || "",
          offer.leadstar_benefits_html || ""
        );
        if (reward !== null && reward > 0) method = "gemini_feed";
        // Rate limit: 4s między wywołaniami
        await new Promise((r) => setTimeout(r, 4000));
      } catch {
        // kontynuuj do scrapingu
      }
    }

    // 2. Scraping strony banku jeśli Gemini nie znalazł
    if ((reward === null || reward === 0) && offer.affiliate_url) {
      try {
        const scrapeResult = await scrapeOfferPage(offer.affiliate_url);
        if (scrapeResult && scrapeResult.reward !== null && scrapeResult.reward > 0) {
          reward = scrapeResult.reward;
          method = "scrape";
          scraped++;
        }
      } catch {
        // nie udało się
      }
    }

    const newFlags = {
      ...(offer.quality_flags || {}),
      reward_zero: reward === null || reward === 0,
      scraped_from_page: method === "scrape",
      scrape_failed: method === "none",
      last_scraped_at: new Date().toISOString(),
    };

    if (reward !== null && reward > 0) {
      await supabase
        .from("offers")
        .update({ reward, quality_flags: newFlags, updated_at: new Date().toISOString() })
        .eq("id", offer.id);
      enriched++;
    } else {
      await supabase
        .from("offers")
        .update({ quality_flags: newFlags })
        .eq("id", offer.id);
      failed++;
    }

    details.push({ bank: offer.bank_name, reward, method });
  }

  return NextResponse.json({
    success: true,
    processed: offers.length,
    enriched,
    scraped,
    failed,
    remaining: offers.length === MAX_PER_RUN ? "możliwe że są jeszcze oferty — uruchom ponownie" : "brak",
    duration_ms: Date.now() - start,
    details,
  });
}
