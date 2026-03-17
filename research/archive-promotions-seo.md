# Koncepcja Archiwum Promocji Bankowych (SEO Long Tail)
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17

Utrzymywanie zakończonych promocji bankowych w serwisie to jedna z najskuteczniejszych taktyk budowania ruchu "długiego ogona" (long tail SEO). Użytkownicy często wyszukują w Google regulaminów starych ofert (np. "promocja mbank sierpień 2025 regulamin", "kiedy wypłata premii santander edycja 3"), aby upewnić się, czy spełnili warunki lub kiedy spodziewać się przelewu.

## 1. Jak to robi konkurencja?
- **LiveSmarter / Rekin Finansów:** Zostawiają stare artykuły na blogu, dodając na górze czerwoną belkę z tekstem "Ta promocja jest już nieaktualna". Linki pozostają w indeksie Google.
- **Bankier / Comperia:** Usuwają oferty z głównego rankingu, ale podstrona danej oferty (jeśli istniała) zwraca często błąd 404 lub przekierowuje 301 na stronę główną (co jest złym podejściem UX/SEO w kontekście szukania regulaminów).

## 2. Nasza strategia (CebulaZysku.pl)

Zamiast zmieniać `is_active: false` (co ukrywa ofertę przed frontendem i usuwa z sitemap.xml), powinniśmy dodać nowy status oferty.

### Nowy model danych w Supabase
W tabeli `offers`:
Zmiana podejścia z `is_active` (boolean) na enum `status`: `['active', 'expired', 'draft']` lub pozostawienie `is_active` ale dodanie `is_archived`.
Dla minimalnej zmiany u nas: gdy oferta wygasa (znika z XML), ustawiamy `status: 'expired'` (lub `is_active: false` ale front nadal potrafi wyciągnąć ofertę po slugu, tylko nie pokazuje jej na głównej stronie w Rankingu).

### UX/UI Strony Archiwalnej (`/oferta/[slug]`)
Gdy użytkownik wchodzi na wygasłą ofertę:
1. **Banner:** Na samej górze ogromny, szary/żółty banner: "⚠️ Ta promocja zakończyła się w dniu [data]. [Sprawdź aktualne promocje tego banku ->]".
2. **Brak linków afiliacyjnych:** Przycisk "Załóż konto" znika lub zmienia się na "Zobacz aktualny ranking". (Nie chcemy przepalać pustych klików).
3. **Zachowanie treści:** Opis, pros/cons, FAQ i przede wszystkim **Warunki z datami wypłat** pozostają widoczne! Użytkownik, który u nas założył konto miesiąc temu, musi mieć możliwość powrotu do trackera.

## 3. Nowy widok: `/archiwum` lub `/zakonczone-promocje`
Stworzenie podstrony, na której chronologicznie wylistowane są wszystkie stare promocje (paginowane). To buduje ogromny autorytet w oczach Google ("ta strona śledzi promocje od lat, ma potężną bazę danych").

## 4. Wytyczne implementacyjne (Dla Claude)
1. Zmiana w API / frontendzie: funkcja `getOfferBySlug` powinna zwracać ofertę nawet jeśli `is_active = false` (lub `status = expired`), ale sam ranking (`getOffers`) odfiltrowuje wygasłe.
2. Sitemap.ts musi nadal wypluwać URL-e wygasłych ofert, aby Google ich nie deindeksował.
3. Component `OfferCard` zyskuje wariant `expired` (szare logo, brak przycisku).
