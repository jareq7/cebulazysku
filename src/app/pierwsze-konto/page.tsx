// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
import { Metadata } from "next";
import Link from "next/link";
import { fetchOffersFromDB } from "@/lib/offers";
import type { BankOffer } from "@/data/banks";
import { getDifficultyLabel, getDifficultyColor } from "@/data/banks";
import { JsonLd } from "@/components/JsonLd";
import { OfferCard } from "@/components/OfferCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export const revalidate = 3600; // ISR — 1h

export const metadata: Metadata = {
  title: "Pierwsze konto z premią — łatwe oferty dla początkujących | CebulaZysku",
  description:
    "Nigdy nie zakładałeś konta? Zaczynasz przygodę z premiami bankowymi? Tu znajdziesz najłatwiejsze oferty — bez skomplikowanych warunków. Proste, bezpieczne, opłacalne! 🧅",
  openGraph: {
    title: "Pierwsze konto z premią — CebulaZysku",
    description:
      "Najłatwiejsze premie bankowe dla początkujących. Bez żargonu, bez stresu!",
    type: "website",
    url: "https://cebulazysku.pl/pierwsze-konto",
  },
  alternates: {
    canonical: "https://cebulazysku.pl/pierwsze-konto",
  },
};

export default async function PierwszeKontoPage() {
  const allOffers = await fetchOffersFromDB();
  const easyOffers = allOffers
    .filter((o) => o.difficulty === "easy" && o.hasUserReward)
    .sort((a, b) => b.reward - a.reward);

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
        name: "Pierwsze konto z premią",
        item: "https://cebulazysku.pl/pierwsze-konto",
      },
    ],
  };

  const totalEasyReward = easyOffers.reduce((sum, o) => sum + o.reward, 0);

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
              <BreadcrumbPage>Pierwsze konto</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-7 w-7 text-emerald-500" />
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Twoje pierwsze konto z premią
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nigdy nie zbierałeś premii bankowych? Nie martw się — wybraliśmy
            dla Ciebie <span className="font-semibold text-emerald-600">najłatwiejsze oferty</span>,
            które da się ogarnąć bez stresu i żargonu.
          </p>
          {easyOffers.length > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              🧅 {easyOffers.length} łatwych ofert, łącznie do{" "}
              <span className="font-bold text-emerald-600">{totalEasyReward} zł</span>{" "}
              premii
            </p>
          )}
        </div>

        {/* How it works — simplified */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Jak to działa? 3 proste kroki
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-3">
                  <span className="text-xl font-bold text-emerald-600">1</span>
                </div>
                <h3 className="font-semibold mb-1">Otwórz konto</h3>
                <p className="text-sm text-muted-foreground">
                  Kliknij w ofertę, wypełnij formularz online. Zajmuje to 5-10 minut.
                  Nie musisz nigdzie iść.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-3">
                  <span className="text-xl font-bold text-emerald-600">2</span>
                </div>
                <h3 className="font-semibold mb-1">Spełnij warunki</h3>
                <p className="text-sm text-muted-foreground">
                  Rób normalnie — płać kartą w sklepie, przelej pieniądze.
                  Nasz tracker przypomni Ci co i kiedy.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-3">
                  <span className="text-xl font-bold text-emerald-600">3</span>
                </div>
                <h3 className="font-semibold mb-1">Odbierz premię</h3>
                <p className="text-sm text-muted-foreground">
                  Pieniądze wpłyną na Twoje konto. Możesz je wydać na co chcesz.
                  Serio, to takie proste!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trust signals */}
        <section className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-medium">100% bezpieczne</p>
                <p className="text-xs text-muted-foreground">
                  Wszystkie banki w Polsce są gwarantowane przez BFG
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-medium">Bez zobowiązań</p>
                <p className="text-xs text-muted-foreground">
                  Po premii możesz zamknąć konto — za darmo
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
              <Clock className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-medium">5 minut otwarcia</p>
                <p className="text-xs text-muted-foreground">
                  Wszystko online, bez wychodzenia z domu
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Easy offers */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-2">
            Najłatwiejsze oferty dla początkujących
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Tylko oferty z trudnością „Łatwa" — minimum warunków, maksimum zysku.
          </p>

          {easyOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {easyOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Aktualnie brak łatwych ofert. Sprawdź ponownie za kilka dni — oferty
                  zmieniają się regularnie!
                </p>
                <Link href="/" className="mt-3 inline-block">
                  <Button variant="outline" className="gap-2">
                    Zobacz wszystkie oferty
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>

        {/* FAQ for noobs */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            Najczęstsze pytania
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Czy otwarcie konta jest bezpieczne?",
                a: "Tak! Wszystkie banki w Polsce podlegają nadzorowi KNF, a Twoje pieniądze są gwarantowane przez Bankowy Fundusz Gwarancyjny (BFG) do 100 000 euro. Otwarcie konta to standard — miliony ludzi to robi.",
              },
              {
                q: "Czy muszę zamknąć swoje obecne konto?",
                a: "Nie! Możesz mieć kilka kont jednocześnie. To w pełni legalne. Większość premii wymaga nowego konta w danym banku, ale Twoje obecne konto w innym banku możesz spokojnie zachować.",
              },
              {
                q: "Czy premia bankowa to oszustwo?",
                a: "Absolutnie nie. Banki wydają miliardy na reklamę. Premia za konto to po prostu ich sposób na pozyskanie nowego klienta — zamiast dawać pieniądze reklamodawcom, dają je bezpośrednio Tobie.",
              },
              {
                q: "Czy zapłacę podatek od premii?",
                a: 'W większości przypadków nie! Premie bankowe do 2000 zł w ramach tzw. "sprzedaży premiowej" są zwolnione z podatku dochodowego. Szczegóły znajdziesz na naszym blogu.',
              },
              {
                q: "Co jeśli zapomnę spełnić warunki?",
                a: "Właśnie po to stworzyliśmy CebulaZysku! Nasz tracker przypomina Ci co miesiąc, jakie warunki musisz spełnić. Załóż konto na stronie i nigdy niczego nie przegap.",
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
          <Sparkles className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold mb-2">
            Wybierz swoje pierwsze konto z premią
          </h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Załóż darmowe konto na CebulaZysku — tracker będzie pilnował
            warunków za Ciebie, żebyś nie stracił ani złotówki!
          </p>
          <Link href="/rejestracja">
            <Button size="lg" className="gap-2">
              Zaczynam! Załóż konto
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
    </>
  );
}
