// @author Claude Code (claude-opus-4-6) | 2026-03-26
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  const supabase = createAdminClient();

  const [
    { count: blogCount },
    { count: offerCount },
    { data: offersWithFaq },
    { count: bankHubCount },
    { count: comparisonCount },
  ] = await Promise.all([
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("offers").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("offers").select("faq").eq("is_active", true),
    // Bank hubs are static pages — count known banks
    Promise.resolve({ count: 10 }),
    // Comparisons are static — estimate from generateStaticParams
    Promise.resolve({ count: 28 }),
  ]);

  const pagesWithFaq = offersWithFaq?.filter(
    (o) => o.faq && Array.isArray(o.faq) && o.faq.length > 0
  ).length || 0;

  // Internal linking rules count (hardcoded — matches internal-links.ts)
  const internalLinksBank = 12;
  const internalLinksGlossary = 10;

  // Estimate total pages: home + static pages + offers + blogs + bank hubs + comparisons + glossary
  const staticPages = 12; // home, ranking, blog, o-nas, kontakt, jak-to-dziala, regulamin, polityka, rejestracja, logowanie, link, slownik
  const totalPages =
    staticPages +
    (offerCount || 0) +
    (blogCount || 0) +
    (bankHubCount || 0) +
    (comparisonCount || 0);

  return NextResponse.json({
    totalPages,
    totalBlogPosts: blogCount || 0,
    totalOffers: offerCount || 0,
    totalBankHubs: bankHubCount || 0,
    totalComparisons: comparisonCount || 0,
    pagesWithFaq,
    internalLinksBank,
    internalLinksGlossary,
  });
}
