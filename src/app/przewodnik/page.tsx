// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LeadMagnetForm } from "@/components/LeadMagnetForm";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  BookOpen,
  CheckCircle,
  Shield,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Darmowy Przewodnik Cebularza — pobierz PDF | CebulaZysku",
  description:
    "Pobierz bezpłatny Kodeks Cebularza 2026. Dowiedz się krok po kroku jak zarabiać do 5000 zł rocznie na premiach bankowych. 10 stron praktycznej wiedzy.",
  openGraph: {
    title: "Darmowy Przewodnik Cebularza — CebulaZysku",
    description:
      "Kodeks Cebularza 2026: jak zarabiać do 5000 zł rocznie na premiach bankowych. Pobierz PDF za darmo.",
    type: "website",
    url: "https://cebulazysku.pl/przewodnik",
  },
  alternates: {
    canonical: "https://cebulazysku.pl/przewodnik",
  },
};

const chapters = [
  {
    title: "Haczyki — Prawda o budżetach reklamowych",
    description: "Dlaczego banki dają Ci darmowe pieniądze i jak to wykorzystać.",
  },
  {
    title: "3 mity, które Cię powstrzymują",
    description: "BIK, podatki, bezpieczeństwo — obalamy popularne obawy.",
  },
  {
    title: "Twój plan na pierwsze 1000 zł",
    description: "Krok po kroku: które 2 konta otworzyć jako pierwsze.",
  },
  {
    title: "Rotacja bankowa — Kod Nieskończoności",
    description: "Jak korzystać z karencji i zarabiać co rok od nowa.",
  },
  {
    title: "Tracker warunków",
    description: "Jak CebulaZysku pomaga pilnować terminów i nie stracić premii.",
  },
  {
    title: "Zaawansowane strategie",
    description: "Konta firmowe, cashback, połączenie z lokatami.",
  },
];

export default function PrzewodnikPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Strona glowna",
        item: "https://cebulazysku.pl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Przewodnik Cebularza",
        item: "https://cebulazysku.pl/przewodnik",
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Strona glowna</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Przewodnik Cebularza</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-4">
            <BookOpen className="h-4 w-4" />
            Darmowy E-Book
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Kodeks Cebularza 2026
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Jak przestac placic bankom i zmusic je, by wyplacily Ci{" "}
            <span className="font-bold text-emerald-600">5000 zl</span> w jeden rok.
            Przewodnik krok po kroku.
          </p>
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { icon: BookOpen, label: "10 stron", desc: "praktycznej wiedzy" },
            { icon: Shield, label: "100% legalnie", desc: "sprzedaz premiowa" },
            { icon: TrendingUp, label: "Do 5000 zl", desc: "rocznie z premii" },
            { icon: Clock, label: "15 min/mies.", desc: "pracy wlasnej" },
          ].map(({ icon: Icon, label, desc }) => (
            <Card key={label}>
              <CardContent className="p-3 text-center">
                <Icon className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Download form */}
        <div className="mb-12">
          <LeadMagnetForm />
        </div>

        {/* What's inside */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            Co znajdziesz w srodku?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chapters.map((ch, i) => (
              <Card key={ch.title}>
                <CardContent className="p-4 flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{ch.title}</h3>
                    <p className="text-xs text-muted-foreground">{ch.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* For whom */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Dla kogo jest ten przewodnik?
          </h2>
          <div className="space-y-2">
            {[
              "Nigdy nie korzystałeś z promocji bankowych i nie wiesz od czego zacząć",
              "Słyszałeś o premiach, ale boisz się, że to scam lub zepsuje Ci BIK",
              "Chcesz dodatkowe pieniądze bez ryzyka i bez inwestowania",
              "Już cebulujesz, ale chcesz poznać zaawansowane strategie",
              "Prowadzisz firmę i chcesz zarabiać też na kontach firmowych",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Second CTA */}
        <LeadMagnetForm />

        {/* Back link */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Wróć do aktualnych ofert
          </Link>
        </div>
      </div>
    </>
  );
}
