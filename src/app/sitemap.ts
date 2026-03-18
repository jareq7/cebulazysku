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
  ];
}
