import { Metadata } from "next";
import Link from "next/link";
import { fetchExpiredOffersFromDB } from "@/lib/offers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JsonLd } from "@/components/JsonLd";
import {
  ArrowRight,
  History,
  Info,
} from "lucide-react";

export const revalidate = 3600; // Archiwum rzadziej rewalidujemy

export const metadata: Metadata = {
  title: "Archiwum promocji bankowych – zakończone oferty | CebulaZysku",
  description:
    "Lista zakończonych promocji bankowych. Sprawdź archiwalne warunki ofert, regulaminy i daty wygaśnięcia. Bądź gotowy na powrót promocji po okresie karencji.",
  alternates: {
    canonical: "https://cebulazysku.pl/archiwum",
  },
};

export default async function ArchivePage() {
  const expiredOffers = await fetchExpiredOffersFromDB();

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
        name: "Archiwum",
        item: "https://cebulazysku.pl/archiwum",
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Strona główna
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Archiwum promocji</span>
      </nav>

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium mb-4">
          <History className="h-4 w-4" />
          Zakończone okazje
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          Archiwum <span className="text-muted-foreground">promocji</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Tutaj znajdziesz oferty, które już wygasły. Przydatne, jeśli chcesz
          sprawdzić regulamin starej promocji lub obliczyć, kiedy mija Twój
          okres karencji.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 rounded-2xl p-6 mb-12 flex gap-4 items-start">
        <Info className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
          <p className="font-bold mb-1">Dlaczego warto tu zaglądać?</p>
          <p>
            Banki często powtarzają swoje promocje. Jeśli widzisz tu świetną
            ofertę, która wygasła, istnieje duża szansa, że za kilka miesięcy
            pojawi się nowa edycja. Znajomość archiwalnych warunków pomoże Ci
            lepiej zaplanować swoją strategię "cebulenia"!
          </p>
        </div>
      </div>

      {expiredOffers.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl">
          <History className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">Archiwum jest obecnie puste.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {expiredOffers.map((offer) => (
            <Card key={offer.id} className="opacity-75 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  {offer.bankLogo && offer.bankLogo.startsWith("http") ? (
                    <img
                      src={offer.bankLogo}
                      alt={`${offer.bankName} logo`}
                      className="h-10 w-10 rounded-xl object-contain bg-white p-1 shrink-0 opacity-50"
                    />
                  ) : (
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold shrink-0 opacity-50"
                      style={{ backgroundColor: offer.bankColor }}
                    >
                      {offer.bankName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">
                      {offer.bankName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {offer.offerName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-muted-foreground">
                      {offer.reward} zł
                    </p>
                    <p className="text-[10px] text-muted-foreground">było do zdobycia</p>
                  </div>
                  <Link href={`/oferta/${offer.slug}`}>
                    <Button size="sm" variant="ghost" className="gap-1">
                      Szczegóły <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Szukasz aktualnych zysków?</h2>
        <Link href="/ranking">
          <Button size="lg" className="gap-2 px-8">
            Zobacz aktualny ranking
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
