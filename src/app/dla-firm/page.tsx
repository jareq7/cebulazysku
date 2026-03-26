// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
import { Metadata } from "next";
import Link from "next/link";
import { fetchOffersFromDB } from "@/lib/offers";
import type { BankOffer } from "@/data/banks";
import { JsonLd } from "@/components/JsonLd";
import { OfferCard } from "@/components/OfferCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  Clock,
  TrendingUp,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Konto firmowe z premią — najlepsze oferty dla firm 2026 | CebulaZysku",
  description:
    "Porównaj konta firmowe z premiami bankowymi. Otwórz konto dla firmy i odbierz bonus nawet do kilkuset złotych. Sprawdź warunki i wybierz najlepszą ofertę!",
  openGraph: {
    title: "Konto firmowe z premią — CebulaZysku",
    description:
      "Najlepsze premie bankowe dla firm i jednoosobowych działalności gospodarczych.",
    type: "website",
    url: "https://cebulazysku.pl/dla-firm",
  },
  alternates: {
    canonical: "https://cebulazysku.pl/dla-firm",
  },
};

export default async function DlaFirmPage() {
  const allOffers = await fetchOffersFromDB();
  const businessOffers = allOffers
    .filter((o) => o.isBusiness)
    .sort((a, b) => b.reward - a.reward);

  // Also show personal offers for comparison
  const personalOffers = allOffers
    .filter((o) => !o.isBusiness && o.hasUserReward)
    .sort((a, b) => b.reward - a.reward)
    .slice(0, 3);

  const totalBusinessReward = businessOffers.reduce((sum, o) => sum + o.reward, 0);

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
        name: "Konta firmowe z premią",
        item: "https://cebulazysku.pl/dla-firm",
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
              <BreadcrumbPage>Konta firmowe</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-7 w-7 text-emerald-500" />
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Konta firmowe z premią
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Prowadzisz firmę lub jednoosobową działalność? Otwierając konto firmowe
            z promocji, możesz zyskać dodatkowe pieniądze na start — bez ukrytych kosztów.
          </p>
          {businessOffers.length > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              🧅 {businessOffers.length} ofert{businessOffers.length === 1 ? "a" : businessOffers.length < 5 ? "y" : ""} firmow{businessOffers.length === 1 ? "a" : businessOffers.length < 5 ? "e" : "ych"}, łącznie do{" "}
              <span className="font-bold text-emerald-600">{totalBusinessReward} zł</span>{" "}
              premii
            </p>
          )}
        </div>

        {/* Trust signals */}
        <section className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-medium">Bezpieczeństwo BFG</p>
                <p className="text-xs text-muted-foreground">
                  Środki firmowe objęte gwarancją do 100 000 EUR
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
              <Clock className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-medium">Szybkie otwarcie</p>
                <p className="text-xs text-muted-foreground">
                  Online, z NIP-em i dowodem — bez wizyty w oddziale
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
              <TrendingUp className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-medium">Premia na firmę</p>
                <p className="text-xs text-muted-foreground">
                  Dodatkowe pieniądze na działalność — legalnie i bez podatku do 2000 zł
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Business offers */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-2">
            Oferty kont firmowych z premią
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Konta dla firm i JDG — posortowane od najwyższej premii.
          </p>

          {businessOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                <h3 className="font-semibold mb-2">Brak aktywnych ofert firmowych</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Aktualnie nie mamy promocji na konta firmowe. Banki regularnie
                  uruchamiają nowe oferty — wróć tu za kilka dni lub sprawdź oferty osobiste poniżej.
                </p>
                <Link href="/">
                  <Button variant="outline" className="gap-2">
                    Zobacz oferty osobiste
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Personal offers teaser */}
        {personalOffers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-2">
              Może zainteresują Cię też oferty osobiste?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Oprócz konta firmowego, możesz jednocześnie otworzyć konto osobiste z premią
              — to osobne promocje, które się nie wykluczają!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {personalOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
            <div className="text-center mt-4">
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  Wszystkie oferty osobiste
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            Pytania o konta firmowe
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Czy mogę mieć konto firmowe i osobiste w tym samym banku?",
                a: "Tak! To dwa oddzielne produkty. Możesz korzystać z promocji na oba jednocześnie. Niektóre banki dają nawet dodatkowy bonus za posiadanie obu kont.",
              },
              {
                q: "Czy potrzebuję NIP żeby otworzyć konto firmowe?",
                a: "Tak, konto firmowe wymaga numeru NIP. Jeśli prowadzisz jednoosobową działalność gospodarczą (JDG), wystarczy Twój osobisty NIP. Spółki potrzebują NIP spółki.",
              },
              {
                q: "Jak długo trwa otwarcie konta firmowego online?",
                a: "Zwykle 10-15 minut. Potrzebujesz dowodu osobistego, NIP i wpisu do CEIDG/KRS. Większość banków pozwala otworzyć konto bez wizyty w oddziale.",
              },
              {
                q: "Czy premia na konto firmowe jest opodatkowana?",
                a: 'Premie do 2000 zł w ramach "sprzedaży premiowej" są zwolnione z PIT. Jeśli premia wpływa na konto firmowe, może być traktowana jako przychód z działalności — skonsultuj to z księgowym.',
              },
              {
                q: "Czy po premii mogę zamknąć konto firmowe?",
                a: "Tak, ale sprawdź regulamin — niektóre banki wymagają utrzymania konta przez określony czas (np. 3-6 miesięcy). Po tym okresie zamknięcie jest bezpłatne.",
              },
            ].map(({ q, a }) => (
              <Card key={q}>
                <CardContent className="p-4 sm:p-5">
                  <h3 className="font-semibold text-sm mb-1.5">{q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl">
          <Building2 className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold mb-2">
            Śledź premie firmowe z trackerem
          </h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Załóż konto na CebulaZysku — dostaniesz powiadomienie gdy pojawi się
            nowa oferta na konto firmowe z premią!
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
