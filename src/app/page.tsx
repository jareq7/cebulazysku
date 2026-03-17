import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OfferFilters } from "@/components/OfferFilters";
import { fetchOffersFromDB, getTotalPotentialEarnings } from "@/lib/offers";
import {
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const totalEarnings = await getTotalPotentialEarnings();
  const title = "Promocje Bankowe i Ranking Kont 2026 – Zgarnij Premie | CebulaZysku";
  const description = `Aktualne promocje bankowe i ranking kont osobistych. Porównaj oferty, sprawdź haczyki i zyskaj nawet ${totalEarnings} zł na start. Łupimy banki legalnie! 🧅`;

  return {
    title,
    description,
    alternates: {
      canonical: "https://cebulazysku.pl",
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pl_PL",
      url: "https://cebulazysku.pl",
    },
  };
}

export default async function Home() {
  const totalEarnings = await getTotalPotentialEarnings();
  const bankOffers = await fetchOffersFromDB();
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CebulaZysku",
    url: "https://cebulazysku.pl",
    description: `Zyskaj nawet ${totalEarnings} zł dzięki promocjom bankowym. Ranking CebulaZysku pomoże Ci ołupić banki legalnie!`,
    inLanguage: "pl-PL",
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-background dark:via-background dark:to-background">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%228%22%20fill%3D%22%231B5E20%22%20fill-opacity%3D%220.04%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              🧅 {bankOffers.length} ofert do ołupienia
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Obierz premie bankowe{" "}
              <span className="bg-gradient-to-r from-emerald-700 to-green-500 bg-clip-text text-transparent">
                warstwa po warstwie
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Jak cebula — każda warstwa to kolejny zysk. Porównuj promocje, śledź
              warunki i zbieraj premie. Aktualnie do obrania nawet{" "}
              <strong className="text-emerald-600 font-bold">{totalEarnings} zł</strong>!
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/#oferty">
                <Button size="lg" className="gap-2 text-base px-8">
                  Sprawdź oferty
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/jak-to-dziala">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Jak to działa?
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
            {[
              { label: "Do obrania", value: `${totalEarnings} zł`, icon: TrendingUp },
              { label: "Ofert do łupienia", value: `${bankOffers.length}`, icon: Sparkles },
              { label: "Darmowych kont", value: `${bankOffers.filter(o => o.monthlyFee === 0 && o.freeIf === null).length}`, icon: Shield },
              { label: "Min. czas", value: "2 mies.", icon: Clock },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/80 dark:bg-card/80 backdrop-blur p-4 sm:p-6 text-center shadow-sm"
              >
                <stat.icon className="mx-auto h-6 w-6 text-emerald-600 mb-2" />
                <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <DisclaimerBanner />

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Jak obieramy zysk? 🧅</h2>
          <p className="mt-3 text-muted-foreground">
            Trzy warstwy do Twojej premii
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              step: "🧅",
              title: "Wybierz cebulkę",
              description:
                "Przeglądaj oferty banków i wybierz te, które chcesz ołupić.",
            },
            {
              step: "🔪",
              title: "Załóż konto i obieraj",
              description:
                "Załóż konto przez nasz link i dodaj ofertę do trackera.",
            },
            {
              step: "💰",
              title: "Zbieraj warstwy zysku",
              description:
                "Spełniaj warunki, odhaczaj w trackerze i odbieraj premie!",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-bold text-xl mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Offers */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="oferty">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">🧅 Co dzisiaj obieramy?</h2>
            <p className="mt-2 text-muted-foreground">
              Przeglądaj oferty i wybierz swoje cebulki
            </p>
          </div>
        </div>
        <OfferFilters offers={bankOffers} />
      </section>

      {/* Social proof */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 p-6 text-center">
          <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">
            🧅 Dołącz do społeczności cebularzy
          </p>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
            Razem łupimy banki legalnie — obierz swoją pierwszą premię
          </p>
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Dlaczego warto?</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "Bezpieczne 🛡️",
                desc: "Tylko licencjonowane banki z gwarancją BFG. Żadna podejrzana cebulka.",
              },
              {
                icon: CheckCircle,
                title: "Sprawdzone ✅",
                desc: "Każda oferta zweryfikowana i aktualizowana z feedu banków.",
              },
              {
                icon: Clock,
                title: "Tracker ⏰",
                desc: "Przypomnimy Ci o warunkach, żebyś nie przegapił żadnej warstwy.",
              },
              {
                icon: TrendingUp,
                title: "Realne premie 💰",
                desc: `Nawet ${totalEarnings} zł rocznie. To dużo cebuli!`,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-background p-6 text-center shadow-sm"
              >
                <item.icon className="mx-auto h-8 w-8 text-emerald-600 mb-3" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Gotowy na obieranie? 🧅
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Załóż darmowe konto i zacznij łupić premie bankowe.
        </p>
        <Link href="/rejestracja">
          <Button size="lg" className="mt-8 gap-2 text-base px-10">
            Zacznij obierać
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </section>
    </>
  );
}
