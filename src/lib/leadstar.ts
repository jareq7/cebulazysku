// LeadStar REST API client (v0.4.3)

const PARTNER_ID = process.env.LEADSTAR_PARTNER_ID || "";
const API_KEY = process.env.LEADSTAR_API_KEY || "";
const BASE_URL = "https://leadstar.pl/api";

export interface LeadStarOffer {
  id: string;
  branchId: string;
  branch: string;
  productId: string;
  product: string;
  institution: string;
  programName: string;
  description: string; // HTML
  benefits: string;    // HTML
  freeFirst: boolean;
  logo: string;
  url: string; // affiliate link
}

interface ApiRow {
  id: number;
  product_id: number;
  product: string;
  institution: string;
  logo: string;
  program_name: string;
  description?: string;
  benefits?: string;
  free_first: number;
  only_mailing: number;
  settlement_type: string;
  url: string;
  rate1: string;
  rate2: string;
  status_txt: string;
  status: number;
}

interface ApiResponse {
  info: { status: string; error_msg?: string; rows_count?: number };
  rows?: ApiRow[];
}

async function apiPost(endpoint: string, extraParams: Record<string, string | number> = {}): Promise<ApiRow[]> {
  if (!PARTNER_ID || !API_KEY) {
    throw new Error("LEADSTAR_PARTNER_ID lub LEADSTAR_API_KEY nie jest ustawione w zmiennych środowiskowych.");
  }

  const params = new URLSearchParams({
    partner_id: PARTNER_ID,
    api_key: API_KEY,
    ...Object.fromEntries(Object.entries(extraParams).map(([k, v]) => [k, String(v)])),
  });

  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`LeadStar API error: ${response.status} ${response.statusText}`);
  }

  const data: ApiResponse = await response.json();

  if (data.info.status !== "ok") {
    throw new Error(`LeadStar API error: ${data.info.error_msg || "unknown error"}`);
  }

  return data.rows || [];
}

export async function fetchLeadStarOffers(): Promise<LeadStarOffer[]> {
  const rows = await apiPost("programs", { product_id: 0 });

  return rows
    .filter((row) => row.status === 1 && !row.only_mailing)
    .map((row): LeadStarOffer => ({
      id: String(row.id),
      branchId: "",
      branch: "",
      productId: String(row.product_id),
      product: row.product,
      institution: row.institution,
      programName: row.program_name || "",
      description: row.description || "",
      benefits: row.benefits || "",
      freeFirst: row.free_first === 1,
      logo: row.logo || "",
      url: row.url || "",
    }));
}

// Generate a URL-friendly slug from institution + product
export function generateSlug(institution: string, product: string): string {
  const text = `${institution} ${product}`.toLowerCase();
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

// Generate a stable ID from leadstar data
export function generateOfferId(leadstarId: string, institution: string): string {
  return `ls-${leadstarId}-${institution.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
}
