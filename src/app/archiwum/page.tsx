// @author Claude Code (claude-opus-4-6) | 2026-03-18 — initial version
// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26 — added ArchiveFilters with search, bank filter, reward range, stats
// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-29 — code review fixes: OG metadata, shadcn Breadcrumb, Button asChild
import { Metadata } from "next";
import Link from "next/link";
import { fetchExpiredOffersFromDB } from "@/lib/offers";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { ArchiveFilters } from "@/components/ArchiveFilters";
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
  openGraph: {
    title: "Archiwum promocji bankowych – CebulaZysku",
    description:
      "Lista zakończonych promocji bankowych. Sprawdź archiwalne warunki ofert i daty wygaśnięcia.",
    type: "website",
    url: "https://cebulazysku.pl/archiwum",
  },
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
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Strona główna</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Archiwum promocji</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
        <ArchiveFilters offers={expiredOffers} />
      )}

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Szukasz aktualnych zysków?</h2>
        <Button size="lg" className="gap-2 px-8" asChild>
          <Link href="/ranking">
            Zobacz aktualny ranking
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
