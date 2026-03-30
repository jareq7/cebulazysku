// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-30
// Bank descriptions from Gemini G12 (research/bank-hub-descriptions.md)

export interface BankDescription {
  description: string;
  pros: string[];
  cons: string[];
  targetAudience: string;
  promoHistory: string;
}

export const bankDescriptions: Record<string, BankDescription> = {
  mbank: {
    description:
      "mBank to synonim nowoczesnej bankowości internetowej w Polsce, słynący z jednej z najlepszych i najszybszych aplikacji mobilnych na rynku. Od lat przyciąga młodych i świadomych technologicznie klientów swoimi innowacyjnymi rozwiązaniami oraz niezwykle przejrzystymi warunkami prowadzenia konta. Promocje mBanku są zazwyczaj bardzo proste w realizacji, co czyni je idealnym wyborem dla początkujących łowców premii.",
    pros: [
      "Banalnie proste warunki darmowości eKonta",
      "Znakomita, intuicyjna aplikacja mobilna i system transakcyjny",
      "Świetne funkcje dodatkowe (mSaver, szybkie przelewy na telefon)",
    ],
    cons: [
      "Płatne bankomaty poniżej określonej kwoty wypłaty (często 300 zł)",
      "Oferty promocyjne bywają powtarzalne, rzadko przekraczając 500 zł premii",
    ],
    targetAudience:
      "Dla osób, które cenią nowoczesność, płacą głównie telefonem (Apple Pay/Google Pay) lub BLIKIEM i szukają bardzo stabilnej, głównej aplikacji do codziennych finansów.",
    promoHistory:
      "mBank regularnie co 1-2 miesiące odświeża promocję eKonta osobistego. Średnia kwota premii oscyluje wokół 300-500 zł w gotówce. Okres karencji dla powracających klientów jest dość stały i zazwyczaj wynosi około roku do kilkunastu miesięcy od zamknięcia poprzedniego konta.",
  },
  "pekao": {
    description:
      "PKO BP to największy i najstarszy bank w Polsce, który w ostatnich latach przeszedł gigantyczną cyfrową transformację. Choć kojarzy się z tradycyjną bankowością i dużą liczbą placówek, jego aplikacja IKO to absolutny światowy top. Konto za Zero w PKO to świetna, stabilna opcja z ogromną siecią darmowych bankomatów w całym kraju.",
    pros: [
      "Najlepsza i najczęściej nagradzana aplikacja mobilna (IKO)",
      "Największa sieć własnych placówek i bankomatów w Polsce",
      "Brak ukrytych haczyków w regulaminach promocji",
    ],
    cons: [
      "Dość rygorystyczne podejście do warunków bezpłatności karty (konieczność wykonania kilku transakcji miesięcznie)",
      "Mniej nowoczesny interfejs bankowości przeglądarkowej w porównaniu z konkurencją",
    ],
    targetAudience:
      "Dla osób, które potrzebują 100% zaufania do instytucji, cenią sobie fizyczny dostęp do oddziałów banku, a jednocześnie wymagają perfekcyjnie działającej aplikacji do płatności BLIK.",
    promoHistory:
      'PKO stosunkowo niedawno zaczął agresywniej walczyć o klientów w internecie. Aktualne promocje na "Konto za Zero" dają zazwyczaj od 200 do 300 zł premii na start, a ich warunki opierają się głównie na płatnościach BLIKIEM.',
  },
  "santander-polska": {
    description:
      "Santander to potężny, międzynarodowy gracz, który w Polsce zbudował solidną pozycję dzięki swojemu flagowemu produktowi \u2013 Koncie Santander. Bank ten słynie z bardzo agresywnego marketingu i jednych z najbardziej \"rozdawczych\" kampanii promocyjnych, w których nagrody za otwarcie konta nierzadko są łączone z bonusami od partnerów.",
    pros: [
      "Jedne z najwyższych łącznych puli nagród (gotówka + vouchery)",
      "Dodatkowe stałe zwroty (np. do 300 zł rocznie za rachunki domowe)",
      "Bardzo opłacalny program poleceń (kumulacja bonusów)",
    ],
    cons: [
      "Rozbudowane regulaminy promocji (premie podzielone na wiele etapów)",
      "Aplikacja mobilna bywa mniej intuicyjna niż u liderów rynku (mBank/PKO)",
    ],
    targetAudience:
      "Dla wytrawnych Cebularzy, którzy lubią wyciskać z promocji absolutnego maksa i nie przeszkadza im spełnianie kilku drobnych warunków przez parę miesięcy z rzędu.",
    promoHistory:
      "Oferty Santandera to prawdziwe kombajny promocyjne. Niejednokrotnie łączna pula do zgarnięcia z jednego konta dochodzi do 600-700 zł. Często pojawiają się bonusy typu 100 zł do Biedronki za samo podanie kodu polecającego podczas rejestracji.",
  },
  "ing-slaski": {
    description:
      "ING to bank pierwszego wyboru dla wielu młodych Polaków i przedsiębiorców. Charakteryzuje się świetnym podejściem do oszczędzania i edukacji finansowej. Konto z Lwem Direct to produkt niezwykle przejrzysty, z łatwymi warunkami zwolnienia z opłat. System Moje ING uchodzi za jeden z najbardziej estetycznych na rynku.",
    pros: [
      "Bardzo przejrzysty i nowoczesny interfejs (Moje ING)",
      "Świetne zintegrowane konta oszczędnościowe (Smart Saver)",
      "Wysoka stabilność systemów i świetna obsługa klienta",
    ],
    cons: [
      "Promocje wymagają często obrotu bezgotówkowego na stosunkowo duże kwoty (np. 1000 zł)",
      "Opłata za kartę zależy od łącznej kwoty transakcji, a nie ich liczby",
    ],
    targetAudience:
      "Dla osób oszczędnych, które szukają banku głównego, łatwego odkładania końcówek z zakupów i przejrzystej analityki domowego budżetu.",
    promoHistory:
      "Promocje ING są rzadsze i trwają długo (często kilka miesięcy). Typowa nagroda to 300-500 zł przelewana bezpośrednio na otwarte wraz z kontem OKO (Otwarte Konto Oszczędnościowe).",
  },
  "alior-bank": {
    description:
      'Alior Bank od zawsze pozycjonował się jako innowator na polskim rynku. Jego "Konto Jakże Osobiste" to unikalny na skalę kraju produkt, w którym klient sam wybiera pakiety korzyści (np. zwroty za płatności mobilne, darmowe bankomaty czy wyższe oprocentowanie), dostosowując konto do swojego stylu życia.',
    pros: [
      "Elastyczność \u2013 sam wybierasz 2 darmowe korzyści w ramach konta",
      "Często pojawiające się proste i szybkie w wypłacie premie",
      "Bardzo korzystne przewalutowania w pakiecie z kartą",
    ],
    cons: [
      "Gorsze opinie o stabilności starszej wersji aplikacji mobilnej (choć nowa została mocno poprawiona)",
      "Opłata za konto (brak zwolnienia warunkowego), chyba że masz odpowiedni wpływ lub wiek",
    ],
    targetAudience:
      "Dla osób o zróżnicowanych potrzebach, które lubią personalizować swoje usługi (np. podróżników, którzy potrzebują dobrych kursów walut na wakacje, lub osób płacących tylko telefonem za cashback).",
    promoHistory:
      "Alior Bank oferuje zazwyczaj solidne 400-500 zł premii gotówkowej podzielonej na mniejsze transze miesięczne (np. po 50 zł przez kilka miesięcy) oraz często wlicza bardzo lukratywny program poleceń.",
  },
  "bnp-paribas": {
    description:
      'BNP Paribas to potężna europejska grupa, która w Polsce mocno angażuje się w zrównoważony rozwój i ekologię. Oferta "Konto Otwarte na Ciebie" zyskuje ogromną popularność wśród łowców okazji, ponieważ to właśnie tutaj najczęściej pojawiają się krótkie, limitowane akcje we współpracy z zewnętrznymi markami (np. Biedronka, Allegro).',
    pros: [
      "Dużo krótkich, strzałowych promocji z wysokimi nagrodami",
      "Krótki okres karencji (często wystarczy nie być klientem przez ostatnie 12 miesięcy)",
      "Atrakcyjne połączenie premii gotówkowych i voucherów na zakupy",
    ],
    cons: [
      "Skomplikowany proces wypłaty premii (rejestracje na dedykowanych stronach organizatorów promocji)",
      "Aplikacja GOmobile odstaje nieco od polskiej czołówki pod kątem UX",
    ],
    targetAudience:
      "Zdecydowanie dla wprawionych łowców promocji (Cebularzy), którzy potrafią przypilnować dat, zarejestrować się na zewnętrznych stronach i wypełnić formularze po odbiór nagrody.",
    promoHistory:
      "To król krótkich, agresywnych kampanii. Promocje BNP często trwają tylko 2-3 tygodnie. Pula nagród zazwyczaj składa się z np. 100 zł w gotówce na start i kilkuset złotych w bonach (np. do Biedronki, Żabki czy na Allegro).",
  },
};
