# Draft Polityki Prywatności (Cookies & Analytics)
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17 — Zmiany pod kątem RODO i analityki

Poniższe sekcje powinny zostać zaimplementowane przez `Claude Code` na stronie `src/app/polityka-prywatnosci/page.tsx` w odpowiednich nagłówkach dotyczących plików cookies i analityki.

---

## Nowy fragment: Pliki Cookies i Narzędzia Śledzące (Zgoda)

W serwisie CebulaZysku.pl używamy plików cookies (ciasteczek) oraz innych podobnych technologii (np. local storage, znaczniki pikselowe) w celu prawidłowego działania strony, analizy ruchu, poprawy komfortu użytkowania oraz personalizacji treści i reklam.

Korzystamy z mechanizmu Google Consent Mode v2, co oznacza, że szanujemy Twoje decyzje. Dopóki nie wyrazisz na to wyraźnej zgody na bannerze plików cookies, zablokowane zostaną wszystkie technologie analityczne i reklamowe (poza absolutnie niezbędnymi do technicznego działania serwisu). 

Możesz w każdej chwili zarządzać swoimi zgodami (wycofać je lub zmienić) korzystając z linku **"Ustawienia cookies"** dostępnego w stopce naszej strony.

Podzieliliśmy nasze pliki cookies na trzy główne kategorie:

1. **Niezbędne (Zawsze aktywne):** Są kluczowe dla działania strony internetowej. Zapewniają między innymi funkcje nawigacyjne, zapamiętanie statusu zalogowania, a także sam wybór i zapamiętanie zgód dotyczących plików cookies. Strona internetowa nie może funkcjonować w pełni poprawnie bez tych ciasteczek.
2. **Analityczne (Wymagają zgody):** Pozwalają nam liczyć wizyty i źródła ruchu na naszej platformie. Dzięki nim wiemy, które podstrony promocyjne są najpopularniejsze i jak użytkownicy poruszają się po serwisie (np. za pomocą Google Analytics). Zebrane przez nie dane są agregowane i nie służą bezpośrednio identyfikacji konkretnej osoby.
3. **Reklamowe i Personalizacyjne (Wymagają zgody):** Mogą być wykorzystywane przez nas oraz naszych partnerów reklamowych (np. firmy zarządzające mediami społecznościowymi) do budowania profilu Twoich zainteresowań i wyświetlania Ci dopasowanych reklam ("cebulowych okazji") na innych stronach internetowych, a także precyzyjnego mierzenia efektywności naszych kampanii.

## Nowy fragment: Z jakich platform i partnerów korzystamy?

Aby nieustannie polepszać nasze usługi i docierać do nowych "cebularzy", nawiązaliśmy współpracę z zewnętrznymi podmiotami analityczno-reklamowymi. Pełną listę naszych partnerów stanowią:

* **Google (Google Analytics 4, Google Ads)** — w zakresie mierzenia statystyk używalności i skuteczności reklam w wyszukiwarce. 
* **Meta (Facebook, Instagram Pixel)** — w zakresie mierzenia zdarzeń, skuteczności kampanii reklamowych oraz remarketingu.
* **TikTok (TikTok Pixel)** — w zakresie analizy konwersji reklam w sieci TikTok.
* **X / Twitter (X Pixel)** — w zakresie optymalizacji kampanii w tej sieci.
* **LinkedIn (Insight Tag)** — do celów reklamowych i analitycznych na platformie LinkedIn.
* **Microsoft Ads (UET Tag)** — do śledzenia konwersji pochodzących z reklam w sieci wyszukiwania Bing/Yahoo.

Wykorzystujemy scentralizowany system **Google Tag Manager (GTM)**, który na bieżąco zarządza aktywnością powyższych skryptów na podstawie wyrażonej przez Ciebie zgody.

## Nowy fragment: Zabezpieczone Śledzenie Konwersji (Enhanced Conversions)

Bezpieczeństwo Twoich danych to dla nas priorytet. W celu podniesienia dokładności prowadzonych przez nas działań afiliacyjnych, korzystamy z funkcji Zaawansowanych Konwersji (m.in. w systemach Google i Meta). 

Gdy podejmujesz na stronie działania (np. rejestrujesz konto lub klikasz wybraną promocję bankową), dane takie jak Twój adres e-mail **nie są przesyłane w sposób jawny**. Przed wysłaniem do serwisu partnerskiego, adres e-mail zostaje natychmiast i nieodwracalnie zahashowany po stronie Twojej przeglądarki (za pomocą algorytmu SHA-256). Mechanizm ten pozwala platformom zewnętrznym na powiązanie wizyty z wcześniejszymi działaniami bez posiadania faktycznego, "czytelnego" tekstu Twojego maila. Możesz z tego zrezygnować, wycofując zgodę w sekcji "Reklamowe".
