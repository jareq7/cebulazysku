import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchLeadStarOffers, generateSlug, generateOfferId } from "@/lib/leadstar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const syncSecret = process.env.SYNC_SECRET;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
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
  const errors: string[] = [];
  const activeLeadstarIds: string[] = [];

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

      const { data: existing } = await supabase
        .from("offers")
        .select("id, source, reward, locked_fields, quality_flags, leadstar_description_html, leadstar_benefits_html")
        .eq("leadstar_id", ls.id)
        .single();

      const descEmpty = !ls.description || ls.description.trim().length < 30;
      const benefitsEmpty = !ls.benefits || ls.benefits.trim().length < 30;

      if (existing) {
        const lockedFields: string[] = existing.locked_fields || [];

        const updateData: Record<string, unknown> = {
          leadstar_logo_url: offerData.leadstar_logo_url,
          leadstar_affiliate_url: offerData.leadstar_affiliate_url,
          free_first: offerData.free_first,
          is_active: true,
          updated_at: offerData.updated_at,
        };

        if (!lockedFields.includes("bank_logo")) updateData.bank_logo = offerData.bank_logo;
        if (!lockedFields.includes("affiliate_url")) updateData.affiliate_url = offerData.affiliate_url;

        // Wykryj zmianę opisu lub warunków w feedzie → zresetuj ai_generated_at
        const descChanged = !lockedFields.includes("leadstar_description_html") &&
          ls.description !== (existing.leadstar_description_html || "");
        const benefitsChanged = !lockedFields.includes("leadstar_benefits_html") &&
          ls.benefits !== (existing.leadstar_benefits_html || "");

        if (!lockedFields.includes("leadstar_description_html")) updateData.leadstar_description_html = offerData.leadstar_description_html;
        if (!lockedFields.includes("leadstar_benefits_html")) updateData.leadstar_benefits_html = offerData.leadstar_benefits_html;

        if (descChanged || benefitsChanged) {
          updateData.ai_generated_at = null;
        }

        if (existing.source === "leadstar") {
          if (!lockedFields.includes("bank_name")) updateData.bank_name = offerData.bank_name;
          if (!lockedFields.includes("offer_name")) updateData.offer_name = offerData.offer_name;
        }

        // Zaktualizuj flagi jakości (bez AI/scrapingu — to robi /api/admin/enrich)
        const existingFlags = existing.quality_flags || {};
        updateData.quality_flags = {
          ...existingFlags,
          reward_zero: existing.reward === 0 || existing.reward === null,
          description_empty: descEmpty,
          benefits_empty: benefitsEmpty,
        };

        const { error } = await supabase.from("offers").update(updateData).eq("id", existing.id);
        if (error) throw error;
        updated++;
      } else {
        // Nowa oferta — reward będzie uzupełniony przez /api/admin/enrich
        const insertData = {
          ...offerData,
          reward: 0,
          locked_fields: [],
          quality_flags: {
            reward_zero: true,
            description_empty: descEmpty,
            benefits_empty: benefitsEmpty,
          },
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
    errors: errors.length,
    duration_ms: duration,
  };
}

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
