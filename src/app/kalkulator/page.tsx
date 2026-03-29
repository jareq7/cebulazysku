// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-29
import { Metadata } from "next";
import { fetchOffersFromDB } from "@/lib/offers";
import { JsonLd } from "@/components/JsonLd";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Calculator } from "lucide-react";
import { CalculatorExtended } from "@/components/CalculatorExtended";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kalkulator premii bankowych — ile możesz zarobić? | CebulaZysku",
  description:
    "Oblicz ile zarobisz na promocjach bankowych. Podaj wpływy, liczbę kont i czas — kalkulator pokaże realne zarobki z premii bankowych. Sprawdź swój potencjał!",
  openGraph: {
    title: "Kalkulator premii bankowych — CebulaZysku",
    description:
      "Ile możesz zarobić na premiach bankowych? Oblicz swój potencjał zarobkowy z naszym kalkulatorem.",
    type: "website",
    url: "https://cebulazysku.pl/kalkulator",
  },
  alternates: {
    canonical: "https://cebulazysku.pl/kalkulator",
  },
};

export default async function KalkulatorPage() {
  const allOffers = await fetchOffersFromDB();
  const activeOffers = allOffers.filter((o) => o.hasUserReward);

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
        name: "Kalkulator premii",
        item: "https://cebulazysku.pl/kalkulator",
      },
    ],
  };

  // JSON-LD: WebApplication
  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Kalkulator premii bankowych — CebulaZysku",
    description:
      "Oblicz ile możesz zarobić na promocjach bankowych w danym okresie.",
    url: "https://cebulazysku.pl/kalkulator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PLN",
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={appLd} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Strona główna</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Kalkulator premii</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="h-7 w-7 text-emerald-500" />
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Kalkulator premii bankowych
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oblicz ile realnie zarobisz na promocjach bankowych. Dostosuj parametry
            do swojej sytuacji — wpływy, liczbę kont i okres, a kalkulator pokaże
            Twój potencjał zarobkowy.
          </p>
        </div>

        {/* Extended Calculator */}
        <CalculatorExtended offers={activeOffers} />
      </div>
    </>
  );
}
