// @author Claude Code (claude-opus-4-6) | 2026-03-18
// Sync Conversand Financial PL offers → affiliate_sources + new offers

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllOffers, type ConversandOffer } from "@/lib/conversand";
import { matchBankName } from "@/lib/bank-name-matcher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  return false;
}

function generateConversandSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[ąá]/g, "a").replace(/[ćč]/g, "c").replace(/[ęé]/g, "e")
    .replace(/[łĺ]/g, "l").replace(/[ńñ]/g, "n").replace(/[óö]/g, "o")
    .replace(/[śš]/g, "s").replace(/[źżž]/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

// Default bank logos for known banks (Conversand doesn't provide logos)
const BANK_LOGOS: Record<string, string> = {
  alior: "https://img.leadmax.pl/bank-alior.png",
  bnp: "https://img.leadmax.pl/bank-bnp-paribas.png",
  mbank: "https://img.leadmax.pl/bank-mbank.png",
  pekao: "https://img.leadmax.pl/bank-pekao.png",
  millennium: "https://img.leadmax.pl/bank-millennium.png",
  ing: "https://img.leadmax.pl/bank-ing.png",
  santander: "https://img.leadmax.pl/bank-santander.png",
  pkobp: "https://img.leadmax.pl/bank-pko-bp.png",
  velobank: "https://img.leadmax.pl/bank-velobank.png",
  citi: "https://img.leadmax.pl/bank-citi.png",
};

function guessBankLogo(conversandName: string): string | null {
  const lower = conversandName.toLowerCase();
  for (const [key, url] of Object.entries(BANK_LOGOS)) {
    if (lower.includes(key)) return url;
  }
  return null;
}

async function runConversandSync() {
  const start = Date.now();
  const supabase = createAdminClient();

  // 1. Fetch all Conversand Financial PL offers
  let conversandOffers: ConversandOffer[];
  try {
    conversandOffers = await getAllOffers();
  } catch (err) {
    throw new Error(`Failed to fetch Conversand offers: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (conversandOffers.length === 0) {
    return { success: true, message: "No Conversand offers found", duration_ms: Date.now() - start };
  }

  // 2. Get all existing DB offers for matching
  const { data: dbOffers, error: dbError } = await supabase
    .from("offers")
    .select("id, bank_name, slug, source, is_active")
    .eq("is_active", true);

  if (dbError) throw new Error(`DB query failed: ${dbError.message}`);

  const matchableOffers = (dbOffers || []).map((o) => ({
    id: o.id,
    bank_name: o.bank_name,
    slug: o.slug,
  }));

  let matched = 0;
  let newCreated = 0;
  let skipped = 0;
  const errors: string[] = [];
  const results: { name: string; action: string; offerId?: string }[] = [];

  for (const conv of conversandOffers) {
    try {
      // 3. Try to match to existing DB offer
      const dbMatch = matchBankName(conv.name, matchableOffers);

      if (dbMatch) {
        // 4a. Matched — upsert affiliate_sources row
        const { error: upsertError } = await supabase
          .from("affiliate_sources")
          .upsert(
            {
              offer_id: dbMatch.id,
              network: "conversand",
              commission_amount: conv.payout || null,
              commission_type: conv.payout_type === "CPS" ? "percentage" : "fixed",
              commission_currency: conv.currency || "PLN",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "offer_id,network" }
          );

        if (upsertError) {
          errors.push(`affiliate_sources upsert for ${conv.name}: ${upsertError.message}`);
        } else {
          matched++;
          results.push({ name: conv.name, action: "matched", offerId: dbMatch.id });
        }
      } else {
        // 4b. Not matched — create new offer with source=conversand, has_user_reward=false
        const slug = generateConversandSlug(conv.name);
        const offerId = `conv-${conv.id}`;

        // Check if we already created this Conversand offer before
        const { data: existing } = await supabase
          .from("offers")
          .select("id")
          .eq("id", offerId)
          .single();

        if (existing) {
          // Already exists — just update affiliate_sources
          const { error: upsertError } = await supabase
            .from("affiliate_sources")
            .upsert(
              {
                offer_id: offerId,
                network: "conversand",
                commission_amount: conv.payout || null,
                commission_type: conv.payout_type === "CPS" ? "percentage" : "fixed",
                commission_currency: conv.currency || "PLN",
                updated_at: new Date().toISOString(),
              },
              { onConflict: "offer_id,network" }
            );
          if (upsertError) errors.push(`affiliate_sources update for ${conv.name}: ${upsertError.message}`);
          skipped++;
          results.push({ name: conv.name, action: "already_exists", offerId });
          continue;
        }

        const bankLogo = guessBankLogo(conv.name);

        const { error: insertError } = await supabase.from("offers").insert({
          id: offerId,
          slug,
          bank_name: conv.name,
          bank_logo: bankLogo,
          offer_name: conv.name,
          short_description: conv.description || conv.name,
          source: "conversand",
          has_user_reward: false,
          reward: 0,
          is_active: true,
          conditions: [],
          locked_fields: [],
          quality_flags: { reward_zero: true, conversand_only: true },
          first_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          errors.push(`Insert offer ${conv.name}: ${insertError.message}`);
        } else {
          // Also create affiliate_sources row
          await supabase.from("affiliate_sources").insert({
            offer_id: offerId,
            network: "conversand",
            commission_amount: conv.payout || null,
            commission_type: conv.payout_type === "CPS" ? "percentage" : "fixed",
            commission_currency: conv.currency || "PLN",
          });

          newCreated++;
          results.push({ name: conv.name, action: "created", offerId });
        }
      }
    } catch (err) {
      errors.push(`Processing ${conv.name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const duration = Date.now() - start;

  // Log sync results
  console.log(`[sync-conversand] Done in ${duration}ms: ${matched} matched, ${newCreated} new, ${skipped} skipped, ${errors.length} errors`);
  for (const r of results) {
    console.log(`  ${r.action}: ${r.name} → ${r.offerId || "—"}`);
  }

  return {
    success: true,
    conversand_offers: conversandOffers.length,
    matched,
    new_created: newCreated,
    skipped,
    errors: errors.length,
    error_details: errors.length > 0 ? errors : undefined,
    duration_ms: duration,
  };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runConversandSync();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[sync-conversand] Failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runConversandSync();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[sync-conversand] Failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
