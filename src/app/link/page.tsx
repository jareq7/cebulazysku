// @author Claude Code (claude-opus-4-6) | 2026-03-26
import { Metadata } from "next";
import Image from "next/image";
import { fetchOffersFromDB } from "@/lib/offers";
import { AffiliateLink } from "@/components/AffiliateLink";
import { getDifficultyLabel, getDifficultyColor } from "@/data/banks";
import { Clock, ExternalLink } from "lucide-react";

export const revalidate = 3600; // ISR — refresh co 1h

export const metadata: Metadata = {
  title: "TOP Premie Bankowe | CebulaZysku",
  description:
    "Najlepsze aktualne premie bankowe w jednym miejscu. Kliknij i zacznij zarabiać na bankach!",
  robots: { index: false, follow: true },
  openGraph: {
    title: "TOP Premie Bankowe | CebulaZysku",
    description:
      "Najlepsze aktualne premie bankowe w jednym miejscu. Kliknij i zacznij zarabiać na bankach!",
    url: "https://cebulazysku.pl/link",
    images: [
      {
        url: "https://cebulazysku.pl/api/og?type=default",
        width: 1200,
        height: 630,
        alt: "TOP Premie Bankowe | CebulaZysku",
      },
    ],
  },
};

function daysLeft(deadline: string): number {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default async function BioLinkPage() {
  const offers = await fetchOffersFromDB();
  const top = offers
    .filter((o) => o.reward > 0 && o.affiliateUrl)
    .sort((a, b) => b.reward - a.reward)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-md px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <Image
            src="/logo-icon.png"
            alt="CebulaZysku"
            width={64}
            height={64}
            className="mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            CebulaZysku
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Obieraj premie bankowe warstwa po warstwie 🧅
          </p>
        </div>

        {/* Offers */}
        <div className="space-y-3">
          {top.map((offer) => {
            const days = daysLeft(offer.deadline);
            const diffColor = getDifficultyColor(offer.difficulty);
            return (
              <AffiliateLink
                key={offer.id}
                href={offer.affiliateUrl}
                offerId={offer.id}
                bankName={offer.bankName}
                reward={offer.reward}
                sourcePage="bio-link"
                className="block"
              >
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800">
                  {/* Logo */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                    {offer.bankLogo ? (
                      <Image
                        src={offer.bankLogo}
                        alt={offer.bankName}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-400">
                        {offer.bankName.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-gray-900 dark:text-white">
                        {offer.bankName}
                      </span>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${diffColor}`}
                      >
                        {getDifficultyLabel(offer.difficulty)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {days > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {days} dni
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reward + arrow */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {offer.reward} zł
                    </span>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </AffiliateLink>
            );
          })}
        </div>

        {/* CTA — all offers */}
        <div className="mt-6 text-center">
          <a
            href="https://cebulazysku.pl/?utm_source=bio&utm_medium=link"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-700"
          >
            Zobacz wszystkie oferty
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          cebulazysku.pl — śledzimy warunki za Ciebie
        </p>
      </div>
    </div>
  );
}
