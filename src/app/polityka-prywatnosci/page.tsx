import { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności serwisu CebulaZysku. Informacje o przetwarzaniu danych osobowych zgodnie z RODO.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-extrabold">Polityka prywatności</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        Ostatnia aktualizacja: 6 marca 2026 r.
      </p>

      <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground">
            1. Administrator danych osobowych
          </h2>
          <p>
            Administratorem danych osobowych przetwarzanych w serwisie
            CebulaZysku (dalej: „Serwis") dostępnym pod adresem cebulazysku.pl
            jest właściciel serwisu (dalej: „Administrator").
          </p>
          <p>
            Kontakt z Administratorem możliwy jest za pośrednictwem formularza
            kontaktowego na stronie{" "}
            <a href="/kontakt" className="text-primary underline">
              /kontakt
            </a>{" "}
            lub pod adresem e-mail: kontakt@cebulazysku.pl.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            2. Cele i podstawy przetwarzania danych
          </h2>
          <p>Dane osobowe przetwarzane są w następujących celach:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Rejestracja i obsługa konta użytkownika</strong> – na
              podstawie art. 6 ust. 1 lit. b RODO (wykonanie umowy). Zakres
              danych: imię, adres e-mail, hasło (przechowywane w formie
              zaszyfrowanej).
            </li>
            <li>
              <strong>Śledzenie postępów promocji bankowych</strong> – na
              podstawie art. 6 ust. 1 lit. b RODO (wykonanie umowy). Zakres
              danych: identyfikator użytkownika, wybrane oferty, postępy
              spełniania warunków.
            </li>
            <li>
              <strong>Obsługa zapytań kontaktowych</strong> – na podstawie art.
              6 ust. 1 lit. f RODO (prawnie uzasadniony interes Administratora).
            </li>
            <li>
              <strong>Analityka i optymalizacja Serwisu</strong> – na podstawie
              art. 6 ust. 1 lit. a RODO (zgoda) lub art. 6 ust. 1 lit. f RODO
              (prawnie uzasadniony interes).
            </li>
            <li>
              <strong>Marketing i remarketing</strong> – na podstawie art. 6
              ust. 1 lit. a RODO (zgoda).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            3. Odbiorcy danych
          </h2>
          <p>Dane osobowe mogą być przekazywane następującym kategoriom odbiorców:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Dostawcy usług hostingowych i infrastruktury IT</li>
            <li>Dostawcy narzędzi analitycznych (Google Analytics, Meta Pixel)</li>
            <li>Dostawcy usług e-mail</li>
          </ul>
          <p>
            Administrator nie sprzedaje danych osobowych podmiotom trzecim.
            Kliknięcie linku afiliacyjnego przekierowuje użytkownika na stronę
            banku – od tego momentu przetwarzanie danych podlega polityce
            prywatności danego banku.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            4. Okres przechowywania danych
          </h2>
          <p>
            Dane osobowe przechowywane są przez okres korzystania z konta w
            Serwisie. Po usunięciu konta dane są usuwane niezwłocznie, z
            wyjątkiem danych, których przechowywanie wymagane jest przepisami
            prawa.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            5. Prawa użytkownika
          </h2>
          <p>Zgodnie z RODO użytkownikowi przysługują następujące prawa:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Prawo dostępu do swoich danych (art. 15 RODO)</li>
            <li>Prawo do sprostowania danych (art. 16 RODO)</li>
            <li>Prawo do usunięcia danych – „prawo do bycia zapomnianym" (art. 17 RODO)</li>
            <li>Prawo do ograniczenia przetwarzania (art. 18 RODO)</li>
            <li>Prawo do przenoszenia danych (art. 20 RODO)</li>
            <li>Prawo do sprzeciwu wobec przetwarzania (art. 21 RODO)</li>
            <li>Prawo do cofnięcia zgody w dowolnym momencie (art. 7 ust. 3 RODO)</li>
            <li>
              Prawo do wniesienia skargi do organu nadzorczego – Prezesa Urzędu
              Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            6. Pliki cookies
          </h2>
          <p>
            Serwis wykorzystuje pliki cookies w celu zapewnienia prawidłowego
            działania, analizy ruchu oraz personalizacji treści. Rodzaje
            wykorzystywanych cookies:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Niezbędne</strong> – wymagane do działania Serwisu (np.
              sesja użytkownika). Podstawa: art. 6 ust. 1 lit. f RODO.
            </li>
            <li>
              <strong>Analityczne</strong> – zbierają anonimowe dane o
              korzystaniu z Serwisu (np. Google Analytics). Podstawa: zgoda
              użytkownika.
            </li>
            <li>
              <strong>Marketingowe</strong> – umożliwiają wyświetlanie
              spersonalizowanych reklam (np. Meta Pixel, Google Ads). Podstawa:
              zgoda użytkownika.
            </li>
          </ul>
          <p>
            Użytkownik może zarządzać ustawieniami cookies w przeglądarce.
            Wyłączenie cookies niezbędnych może ograniczyć funkcjonalność
            Serwisu.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            7. Bezpieczeństwo danych
          </h2>
          <p>
            Administrator stosuje odpowiednie środki techniczne i organizacyjne
            zapewniające ochronę przetwarzanych danych osobowych, w
            szczególności zabezpieczenia przed nieuprawnionym dostępem,
            utratą lub zniszczeniem.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            8. Zmiany polityki prywatności
          </h2>
          <p>
            Administrator zastrzega sobie prawo do zmiany niniejszej polityki
            prywatności. O istotnych zmianach użytkownicy zostaną
            poinformowani za pośrednictwem Serwisu. Korzystanie z Serwisu po
            wprowadzeniu zmian oznacza ich akceptację.
          </p>
        </section>

        <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/30 p-4 mt-8">
          <p className="text-emerald-800 dark:text-emerald-300 text-xs">
            <strong>Uwaga:</strong> Niniejsza polityka prywatności ma charakter
            wzorcowy i powinna zostać zweryfikowana przez radcę prawnego przed
            publikacją w wersji produkcyjnej.
          </p>
        </div>
      </div>
    </div>
  );
}
