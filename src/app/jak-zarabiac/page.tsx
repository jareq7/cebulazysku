// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-29
import { Metadata } from "next";
import Link from "next/link";
import { fetchOffersFromDB } from "@/lib/offers";
import { pluralize } from "@/lib/pluralize";
import { JsonLd } from "@/components/JsonLd";
import { Card, CardContent } from "@/components/ui/card";
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
  Search,
  UserPlus,
  ListChecks,
  Banknote,
  Repeat,
  ShieldCheck,
  Clock,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Jak zarabiać na promocjach bankowych? Poradnik krok po kroku | CebulaZysku",
  description:
    "Dowiedz się jak legalnie zarabiać na premiach bankowych. 5 prostych kroków: wybierz ofertę, otwórz konto, spełnij warunki, odbierz premię i powtórz. Sprawdzony sposób na dodatkowe pieniądze!",
  openGraph: {
    title: "Jak zarabiać na promocjach bankowych? — CebulaZysku",
    description:
      "Poradnik krok po kroku: jak obierać premie bankowe legalnie i bez ryzyka. 5 kroków do pierwszych dodatkowych złotówek.",
    type: "website",
    url: "https://cebulazysku.pl/jak-zarabiac",
  },
  alternates: {
    canonical: "https://cebulazysku.pl/jak-zarabiac",
  },
};

const steps = [
  {
    icon: Search,
    title: "Wybierz najlepszą ofertę",
    description:
      "Przeglądaj aktualne promocje bankowe na CebulaZysku. Każda oferta ma jasno opisaną premię, warunki i poziom trudności. Na start wybierz ofertę oznaczoną jako \"łatwa\" — wymaga minimum formalności i daje szybką premię.",
    tips: [
      "Zacznij od ofert z największą premią i najłatwiejszymi warunkami",
      "Sprawdź czy nie masz już konta w danym banku — to zazwyczaj dyskwalifikuje",
      "Porównaj oferty na naszym rankingu — sortujemy je po opłacalności",
    ],
    estimatedTime: "10 minut",
  },
  {
    icon: UserPlus,
    title: "Otwórz konto bankowe",
    description:
      "Kliknij link afiliacyjny przy wybranej ofercie i załóż konto na stronie banku. Proces trwa 10-15 minut i można go zrobić w pełni online. Potrzebujesz tylko dowodu osobistego i smartfona.",
    tips: [
      "Używaj ZAWSZE linku z naszej strony — tylko wtedy bank zaliczy Twoje zgłoszenie do promocji",
      "Przeczytaj regulamin promocji przed otwarciem konta",
      "Zapisz datę otwarcia — warunki mają deadline!",
    ],
    estimatedTime: "15 minut",
  },
  {
    icon: ListChecks,
    title: "Spełnij warunki promocji",
    description:
      "Każda oferta ma konkretne warunki: przelewy, płatności kartą, BLIK, zasilenie konta itp. Dodaj ofertę do trackera na CebulaZysku i zaznaczaj wykonane warunki — nie zapomnisz o żadnym!",
    tips: [
      "Ustaw przypomnienia w kalendarzu na deadline'y",
      "Rób wszystko w pierwszym tygodniu — nie odkładaj na później",
      "Płatności kartą można robić nawet za drobne zakupy (np. pieczywo)",
    ],
    estimatedTime: "1-4 tygodnie",
  },
  {
    icon: Banknote,
    title: "Odbierz premię",
    description:
      "Po spełnieniu warunków bank automatycznie przeleje premię na Twoje konto. Zazwyczaj trwa to 1-30 dni od zakończenia okresu promocyjnego. Premie do 2000 zł z tzw. \"sprzedaży premiowej\" są zwolnione z PIT!",
    tips: [
      "Sprawdź w regulaminie, kiedy dokładnie premia zostanie wypłacona",
      "Jeśli premia nie przyszła w terminie — zadzwoń na infolinię banku",
      "Zachowaj potwierdzenie spełnienia warunków (screenshoty)",
    ],
    estimatedTime: "1-30 dni oczekiwania",
  },
  {
    icon: Repeat,
    title: "Powtórz z kolejną ofertą",
    description:
      "Gratulacje — właśnie zarobiłeś! Teraz poczekaj na okres karencji (zwykle 12 miesięcy od zamknięcia konta) i powtórz proces z innym bankiem. Doświadczeni \"cebularze\" rotują między 3-5 bankami i zarabiają kilka tysięcy rocznie.",
    tips: [
      "Możesz mieć konta w wielu bankach jednocześnie",
      "Zapisz daty otwarcia i zamknięcia kont, by śledzić karencje",
      "Nie zamykaj konta zbyt wcześnie — sprawdź minimalny okres w regulaminie",
    ],
    estimatedTime: "powtarzaj co miesiąc",
  },
];

export default async function JakZarabiacPage() {
  const allOffers = await fetchOffersFromDB();
  const activeOffers = allOffers.filter((o) => o.hasUserReward);
  const totalReward = activeOffers.reduce((sum, o) => sum + o.reward, 0);
  const maxReward = Math.max(...activeOffers.map((o) => o.reward), 0);

  // JSON-LD: HowTo schema
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Jak zarabiać na promocjach bankowych?",
    description:
      "Poradnik krok po kroku: jak legalnie zarabiać na premiach bankowych, otwierając konta osobiste z bonusami.",
    totalTime: "P30D",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "PLN",
      value: "0",
    },
    supply: [
      {
        "@type": "HowToSupply",
        name: "Dowód osobisty",
      },
      {
        "@type": "HowToSupply",
        name: "Smartfon z dostępem do internetu",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: "CebulaZysku.pl — tracker promocji bankowych",
      },
    ],
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.description,
      url: `https://cebulazysku.pl/jak-zarabiac#krok-${i + 1}`,
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
        name: "Jak zarabiać",
        item: "https://cebulazysku.pl/jak-zarabiac",
      },
    ],
  };

  return (
    <>
      <JsonLd data={howToLd} />
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
              <BreadcrumbPage>Jak zarabiać</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Jak zarabiać na promocjach bankowych?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Kompletny poradnik dla początkujących i zaawansowanych cebularzy.
            5 prostych kroków do legalnych, dodatkowych pieniędzy.
          </p>

          {activeOffers.length > 0 && (
            <div className="inline-flex items-center gap-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl px-6 py-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{activeOffers.length}</p>
                <p className="text-xs text-muted-foreground">
                  {pluralize(activeOffers.length, "oferta", "oferty", "ofert")} aktywnych
                </p>
              </div>
              <div className="h-8 w-px bg-emerald-200 dark:bg-emerald-800" />
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{totalReward} zł</p>
                <p className="text-xs text-muted-foreground">do zdobycia łącznie</p>
              </div>
              <div className="h-8 w-px bg-emerald-200 dark:bg-emerald-800" />
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{maxReward} zł</p>
                <p className="text-xs text-muted-foreground">najwyższa premia</p>
              </div>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-10 mb-16">
          {steps.map((step, i) => (
            <section key={i} id={`krok-${i + 1}`} className="scroll-mt-20">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Step number + icon */}
                    <div className="flex items-center gap-4 p-6 sm:p-8 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20 sm:flex-col sm:justify-center sm:w-40 sm:shrink-0">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400">
                        <step.icon className="h-7 w-7" />
                      </div>
                      <div className="sm:text-center">
                        <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
                          Krok {i + 1}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {step.estimatedTime}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 flex-1">
                      <h2 className="text-xl font-bold mb-3">{step.title}</h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {step.description}
                      </p>

                      {/* Tips */}
                      <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-lg p-4">
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5" />
                          Wskazówki cebularza
                        </p>
                        <ul className="space-y-1.5">
                          {step.tips.map((tip, j) => (
                            <li
                              key={j}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-emerald-500 mt-0.5">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          ))}
        </div>

        {/* Safety section */}
        <section className="mb-12">
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-8 w-8 text-emerald-600 shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-bold mb-3">
                  Czy to legalne i bezpieczne?
                </h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>
                    <strong>Tak!</strong> Zakładasz konta w normalnych, licencjonowanych bankach
                    objętych Bankowym Funduszem Gwarancyjnym (BFG). Twoje pieniądze
                    są chronione do kwoty 100 000 EUR.
                  </p>
                  <p>
                    Premie bankowe to standardowy element marketingu — banki płacą za
                    pozyskanie nowego klienta. To dokładnie to samo co cashback czy
                    punkty lojalnościowe, tylko w formie gotówki.
                  </p>
                  <p>
                    Premie do 2000 zł rocznie z tzw. &quot;sprzedaży premiowej&quot; są zwolnione
                    z podatku dochodowego (PIT). Powyżej tego progu bank naliczy
                    zryczałtowany 10% PIT.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common mistakes */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Najczęstsze błędy początkujących
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                mistake: "Otwarcie konta bez linku afiliacyjnego",
                fix: "Zawsze klikaj link z CebulaZysku — bez niego bank nie zaliczy Cię do promocji",
              },
              {
                mistake: "Zapomnienie o terminie",
                fix: "Użyj trackera i ustaw przypomnienia. Jeden przegapiony warunek = brak premii",
              },
              {
                mistake: "Zamknięcie konta za wcześnie",
                fix: "Sprawdź minimalny okres w regulaminie (zwykle 3-6 miesięcy)",
              },
              {
                mistake: "Otwieranie konta w banku, w którym już było",
                fix: "Większość promocji wymaga, by klient nie miał konta w ostatnich 12-24 miesiącach",
              },
            ].map(({ mistake, fix }) => (
              <Card key={mistake}>
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-red-600 dark:text-red-400 mb-1">
                    ❌ {mistake}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✅ {fix}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Earnings potential */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Ile można zarobić?
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-emerald-200 dark:border-emerald-800/40">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-bold text-emerald-600">200-500 zł</p>
                <p className="text-sm text-muted-foreground mt-1">Pierwsza promocja</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Jedna oferta, minimalne warunki. Idealny start dla cebularza.
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 dark:border-emerald-800/40">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-bold text-emerald-600">1 500-3 000 zł</p>
                <p className="text-sm text-muted-foreground mt-1">Pierwszy rok</p>
                <p className="text-xs text-muted-foreground mt-2">
                  3-5 ofert równolegle. Większość cebularzy osiąga ten poziom.
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 dark:border-emerald-800/40">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-bold text-emerald-600">5 000+ zł</p>
                <p className="text-sm text-muted-foreground mt-1">Rocznie (pro)</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Konta osobiste, firmowe, karty kredytowe. Pełna rotacja banków.
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            * Kwoty orientacyjne na podstawie historycznych promocji bankowych. Rzeczywiste zarobki zależą od aktualnych ofert i spełnienia warunków.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center py-10 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl">
          <h2 className="text-2xl font-bold mb-3">
            Gotowy na pierwszą premię? 🧅
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Sprawdź aktualne oferty i wybierz tę, która najlepiej pasuje do Ciebie.
            Tracker pomoże Ci nie zapomnieć o żadnym warunku.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/ranking">
                Zobacz ranking ofert
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/rejestracja">
                Załóż konto z trackerem
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
