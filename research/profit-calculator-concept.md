# Koncepcja Kalkulatora Zysków Cebularza (Lead Magnet)
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17

Kalkulator zysków to potężne narzędzie konwersyjne na stronie głównej, które pozwoli nowym użytkownikom natychmiast zwizualizować, ile pieniędzy leży na stole.

## 1. Cel Biznesowy
Zamiast pokazywać suchą sumę (np. "3450 zł na start"), angażujemy użytkownika w prostą interakcję (mikro-zaangażowanie). Zwiększa to FOMO i chęć rozpoczęcia "obierania".

## 2. Proponowany UX/UI
Sekcja na stronie głównej (tuż pod Hero).
**Tytuł:** Zobacz, ile zarobisz w tym miesiącu!
**Krok 1:** Pytanie "Gdzie masz już konto osobiste?"
- Użytkownik widzi grid małych logotypów najpopularniejszych banków (PKO, mBank, ING, Santander, Millennium).
- Może kliknąć loga, by je "wyszarzyć" (zaznaczyć jako posiadane).
**Krok 2:** Interaktywny licznik (jak w samochodzie), który płynnie zlicza w dół potencjalną kwotę na podstawie odklikniętych banków.
- Np. Zaznacza mBank (-500 zł), zaznacza ING (-300 zł).
- Licznik: "Zostało Ci jeszcze do odebrania: 2650 zł!"
**Krok 3:** CTA "Odbierz swoje 2650 zł". Przycisk przenosi do Rankingu z automatycznie nałożonym filtrem (wykluczonymi bankami).

## 3. Elementy Techniczne (React / Next.js)
1. **Stan lokalny:** `useState<string[]>` z tablicą ID banków, w których user ma konto.
2. **Kalkulacja:** Przekazanie `offers` jako props. `const potential = offers.filter(o => !selectedBanks.includes(o.bankId)).reduce(...)`.
3. **Framer Motion / Framer:** Użycie animacji zliczania cyfr dla efektu "wow".
4. **URL State:** Po kliknięciu CTA przekierowanie na `/#oferty?exclude=mbank,ing`, co pozwala komponentowi `OfferFilters` od razu zainicjować stan (lub zapis do Contextu `UserBanksContext`, jeśli user w międzyczasie zdecyduje się na szybką rejestrację).

## 4. Dlaczego to zadziała?
Wykorzystujemy zasadę tzw. "Endowment effect" (efekt posiadania). Użytkownik widzi kwotę 2650 zł, która jest "jego" (jest dostępna), ale on jej nie bierze. Psychologia wskazuje, że strata boli dwa razy bardziej niż zysk cieszy – "tracę 2650 zł, nie robiąc nic".
To idealny wstęp przed klasycznym onboardingiem.
