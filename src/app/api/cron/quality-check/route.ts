import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { scrapeOfferPage } from "@/lib/scrape-offer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Ile ofert sprawdzamy na jedno wywołanie crona
// 5 × maks 12s timeout scrape = ~60s (limit Vercel)
const MAX_PER_RUN = 5;

// Minimalna różnica premii (PLN) uznawana za niezgodność
const MISMATCH_THRESHOLD = 50;

// Ile dni może minąć zanim oferta wymaga ponownego sprawdzenia
const RECHECK_DAYS = 7;

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  // Vercel sam wysyła nagłówek gdy to prawdziwy cron (środowisko produkcyjne)
  if (process.env.VERCEL_ENV === "production" && !cronSecret) return true;
  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hasGemini = !!process.env.GEMINI_API_KEY;
  if (!hasGemini) {
    return NextResponse.json({ error: "GEMINI_API_KEY nie jest ustawiony." }, { status: 400 });
  }

  const start = Date.now();
  const supabase = createAdminClient();

  // Pobierz oferty do sprawdzenia: najdawniej sprawdzane (lub nigdy) → aktywne z URL-em
  const recheckBefore = new Date(Date.now() - RECHECK_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data: offers, error } = await supabase
    .from("offers")
    .select("id, bank_name, offer_name, reward, affiliate_url, quality_flags, locked_fields")
    .eq("is_active", true)
    .not("affiliate_url", "is", null)
    .or(`quality_flags->last_checked_at.is.null,quality_flags->>last_checked_at.lt.${recheckBefore}`)
    .order("updated_at", { ascending: true })
    .limit(MAX_PER_RUN);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!offers || offers.length === 0) {
    return NextResponse.json({
      success: true,
      message: "Wszystkie aktywne oferty były sprawdzone w ciągu ostatnich 7 dni.",
      checked: 0,
      duration_ms: Date.now() - start,
    });
  }

  let checked = 0;
  let mismatches = 0;
  let unreachable = 0;
  const details: {
    bank: string;
    stored_reward: number;
    found_reward: number | null;
    mismatch: boolean;
    unreachable: boolean;
    final_url?: string;
  }[] = [];

  for (const offer of offers) {
    if (!offer.affiliate_url) continue;

    const existingFlags = offer.quality_flags || {};
    let newFlags: Record<string, unknown> = { ...existingFlags };

    try {
      const result = await scrapeOfferPage(offer.affiliate_url);

      if (!result) {
        // Całkowity błąd scrapingu (sieć, timeout itp.)
        newFlags = {
          ...newFlags,
          page_unreachable: true,
          reward_mismatch: false,
          last_checked_at: new Date().toISOString(),
        };
        unreachable++;
        details.push({
          bank: offer.bank_name,
          stored_reward: offer.reward,
          found_reward: null,
          mismatch: false,
          unreachable: true,
        });
      } else if (result.skipped) {
        // Strona JS-only — nie możemy ocenić
        newFlags = {
          ...newFlags,
          page_unreachable: false,
          page_js_only: true,
          last_checked_at: new Date().toISOString(),
        };
        details.push({
          bank: offer.bank_name,
          stored_reward: offer.reward,
          found_reward: null,
          mismatch: false,
          unreachable: false,
          final_url: result.finalUrl,
        });
      } else {
        // Mamy wynik scrapingu
        const foundReward = result.reward ?? 0;
        const storedReward = offer.reward ?? 0;
        const diff = Math.abs(foundReward - storedReward);
        const isMismatch = diff >= MISMATCH_THRESHOLD && foundReward > 0;

        newFlags = {
          ...newFlags,
          page_unreachable: false,
          page_js_only: false,
          reward_mismatch: isMismatch,
          checked_reward: foundReward,
          last_checked_at: new Date().toISOString(),
        };

        if (isMismatch) mismatches++;
        details.push({
          bank: offer.bank_name,
          stored_reward: storedReward,
          found_reward: foundReward,
          mismatch: isMismatch,
          unreachable: false,
          final_url: result.finalUrl,
        });
      }
    } catch {
      newFlags = {
        ...newFlags,
        page_unreachable: true,
        last_checked_at: new Date().toISOString(),
      };
      unreachable++;
      details.push({
        bank: offer.bank_name,
        stored_reward: offer.reward,
        found_reward: null,
        mismatch: false,
        unreachable: true,
      });
    }

    await supabase
      .from("offers")
      .update({ quality_flags: newFlags })
      .eq("id", offer.id);

    checked++;
  }

  const duration = Date.now() - start;

  // Zapisz wynik do tabeli sync_log jako wpis kontrolny (opcjonalne — reużywamy istniejącą strukturę)
  // Pomijamy — sync_log jest dla sync feedu, nie dla quality checks

  console.log(`[quality-check] checked=${checked} mismatches=${mismatches} unreachable=${unreachable} duration=${duration}ms`);

  return NextResponse.json({
    success: true,
    checked,
    mismatches,
    unreachable,
    duration_ms: duration,
    details,
  });
}
