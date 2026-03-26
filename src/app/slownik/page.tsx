// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BookOpen, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import glossaryData from "@/../research/tooltip-glossary.json";
import { GlossarySearch } from "@/components/GlossarySearch";

export const metadata: Metadata = {
  title: "Słownik bankowy — CebulaZysku",
  description:
    "Słownik terminów bankowych dla cebularzy. BIK, BFG, MCC, karencja, rotacja bankowa i więcej. Proste wyjaśnienia bez żargonu! 🧅",
  openGraph: {
    title: "Słownik bankowy — CebulaZysku",
    description:
      "Słownik terminów bankowych dla cebularzy. BIK, BFG, MCC, karencja, rotacja bankowa i więcej. Proste wyjaśnienia bez żargonu! 🧅",
    type: "website",
    url: "https://cebulazysku.pl/slownik",
  },
  alternates: {
    canonical: "https://cebulazysku.pl/slownik",
  },
};

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const difficultyLabels: Record<string, string> = {
  easy: "Łatwa",
  medium: "Średnia",
  hard: "Trudna",
};

// Sort terms alphabetically (Polish locale)
const sortedTerms = [...glossaryData.terms].sort((a, b) =>
  a.term.localeCompare(b.term, "pl")
);

// Group by first letter
const grouped = sortedTerms.reduce<Record<string, typeof sortedTerms>>(
  (acc, item) => {
    const letter = item.term.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(item);
    return acc;
  },
  {}
);

const letters = Object.keys(grouped).sort((a, b) => a.localeCompare(b, "pl"));

export default function SlownikPage() {
  // JSON-LD: DefinedTermSet
  const definedTermSetLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Słownik bankowy CebulaZysku",
    description:
      "Zbiór terminów bankowych wyjaśnionych prostym językiem dla cebularzy.",
    url: "https://cebulazysku.pl/slownik",
    hasDefinedTerm: sortedTerms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.tooltip,
    })),
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
        name: "Słownik bankowy",
        item: "https://cebulazysku.pl/slownik",
      },
    ],
  };

  return (
    <>
      <JsonLd data={definedTermSetLd} />
      <JsonLd data={breadcrumbLd} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Strona główna</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Słownik bankowy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Słownik bankowy cebularza 🧅
            </h1>
          </div>
          <p className="text-muted-foreground">
            Nie wiesz co to MCC albo karencja? Spokojnie — tu wyjaśniamy bankowy
            żargon prostym językiem. Kliknij literę lub wyszukaj termin.
          </p>
        </div>

        {/* Search (client component) */}
        <GlossarySearch terms={sortedTerms} />

        {/* Alphabet navigation */}
        <nav className="flex flex-wrap gap-1.5 mb-8" aria-label="Nawigacja alfabetyczna">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#${letter.toLowerCase()}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 transition-colors"
            >
              {letter}
            </a>
          ))}
        </nav>

        {/* Terms grouped by letter */}
        <div className="space-y-8">
          {letters.map((letter) => (
            <section key={letter} id={letter.toLowerCase()}>
              <h2 className="text-lg font-bold mb-3 border-b pb-1 scroll-mt-20">
                {letter}
              </h2>
              <div className="space-y-3">
                {grouped[letter].map((item) => (
                  <Card
                    key={item.term}
                    id={item.term.toLowerCase().replace(/\s+/g, "-")}
                    className="scroll-mt-20"
                  >
                    <CardContent className="p-4 sm:p-5">
                      <h3 className="font-semibold text-base mb-1.5">
                        {item.term}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.tooltip}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Difficulty levels */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Poziomy trudności ofert
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Każda oferta na CebulaZysku ma przypisany poziom trudności — oto co
            oznaczają:
          </p>
          <div className="grid gap-3">
            {(Object.entries(glossaryData.difficulties) as [string, string][]).map(
              ([key, desc]) => (
                <Card key={key}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <Badge className={`${difficultyColors[key]} shrink-0 mt-0.5`}>
                      {difficultyLabels[key]}
                    </Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 mt-8 bg-muted/30 rounded-2xl">
          <h2 className="text-xl font-semibold mb-2">
            Gotowy żeby obrać pierwszą cebulkę?
          </h2>
          <p className="text-muted-foreground mb-4">
            Teraz gdy znasz już żargon — sprawdź aktualne oferty z premiami!
          </p>
          <Link href="/">
            <Button size="lg" className="gap-2">
              Zobacz oferty
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
    </>
  );
}
