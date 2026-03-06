import { Metadata } from "next";
import Link from "next/link";
import { Users, Target, Shield, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "O nas",
  description:
    "Poznaj BankPremie – serwis porównujący promocje bankowe w Polsce. Dowiedz się o naszej misji i modelu działania.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-4">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-extrabold">O nas</h1>
      </div>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
        BankPremie to niezależny serwis informacyjny pomagający porównywać
        promocje bankowe i śledzić postępy spełniania ich warunków.
      </p>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Nasza misja</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Banki regularnie oferują premie za otwarcie konta i spełnienie
          określonych warunków. Problem polega na tym, że te promocje są
          rozproszone po wielu stronach, warunki bywają skomplikowane, a
          śledzenie postępów jest trudne.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          BankPremie rozwiązuje ten problem – zbieramy aktualne promocje w
          jednym miejscu, prezentujemy warunki w przejrzysty sposób i
          oferujemy tracker, który pomaga nie przegapić żadnego warunku.
        </p>
      </section>

      {/* Values */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">Co nas wyróżnia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Target,
              title: "Przejrzystość",
              desc: "Każda oferta ma jasno opisane warunki, kwotę premii, trudność i termin. Bez ukrytych haczyków.",
            },
            {
              icon: Shield,
              title: "Bezpieczeństwo",
              desc: "Prezentujemy wyłącznie oferty licencjonowanych banków objętych Bankowym Funduszem Gwarancyjnym.",
            },
            {
              icon: Users,
              title: "Niezależność",
              desc: "Kolejność ofert nie jest uzależniona od prowizji afiliacyjnej. Prezentujemy obiektywne informacje.",
            },
            {
              icon: Heart,
              title: "Bezpłatność",
              desc: "Korzystanie z serwisu i trackera jest całkowicie darmowe. Nie pobieramy żadnych opłat od użytkowników.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="pt-6">
                <item.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Affiliate model */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Model działania</h2>
        <div className="rounded-2xl bg-muted/50 p-6 space-y-3">
          <p className="text-muted-foreground leading-relaxed">
            BankPremie utrzymuje się z <strong>prowizji afiliacyjnych</strong>.
            Oznacza to, że gdy klikniesz link prowadzący do strony banku i
            otworzysz konto, bank może wypłacić nam prowizję za
            polecenie.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>Co ważne:</strong> korzystanie z naszych linków nie wiąże
            się z żadnymi dodatkowymi kosztami dla Ciebie. Otrzymujesz tę samą
            ofertę, co bezpośrednio na stronie banku – a często nawet lepszą,
            bo banki przygotowują specjalne warunki dla partnerów afiliacyjnych.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Prowizje afiliacyjne <strong>nie wpływają</strong> na kolejność
            prezentacji ofert w serwisie. Naszym priorytetem jest obiektywna
            i rzetelna informacja.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mb-12">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="font-bold text-amber-900 mb-2">Ważna informacja</h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            BankPremie ma charakter wyłącznie informacyjny i{" "}
            <strong>nie stanowi doradztwa finansowego</strong>, inwestycyjnego
            ani prawnego. Przed podjęciem decyzji finansowych zalecamy
            zapoznanie się z pełnymi warunkami oferty na stronie banku.
            Przedstawione informacje mogą nie być w pełni aktualne –
            szczegółowe warunki promocji dostępne są na stronach
            poszczególnych banków.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link href="/#oferty">
          <Button size="lg" className="gap-2 text-base px-10">
            Sprawdź aktualne promocje
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
