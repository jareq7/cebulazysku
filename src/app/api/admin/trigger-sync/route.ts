import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchLeadStarOffers, generateSlug, generateOfferId } from "@/lib/leadstar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
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
          .select("id")
          .eq("leadstar_id", ls.id)
          .single();

        if (existing) {
          const { error } = await supabase
            .from("offers")
            .update({
              bank_name: offerData.bank_name,
              bank_logo: offerData.bank_logo,
              offer_name: offerData.offer_name,
              leadstar_description_html: offerData.leadstar_description_html,
              leadstar_benefits_html: offerData.leadstar_benefits_html,
              leadstar_logo_url: offerData.leadstar_logo_url,
              leadstar_affiliate_url: offerData.leadstar_affiliate_url,
              affiliate_url: offerData.affiliate_url,
              free_first: offerData.free_first,
              is_active: true,
              updated_at: offerData.updated_at,
            })
            .eq("id", existing.id);
          if (error) throw error;
          updated++;
        } else {
          const { error } = await supabase.from("offers").insert(offerData);
          if (error) throw error;
          created++;
        }
      } catch (err) {
        const msg = `Error: ${ls.institution} ${ls.product}: ${err instanceof Error ? err.message : String(err)}`;
        errors.push(msg);
      }
    }

    // Soft delete
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

    return NextResponse.json({
      success: true,
      offers_found: leadstarOffers.length,
      created,
      updated,
      deactivated,
      errors: errors.length,
      duration_ms: duration,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Manual sync failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
