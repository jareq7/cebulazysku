import { createClient } from "@/lib/supabase/client";
import type { BankOffer, Condition } from "@/data/banks";

// Maps a Supabase DB row to a BankOffer object for frontend use
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbOffer(row: any): BankOffer {
  return {
    id: row.id,
    slug: row.slug,
    bankName: row.bank_name,
    bankLogo: row.bank_logo || "/banks/default.svg",
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
    lastUpdated: row.last_updated || row.updated_at || "",
  };
}

export async function fetchOffersFromDB(): Promise<BankOffer[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("is_active", true)
    .order("reward", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch offers from DB:", error?.message);
    return [];
  }

  return data.map(mapDbOffer);
}

export async function fetchOfferBySlug(slug: string): Promise<BankOffer | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return mapDbOffer(data);
}
