import type { BankOffer, Condition } from "@/data/banks";
import { bankOffers as staticOffers } from "@/data/banks";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbOffer(row: any): BankOffer {
  return {
    id: row.id,
    slug: row.slug,
    bankName: row.bank_name,
    bankLogo: row.bank_logo
      ? row.bank_logo.startsWith("//") ? `https:${row.bank_logo}` : row.bank_logo
      : "/banks/default.svg",
    bankColor: row.bank_color || "#6B7280",
    offerName: row.offer_name,
    shortDescription: row.short_description || "",
    fullDescription: row.full_description || row.leadstar_description_html || "",
    reward: row.reward || 0,
    difficulty: row.difficulty || "medium",
    conditions: Array.isArray(row.conditions) ? row.conditions as Condition[] : [],
    deadline: row.deadline || "",
    affiliateUrl: row.affiliate_url || "#",
    pros: Array.isArray(row.pros) ? row.pros as string[] : [],
    cons: Array.isArray(row.cons) ? row.cons as string[] : [],
    faq: Array.isArray(row.faq) ? row.faq as { question: string; answer: string }[] : [],
    monthlyFee: row.monthly_fee || 0,
    freeIf: row.free_if || null,
    featured: row.featured || false,
    lastUpdated: row.last_updated || row.first_seen_at || row.updated_at || "",
    bannerUrl: row.banner_url || null,
    forYoung: row.for_young || false,
  };
}

async function supabaseGet(path: string): Promise<unknown[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchOffersFromDB(): Promise<BankOffer[]> {
  const data = await supabaseGet(
    "offers?is_active=eq.true&reward=gt.0&order=reward.desc&select="
  );
  if (!data || !Array.isArray(data) || data.length === 0) {
    return staticOffers.filter((o) => o.reward > 0);
  }
  return data.map(mapDbOffer);
}

export async function fetchOfferBySlug(slug: string): Promise<BankOffer | null> {
  const data = await supabaseGet(
    `offers?slug=eq.${encodeURIComponent(slug)}&is_active=eq.true&reward=gt.0&select=*`
  );
  if (!data || !Array.isArray(data) || data.length === 0) {
    return staticOffers.find((o) => o.slug === slug) || null;
  }
  return mapDbOffer(data[0]);
}

export async function getTotalPotentialEarnings(): Promise<number> {
  const offers = await fetchOffersFromDB();
  return offers.reduce((sum, o) => sum + o.reward, 0);
}

export async function getFeaturedOffers(): Promise<BankOffer[]> {
  const offers = await fetchOffersFromDB();
  return offers.filter((o) => o.featured);
}
