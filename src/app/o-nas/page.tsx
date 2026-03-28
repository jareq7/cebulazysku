import { Metadata } from "next";
import Link from "next/link";
import { Users, Target, Shield, Heart, ArrowRight, Zap, Bell, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "O nas – Misja CebulaZysku | CebulaZysku",
  description:
    "Poznaj CebulaZysku – niezależny serwis, który obiera premie bankowe warstwa po warstwie. Dowiedz się o naszej misji i zobacz jak pomagamy zarabiać.",
  alternates: {
    canonical: "https://cebulazysku.pl/o-nas",
  },
  openGraph: {
    title: "Kim jesteśmy? Misja | CebulaZysku",
    description: "Poznaj zespół, który testuje i śledzi promocje bankowe w Polsce. Ołupimy banki legalnie!",
    type: "website",
    locale: "pl_PL",
    url: "https://cebulazysku.pl/o-nas",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-4">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-extrabold">O nas</h1>
      </div>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
        CebulaZysku to niezależny serwis, który pomaga obierać premie bankowe
        warstwa po warstwie — porównujemy oferty i pomagamy śledzić warunki. 🧅
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
          CebulaZysku rozwiązuje ten problem – zbieramy aktualne promocje w
          jednym miejscu, prezentujemy warunki w przejrzysty sposób i
          oferujemy tracker, który pilnuje każdej warstwy Twojego zysku.
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

      {/* Persona — Dla kogo jest CebulaZysku? */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Dla kogo jest CebulaZysku?</h2>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-800/40 p-6 space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Jeśli regularnie szukasz sposobów, żeby Twoje pieniądze pracowały ciężej
            niż Ty — jesteś w dobrym miejscu. Nazywamy się <strong>Cebularzami</strong>,
            bo obieramy zyski warstwa po warstwie.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Zapominasz o warunkach?</p>
                <p className="text-xs text-muted-foreground">
                  Nasz Tracker przypomni Ci o każdej płatności i terminie.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Regulaminy Cię przerażają?</p>
                <p className="text-xs text-muted-foreground">
                  Rozbijamy warunki na proste kroki — zero prawniczego żargonu.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Przegapiasz deadline'y?</p>
                <p className="text-xs text-muted-foreground">
                  Powiadomienia email i push, żebyś nie stracił premii.
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium mt-2">
            Sprytny Cebularz nie traci pieniędzy — on je obiera.
          </p>
        </div>
      </section>

      {/* Affiliate model */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Model działania</h2>
        <div className="rounded-2xl bg-muted/50 p-6 space-y-3">
          <p className="text-muted-foreground leading-relaxed">
            CebulaZysku utrzymuje się z <strong>prowizji afiliacyjnych</strong>.
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
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/30 p-6">
          <h2 className="font-bold text-emerald-900 dark:text-emerald-200 mb-2">Ważna informacja</h2>
          <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
            CebulaZysku ma charakter wyłącznie informacyjny i{" "}
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
