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
        Ostatnia aktualizacja: 17 marca 2026 r.
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
            <li>Dostawcy narzędzi analitycznych i reklamowych (Google Analytics, Google Ads, Meta, TikTok, X, LinkedIn, Microsoft Ads — szczegóły w sekcji 7)</li>
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
            6. Pliki cookies i narzędzia śledzące
          </h2>
          <p>
            W serwisie CebulaZysku używamy plików cookies (ciasteczek) oraz
            innych podobnych technologii (np. local storage, znaczniki pikselowe)
            w celu prawidłowego działania strony, analizy ruchu, poprawy
            komfortu użytkowania oraz personalizacji treści i reklam.
          </p>
          <p>
            Korzystamy z mechanizmu Google Consent Mode v2, co oznacza, że
            szanujemy Twoje decyzje. Dopóki nie wyrazisz na to wyraźnej zgody
            na bannerze plików cookies, zablokowane zostaną wszystkie
            technologie analityczne i reklamowe (poza absolutnie niezbędnymi
            do technicznego działania serwisu).
          </p>
          <p>
            Możesz w każdej chwili zarządzać swoimi zgodami (wycofać je lub
            zmienić) korzystając z linku <strong>„Ustawienia cookies"</strong>{" "}
            dostępnego w stopce naszej strony.
          </p>
          <p>Podzieliliśmy nasze pliki cookies na trzy główne kategorie:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Niezbędne (zawsze aktywne)</strong> – kluczowe dla
              działania strony: funkcje nawigacyjne, zapamiętanie statusu
              zalogowania, a także sam wybór i zapamiętanie zgód dotyczących
              plików cookies. Podstawa: art. 6 ust. 1 lit. f RODO.
            </li>
            <li>
              <strong>Analityczne (wymagają zgody)</strong> – pozwalają nam
              liczyć wizyty i źródła ruchu. Dzięki nim wiemy, które podstrony
              są najpopularniejsze i jak użytkownicy poruszają się po serwisie
              (np. za pomocą Google Analytics 4). Zebrane dane są agregowane
              i nie służą bezpośrednio identyfikacji konkretnej osoby. Podstawa:
              art. 6 ust. 1 lit. a RODO (zgoda).
            </li>
            <li>
              <strong>Reklamowe i personalizacyjne (wymagają zgody)</strong> –
              mogą być wykorzystywane przez nas oraz naszych partnerów
              reklamowych do budowania profilu zainteresowań i wyświetlania
              dopasowanych reklam na innych stronach internetowych, a także
              precyzyjnego mierzenia efektywności kampanii. Podstawa:
              art. 6 ust. 1 lit. a RODO (zgoda).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            7. Platformy i partnerzy analityczno-reklamowi
          </h2>
          <p>
            Wykorzystujemy scentralizowany system Google Tag Manager (GTM),
            który zarządza aktywnością poniższych skryptów na podstawie
            wyrażonej przez Ciebie zgody:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Google (Google Analytics 4, Google Ads)</strong> –
              mierzenie statystyk używalności i skuteczności reklam w
              wyszukiwarce.
            </li>
            <li>
              <strong>Meta (Facebook, Instagram Pixel)</strong> – mierzenie
              zdarzeń, skuteczności kampanii reklamowych oraz remarketing.
            </li>
            <li>
              <strong>TikTok (TikTok Pixel)</strong> – analiza konwersji reklam
              w sieci TikTok.
            </li>
            <li>
              <strong>X / Twitter (X Pixel)</strong> – optymalizacja kampanii
              w tej sieci.
            </li>
            <li>
              <strong>LinkedIn (Insight Tag)</strong> – cele reklamowe i
              analityczne na platformie LinkedIn.
            </li>
            <li>
              <strong>Microsoft Ads (UET Tag)</strong> – śledzenie konwersji
              pochodzących z reklam w sieci wyszukiwania Bing/Yahoo.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            8. Zabezpieczone śledzenie konwersji (Enhanced Conversions)
          </h2>
          <p>
            W celu podniesienia dokładności prowadzonych działań afiliacyjnych
            korzystamy z funkcji Zaawansowanych Konwersji (Enhanced Conversions)
            w systemach Google i Meta.
          </p>
          <p>
            Gdy podejmujesz na stronie działania (np. rejestrujesz konto lub
            klikasz wybraną promocję bankową), dane takie jak Twój adres e-mail{" "}
            <strong>nie są przesyłane w sposób jawny</strong>. Przed wysłaniem
            do serwisu partnerskiego adres e-mail zostaje natychmiast i
            nieodwracalnie zahashowany po stronie Twojej przeglądarki (za
            pomocą algorytmu SHA-256). Mechanizm ten pozwala platformom
            zewnętrznym na powiązanie wizyty z wcześniejszymi działaniami
            bez posiadania czytelnego tekstu Twojego maila.
          </p>
          <p>
            Możesz z tego zrezygnować, wycofując zgodę w kategorii
            „Reklamowe" w ustawieniach cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            9. Bezpieczeństwo danych
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
            10. Zmiany polityki prywatności
          </h2>
          <p>
            Administrator zastrzega sobie prawo do zmiany niniejszej polityki
            prywatności. O istotnych zmianach użytkownicy zostaną
            poinformowani za pośrednictwem Serwisu. Korzystanie z Serwisu po
            wprowadzeniu zmian oznacza ich akceptację.
          </p>
        </section>

      </div>
    </div>
  );
}
