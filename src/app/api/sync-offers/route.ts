import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchLeadStarOffers, generateSlug, generateOfferId } from "@/lib/leadstar";
import { parseRewardFromDescription } from "@/lib/parse-reward";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const syncSecret = process.env.SYNC_SECRET;
  const cronSecret = process.env.CRON_SECRET;

  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;

  // Manual trigger via SYNC_SECRET
  if (syncSecret && authHeader === `Bearer ${syncSecret}`) return true;

  return false;
}

export async function runSync() {
  const start = Date.now();
  const supabase = createAdminClient();
  const leadstarOffers = await fetchLeadStarOffers();

  let created = 0;
  let updated = 0;
  let deactivated = 0;
  let rewardsUpdated = 0;
  const errors: string[] = [];
  const rewardChanges: { id: string; bank: string; old: number; new: number }[] = [];
  const activeLeadstarIds: string[] = [];
  const hasGemini = !!process.env.GEMINI_API_KEY;

  for (const ls of leadstarOffers) {
    try {
      activeLeadstarIds.push(ls.id);
      const offerId = generateOfferId(ls.id, ls.institution);
      const slug = generateSlug(ls.institution, ls.product);

      const offerData = {
        id: offerId,
        slug,
        bank_name: ls.institution,
        bank_logo: ls.logo || null,
        offer_name: ls.programName || ls.product,
        short_description: ls.product,
        leadstar_id: ls.id,
        leadstar_product_id: ls.productId,
        leadstar_branch: ls.branch,
        leadstar_program_name: ls.programName,
        leadstar_description_html: ls.description,
        leadstar_benefits_html: ls.benefits,
        leadstar_logo_url: ls.logo,
        leadstar_affiliate_url: ls.url,
        affiliate_url: ls.url,
        free_first: ls.freeFirst,
        source: "leadstar" as const,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      // Parse reward using Gemini AI (if available)
      let parsedReward: number | null = null;
      if (hasGemini) {
        try {
          parsedReward = await parseRewardFromDescription(
            ls.programName || ls.product,
            ls.description || "",
            ls.benefits || ""
          );
          // Rate limit: wait 4s between AI calls (free tier = 20 req/min)
          await new Promise((r) => setTimeout(r, 4000));
        } catch (err) {
          errors.push(`AI parse error for ${ls.institution}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      // Check if offer exists
      const { data: existing } = await supabase
        .from("offers")
        .select("id, source, reward")
        .eq("leadstar_id", ls.id)
        .single();

      if (existing) {
        // Update — preserve manually enriched fields
        // For "hybrid" offers (manually enriched), don't overwrite offer_name
        // since admin may have corrected it
        const updateData: Record<string, unknown> = {
          bank_logo: offerData.bank_logo,
          leadstar_description_html: offerData.leadstar_description_html,
          leadstar_benefits_html: offerData.leadstar_benefits_html,
          leadstar_logo_url: offerData.leadstar_logo_url,
          leadstar_affiliate_url: offerData.leadstar_affiliate_url,
          affiliate_url: offerData.affiliate_url,
          free_first: offerData.free_first,
          is_active: true,
          updated_at: offerData.updated_at,
        };

        // Only overwrite offer_name and bank_name for pure leadstar offers
        if (existing.source === "leadstar") {
          updateData.bank_name = offerData.bank_name;
          updateData.offer_name = offerData.offer_name;
        }

        // Update reward via AI parser:
        // - For "leadstar" source: always update if AI parsed a value
        // - For "hybrid" source: only update if current reward is 0 (never overwrite manual edits)
        if (parsedReward !== null && parsedReward >= 0) {
          const shouldUpdateReward =
            existing.source === "leadstar" ||
            (existing.source === "hybrid" && (existing.reward === 0 || existing.reward === null));

          if (shouldUpdateReward && parsedReward !== existing.reward) {
            rewardChanges.push({
              id: existing.id,
              bank: ls.institution,
              old: existing.reward || 0,
              new: parsedReward,
            });
            updateData.reward = parsedReward;
            rewardsUpdated++;
          }
        }

        const { error } = await supabase
          .from("offers")
          .update(updateData)
          .eq("id", existing.id);

        if (error) throw error;
        updated++;
      } else {
        // Insert new offer — include AI-parsed reward if available
        const insertData = {
          ...offerData,
          reward: parsedReward ?? 0,
        };
        const { error } = await supabase.from("offers").insert(insertData);
        if (error) throw error;
        created++;
      }
    } catch (err) {
      const msg = `Error processing ${ls.institution} ${ls.product}: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(msg);
      console.error(msg);
    }
  }

  // Soft delete: deactivate LeadStar offers no longer in feed
  try {
    const { data: allLeadstar } = await supabase
      .from("offers")
      .select("id, leadstar_id")
      .in("source", ["leadstar", "hybrid"])
      .eq("is_active", true);

    if (allLeadstar) {
      const toDeactivate = allLeadstar.filter(
        (o) => o.leadstar_id && !activeLeadstarIds.includes(o.leadstar_id)
      );
      for (const offer of toDeactivate) {
        await supabase
          .from("offers")
          .update({ is_active: false, updated_at: new Date().toISOString() })
          .eq("id", offer.id);
        deactivated++;
      }
    }
  } catch (err) {
    errors.push(`Deactivation error: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Log sync
  const duration = Date.now() - start;
  await supabase.from("sync_log").insert({
    offers_found: leadstarOffers.length,
    offers_created: created,
    offers_updated: updated,
    offers_deactivated: deactivated,
    errors: errors.length > 0 ? errors : [],
    duration_ms: duration,
  });

  return {
    success: true,
    offers_found: leadstarOffers.length,
    created,
    updated,
    deactivated,
    rewards_updated: rewardsUpdated,
    reward_changes: rewardChanges,
    ai_parser: hasGemini ? "gemini-flash" : "disabled",
    errors: errors.length,
    duration_ms: duration,
  };
}

// GET — called by Vercel Cron Jobs
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runSync();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Sync failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST — called manually (e.g. curl)
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runSync();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Sync failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
