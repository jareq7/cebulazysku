import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchLeadStarOffers, generateSlug, generateOfferId } from "@/lib/leadstar";
import { parseRewardFromDescription } from "@/lib/parse-reward";
import { scrapeOfferPage } from "@/lib/scrape-offer";

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
  let qualityIssues = 0;
  let scraped = 0;
  const errors: string[] = [];
  const rewardChanges: { id: string; bank: string; old: number; new: number }[] = [];
  const activeLeadstarIds: string[] = [];
  const hasGemini = !!process.env.GEMINI_API_KEY;
  // Ogranicz scraping do max 5 ofert per sync (ochrona przed timeoutem Vercel)
  const MAX_SCRAPE_PER_SYNC = 5;
  let scrapeAttempts = 0;

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
        .select("id, source, reward, locked_fields, quality_flags")
        .eq("leadstar_id", ls.id)
        .single();

      if (existing) {
        // Update — preserve manually enriched fields
        // For "hybrid" offers (manually enriched), don't overwrite offer_name
        // since admin may have corrected it
        const lockedFields: string[] = existing.locked_fields || [];

        const updateData: Record<string, unknown> = {};

        // Pola z feedu — dodaj tylko jeśli nie są zablokowane
        if (!lockedFields.includes("bank_logo")) updateData.bank_logo = offerData.bank_logo;
        if (!lockedFields.includes("leadstar_description_html")) updateData.leadstar_description_html = offerData.leadstar_description_html;
        if (!lockedFields.includes("leadstar_benefits_html")) updateData.leadstar_benefits_html = offerData.leadstar_benefits_html;
        updateData.leadstar_logo_url = offerData.leadstar_logo_url;
        updateData.leadstar_affiliate_url = offerData.leadstar_affiliate_url;
        if (!lockedFields.includes("affiliate_url")) updateData.affiliate_url = offerData.affiliate_url;
        updateData.free_first = offerData.free_first;
        updateData.is_active = true;
        updateData.updated_at = offerData.updated_at;

        // Only overwrite offer_name and bank_name for pure leadstar offers (jeśli niezablokowane)
        if (existing.source === "leadstar") {
          if (!lockedFields.includes("bank_name")) updateData.bank_name = offerData.bank_name;
          if (!lockedFields.includes("offer_name")) updateData.offer_name = offerData.offer_name;
        }

        // Update reward via AI parser:
        // - For "leadstar" source: always update if AI parsed a value
        // - For "hybrid" source: only update if current reward is 0
        // - Never update if "reward" is in locked_fields
        if (parsedReward !== null && parsedReward >= 0 && !lockedFields.includes("reward")) {
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

        // Wykryj problemy jakości i zaktualizuj quality_flags
        const effectiveReward = (updateData.reward as number) ?? existing.reward ?? 0;
        const newQualityFlags: Record<string, unknown> = {
          ...(existing.quality_flags || {}),
        };

        const rewardZero = effectiveReward === 0 || effectiveReward === null;
        const descEmpty = !ls.description || ls.description.trim().length < 30;
        const benefitsEmpty = !ls.benefits || ls.benefits.trim().length < 30;

        newQualityFlags.reward_zero = rewardZero;
        newQualityFlags.description_empty = descEmpty;
        newQualityFlags.benefits_empty = benefitsEmpty;

        if (rewardZero || descEmpty) {
          qualityIssues++;

          // Próbuj scrapować stronę docelową jeśli jeszcze nie dzisiaj i mamy limit
          const today = new Date().toISOString().slice(0, 10);
          const lastScraped = newQualityFlags.last_scraped_at as string | undefined;
          const alreadyScrapedToday = lastScraped?.startsWith(today);

          if (!alreadyScrapedToday && scrapeAttempts < MAX_SCRAPE_PER_SYNC && ls.url) {
            scrapeAttempts++;
            try {
              const scrapeResult = await scrapeOfferPage(ls.url);
              if (scrapeResult) {
                newQualityFlags.last_scraped_at = new Date().toISOString();
                newQualityFlags.scrape_final_url = scrapeResult.finalUrl;

                if (scrapeResult.skipped) {
                  newQualityFlags.scrape_failed = true;
                  newQualityFlags.scrape_failed_reason = scrapeResult.skipped;
                } else if (scrapeResult.reward !== null && !lockedFields.includes("reward")) {
                  newQualityFlags.scraped_from_page = true;
                  newQualityFlags.scrape_failed = false;
                  newQualityFlags.scrape_reward = scrapeResult.reward;
                  if (scrapeResult.reward > 0 && effectiveReward === 0) {
                    updateData.reward = scrapeResult.reward;
                    rewardsUpdated++;
                    scraped++;
                    newQualityFlags.reward_zero = false;
                  }
                } else {
                  newQualityFlags.scrape_failed = true;
                  newQualityFlags.scrape_failed_reason = "no_reward_found";
                }
              } else {
                newQualityFlags.scrape_failed = true;
                newQualityFlags.scrape_failed_reason = "fetch_error";
              }
            } catch (scrapeErr) {
              newQualityFlags.scrape_failed = true;
              newQualityFlags.scrape_failed_reason = String(scrapeErr).slice(0, 100);
            }
          }
        } else {
          // Oferta jest OK — wyczyść flagi problemów
          newQualityFlags.reward_zero = false;
          newQualityFlags.scrape_failed = false;
        }

        updateData.quality_flags = newQualityFlags;

        const { error } = await supabase
          .from("offers")
          .update(updateData)
          .eq("id", existing.id);

        if (error) throw error;
        updated++;
      } else {
        // Insert new offer — include AI-parsed reward if available
        const initialReward = parsedReward ?? 0;
        const initialQualityFlags: Record<string, unknown> = {
          reward_zero: initialReward === 0,
          description_empty: !ls.description || ls.description.trim().length < 30,
          benefits_empty: !ls.benefits || ls.benefits.trim().length < 30,
        };

        if (initialReward === 0 || initialQualityFlags.description_empty) qualityIssues++;

        const insertData = {
          ...offerData,
          reward: initialReward,
          locked_fields: [],
          quality_flags: initialQualityFlags,
          first_seen_at: new Date().toISOString(),
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
    quality_issues: qualityIssues,
    scraped_from_pages: scraped,
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
