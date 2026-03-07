export type ConditionType =
  | "transfer"
  | "card_payment"
  | "blik_payment"
  | "income"
  | "standing_order"
  | "direct_debit"
  | "mobile_app_login"
  | "online_payment"
  | "contactless_payment";

export interface Condition {
  id: string;
  type: ConditionType;
  label: string;
  description: string;
  requiredCount: number;
  perMonth: boolean;
  monthsRequired: number;
}

export interface BankOffer {
  id: string;
  slug: string;
  bankName: string;
  bankLogo: string;
  bankColor: string;
  offerName: string;
  shortDescription: string;
  fullDescription: string;
  reward: number;
  difficulty: "easy" | "medium" | "hard";
  conditions: Condition[];
  deadline: string;
  affiliateUrl: string;
  pros: string[];
  cons: string[];
  faq: { question: string; answer: string }[];
  monthlyFee: number;
  freeIf: string | null;
  featured: boolean;
  lastUpdated: string;
}

export const conditionTypeLabels: Record<ConditionType, string> = {
  transfer: "Przelew wychodzący",
  card_payment: "Płatność kartą",
  blik_payment: "Płatność BLIK",
  income: "Wpływ na konto",
  standing_order: "Zlecenie stałe",
  direct_debit: "Polecenie zapłaty",
  mobile_app_login: "Logowanie do aplikacji",
  online_payment: "Płatność online",
  contactless_payment: "Płatność zbliżeniowa",
};

export const conditionTypeIcons: Record<ConditionType, string> = {
  transfer: "ArrowRightLeft",
  card_payment: "CreditCard",
  blik_payment: "Smartphone",
  income: "DollarSign",
  standing_order: "Repeat",
  direct_debit: "FileCheck",
  mobile_app_login: "LogIn",
  online_payment: "Globe",
  contactless_payment: "Wifi",
};

export const bankOffers: BankOffer[] = [
  {
    id: "mbank-ekonto-promo",
    slug: "mbank-ekonto-300zl",
    bankName: "mBank",
    bankLogo: "/banks/mbank.svg",
    bankColor: "#00843D",
    offerName: "eKonto z premią 300 zł",
    shortDescription:
      "Otwórz eKonto i wykonuj transakcje przez 3 miesiące. Premia do 300 zł!",
    fullDescription:
      "Promocja mBanku dla nowych klientów. Otwórz eKonto osobiste i spełniaj proste warunki przez 3 miesiące, aby zgarnąć do 300 zł premii. Konto jest prowadzone bezpłatnie przy wpływie min. 1000 zł/mies. Oferuje darmową kartę wielowalutową oraz dostęp do najlepszej aplikacji mobilnej w Polsce.",
    reward: 300,
    difficulty: "easy",
    conditions: [
      {
        id: "mbank-transfer",
        type: "transfer",
        label: "Wykonaj 1 przelew w miesiącu",
        description: "Wykonaj minimum 1 przelew wychodzący w każdym miesiącu promocji",
        requiredCount: 1,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "mbank-card",
        type: "card_payment",
        label: "Zapłać kartą 5 razy w miesiącu",
        description: "Wykonaj minimum 5 transakcji kartą debetową w każdym miesiącu",
        requiredCount: 5,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "mbank-income",
        type: "income",
        label: "Wpływ min. 1000 zł/mies.",
        description:
          "Zapewnij wpływ na konto minimum 1000 zł w każdym miesiącu promocji",
        requiredCount: 1,
        perMonth: true,
        monthsRequired: 3,
      },
    ],
    deadline: "2026-06-30",
    affiliateUrl: "#",
    pros: [
      "Najlepsza aplikacja mobilna w Polsce",
      "Darmowa karta wielowalutowa",
      "Brak opłat przy wpływie 1000 zł",
      "Szybki proces otwarcia konta online",
    ],
    cons: [
      "Opłata 9 zł/mies. bez wpływu 1000 zł",
      "Premia rozłożona na 3 miesiące",
    ],
    faq: [
      {
        question: "Czy muszę być nowym klientem mBanku?",
        answer:
          "Tak, promocja jest skierowana do osób, które nie posiadały konta w mBanku w ciągu ostatnich 12 miesięcy.",
      },
      {
        question: "Kiedy otrzymam premię?",
        answer:
          "Premia jest wypłacana w ciągu 30 dni po zakończeniu każdego miesiąca promocyjnego, w 3 częściach po 100 zł.",
      },
      {
        question: "Czy mogę zamknąć konto po otrzymaniu premii?",
        answer:
          "Tak, po otrzymaniu pełnej premii możesz zamknąć konto bez dodatkowych opłat.",
      },
    ],
    monthlyFee: 0,
    freeIf: "Wpływ min. 1000 zł/mies.",
    featured: true,
    lastUpdated: "2026-03-01",
  },
  {
    id: "ing-konto-promo",
    slug: "ing-konto-mobi-200zl",
    bankName: "ING Bank Śląski",
    bankLogo: "/banks/ing.svg",
    bankColor: "#FF6600",
    offerName: "Konto Mobi z premią 200 zł",
    shortDescription:
      "Załóż Konto Mobi w ING i zgarniaj premię do 200 zł za aktywność!",
    fullDescription:
      "ING Bank Śląski oferuje premię do 200 zł dla nowych klientów otwierających Konto Mobi. Konto jest całkowicie darmowe – bez opłat za prowadzenie, bez minimalnych wpływów. Wystarczy regularnie korzystać z konta przez 2 miesiące, aby otrzymać pełną premię.",
    reward: 200,
    difficulty: "easy",
    conditions: [
      {
        id: "ing-card",
        type: "card_payment",
        label: "Zapłać kartą 3 razy w miesiącu",
        description: "Wykonaj minimum 3 transakcje kartą w każdym miesiącu",
        requiredCount: 3,
        perMonth: true,
        monthsRequired: 2,
      },
      {
        id: "ing-blik",
        type: "blik_payment",
        label: "Zapłać BLIK 2 razy w miesiącu",
        description: "Wykonaj minimum 2 płatności BLIK w każdym miesiącu",
        requiredCount: 2,
        perMonth: true,
        monthsRequired: 2,
      },
      {
        id: "ing-app",
        type: "mobile_app_login",
        label: "Zaloguj się do aplikacji Moje ING",
        description:
          "Zaloguj się do aplikacji mobilnej Moje ING minimum 1 raz w miesiącu",
        requiredCount: 1,
        perMonth: true,
        monthsRequired: 2,
      },
    ],
    deadline: "2026-07-31",
    affiliateUrl: "#",
    pros: [
      "Konto całkowicie darmowe",
      "Brak wymaganego minimalnego wpływu",
      "Prosta aplikacja mobilna",
      "Łatwe warunki promocji",
    ],
    cons: [
      "Niższa premia niż u konkurencji",
      "Karta płatnicza z opłatą 7 zł bez transakcji",
    ],
    faq: [
      {
        question: "Czy Konto Mobi jest naprawdę darmowe?",
        answer:
          "Tak, Konto Mobi nie ma żadnych opłat za prowadzenie. Karta jest darmowa przy minimum 1 transakcji w miesiącu.",
      },
      {
        question: "Jak szybko otrzymam premię?",
        answer:
          "Premia jest wypłacana do 14 dni po zakończeniu okresu promocyjnego.",
      },
    ],
    monthlyFee: 0,
    freeIf: null,
    featured: true,
    lastUpdated: "2026-03-01",
  },
  {
    id: "santander-promo",
    slug: "santander-konto-select-350zl",
    bankName: "Santander Bank Polska",
    bankLogo: "/banks/santander.svg",
    bankColor: "#EC0000",
    offerName: "Konto Select z premią 350 zł",
    shortDescription:
      "Otwórz Konto Select w Santander i zgarniaj nawet 350 zł premii!",
    fullDescription:
      "Santander oferuje jedną z najwyższych premii na rynku – do 350 zł za otwarcie Konta Select. Warunki są nieco bardziej wymagające, ale wciąż osiągalne. Konto Select to produkt premium z dostępem do bankomatów Santander bez opłat oraz bezpłatną kartą Visa.",
    reward: 350,
    difficulty: "medium",
    conditions: [
      {
        id: "santander-income",
        type: "income",
        label: "Wpływ min. 2500 zł/mies.",
        description:
          "Zapewnij wpływ na konto minimum 2500 zł w każdym miesiącu",
        requiredCount: 1,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "santander-card",
        type: "card_payment",
        label: "Zapłać kartą 8 razy w miesiącu",
        description:
          "Wykonaj minimum 8 transakcji kartą debetową miesięcznie",
        requiredCount: 8,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "santander-transfer",
        type: "transfer",
        label: "Wykonaj 3 przelewy w miesiącu",
        description: "Wykonaj minimum 3 przelewy wychodzące miesięcznie",
        requiredCount: 3,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "santander-standing",
        type: "standing_order",
        label: "Ustaw 1 zlecenie stałe",
        description: "Ustaw minimum 1 zlecenie stałe na koncie",
        requiredCount: 1,
        perMonth: false,
        monthsRequired: 1,
      },
    ],
    deadline: "2026-05-31",
    affiliateUrl: "#",
    pros: [
      "Najwyższa premia na rynku (350 zł)",
      "Darmowe bankomaty Santander",
      "Bezpłatna karta Visa",
      "Dobra obsługa klienta",
    ],
    cons: [
      "Wymagany wyższy wpływ (2500 zł)",
      "Więcej warunków do spełnienia",
      "Opłata 10 zł/mies. bez wpływu",
    ],
    faq: [
      {
        question: "Czy premia jest wypłacana jednorazowo?",
        answer:
          "Nie, premia jest wypłacana w 2 ratach: 200 zł po pierwszym miesiącu i 150 zł po trzecim miesiącu.",
      },
      {
        question: "Czy muszę mieć zlecenie stałe przez cały okres?",
        answer:
          "Nie, wystarczy je ustawić jednorazowo. Może to być nawet zlecenie na symboliczną kwotę.",
      },
    ],
    monthlyFee: 0,
    freeIf: "Wpływ min. 2500 zł/mies.",
    featured: true,
    lastUpdated: "2026-02-28",
  },
  {
    id: "pkobp-promo",
    slug: "pko-konto-za-zero-250zl",
    bankName: "PKO Bank Polski",
    bankLogo: "/banks/pkobp.svg",
    bankColor: "#003A70",
    offerName: "Konto za Zero z premią 250 zł",
    shortDescription:
      "Największy bank w Polsce oferuje 250 zł za założenie Konta za Zero!",
    fullDescription:
      "PKO Bank Polski – największy bank w Polsce – oferuje premię 250 zł za otwarcie Konta za Zero. Konto jest darmowe przy wpływie 1500 zł miesięcznie. PKO ma najszerzszą sieć bankomatów i placówek w kraju, co jest dużym atutem.",
    reward: 250,
    difficulty: "medium",
    conditions: [
      {
        id: "pkobp-income",
        type: "income",
        label: "Wpływ min. 1500 zł/mies.",
        description: "Zapewnij wpływ na konto minimum 1500 zł miesięcznie",
        requiredCount: 1,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "pkobp-card",
        type: "card_payment",
        label: "Zapłać kartą 4 razy w miesiącu",
        description: "Wykonaj minimum 4 transakcje kartą w każdym miesiącu",
        requiredCount: 4,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "pkobp-blik",
        type: "blik_payment",
        label: "Zapłać BLIK 3 razy w miesiącu",
        description: "Wykonaj minimum 3 płatności BLIK w każdym miesiącu",
        requiredCount: 3,
        perMonth: true,
        monthsRequired: 3,
      },
    ],
    deadline: "2026-08-31",
    affiliateUrl: "#",
    pros: [
      "Największy bank w Polsce",
      "Najszersza sieć bankomatów",
      "Aplikacja IKO – jedna z najlepszych",
      "Łatwy dostęp do placówek",
    ],
    cons: [
      "Wymagany wpływ 1500 zł",
      "Opłata 10 zł/mies. bez warunków",
    ],
    faq: [
      {
        question: "Czy mogę otworzyć konto online?",
        answer:
          "Tak, konto można otworzyć w pełni online z potwierdzeniem tożsamości przez wideoweryfikację lub przelew weryfikacyjny.",
      },
    ],
    monthlyFee: 0,
    freeIf: "Wpływ min. 1500 zł/mies.",
    featured: false,
    lastUpdated: "2026-02-25",
  },
  {
    id: "millennium-promo",
    slug: "millennium-konto-360-400zl",
    bankName: "Bank Millennium",
    bankLogo: "/banks/millennium.svg",
    bankColor: "#87189D",
    offerName: "Konto 360° z premią 400 zł",
    shortDescription:
      "Rekordowa premia 400 zł w Banku Millennium za Konto 360°!",
    fullDescription:
      "Bank Millennium oferuje jedną z najwyższych premii na rynku – aż 400 zł za otwarcie Konta 360°. Warunki są bardziej wymagające, ale premia rekompensuje to z nawiązką. Konto 360° oferuje kompleksowe zarządzanie finansami z bardzo dobrą aplikacją mobilną.",
    reward: 400,
    difficulty: "hard",
    conditions: [
      {
        id: "millennium-income",
        type: "income",
        label: "Wpływ min. 3000 zł/mies.",
        description: "Zapewnij wpływ minimum 3000 zł w każdym miesiącu",
        requiredCount: 1,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "millennium-card",
        type: "card_payment",
        label: "Zapłać kartą 10 razy w miesiącu",
        description: "Wykonaj minimum 10 transakcji kartą miesięcznie",
        requiredCount: 10,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "millennium-transfer",
        type: "transfer",
        label: "Wykonaj 5 przelewów w miesiącu",
        description: "Wykonaj minimum 5 przelewów wychodzących miesięcznie",
        requiredCount: 5,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "millennium-blik",
        type: "blik_payment",
        label: "Zapłać BLIK 3 razy w miesiącu",
        description: "Wykonaj minimum 3 płatności BLIK w każdym miesiącu",
        requiredCount: 3,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "millennium-direct-debit",
        type: "direct_debit",
        label: "Ustaw polecenie zapłaty",
        description: "Ustaw minimum 1 polecenie zapłaty (np. za media)",
        requiredCount: 1,
        perMonth: false,
        monthsRequired: 1,
      },
    ],
    deadline: "2026-04-30",
    affiliateUrl: "#",
    pros: [
      "Najwyższa premia (400 zł)",
      "Bardzo dobra aplikacja mobilna",
      "Kompleksowe zarządzanie finansami",
      "Program lojalnościowy Goodie",
    ],
    cons: [
      "Wymagający warunki",
      "Wysoki próg wpływu (3000 zł)",
      "Dużo transakcji do wykonania",
    ],
    faq: [
      {
        question: "Czy 400 zł jest wypłacane od razu?",
        answer:
          "Nie, premia jest wypłacana w 3 ratach: 150 zł, 150 zł i 100 zł po kolejnych miesiącach spełnienia warunków.",
      },
      {
        question: "Czy polecenie zapłaty musi być na konkretną kwotę?",
        answer:
          "Nie, wystarczy dowolne polecenie zapłaty – może to być np. abonament telefoniczny czy rachunek za media.",
      },
    ],
    monthlyFee: 0,
    freeIf: "Wpływ min. 2000 zł/mies.",
    featured: true,
    lastUpdated: "2026-03-03",
  },
  {
    id: "bnp-promo",
    slug: "bnp-paribas-konto-otwarte-200zl",
    bankName: "BNP Paribas",
    bankLogo: "/banks/bnp.svg",
    bankColor: "#009A44",
    offerName: "Konto Otwarte na Ciebie z premią 200 zł",
    shortDescription:
      "Załóż Konto Otwarte na Ciebie i odbierz 200 zł premii!",
    fullDescription:
      "BNP Paribas oferuje 200 zł premii za otwarcie Konta Otwartego na Ciebie. To konto z jednym z najniższych progów wymagań – wystarczy wpływ 1000 zł i kilka transakcji. Bank oferuje też cashback na wybrane kategorie zakupów.",
    reward: 200,
    difficulty: "easy",
    conditions: [
      {
        id: "bnp-income",
        type: "income",
        label: "Wpływ min. 1000 zł/mies.",
        description: "Zapewnij wpływ minimum 1000 zł miesięcznie",
        requiredCount: 1,
        perMonth: true,
        monthsRequired: 2,
      },
      {
        id: "bnp-card",
        type: "card_payment",
        label: "Zapłać kartą 4 razy w miesiącu",
        description: "Wykonaj minimum 4 transakcje kartą miesięcznie",
        requiredCount: 4,
        perMonth: true,
        monthsRequired: 2,
      },
    ],
    deadline: "2026-09-30",
    affiliateUrl: "#",
    pros: [
      "Niski próg wejścia",
      "Cashback na zakupy",
      "Darmowe wypłaty z bankomatów",
      "Szybkie otwarcie konta",
    ],
    cons: [
      "Mniejsza sieć placówek",
      "Aplikacja mobilna mogłaby być lepsza",
    ],
    faq: [
      {
        question: "Czy BNP Paribas jest bezpiecznym bankiem?",
        answer:
          "Tak, BNP Paribas to jeden z największych banków na świecie z ratingiem A+. Depozyty są chronione przez BFG.",
      },
    ],
    monthlyFee: 0,
    freeIf: "Wpływ min. 1000 zł/mies.",
    featured: false,
    lastUpdated: "2026-02-20",
  },
  {
    id: "citi-promo",
    slug: "citi-handlowy-konto-250zl",
    bankName: "Citi Handlowy",
    bankLogo: "/banks/citi.svg",
    bankColor: "#003DA5",
    offerName: "Citigold z premią 250 zł",
    shortDescription:
      "Otwórz Citigold i zgarniaj premię 250 zł za aktywność!",
    fullDescription:
      "Citi Handlowy oferuje premię 250 zł za otwarcie konta Citigold. Konto premium z dostępem do globalnej sieci bankomatów Citibank bez prowizji. Idealne dla osób podróżujących i dokonujących transakcji walutowych.",
    reward: 250,
    difficulty: "medium",
    conditions: [
      {
        id: "citi-income",
        type: "income",
        label: "Wpływ min. 2000 zł/mies.",
        description: "Zapewnij wpływ minimum 2000 zł miesięcznie",
        requiredCount: 1,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "citi-card",
        type: "card_payment",
        label: "Zapłać kartą 6 razy w miesiącu",
        description: "Wykonaj minimum 6 transakcji kartą miesięcznie",
        requiredCount: 6,
        perMonth: true,
        monthsRequired: 3,
      },
      {
        id: "citi-online",
        type: "online_payment",
        label: "Płatność online 2 razy w miesiącu",
        description: "Wykonaj minimum 2 płatności online miesięcznie",
        requiredCount: 2,
        perMonth: true,
        monthsRequired: 3,
      },
    ],
    deadline: "2026-06-30",
    affiliateUrl: "#",
    pros: [
      "Globalna sieć bankomatów",
      "Karta wielowalutowa",
      "Prestiżowy bank premium",
      "Dobre przewalutowanie",
    ],
    cons: [
      "Wyższy próg wpływu",
      "Mniejsza sieć placówek w PL",
      "Aplikacja mniej popularna",
    ],
    faq: [
      {
        question: "Czy Citigold jest darmowe?",
        answer:
          "Konto Citigold jest darmowe przy wpływie min. 2000 zł miesięcznie. Bez wpływu opłata wynosi 15 zł/mies.",
      },
    ],
    monthlyFee: 0,
    freeIf: "Wpływ min. 2000 zł/mies.",
    featured: false,
    lastUpdated: "2026-02-15",
  },
  {
    id: "credit-agricole-promo",
    slug: "credit-agricole-konto-150zl",
    bankName: "Credit Agricole",
    bankLogo: "/banks/creditagricole.svg",
    bankColor: "#006837",
    offerName: "Konto dla Ciebie z premią 150 zł",
    shortDescription:
      "Najprostsza promocja – 150 zł za założenie Konta dla Ciebie!",
    fullDescription:
      "Credit Agricole oferuje 150 zł za otwarcie Konta dla Ciebie. To najprostsza promocja na rynku – wystarczy jedna transakcja kartą i wpływ na konto. Idealna dla osób, które chcą szybko zarobić bez skomplikowanych warunków.",
    reward: 150,
    difficulty: "easy",
    conditions: [
      {
        id: "ca-card",
        type: "card_payment",
        label: "Zapłać kartą 1 raz w miesiącu",
        description: "Wykonaj minimum 1 transakcję kartą w każdym miesiącu",
        requiredCount: 1,
        perMonth: true,
        monthsRequired: 2,
      },
      {
        id: "ca-income",
        type: "income",
        label: "Wpływ min. 500 zł/mies.",
        description: "Zapewnij wpływ minimum 500 zł miesięcznie",
        requiredCount: 1,
        perMonth: true,
        monthsRequired: 2,
      },
    ],
    deadline: "2026-12-31",
    affiliateUrl: "#",
    pros: [
      "Najprostsze warunki na rynku",
      "Niski próg wpływu (500 zł)",
      "Konto w pełni darmowe",
      "Szybka wypłata premii",
    ],
    cons: [
      "Niższa premia (150 zł)",
      "Mniejsza sieć placówek",
    ],
    faq: [
      {
        question: "Czy to naprawdę takie proste?",
        answer:
          "Tak, wystarczy 1 transakcja kartą i wpływ 500 zł miesięcznie przez 2 miesiące. To jedna z najprostszych promocji bankowych.",
      },
    ],
    monthlyFee: 0,
    freeIf: null,
    featured: false,
    lastUpdated: "2026-03-05",
  },
];

export function getOfferBySlug(slug: string): BankOffer | undefined {
  return bankOffers.find((o) => o.slug === slug);
}

export function getFeaturedOffers(): BankOffer[] {
  return bankOffers.filter((o) => o.featured);
}

export function getTotalPotentialEarnings(): number {
  return bankOffers.reduce((sum, o) => sum + o.reward, 0);
}

export function getDifficultyLabel(difficulty: BankOffer["difficulty"]): string {
  const labels = { easy: "Łatwy", medium: "Średni", hard: "Trudny" };
  return labels[difficulty];
}

export function getDifficultyColor(difficulty: BankOffer["difficulty"]): string {
  const colors = {
    easy: "bg-amber-100 text-amber-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };
  return colors[difficulty];
}
