// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-30
import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight, HelpCircle } from "lucide-react";
import { FaqAccordion } from "@/components/FaqAccordion";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "FAQ — najczęściej zadawane pytania o promocje bankowe | CebulaZysku",
  description:
    "Odpowiedzi na 20 najczęstszych pytań o promocje bankowe: legalność, podatki, karencja, BIK, zamykanie kont i więcej. Wszystko co musisz wiedzieć zanim zaczniesz zarabiać.",
  openGraph: {
    title: "FAQ — pytania o promocje bankowe | CebulaZysku",
    description:
      "20 odpowiedzi na najważniejsze pytania o zarabianie na premiach bankowych.",
    type: "website",
    url: "https://cebulazysku.pl/faq",
  },
  alternates: {
    canonical: "https://cebulazysku.pl/faq",
  },
};

const faqItems = [
  {
    question: "Czy promocje bankowe są w ogóle legalne?",
    answer: "Tak, promocje bankowe są w 100% legalne i stanowią oficjalne narzędzie marketingowe banków w Polsce. Mają na celu przyciągnięcie nowych klientów w nadziei, że po założeniu konta, zostaną oni z daną instytucją na dłużej. Zamiast wydawać miliony na reklamy w telewizji, bank woli zapłacić Ci kilkaset złotych za wypróbowanie jego aplikacji.",
  },
  {
    question: "Czy od nagrody z banku muszę zapłacić podatek?",
    answer: "Zdecydowana większość premii i nagród za otwarcie konta osobistego w Polsce jest zwolniona z podatku dochodowego. Traktowane są one jako tzw. sprzedaż premiowa. Jeśli regulamin stanowi inaczej (co jest rzadkością i dotyczy zazwyczaj bardzo wysokich kwot), to bank jako płatnik sam odprowadza podatek zryczałtowany. Ty otrzymujesz kwotę netto do swojej kieszeni i nie wpisujesz jej do PIT.",
  },
  {
    question: "Co to jest karencja i dlaczego jest tak ważna?",
    answer: "Karencja to ustalony przez bank okres, po którym były klient jest traktowany jako całkowicie \"nowy\" i znów może skorzystać z promocji powitalnej. Zazwyczaj wynosi ona od 12 do 36 miesięcy od momentu zamknięcia poprzedniego konta. Przed aplikowaniem o nagrodę, warto zawsze sprawdzić w regulaminie datę, od której musisz nie posiadać rachunku w danym banku.",
  },
  {
    question: "Co się stanie, jeśli zapomnę spełnić warunek promocji?",
    answer: "Jeśli w jednym z miesięcy zapomnisz spełnić warunek (np. wykonać 5 płatności kartą), po prostu nie otrzymasz premii za ten konkretny okres. Niestety, w większości przypadków utracisz też prawo do reszty bonusu, jeśli był on wypłacany w transzach. Właśnie dlatego narzędzia takie jak Tracker CebulaZysku pomagają pilnować terminów, byś nie stracił ani złotówki.",
  },
  {
    question: "Czy bank może odmówić mi założenia konta?",
    answer: "Zasadniczo banki rzadko odmawiają otwarcia zwykłego konta osobistego. Zdarza się to głównie wtedy, gdy Twoje dane w bazach są niezgodne z dowodem, lub jeśli posiadasz już tzw. konto techniczne po dawnej spłacie kredytu. W przypadku kart kredytowych, bank ocenia jednak Twoją zdolność kredytową i może odrzucić wniosek po weryfikacji w BIK.",
  },
  {
    question: "Ile kont bankowych mogę mieć jednocześnie?",
    answer: "Polskie prawo nie nakłada żadnego limitu na liczbę posiadanych kont bankowych. Możesz mieć 5, 10 lub nawet 20 rachunków w różnych instytucjach. Kluczowe jest jedynie to, byś kontrolował, czy żadne z nich nie generuje ukrytych opłat za brak aktywności (dlatego niepotrzebne konta promocyjne po prostu zamykamy).",
  },
  {
    question: "Czy po odebraniu premii mogę od razu zamknąć konto?",
    answer: "W większości regulaminów nie ma zapisu zabraniającego szybkiego wypowiedzenia umowy. Gdy bank wypłaci Ci nagrodę na konto i środki zaksięgują się na Twoim rachunku, możesz przenieść je do innego banku, a samo konto promocyjne zamknąć. Dobrą praktyką jest odczekanie kilku dni po wpływie premii przed złożeniem wypowiedzenia.",
  },
  {
    question: "Czym jest \"wpływ na konto\" w promocji?",
    answer: "Gdy bank wymaga \"wpływu\", zazwyczaj ma na myśli po prostu zewnętrzny przelew przychodzący. Jeśli nie zaznaczono wyraźnie, że ma to być \"wynagrodzenie od pracodawcy\", możesz po prostu przelać wymaganą kwotę ze swojego własnego konta z innego banku. Ważne, by pieniądze fizycznie znalazły się na rachunku w danym miesiącu.",
  },
  {
    question: "Czy wypłata z bankomatu liczy się jako płatność kartą?",
    answer: "Z reguły nie. Kiedy banki stawiają warunek zrobienia określonej liczby \"płatności kartą\", zależy im na płatnościach bezgotówkowych (w terminalach w sklepach stacjonarnych lub przez internet). Wypłacanie gotówki z bankomatu to tzw. transakcje gotówkowe i nie zaliczają się one do wyrabiania premii promocyjnej.",
  },
  {
    question: "Czy płatność BLIKiem liczy się jako płatność kartą?",
    answer: "To zależy ściśle od regulaminu konkretnej promocji. Wiele nowszych akcji akceptuje zarówno płatności fizyczną kartą, Google/Apple Pay, jak i kodami BLIK. Jednakże, w niektórych bankach, wymóg brzmi stricte \"kartą debetową wydaną do konta\", co eliminuje BLIKA. Zawsze czytaj uważnie podsumowanie warunków na naszej stronie oferty.",
  },
  {
    question: "Czym się różni karta debetowa od kredytowej?",
    answer: "Karta debetowa (wydawana do zwykłego konta) pozwala Ci wydawać tylko te pieniądze, które masz obecnie fizycznie na koncie. Karta kredytowa to limit pożyczony od banku \u2013 płacąc nią, zaciągasz krótkoterminowy kredyt. Karty kredytowe mają często lepsze promocje z wyższymi nagrodami, ale wymagają terminowej spłaty, by uniknąć odsetek.",
  },
  {
    question: "Ile kosztuje używanie darmowego konta?",
    answer: "\"Darmowe konto\" często posiada tzw. darmowość warunkową. Znaczy to, że bank nie pobierze od Ciebie miesięcznej opłaty za rachunek lub kartę (np. 10 zł), o ile spełnisz w miesiącu prosty warunek (np. zapłacisz 3 razy kartą albo zasilisz konto tysiącem złotych). Nasz portal zawsze podkreśla te wymagania, aby uniknąć przykrych niespodzianek na wyciągu.",
  },
  {
    question: "Czy stracę pieniądze, jeśli mniejszy bank upadnie?",
    answer: "Nie, Twoje pieniądze w Polsce są bardzo dobrze chronione. Każdy legalnie działający w Polsce bank objęty jest gwarancjami Bankowego Funduszu Gwarancyjnego (BFG). W przypadku hipotetycznej upadłości, instytucja ta w kilka dni zwróci Ci 100% Twoich zgromadzonych środków aż do równowartości 100 000 euro na jeden bank.",
  },
  {
    question: "Dlaczego bank płaci za założenie u niego konta?",
    answer: "Pozyskanie nowego klienta przez tradycyjną reklamę w TV czy billboardy kosztuje banki krocie. Instytucje zorientowały się, że znacznie efektywniej jest zapłacić ułamek tej kwoty bezpośrednio do kieszeni samego klienta. Mają nadzieję, że z nimi zostaniesz i kiedyś zaciągniesz u nich kredyt lub założysz lokatę.",
  },
  {
    question: "Kiedy w końcu dostanę moją premię z promocji?",
    answer: "Czas wypłaty nagrody zależy od banku i konstrukcji regulaminu. Czasem pierwsza transza (np. 100 zł) ląduje u Ciebie już w kilka dni od otwarcia konta, ale zazwyczaj na główną nagrodę czeka się do połowy miesiąca następującego po miesiącu, w którym spełniłeś warunki. Oczekiwany termin przelewu jest zawsze dokładnie opisany na stronie danej promocji.",
  },
  {
    question: "Jak najłatwiej zamknąć niepotrzebne konto bankowe?",
    answer: "Obecnie zamykanie kont jest bardzo proste. W 90% banków zrobisz to bez wychodzenia z domu, z poziomu bankowości internetowej (zakładka ustawienia / wiadomości / wypowiedzenie umowy) lub przez infolinię. Pamiętaj, że bank ma przeważnie 30 dni tzw. okresu wypowiedzenia. Przed zamknięciem wyprowadź wszystkie swoje pieniądze, zostawiając np. 5 złotych na pokrycie ewentualnych mikrokosztów za ostatnie dni.",
  },
  {
    question: "Czy założenie kilku kont zepsuje mi BIK?",
    answer: "Założenie standardowego konta osobistego (ROR) nie jest widoczne w Biurze Informacji Kredytowej (BIK) jako zobowiązanie i nie wpływa na Twoją zdolność kredytową, z wyjątkiem sytuacji, gdy wnioskujesz też o limit w rachunku. Dopiero wyrabianie kart kredytowych generuje zapytania do BIK, co przy dużej liczbie wniosków na raz może na kilka miesięcy obniżyć Twoją punktację (tzw. scoring).",
  },
  {
    question: "Nie mam 18 lat. Czy mogę brać udział w promocjach?",
    answer: "Większość największych premii wymaga bycia pełnoletnim obywatelem z polskim dowodem osobistym. Jednakże banki często organizują świetne akcje specjalne dla nastolatków (13-17 lat), gdzie w założeniu konta musi pomóc rodzic. Znajdziesz takie oferty w odpowiednich zakładkach lub kategoriach wiekowych na naszej platformie.",
  },
  {
    question: "Mam u Was w Trackerze dodane konto. Czy widzieliście mój PIN?",
    answer: "Absolutnie nie! Tracker CebulaZysku to tylko prywatny, szyfrowany notatnik i kalendarz powiadomień. My nie mamy żadnego wglądu w Twoje rzeczywiste operacje na koncie bankowym. Odznaczasz tam warunki ręcznie, dla własnej kontroli. Bezpieczeństwo Twoich finansów to dla nas priorytet, dlatego nigdy nie prosimy Cię o loginy czy hasła do banków.",
  },
  {
    question: "Skąd wy w ogóle wiecie o tych promocjach jako pierwsi?",
    answer: "Jesteśmy ekspertami, dla których bankowość to pasja. Nasz zespół (wraz z wdrożonymi automatami sztucznej inteligencji) codziennie monitoruje dziesiątki stron bankowych, komunikatów KNF i baz partnerskich. Przebijamy się przez skomplikowane regulaminy PDF i skracamy je dla Ciebie do prostych punktów, zanim konkurencja zdąży w ogóle o nich napisać.",
  },
];

export default function FaqPage() {
  // JSON-LD: FAQPage
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
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
        name: "FAQ",
        item: "https://cebulazysku.pl/faq",
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Strona główna</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>FAQ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4" />
            Baza wiedzy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Najczęściej zadawane pytania
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Odpowiedzi na 20 najpopularniejszych pytań o promocje bankowe,
            podatki, karencję, BIK i bezpieczeństwo.
          </p>
        </div>

        {/* FAQ Accordion */}
        <FaqAccordion items={faqItems} />

        {/* CTA */}
        <div className="mt-12 text-center py-8 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl">
          <h2 className="text-xl font-bold mb-3">
            Nie znalazłeś odpowiedzi? 🧅
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
            Napisz do nas — chętnie pomożemy i dodamy Twoje pytanie do bazy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/ranking">
                Sprawdź oferty
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/kontakt">
                Zadaj pytanie
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
