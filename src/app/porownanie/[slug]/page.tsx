// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchOffersFromDB } from "@/lib/offers";
import type { BankOffer } from "@/data/banks";
import { JsonLd } from "@/components/JsonLd";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight, Scale, Trophy } from "lucide-react";

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

interface ComparisonPair {
  slug: string;
  offerA: BankOffer;
  offerB: BankOffer;
}

async function getAllComparisons(): Promise<ComparisonPair[]> {
  const offers = await fetchOffersFromDB();
  if (offers.length < 2) return [];

  // Group by bank — pick best offer per bank (highest reward)
  const bestPerBank = new Map<string, BankOffer>();
  for (const o of offers) {
    const key = bankNameToSlug(o.bankName);
    const existing = bestPerBank.get(key);
    if (!existing || o.reward > existing.reward) {
      bestPerBank.set(key, o);
    }
  }

  const bankOffers = Array.from(bestPerBank.values());
  const pairs: ComparisonPair[] = [];

  // Generate all unique pairs
  for (let i = 0; i < bankOffers.length; i++) {
    for (let j = i + 1; j < bankOffers.length; j++) {
      const a = bankOffers[i];
      const b = bankOffers[j];
      const slugA = bankNameToSlug(a.bankName);
      const slugB = bankNameToSlug(b.bankName);
      // Alphabetical order for consistent slugs
      const [first, second] = slugA < slugB ? [a, b] : [b, a];
      const firstSlug = bankNameToSlug(first.bankName);
      const secondSlug = bankNameToSlug(second.bankName);
      pairs.push({
        slug: `${firstSlug}-vs-${secondSlug}`,
        offerA: first,
        offerB: second,
      });
    }
  }

  return pairs;
}

// --- Static Params ---

export async function generateStaticParams() {
  const comparisons = await getAllComparisons();
  return comparisons.map((c) => ({ slug: c.slug }));
}

// --- Metadata ---

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const comparisons = await getAllComparisons();
  const comparison = comparisons.find((c) => c.slug === slug);
  if (!comparison) return {};

  const { offerA, offerB } = comparison;
  const title = `${offerA.bankName} vs ${offerB.bankName} — porównanie premii bankowych 2026`;
  const description = `Porównaj premie: ${offerA.bankName} (${offerA.reward} zł) vs ${offerB.bankName} (${offerB.reward} zł). Który bank da Ci więcej? Sprawdź warunki, trudność i deadline! 🧅`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://cebulazysku.pl/porownanie/${slug}`,
    },
    alternates: {
      canonical: `https://cebulazysku.pl/porownanie/${slug}`,
    },
  };
}

// --- Verdict ---

function getVerdict(offerA: BankOffer, offerB: BankOffer): { winner: BankOffer; reason: string } {
  const difficultyScore = { easy: 3, medium: 2, hard: 1 };
  const scoreA = offerA.reward * 0.6 + difficultyScore[offerA.difficulty] * 100 * 0.3 - offerA.conditions.length * 10;
  const scoreB = offerB.reward * 0.6 + difficultyScore[offerB.difficulty] * 100 * 0.3 - offerB.conditions.length * 10;

  if (scoreA >= scoreB) {
    const reasons: string[] = [];
    if (offerA.reward > offerB.reward) reasons.push("wyższa premia");
    if (difficultyScore[offerA.difficulty] > difficultyScore[offerB.difficulty]) reasons.push("łatwiejsze warunki");
    if (offerA.conditions.length < offerB.conditions.length) reasons.push("mniej warunków do spełnienia");
    return {
      winner: offerA,
      reason: reasons.length > 0 ? reasons.join(", ") : "lepszy stosunek premii do wymagań",
    };
  } else {
    const reasons: string[] = [];
    if (offerB.reward > offerA.reward) reasons.push("wyższa premia");
    if (difficultyScore[offerB.difficulty] > difficultyScore[offerA.difficulty]) reasons.push("łatwiejsze warunki");
    if (offerB.conditions.length < offerA.conditions.length) reasons.push("mniej warunków do spełnienia");
    return {
      winner: offerB,
      reason: reasons.length > 0 ? reasons.join(", ") : "lepszy stosunek premii do wymagań",
    };
  }
}

// --- Page ---

export default async function ComparisonPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const comparisons = await getAllComparisons();
  const comparison = comparisons.find((c) => c.slug === slug);

  if (!comparison) notFound();

  const { offerA, offerB } = comparison;
  const verdict = getVerdict(offerA, offerB);

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
        name: `${offerA.bankName} vs ${offerB.bankName}`,
        item: `https://cebulazysku.pl/porownanie/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Oferty</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {offerA.bankName} vs {offerB.bankName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Scale className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {offerA.bankName} vs {offerB.bankName}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Porównanie premii bankowych — który bank da Ci więcej? 🧅
          </p>
        </div>

        {/* Comparison Table */}
        <ComparisonTable offerA={offerA} offerB={offerB} />

        {/* Verdict */}
        <Card className="mt-8 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 shrink-0">
                <Trophy className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-1">
                  Nasza rekomendacja: {verdict.winner.bankName}
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                  {verdict.winner.bankName} wygrywa to porównanie dzięki:{" "}
                  <span className="font-medium text-foreground">{verdict.reason}</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link href={`/oferta/${verdict.winner.slug}`}>
                    <Button className="gap-2">
                      Zobacz ofertę {verdict.winner.bankName}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href={`/oferta/${verdict.winner === offerA ? offerB.slug : offerA.slug}`}
                  >
                    <Button variant="outline" className="gap-2">
                      Zobacz ofertę{" "}
                      {verdict.winner === offerA ? offerB.bankName : offerA.bankName}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Other comparisons */}
        {comparisons.length > 1 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold mb-4">
              Inne porównania
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comparisons
                .filter((c) => c.slug !== slug)
                .slice(0, 6)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/porownanie/${c.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <Scale className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium">
                      {c.offerA.bankName} vs {c.offerB.bankName}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {c.offerA.reward} vs {c.offerB.reward} zł
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center py-8 mt-8 bg-muted/30 rounded-2xl">
          <h2 className="text-xl font-semibold mb-2">
            Nie wiesz którą wybrać?
          </h2>
          <p className="text-muted-foreground mb-4">
            Śledź obie promocje jednocześnie — nasz tracker pilnuje warunków za Ciebie!
          </p>
          <Link href="/rejestracja">
            <Button size="lg" className="gap-2">
              Załóż konto — za darmo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
    </>
  );
}
