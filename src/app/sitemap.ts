// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26 — added bank hub pages to sitemap
import { MetadataRoute } from "next";
import { fetchOffersFromDB, fetchNoRewardOffers } from "@/lib/offers";
import { blogPosts } from "@/data/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cebulazysku.pl";
  const [bankOffers, noRewardOffers] = await Promise.all([
    fetchOffersFromDB(),
    fetchNoRewardOffers(),
  ]);

  const offerPages = bankOffers.map((offer) => ({
    url: `${baseUrl}/oferta/${offer.slug}`,
    lastModified: offer.lastUpdated ? new Date(offer.lastUpdated) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const noRewardPages = noRewardOffers.map((offer) => ({
    url: `${baseUrl}/oferta/${offer.slug}`,
    lastModified: offer.lastUpdated ? new Date(offer.lastUpdated) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Bank hub pages — distinct bank slugs
  const bankSlugs = new Set<string>();
  for (const o of [...bankOffers, ...noRewardOffers]) {
    bankSlugs.add(
      o.bankName
        .toLowerCase()
        .replace(/\s+s\.a\.?$/i, "")
        .replace(/bank\s+/gi, "")
        .replace(/ś/g, "s").replace(/ł/g, "l").replace(/ó/g, "o")
        .replace(/ż/g, "z").replace(/ź/g, "z").replace(/ą/g, "a")
        .replace(/ę/g, "e").replace(/ć/g, "c").replace(/ń/g, "n")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    );
  }
  const bankHubPages = Array.from(bankSlugs).map((slug) => ({
    url: `${baseUrl}/bank/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Comparison pages — all unique bank pairs
  const bankList = Array.from(bankSlugs).sort();
  const comparisonPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < bankList.length; i++) {
    for (let j = i + 1; j < bankList.length; j++) {
      comparisonPages.push({
        url: `${baseUrl}/porownanie/${bankList[i]}-vs-${bankList[j]}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/jak-to-dziala`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ranking`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/slownik`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pierwsze-konto`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dla-firm`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kalkulator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/przewodnik`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/archiwum`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/o-nas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/polityka-prywatnosci`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/regulamin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/rejestracja`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...offerPages,
    ...noRewardPages,
    ...blogPages,
    ...bankHubPages,
    ...comparisonPages,
  ];
}
