# Analiza Konkurencji: Polskie Porównywarki Promocji Bankowych
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17

Przeprowadzono badanie polskiego rynku afiliacji bankowych (na podstawie głównych graczy takich jak Rekin Finansów, ZamknijKonto, NajlepszeKonta, LiveSmarter, Comperia, Bankier). Poniżej zestawienie ich taktyk, mocnych stron oraz luk rynkowych, które CebulaZysku.pl wypełnia lub powinna zagospodarować.

## 1. Główni Gracze na Rynku (Przykłady)

### Rekin Finansów / LiveSmarter
- **Mocne strony:** Bardzo zaawansowana, wieloletnia baza artykułów. Silny osobisty brand autora budujący zaufanie. Szczegółowe "prześwietlanie" regulaminów linijka po linijce.
- **Słabe strony:** Archaiczny design, gąszcz tekstu. Wymagają od czytelnika przeczytania artykułu na 3000 słów by zrozumieć czy się opłaca. Brak zautomatyzowanych trackerów dla użytkowników.

### ZamknijKonto.pl
- **Mocne strony:** Bardzo skuteczna niszowa optymalizacja pod zapytania "jak zamknąć konto". Czysty interfejs.
- **Słabe strony:** Brak rozbudowanych funkcji dla powracających użytkowników (np. konta usera, gamifikacji).

### Bankier / Comperia (Agregatory finansowe)
- **Mocne strony:** Gigantyczny autorytet (Domain Authority). Posiadają porównywarki niemal wszystkiego.
- **Słabe strony:** Brak "duszy". Suche tabele, w których premie bankowe to tylko jeden z wielu parametrów. Całkowity brak edukacji czy pomocy przy realizacji warunków (tylko odsyłają do banku).

## 2. Co konkurencja robi dobrze?

1. **Email Marketing (Newslettery):** Posiadają potężne bazy mailingowe z "alertami" o nowych okazjach. (U nas: Faza 5 - do dokończenia powiadomienia e-mail).
2. **Kalkulatory Zysku:** Niektóre portale udostępniają suwaki "Ile możesz zyskać w tym miesiącu otwierając te 3 konta".
3. **Archiwum Promocji (Cmentarzysko):** Utrzymują na podstronach stare, nieaktywne już promocje z adnotacją "Zakończona", co świetnie działa na długi ogon SEO, bo ludzie wciąż szukają starych warunków po paru miesiącach.

## 3. Czego brakuje u konkurencji? (Nasza przewaga - CebulaZysku)

1. **Dashboard & Gamifikacja (Killer Feature):** Nikt w Polsce nie oferuje panelu "Trackera", w którym użytkownik może odznaczać warunki, zbierać odznaki, włączyć push notifications z przypomnieniem o terminach, ani śledzić swoich historycznych łupów w jednym miejscu (PWA). Jesteśmy tu pionierem.
2. **"Moje Banki" i Karencja:** Brak u konkurencji systemu, który filtruje oferty na podstawie "mam tu już konto" i zdejmuje ciężar liczenia karencji z użytkownika.
3. **Krótkie formy (Shorts / AI / Wideo):** Blogerzy skupiają się na ścianach tekstu. Nasze wideo-podsumowania, pigułki wiedzy pisane przez AI oraz styl "Cebulowy" są bardziej przystępne na telefonach komórkowych.
4. **Przejrzystość Warunków:** Tabele z logami i konkretnymi "X transakcji", podawane w jednolitym formacie niezależnie od banku, to krok naprzód w porównaniu z ciągłym tekstem.

## 4. Rekomendacje dla CebulaZysku.pl (Roadmap & Action Points)

Biorąc pod uwagę powyższe wnioski, oto na co powinniśmy położyć nacisk w kolejnych tygodniach rozwoju:

### A) Utrzymanie starych ofert pod SEO
Zamiast ukrywać zakończone z LeadStar oferty poprzez flagę `is_active: false` (co usuwa je ze strony i sitemap), powinniśmy na froncie prezentować podstrony z flagą, dodając ogromny banner **"Ta promocja wygasła. Sprawdź najnowsze oferty tego banku tutaj →"**. Ludzie szukają w Google np. "regulamin mbank wrzesień 2025" - musimy tam być, nawet jeśli promocji już nie ma, i przekierowywać ich na nasz dzisiejszy ranking.

### B) Kalkulator "Cebulowego Potencjału" (Lead Magnet)
Zaimplementować prosty quiz na stronie głównej (w formie lead magnet): "W jakich bankach masz już konto? Zaznacz loga." -> "Klik!" -> Wyświetla kwotę: "Zostało Ci jeszcze 3450 zł gwarantowanej premii do wyciągnięcia. Zostaw maila, przyślemy Ci instrukcję od czego zacząć".

### C) Tabela "Archiwalnych Karencji" na podstronie banku
Na `/oferta/mbank` można dodać akordion pokazujący archiwum: jakie były poprzednie daty karencji w historycznych promocjach. To buduje wiarygodność i eksperckość w oczach Google.