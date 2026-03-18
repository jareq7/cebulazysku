// @author Claude Code (claude-opus-4-6) | 2026-03-18
// Conversand CPA network API client

const API_KEY = process.env.CONVERSAND_API_KEY || "";
const USER_ID = process.env.CONVERSAND_USER_ID || "";
const BASE_URL = "https://conversand.com/api";

// --- Types ---

export interface ConversandOffer {
  id: number;
  name: string;
  description: string;
  category: string;
  country: string;
  payout: number;
  payout_type: string; // "CPS", "CPL", etc.
  currency: string;
  status: string;
  url?: string;
}

export interface ConversandStat {
  date: string;
  program: string;
  clicks: number;
  leads: number;
  commission: number;
}

export interface ConversandBalance {
  balance: number;
  currency: string;
  threshold: number;
}

export interface ConversandPayout {
  id: number;
  amount: number;
  currency: string;
  status: string;
  date: string;
}

// --- API helpers ---

async function apiGet<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("user_id", USER_ID);
  url.searchParams.set("format", "json");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Conversand API error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Public API ---

export async function getOffers(page = 1): Promise<{ offers: ConversandOffer[]; hasMore: boolean }> {
  const data = await apiGet<{ data?: ConversandOffer[]; total?: number }>("offers.php", {
    category: "21", // Financial
    country: "PL",
    page: String(page),
  });

  const offers = Array.isArray(data.data) ? data.data : [];
  const total = data.total || 0;
  return { offers, hasMore: page * 20 < total };
}

export async function getAllOffers(): Promise<ConversandOffer[]> {
  const all: ConversandOffer[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const result = await getOffers(page);
    all.push(...result.offers);
    hasMore = result.hasMore;
    page++;
    if (hasMore) await delay(500);
  }

  return all;
}

export async function getStatistics(
  dateStart: string,
  dateStop: string,
  groupBy = "program"
): Promise<ConversandStat[]> {
  const data = await apiGet<{ data?: ConversandStat[] }>("statistics.php", {
    date_start: dateStart,
    date_stop: dateStop,
    group_by: groupBy,
  });
  return Array.isArray(data.data) ? data.data : [];
}

export async function getBalance(): Promise<ConversandBalance> {
  const data = await apiGet<ConversandBalance>("balance.php");
  return {
    balance: data.balance || 0,
    currency: data.currency || "PLN",
    threshold: data.threshold || 0,
  };
}

export async function getPayouts(): Promise<ConversandPayout[]> {
  const data = await apiGet<{ data?: ConversandPayout[] }>("payouts.php");
  return Array.isArray(data.data) ? data.data : [];
}
