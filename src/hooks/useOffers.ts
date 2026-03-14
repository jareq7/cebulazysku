"use client";

import { useState, useEffect } from "react";
import type { BankOffer, Condition } from "@/data/banks";
import { bankOffers as staticOffers } from "@/data/banks";

function decodeAndStripHtml(html: string): string {
  const namedEntities: Record<string, string> = {
    "&nbsp;": " ", "&lt;": "<", "&gt;": ">", "&amp;": "&",
    "&quot;": '"', "&apos;": "'", "&ndash;": "–", "&mdash;": "—",
    "&bull;": "•", "&hellip;": "…", "&euro;": "€",
  };
  return html
    .replace(/&[a-zA-Z]+;/g, (match) => namedEntities[match.toLowerCase()] ?? match)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbOffer(row: any): BankOffer {
  const logo = row.bank_logo
    ? row.bank_logo.startsWith("//") ? `https:${row.bank_logo}` : row.bank_logo
    : "";
  return {
    id: row.id,
    slug: row.slug,
    bankName: row.bank_name,
    bankLogo: logo,
    bankColor: row.bank_color || "#6B7280",
    offerName: row.offer_name,
    shortDescription: row.short_description || "",
    fullDescription: row.full_description
      ? decodeAndStripHtml(row.full_description)
      : (row.leadstar_description_html ? decodeAndStripHtml(row.leadstar_description_html) : ""),
    reward: row.reward || 0,
    difficulty: row.difficulty || "medium",
    conditions: Array.isArray(row.conditions) ? (row.conditions as Condition[]) : [],
    deadline: row.deadline || "",
    affiliateUrl: row.affiliate_url || "#",
    pros: Array.isArray(row.pros) ? (row.pros as string[]) : [],
    cons: Array.isArray(row.cons) ? (row.cons as string[]) : [],
    faq: Array.isArray(row.faq) ? (row.faq as { question: string; answer: string }[]) : [],
    monthlyFee: row.monthly_fee || 0,
    freeIf: row.free_if || null,
    featured: row.featured || false,
    lastUpdated: row.last_updated || row.updated_at || "",
    bannerUrl: row.banner_url || null,
    forYoung: row.for_young || false,
    isBusiness: row.is_business || false,
  };
}

export function useOffers() {
  const [offers, setOffers] = useState<BankOffer[]>(staticOffers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setIsLoading(false);
      return;
    }

    fetch(`${url}/rest/v1/offers?is_active=eq.true&reward=gt.0&order=reward.desc&select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOffers(data.map(mapDbOffer).filter((o: BankOffer) => o.conditions.length > 0));
        } else {
          setOffers(staticOffers.filter((o) => o.reward > 0));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return { offers, isLoading: isLoading };
}
