import { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Regulamin serwisu",
  description:
    "Regulamin serwisu CebulaZysku – zasady korzystania z porównywarki promocji bankowych.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-extrabold">Regulamin serwisu</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        Ostatnia aktualizacja: 6 marca 2026 r.
      </p>

      <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground">
            § 1. Postanowienia ogólne
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Niniejszy regulamin (dalej: „Regulamin") określa zasady
              korzystania z serwisu internetowego CebulaZysku (dalej: „Serwis")
              dostępnego pod adresem cebulazysku.pl.
            </li>
            <li>
              Właścicielem i operatorem Serwisu jest Administrator wskazany w
              Polityce prywatności.
            </li>
            <li>
              Serwis ma charakter informacyjny i służy do porównywania promocji
              oferowanych przez banki działające na terytorium Rzeczypospolitej
              Polskiej.
            </li>
            <li>
              Korzystanie z Serwisu jest dobrowolne i bezpłatne.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            § 2. Definicje
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Serwis</strong> – strona internetowa CebulaZysku dostępna
              pod adresem cebulazysku.pl wraz ze wszystkimi podstronami.
            </li>
            <li>
              <strong>Użytkownik</strong> – osoba fizyczna korzystająca z
              Serwisu.
            </li>
            <li>
              <strong>Konto</strong> – indywidualne konto Użytkownika w Serwisie,
              umożliwiające korzystanie z funkcji trackera promocji.
            </li>
            <li>
              <strong>Oferta bankowa</strong> – informacja o promocji bankowej
              prezentowana w Serwisie na podstawie publicznie dostępnych danych.
            </li>
            <li>
              <strong>Tracker</strong> – funkcjonalność Serwisu umożliwiająca
              Użytkownikowi śledzenie postępów spełniania warunków promocji
              bankowych.
            </li>
            <li>
              <strong>Link afiliacyjny</strong> – link prowadzący do strony
              banku, którego kliknięcie może generować prowizję dla operatora
              Serwisu.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            § 3. Zasady korzystania z Serwisu
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Przeglądanie ofert bankowych w Serwisie nie wymaga rejestracji.
            </li>
            <li>
              Korzystanie z funkcji trackera wymaga założenia Konta poprzez
              formularz rejestracyjny.
            </li>
            <li>
              Użytkownik zobowiązuje się do podania prawdziwych danych podczas
              rejestracji.
            </li>
            <li>
              Użytkownik jest odpowiedzialny za zachowanie poufności danych
              dostępowych do swojego Konta.
            </li>
            <li>
              Zabrania się korzystania z Serwisu w sposób niezgodny z prawem,
              dobrymi obyczajami lub naruszający prawa osób trzecich.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            § 4. Charakter informacyjny Serwisu
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>
                Serwis ma wyłącznie charakter informacyjny i nie stanowi
                doradztwa finansowego, inwestycyjnego ani prawnego.
              </strong>
            </li>
            <li>
              Informacje o ofertach bankowych prezentowane w Serwisie pochodzą z
              publicznie dostępnych źródeł i mogą nie być w pełni aktualne.
              Szczegółowe warunki promocji dostępne są na stronach
              internetowych poszczególnych banków.
            </li>
            <li>
              Administrator dokłada starań, aby informacje prezentowane w
              Serwisie były rzetelne i aktualne, jednak nie gwarantuje ich
              kompletności ani dokładności.
            </li>
            <li>
              Decyzje finansowe podejmowane przez Użytkownika na podstawie
              informacji z Serwisu są podejmowane na własne ryzyko Użytkownika.
            </li>
            <li>
              Tracker służy wyłącznie do osobistego śledzenia postępów i nie
              stanowi wiążącego potwierdzenia spełnienia warunków promocji
              bankowej. O spełnieniu warunków decyduje wyłącznie bank.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            § 5. Linki afiliacyjne
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Serwis zawiera linki afiliacyjne prowadzące do stron banków.
              Kliknięcie w taki link może skutkować przyznaniem prowizji
              operatorowi Serwisu przez bank.
            </li>
            <li>
              Korzystanie z linków afiliacyjnych jest dobrowolne i nie wiąże się
              z żadnymi dodatkowymi kosztami dla Użytkownika.
            </li>
            <li>
              Obecność linku afiliacyjnego nie wpływa na kolejność ani sposób
              prezentacji ofert w Serwisie.
            </li>
            <li>
              Po kliknięciu linku afiliacyjnego Użytkownik zostaje przekierowany
              na stronę banku. Od tego momentu zastosowanie mają regulamin i
              polityka prywatności danego banku.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            § 6. Odpowiedzialność
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Administrator nie ponosi odpowiedzialności za decyzje finansowe
              podjęte przez Użytkownika na podstawie informacji z Serwisu.
            </li>
            <li>
              Administrator nie ponosi odpowiedzialności za treści i usługi
              oferowane przez banki, do których prowadzą linki z Serwisu.
            </li>
            <li>
              Administrator nie ponosi odpowiedzialności za czasową
              niedostępność Serwisu wynikającą z przyczyn technicznych.
            </li>
            <li>
              Administrator nie ponosi odpowiedzialności za utratę danych
              przechowywanych lokalnie w przeglądarce Użytkownika (localStorage).
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            § 7. Konto użytkownika
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Rejestracja w Serwisie wymaga podania imienia, adresu e-mail i
              hasła oraz akceptacji niniejszego Regulaminu i Polityki
              prywatności.
            </li>
            <li>
              Użytkownik może w dowolnym momencie usunąć swoje Konto,
              kontaktując się z Administratorem.
            </li>
            <li>
              Administrator zastrzega sobie prawo do usunięcia Konta
              Użytkownika naruszającego postanowienia Regulaminu.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            § 8. Własność intelektualna
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Treści, grafiki, układ i elementy Serwisu stanowią własność
              Administratora lub są wykorzystywane na podstawie odpowiednich
              licencji.
            </li>
            <li>
              Nazwy i logotypy banków są własnością odpowiednich podmiotów i są
              wykorzystywane w Serwisie wyłącznie w celach informacyjnych.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            § 9. Postanowienia końcowe
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Administrator zastrzega sobie prawo do zmiany Regulaminu. O
              istotnych zmianach Użytkownicy zostaną poinformowani za
              pośrednictwem Serwisu.
            </li>
            <li>
              W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie
              mają przepisy prawa polskiego.
            </li>
            <li>
              Wszelkie spory wynikające z korzystania z Serwisu będą rozstrzygane
              przez sąd właściwy dla siedziby Administratora.
            </li>
            <li>Regulamin obowiązuje od dnia 6 marca 2026 r.</li>
          </ol>
        </section>

      </div>
    </div>
  );
}
