import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Search,
  MousePointerClick,
  ListChecks,
  Banknote,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Jak to działa?",
  description:
    "Dowiedz się, jak zarabiać na promocjach bankowych krok po kroku. Załóż konto, spełniaj warunki i odbieraj premie!",
};

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: "1. Przeglądaj oferty",
      description:
        "Sprawdź aktualne promocje bankowe na naszej stronie. Każda oferta ma jasno opisane warunki, kwotę premii i poziom trudności. Wybierz te, które najlepiej pasują do Twojej sytuacji.",
    },
    {
      icon: MousePointerClick,
      title: "2. Załóż konto bankowe",
      description:
        "Kliknij link afiliacyjny przy wybranej ofercie i załóż konto bezpośrednio na stronie banku. Większość kont można otworzyć w pełni online w kilka minut.",
    },
    {
      icon: ListChecks,
      title: "3. Śledź warunki w trackerze",
      description:
        "Dodaj ofertę do swojego dashboardu i zaznaczaj wykonane warunki: przelewy, płatności kartą, BLIK i inne. Tracker pokaże Ci postęp w czasie rzeczywistym.",
    },
    {
      icon: Banknote,
      title: "4. Odbierz premię",
      description:
        "Po spełnieniu wszystkich warunków bank automatycznie wypłaci premię na Twoje konto. Gotowe! Możesz przejść do kolejnej oferty.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Jak to działa?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Odbieranie premii bankowych jest prostsze niż myślisz.
          Wystarczą 4 kroki.
        </p>
      </div>

      <div className="space-y-12">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex gap-6 items-start"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <step.icon className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{step.title}</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl bg-amber-50 border border-amber-200 p-8">
        <div className="flex items-start gap-4">
          <ShieldCheck className="h-8 w-8 text-amber-600 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold">Czy to bezpieczne?</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Tak! Zakładasz konta w normalnych, licencjonowanych bankach
              objętych Bankowym Funduszem Gwarancyjnym (BFG). Twoje pieniądze
              są chronione do kwoty 100 000 EUR. Nasz serwis jedynie pomaga Ci
              znaleźć najlepsze oferty i śledzić postępy – nigdy nie mamy
              dostępu do Twoich danych bankowych.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/rejestracja">
          <Button size="lg" className="gap-2 text-base px-10">
            Sprawdź oferty
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
