// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-30 — W8: added bank descriptions from Gemini G12, Button asChild fixes
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchOffersFromDB, fetchExpiredOffersFromDB } from "@/lib/offers";
import type { BankOffer } from "@/data/banks";
import { bankDescriptions } from "@/data/bank-descriptions";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JsonLd } from "@/components/JsonLd";
import { OfferCard } from "@/components/OfferCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Building2,
  TrendingUp,
  Clock,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Users,
  History,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 3600; // ISR — 1h

// --- Helpers ---

function bankNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+s\.a\.?$/i, "")
    .replace(/bank\s+/gi, "")
    .replace(/ś/g, "s")
    .replace(/ł/g, "l")
    .replace(/ó/g, "o")
    .replace(/ż/g, "z")
    .replace(/ź/g, "z")
    .replace(/ą/g, "a")
    .replace(/ę/g, "e")
    .replace(/ć/g, "c")
    .replace(/ń/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface BankData {
  slug: string;
  name: string;
  offers: BankOffer[];
  expiredOffers: BankOffer[];
}

async function getAllBanks(): Promise<BankData[]> {
  const [active, expired] = await Promise.all([
    fetchOffersFromDB(),
    fetchExpiredOffersFromDB(),
  ]);

  const bankMap = new Map<string, { name: string; offers: BankOffer[]; expiredOffers: BankOffer[] }>();

  for (const offer of active) {
    const slug = bankNameToSlug(offer.bankName);
    if (!bankMap.has(slug)) {
      bankMap.set(slug, { name: offer.bankName, offers: [], expiredOffers: [] });
    }
    bankMap.get(slug)!.offers.push(offer);
  }

  for (const offer of expired) {
    const slug = bankNameToSlug(offer.bankName);
    if (!bankMap.has(slug)) {
      bankMap.set(slug, { name: offer.bankName, offers: [], expiredOffers: [] });
    }
    bankMap.get(slug)!.expiredOffers.push(offer);
  }

  return Array.from(bankMap.entries()).map(([slug, data]) => ({ slug, ...data }));
}

// --- Static Params ---

export async function generateStaticParams() {
  const banks = await getAllBanks();
  return banks.map((b) => ({ slug: b.slug }));
}

// --- Metadata ---

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const banks = await getAllBanks();
  const bank = banks.find((b) => b.slug === slug);
  if (!bank) return {};

  const maxReward = bank.offers.length > 0 ? Math.max(...bank.offers.map((o) => o.reward)) : 0;

  const title = `Premie bankowe ${bank.name} 2026 — aktualne oferty i warunki`;
  const description = bank.offers.length > 0
    ? `${bank.name} ma ${bank.offers.length} aktywn${bank.offers.length === 1 ? "ą" : bank.offers.length < 5 ? "e" : "ych"} promocj${bank.offers.length === 1 ? "ę" : bank.offers.length < 5 ? "e" : "i"} z premią do ${maxReward} zł. Sprawdź warunki, śledź postępy i obierz swoją cebulkę! 🧅`
    : `Sprawdź archiwalne oferty ${bank.name} na CebulaZysku.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://cebulazysku.pl/bank/${slug}`,
    },
    alternates: {
      canonical: `https://cebulazysku.pl/bank/${slug}`,
    },
  };
}

// --- Page ---

export default async function BankHubPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const banks = await getAllBanks();
  const bank = banks.find((b) => b.slug === slug);

  if (!bank) notFound();

  const { name, offers, expiredOffers } = bank;
  const maxReward = offers.length > 0 ? Math.max(...offers.map((o) => o.reward)) : 0;
  const totalReward = offers.reduce((sum, o) => sum + o.reward, 0);
  const bankLogo = offers[0]?.bankLogo || expiredOffers[0]?.bankLogo || "";
  const bankColor = offers[0]?.bankColor || expiredOffers[0]?.bankColor || "#6B7280";

  // JSON-LD: Organization
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: `https://cebulazysku.pl/bank/${slug}`,
    ...(bankLogo && bankLogo.startsWith("http") ? { logo: bankLogo } : {}),
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbLd = {
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
        name: `Premie ${name}`,
        item: `https://cebulazysku.pl/bank/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={organizationLd} />
      <JsonLd data={breadcrumbLd} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Oferty</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Premie {name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8">
          {bankLogo && bankLogo.startsWith("http") ? (
            <img
              src={bankLogo}
              alt={`${name} logo`}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-contain bg-white p-2 shadow-sm border shrink-0"
              width={80}
              height={80}
            />
          ) : (
            <div
              className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl text-white font-bold text-2xl sm:text-3xl shrink-0 shadow-sm"
              style={{ backgroundColor: bankColor }}
            >
              {name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Premie bankowe {name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {offers.length > 0
                ? `${offers.length} aktywn${offers.length === 1 ? "a" : offers.length < 5 ? "e" : "ych"} promocj${offers.length === 1 ? "a" : offers.length < 5 ? "e" : "i"} — obierz swoją cebulkę! 🧅`
                : "Aktualnie brak aktywnych promocji. Sprawdź archiwum poniżej."}
            </p>
          </div>
        </div>

        {/* Stats cards */}
        {offers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Najwyższa premia</p>
                  <p className="text-xl font-bold text-emerald-600">{maxReward} zł</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aktywne oferty</p>
                  <p className="text-xl font-bold">{offers.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Suma premii</p>
                  <p className="text-xl font-bold">{totalReward} zł</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active offers */}
        {offers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Aktywne oferty {name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </section>
        )}

        {/* Expired offers */}
        {expiredOffers.length > 0 && (
          <section className="mb-12">
            <Separator className="mb-8" />
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Historia ofert {name}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Zakończone promocje — warto wiedzieć co było, żeby nie przegapić następnej!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {expiredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </section>
        )}

        {/* Bank description from Gemini G12 */}
        {bankDescriptions[slug] && (() => {
          const desc = bankDescriptions[slug];
          return (
            <section className="mb-12">
              <Separator className="mb-8" />
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                O banku {name}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {desc.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Pros */}
                <Card className="border-emerald-200 dark:border-emerald-800/40">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-emerald-600">
                      <ThumbsUp className="h-4 w-4" />
                      Plusy
                    </h3>
                    <ul className="space-y-2">
                      {desc.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Cons */}
                <Card className="border-red-200 dark:border-red-800/40">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-500">
                      <ThumbsDown className="h-4 w-4" />
                      Minusy
                    </h3>
                    <ul className="space-y-2">
                      {desc.cons.map((con, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Target audience */}
              <Card className="mb-4">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Dla kogo?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc.targetAudience}
                  </p>
                </CardContent>
              </Card>

              {/* Promo history */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <History className="h-4 w-4 text-amber-500" />
                    Historia promocji
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc.promoHistory}
                  </p>
                </CardContent>
              </Card>
            </section>
          );
        })()}

        {/* Poradniki placeholder */}
        <section className="mb-12">
          <Separator className="mb-8" />
          <h2 className="text-xl font-semibold mb-4">
            Poradniki — {name}
          </h2>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-3">
                Wkrótce pojawią się tu poradniki krok po kroku jak ołupić {name} z premii 🧅
              </p>
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/blog">
                  Zobacz blog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center py-8 bg-muted/30 rounded-2xl">
          <h2 className="text-xl font-semibold mb-2">
            Chcesz śledzić warunki promocji {name}?
          </h2>
          <p className="text-muted-foreground mb-4">
            Załóż darmowe konto i nigdy nie zapomnij o żadnym warunku!
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/rejestracja">
              Załóż konto — za darmo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </div>
    </>
  );
}
