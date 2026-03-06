import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OfferFilters } from "@/components/OfferFilters";
import {
  bankOffers,
  getTotalPotentialEarnings,
} from "@/data/banks";
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

export default function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BankPremie",
    url: "https://bankpremie.pl",
    description:
      "Porównaj promocje bankowe i odbieraj premie za założenie konta.",
    inLanguage: "pl-PL",
  };
  const totalEarnings = getTotalPotentialEarnings();

  return (
    <>
      <JsonLd data={websiteJsonLd} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M15%200L30%2015L15%2030L0%2015Z%22%20fill%3D%22%2310b981%22%20fill-opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Aktualnie {bankOffers.length} aktywnych promocji
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Porównaj promocje i{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                odbieraj premie bankowe
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Porównaj oferty, załóż konta i odbieraj premie. Śledź postępy
              spełniania warunków w jednym miejscu. Aktualnie do odebrania nawet{" "}
              <strong className="text-green-600 font-bold">{totalEarnings} zł</strong>!
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/rejestracja">
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
              { label: "Do odebrania", value: `${totalEarnings} zł`, icon: TrendingUp },
              { label: "Aktywnych ofert", value: `${bankOffers.length}`, icon: Sparkles },
              { label: "Bezpłatnych kont", value: `${bankOffers.filter(o => o.monthlyFee === 0).length}`, icon: Shield },
              { label: "Min. czas", value: "2 mies.", icon: Clock },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/80 backdrop-blur p-4 sm:p-6 text-center shadow-sm"
              >
                <stat.icon className="mx-auto h-6 w-6 text-green-600 mb-2" />
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
          <h2 className="text-3xl font-bold">Jak to działa?</h2>
          <p className="mt-3 text-muted-foreground">
            Trzy proste kroki do dodatkowego zarobku
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Wybierz ofertę",
              description:
                "Przeglądaj aktualne promocje bankowe i wybierz te, które Ci odpowiadają.",
            },
            {
              step: "2",
              title: "Załóż konto i śledź postępy",
              description:
                "Otwórz konto przez nasz link afiliacyjny i dodaj ofertę do trackera.",
            },
            {
              step: "3",
              title: "Spełniaj warunki i odbieraj premie",
              description:
                "Zaznaczaj wykonane zadania w trackerze i odbieraj premie bankowe!",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-xl mb-4">
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
            <h2 className="text-3xl font-bold">Aktualne promocje</h2>
            <p className="mt-2 text-muted-foreground">
              Porównaj oferty i wybierz najlepsze dla siebie
            </p>
          </div>
        </div>
        <OfferFilters offers={bankOffers} />
      </section>

      {/* Social proof */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-green-50 border border-green-100 p-6 text-center">
          <p className="text-lg font-semibold text-green-800">
            Ponad <span className="text-2xl font-extrabold">1 200</span> osób korzysta z BankPremie do śledzenia promocji
          </p>
          <p className="text-sm text-green-700 mt-1">
            Dołącz i odbieraj premie bankowe razem z nami
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
                title: "Bezpieczne",
                desc: "Współpracujemy tylko z licencjonowanymi bankami objętymi BFG.",
              },
              {
                icon: CheckCircle,
                title: "Sprawdzone",
                desc: "Każda oferta jest weryfikowana i aktualizowana na bieżąco.",
              },
              {
                icon: Clock,
                title: "Oszczędność czasu",
                desc: "Tracker automatycznie przypomina o warunkach do spełnienia.",
              },
              {
                icon: TrendingUp,
                title: "Realne premie",
                desc: `Nawet ${totalEarnings} zł rocznie z promocji bankowych.`,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-background p-6 text-center shadow-sm"
              >
                <item.icon className="mx-auto h-8 w-8 text-green-600 mb-3" />
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
          Gotowy na premie bankowe?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Załóż darmowe konto i śledź swoje postępy w odbieraniu premii.
        </p>
        <Link href="/rejestracja">
          <Button size="lg" className="mt-8 gap-2 text-base px-10">
            Załóż konto za darmo
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </section>
    </>
  );
}
