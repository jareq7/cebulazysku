// LeadStar XML feed parser

const LEADSTAR_URL = process.env.LEADSTAR_FEED_URL || "";

export interface LeadStarOffer {
  id: string;
  branchId: string;
  branch: string;
  productId: string;
  product: string;
  institution: string;
  programName: string;
  description: string; // HTML
  benefits: string; // HTML
  freeFirst: boolean;
  logo: string;
  url: string; // affiliate link
}

function getTextContent(element: Element, tagName: string): string {
  const el = element.getElementsByTagName(tagName)[0];
  if (!el) return "";
  return el.textContent?.trim() ?? "";
}

export async function fetchLeadStarOffers(): Promise<LeadStarOffer[]> {
  const response = await fetch(LEADSTAR_URL, {
    headers: { "User-Agent": "CebulaZysku/1.0" },
  });

  if (!response.ok) {
    throw new Error(`LeadStar fetch failed: ${response.status} ${response.statusText}`);
  }

  const xmlText = await response.text();

  // Parse XML using DOMParser (available in Edge Runtime / Node 18+)
  // We use a simple regex-based approach for maximum compatibility
  const offers: LeadStarOffer[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const block = match[1];
    const get = (tag: string): string => {
      // Handle CDATA
      const cdataRegex = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`);
      const cdataMatch = cdataRegex.exec(block);
      if (cdataMatch) return cdataMatch[1].trim();

      const simpleRegex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
      const simpleMatch = simpleRegex.exec(block);
      return simpleMatch ? simpleMatch[1].trim() : "";
    };

    offers.push({
      id: get("id"),
      branchId: get("branch_id"),
      branch: get("branch"),
      productId: get("product_id"),
      product: get("product"),
      institution: get("institution"),
      programName: get("program_name"),
      description: get("description"),
      benefits: get("benefits"),
      freeFirst: get("free_first") === "1",
      logo: get("logo"),
      url: get("url"),
    });
  }

  return offers;
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
