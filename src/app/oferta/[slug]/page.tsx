import { existsSync } from "fs";
import { join } from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  getDifficultyLabel,
  getDifficultyColor,
  conditionTypeLabels,
} from "@/data/banks";
import { fetchOffersFromDB, fetchNoRewardOffers, fetchOfferBySlug, fetchAffiliateSourcesForOffer } from "@/lib/offers";
import { resolveAffiliateUrl } from "@/lib/affiliate-routing";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JsonLd } from "@/components/JsonLd";
import { OfferTrackingActions } from "@/components/OfferTrackingActions";
import { OfferCard } from "@/components/OfferCard";
import { OfferVideoPlayer } from "@/components/OfferVideoPlayer";
import { RenderMarkdown } from "@/components/RenderMarkdown";
import { TrackViewItem } from "@/components/TrackViewItem";
import { ExpiredOfferBanner } from "@/components/ExpiredOfferBanner";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
} from "lucide-react";

export async function generateStaticParams() {
  const [offers, noRewardOffers] = await Promise.all([
    fetchOffersFromDB(),
    fetchNoRewardOffers(),
  ]);
  return [...offers, ...noRewardOffers].map((offer) => ({
    slug: offer.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const offer = await fetchOfferBySlug(slug);
  if (!offer) return {};

  const title = offer.hasUserReward
    ? `Promocja ${offer.bankName}: ${offer.reward} zł za ${offer.offerName} | CebulaZysku`
    : `${offer.bankName} — Otwórz konto | CebulaZysku`;
  const description = offer.hasUserReward
    ? `${offer.shortDescription} Zobacz jak ołupić bank ${offer.bankName} i zgarnąć ${offer.reward} zł premii. Sprawdzone warunki, instrukcja krok po kroku i tracker postępów! 🧅`
    : `Otwórz konto w ${offer.bankName}. ${offer.shortDescription}`;
  const ogImageUrl = `https://cebulazysku.pl/api/og?type=offer&bank=${encodeURIComponent(offer.bankName)}&reward=${offer.reward}&title=${encodeURIComponent(offer.offerName)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "pl_PL",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    alternates: {
      canonical: `https://cebulazysku.pl/oferta/${offer.slug}`,
    },
  };
}

export default async function OfferDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const offer = await fetchOfferBySlug(slug);

  if (!offer) {
    notFound();
  }

  // Resolve best affiliate link via routing
  const affiliateSources = await fetchAffiliateSourcesForOffer(offer.id);
  const { url: bestAffiliateUrl, network: affiliateNetwork } = resolveAffiliateUrl(
    offer.affiliateUrl,
    affiliateSources
  );

  const deadlineMs = offer.deadline ? new Date(offer.deadline).getTime() : NaN;
  const daysLeft = !isNaN(deadlineMs)
    ? Math.max(0, Math.ceil((deadlineMs - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const faqJsonLd = offer.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: offer.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } : null;

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
        name: "Oferty",
        item: "https://cebulazysku.pl/#oferty",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: offer.offerName,
        item: `https://cebulazysku.pl/oferta/${offer.slug}`,
      },
    ],
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${offer.bankName} - ${offer.offerName}`,
    "image": offer.bankLogo && offer.bankLogo.startsWith('http') ? offer.bankLogo : "https://cebulazysku.pl/logo-wide.png",
    "description": offer.shortDescription || `Otwórz konto w banku ${offer.bankName} i zgarnij gwarantowane ${offer.reward} zł premii. Sprawdź naszą instrukcję krok po kroku!`,
    "brand": {
      "@type": "Brand",
      "name": offer.bankName
    },
    "offers": {
      "@type": "Offer",
      "url": `https://cebulazysku.pl/oferta/${offer.slug}`,
      "priceCurrency": "PLN",
      "price": offer.reward.toString(),
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": offer.bankName
      },
      ...(offer.deadline && { "priceValidUntil": new Date(offer.deadline).toISOString().split('T')[0] })
    }
  };

  const howToJsonLd = offer.conditions.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `Jak zdobyć ${offer.reward} zł w banku ${offer.bankName}`,
    "description": `Instrukcja krok po kroku, jak założyć ${offer.offerName} i spełnić warunki, aby otrzymać premię.`,
    "totalTime": "P1M",
    "step": offer.conditions.map((condition) => ({
      "@type": "HowToStep",
      "name": condition.label,
      "text": condition.description + (condition.requiredCount > 1 ? ` (Wykonaj ${condition.requiredCount} razy)` : ""),
      "url": `https://cebulazysku.pl/oferta/${offer.slug}#warunki`
    }))
  } : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={productJsonLd} />
      {howToJsonLd && <JsonLd data={howToJsonLd} />}

      {offer.status === "expired" && (
        <ExpiredOfferBanner bankName={offer.bankName} expiredDate={offer.lastUpdated} />
      )}

      <TrackViewItem
        itemId={offer.slug}
        itemName={offer.bankName}
        itemCategory={offer.difficulty}
        price={offer.reward}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Strona główna
        </Link>
        <span>/</span>
        <Link href="/#oferty" className="hover:text-foreground transition-colors">
          Oferty
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{offer.bankName}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        {offer.bankLogo && offer.bankLogo.startsWith("http") ? (
          <img
            src={offer.bankLogo}
            alt={`${offer.bankName} logo`}
            className="h-16 w-16 rounded-2xl object-contain bg-white p-1.5 shrink-0"
            width={64}
            height={64}
          />
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-white font-bold text-2xl shrink-0"
            style={{ backgroundColor: offer.bankColor }}
            aria-label={`Logo ${offer.bankName}`}
          >
            {offer.bankName.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{offer.bankName}</p>
          <h1 className="text-3xl font-extrabold">{offer.offerName}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge className={getDifficultyColor(offer.difficulty)}>
              {getDifficultyLabel(offer.difficulty)}
            </Badge>
            {daysLeft !== null && offer.status === "active" && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Zostało {daysLeft} dni
              </Badge>
            )}
            {offer.status === "expired" && (
              <Badge variant="destructive" className="gap-1">
                Wygasła
              </Badge>
            )}
            {offer.monthlyFee === 0 && (
              <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700">
                Darmowe konto
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right">
          {offer.hasUserReward ? (
            <>
              <p className="text-sm text-muted-foreground">Premia</p>
              <p className="text-4xl font-extrabold text-emerald-600">
                {offer.reward} zł
              </p>
            </>
          ) : (
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Bez premii
            </Badge>
          )}
          {offer.lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Zaktualizowano: {new Date(offer.lastUpdated).toLocaleDateString("pl-PL")}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>O promocji</CardTitle>
            </CardHeader>
            <CardContent>
              <RenderMarkdown text={offer.fullDescription} />
              {offer.freeIf && (
                <p className="mt-4 text-sm">
                  <strong>Konto bezpłatne jeśli:</strong>{" "}
                  <span className="text-emerald-600">{offer.freeIf}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Video */}
          {offer.conditions.length > 0 && offer.status === "active" && (
            <Card>
              <CardHeader>
                <CardTitle>Oferta w skrócie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mx-auto max-w-[360px] sm:max-w-[400px] lg:max-w-[440px]">
                  <OfferVideoPlayer
                    offer={{
                      bankName: offer.bankName,
                      offerName: offer.offerName,
                      reward: offer.reward,
                      conditions: offer.conditions.map((c) => ({ label: c.label })),
                      pros: offer.pros,
                      bankLogo: offer.bankLogo,
                      voiceoverUrl: existsSync(join(process.cwd(), "public", "audio", "voiceovers", `${offer.slug}.mp3`))
                        ? `/audio/voiceovers/${offer.slug}.mp3`
                        : undefined,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Banner */}
          {offer.bannerUrl && offer.status === "active" && (
            <a
              href={offer.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block overflow-hidden rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={offer.bannerUrl}
                alt={`Baner promocyjny ${offer.bankName} – ${offer.offerName}`}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </a>
          )}

          {/* Conditions */}
          {offer.conditions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Warunki do spełnienia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {offer.conditions.map((condition) => (
                  <div
                    key={condition.id}
                    className="rounded-lg border p-4 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{condition.label}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {conditionTypeLabels[condition.type]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {condition.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {condition.perMonth
                        ? `${condition.requiredCount}x miesięcznie przez ${condition.monthsRequired} mies.`
                        : condition.requiredCount > 1
                          ? `${condition.requiredCount}x jednorazowo`
                          : `Jednorazowo`}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Pros & Cons */}
          {(offer.pros.length > 0 || offer.cons.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Zalety i wady</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {offer.pros.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-emerald-600 flex items-center gap-1.5">
                        <Plus className="h-4 w-4" /> Zalety
                      </h4>
                      {offer.pros.map((pro, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {offer.cons.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-600 flex items-center gap-1.5">
                        <Minus className="h-4 w-4" /> Wady
                      </h4>
                      {offer.cons.map((con, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                          <span>{con}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* FAQ */}
          {offer.faq.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Najczęściej zadawane pytania</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {offer.faq.map((item, i) => (
                  <div key={i}>
                    <h4 className="font-semibold">{item.question}</h4>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                    {i < offer.faq.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardContent className="pt-6">
              {offer.status === "active" && offer.hasUserReward ? (
                <OfferTrackingActions
                  offerId={offer.id}
                  bankName={offer.bankName}
                  conditionIds={offer.conditions.map((c) => c.id)}
                  affiliateUrl={bestAffiliateUrl}
                  reward={offer.reward}
                  deadline={offer.deadline}
                />
              ) : offer.status === "active" && !offer.hasUserReward ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Otwórz konto w {offer.bankName} przez nasz link
                  </p>
                  {bestAffiliateUrl && bestAffiliateUrl !== "#" ? (
                    <a
                      href={bestAffiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                    >
                      <Button className="w-full">Otwórz konto</Button>
                    </a>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center">
                      Link afiliacyjny w przygotowaniu
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Ta oferta nie jest już dostępna.
                  </p>
                  <Link href="/ranking">
                    <Button className="w-full">Zobacz aktualne oferty</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Zobacz też */}
      {await (async () => {
        const allOffers = await fetchOffersFromDB();
        const related = allOffers
          .filter((o) => o.id !== offer.id)
          .sort((a, b) => {
            if (a.difficulty === offer.difficulty && b.difficulty !== offer.difficulty) return -1;
            if (b.difficulty === offer.difficulty && a.difficulty !== offer.difficulty) return 1;
            return b.reward - a.reward;
          })
          .slice(0, 3);

        return related.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Zobacz też inne oferty</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          </section>
        ) : null;
      })()}
    </div>
  );
}
