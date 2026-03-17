import { Metadata } from "next";
import Link from "next/link";
import { fetchOffersFromDB } from "@/lib/offers";
import { getDifficultyLabel, getDifficultyColor } from "@/data/banks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JsonLd } from "@/components/JsonLd";
import {
  ArrowRight,
  Trophy,
  Medal,
  Clock,
  Shield,
  TrendingUp,
} from "lucide-react";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Ranking kont bankowych z premią – aktualizowany codziennie | CebulaZysku",
  description:
    "Aktualny ranking najlepszych promocji bankowych z premią. Porównaj konta osobiste i wybierz najwyższą premię. Aktualizowany codziennie.",
  alternates: {
    canonical: "https://cebulazysku.pl/ranking",
  },
  openGraph: {
    title: "Ranking kont bankowych z premią | CebulaZysku",
    description:
      "Sprawdź aktualny ranking najlepszych promocji bankowych. Porównaj premie, trudność i warunki.",
    type: "website",
    locale: "pl_PL",
    url: "https://cebulazysku.pl/ranking",
  },
};

export default async function RankingPage() {
  const offers = await fetchOffersFromDB();

  const sorted = [...offers].sort((a, b) => {
    if (b.reward !== a.reward) return b.reward - a.reward;
    const diffOrder = { easy: 1, medium: 2, hard: 3 };
    return diffOrder[a.difficulty] - diffOrder[b.difficulty];
  });

  const today = new Date().toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalReward = sorted.reduce((sum, o) => sum + o.reward, 0);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Strona główna",
        item: "https://cebulazysku.pl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ranking",
        item: "https://cebulazysku.pl/ranking",
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Strona główna
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Ranking</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-4">
          <Trophy className="h-4 w-4" />
          Aktualizacja: {today}
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Ranking kont bankowych{" "}
          <span className="bg-gradient-to-r from-emerald-700 to-green-500 bg-clip-text text-transparent">
            z premią
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Porównaj {sorted.length} najlepszych promocji bankowych. Łącznie do
          zgarnięcia nawet{" "}
          <strong className="text-emerald-600">{totalReward} zł</strong>.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-emerald-500 mb-1" />
            <p className="text-xl font-bold text-emerald-600">{totalReward} zł</p>
            <p className="text-xs text-muted-foreground">Łącznie do zdobycia</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <Shield className="mx-auto h-5 w-5 text-blue-500 mb-1" />
            <p className="text-xl font-bold">{sorted.length}</p>
            <p className="text-xs text-muted-foreground">Aktywnych ofert</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <Clock className="mx-auto h-5 w-5 text-amber-500 mb-1" />
            <p className="text-xl font-bold">{today.split(" ")[0]}</p>
            <p className="text-xs text-muted-foreground">{today.split(" ").slice(1).join(" ")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Ranking table */}
      <h2 className="sr-only">Lista ofert w rankingu</h2>
      <div className="space-y-3">
        {sorted.map((offer, index) => {
          const dlMs = offer.deadline ? new Date(offer.deadline).getTime() : NaN;
          const daysLeft = !isNaN(dlMs)
            ? Math.max(0, Math.ceil((dlMs - Date.now()) / (1000 * 60 * 60 * 24)))
            : null;

          const isTop3 = index < 3;
          const positionColors = [
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300",
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300",
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-300",
          ];

          return (
            <Card
              key={offer.id}
              className={`transition-all hover:shadow-md ${
                isTop3
                  ? "border-2 " + (positionColors[index]?.split(" border-")[1] ? "border-" + positionColors[index].split("border-")[1] : "")
                  : ""
              }`}
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  {/* Position */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg shrink-0 ${
                      isTop3
                        ? positionColors[index]
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < 3 ? (
                      <Medal className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Bank logo */}
                  {offer.bankLogo && offer.bankLogo.startsWith("http") ? (
                    <img
                      src={offer.bankLogo}
                      alt={`${offer.bankName} logo`}
                      className="h-10 w-10 rounded-xl object-contain bg-white p-1 shrink-0"
                      loading="lazy"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold shrink-0"
                      style={{ backgroundColor: offer.bankColor }}
                    >
                      {offer.bankName.charAt(0)}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm sm:text-base">
                        {offer.bankName}
                      </p>
                      {offer.featured && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] px-1.5 py-0">
                          Polecane
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {offer.offerName}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <Badge className={getDifficultyColor(offer.difficulty)}>
                      {getDifficultyLabel(offer.difficulty)}
                    </Badge>
                    {daysLeft !== null && (
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {daysLeft}d
                      </Badge>
                    )}
                    {offer.monthlyFee === 0 && (
                      <Badge
                        variant="outline"
                        className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700 text-xs"
                      >
                        Darmowe
                      </Badge>
                    )}
                  </div>

                  {/* Reward */}
                  <div className="text-right shrink-0">
                    <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                      {offer.reward} zł
                    </p>
                    <p className="text-[10px] text-muted-foreground">premii</p>
                  </div>

                  {/* CTA */}
                  <Link href={`/oferta/${offer.slug}`} className="shrink-0">
                    <Button
                      size="sm"
                      variant={isTop3 ? "default" : "outline"}
                      className="gap-1"
                    >
                      <span className="hidden sm:inline">Szczegóły</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Mobile badges */}
                <div className="flex sm:hidden items-center gap-2 mt-2 ml-14">
                  <Badge className={`${getDifficultyColor(offer.difficulty)} text-[10px]`}>
                    {getDifficultyLabel(offer.difficulty)}
                  </Badge>
                  {daysLeft !== null && (
                    <Badge variant="outline" className="gap-1 text-[10px]">
                      <Clock className="h-2.5 w-2.5" />
                      {daysLeft}d
                    </Badge>
                  )}
                  {offer.monthlyFee === 0 && (
                    <Badge
                      variant="outline"
                      className="text-emerald-600 border-emerald-200 text-[10px]"
                    >
                      Darmowe
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Ranking aktualizowany automatycznie na podstawie aktualnych ofert.
        </p>
        <Link href="/#oferty">
          <Button size="lg" className="gap-2">
            Przeglądaj wszystkie oferty
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
