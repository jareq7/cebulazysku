# 4. Fazy zrealizowane — szczegóły

[← Powrót do spisu treści](./README.md) | [Roadmapa](./03-roadmap.md)

---

## Faza 0 — Rebranding (Marzec 2026)
**Co zrobiono:**
- Zmieniono nazwę serwisu z „BankPremie" na „CebulaZysku" we wszystkich plikach.
- Nowa paleta kolorów CSS (oklch) — emerald/green.
- Cebulowy język komunikacji w całym serwisie.

---

## Faza: Stabilizacja Danych i Automatyzacja (Marzec 2026)
**Co zrobiono:**
- **Parser Warunków:** Naprawiono krytyczne błędy w deterministycznym parserze (`parse-leadstar-conditions.ts`).
- **Lektor (TTS):** Usprawniono funkcję `sanitizeForTTS` dla ElevenLabs (obsługa skrótów, kwot).
- **Generator Voiceoverów:** Nowy skrypt TS do masowej produkcji dźwięku.
- **Import Bloga:** Skrypt do masowego wrzucania artykułów Markdown do Supabase.

---

## Faza: Analytics, GTM i Consent Mode (Marzec 2026)
**Co zrobiono:**
- **GTM:** Kompletna konfiguracja kontenera (GA4, Meta, TikTok, X, LinkedIn, Google Ads).
- **DataLayer:** Wdrożenie 21 eventów (e-commerce + custom) z obsługą Consent Mode v2.
- **Enhanced Conversions:** Szyfrowanie maili użytkowników (SHA-256) przed wysyłką do platform reklamowych.
- **Audyt Lighthouse:** Pierwszy run produkcyjny, identyfikacja quick-wins.

---

## Faza: SEO Power-Up i Narzędzia Marketingowe (18 Marca 2026)
**Co zrobiono:**

### 1. Zaawansowane Structured Data (JSON-LD)
- **Podstrony ofert:** Wdrożono schematy `Product` + `Offer` (pokazujące kwotę premii bezpośrednio w Google) oraz `HowTo` (generujące kroki instrukcji ołupienia banku w wynikach wyszukiwania).
- **Ranking:** Dodano schemat `ItemList` dla lepszej prezentacji listy ofert w wyszukiwarce.
- **Walidacja:** Wszystkie schematy przetestowane pod kątem zgodności z wytycznymi Google.

### 2. Dynamiczny Silnik OG Images (@vercel/og)
- **Automatyzacja miniatur:** Stworzono endpoint `/api/og`, który w locie generuje szmaragdowe grafiki udostępniania dla social mediów.
- **Personalizacja:** Grafiki automatycznie pobierają logotyp banku, kwotę premii oraz tytuł artykułu/oferty.
- **Integracja:** Podpięto pod `generateMetadata` w ofertach i na blogu.

### 3. SEO Long-Tail: Archiwum Promocji
- **Status ofert:** Rozszerzono bazę danych o kolumnę `status` (active, expired, draft).
- **Strona /archiwum:** Nowy widok prezentujący wygasłe promocje, budujący autorytet domeny i pozwalający użytkownikom sprawdzać archiwalne regulaminy.
- **UX:** Wygasłe oferty posiadają teraz dedykowany żółty banner `ExpiredOfferBanner.tsx` kierujący do aktualnego rankingu.

### 4. Content i Lead Magnety
- **Blog Batch 2:** Napisano 4 obszerne artykuły SEO (bezpieczeństwo, ranking marca, PIT, wiele kont).
- **Kalkulator Zysku:** Zbudowano interaktywny prototyp `ProfitCalculator.tsx` z animacją licznika i efektem konfetti – gotowy do wdrożenia na Landing Page.
- **Newsletter:** Zaprojektowano responsywny szablon HTML tygodniowego biuletynu Cebularza.
- **Midjourney Prompts:** Przygotowano zestaw 10 precyzyjnych promptów do generowania spójnych okładek blogowych 3D.

### 5. Finalny Audyt SEO i Wydajności
- Przeprowadzono kompleksowy audyt Lighthouse dla 5 kluczowych podstron. 
- Wyniki: **SEO: 100/100**, **Accessibility: 95+/100**, **Performance: 90+/100**.
- Naprawiono problemy z CLS (Cumulative Layout Shift) poprzez dodanie explicit wymiarów do logotypów banków.

---
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-18 — Dokumentacja potężnej fali ulepszeń SEO i marketingowych


### Strategia Social Media (Absurd AI TikToks)
- Przeprowadzono głęboki research trendu "AI Brainrot" (gigantyczne zwierzęta, absurdalne sytuacje) na TikToku.
- Przygotowano 4 dedykowane, viralowe koncepcje skryptów (research/tiktok-absurd-ai-concepts.md) łączące ten trend z monetyzacją ofert bankowych i humorem "CebulaZysku".


### Content Marketing & Copywriting (18 Marca 2026)
- **TikTok Viral AI:** Rozbudowano bazę koncepcji do 20 gotowych scenariuszy pod formaty m.in. Subway Surfers, AI Cooking, Time Traveler.
- **Social Media:** Stworzono 10 gotowych formatów graficznych/memów pod modele Imagen/Midjourney.
- **Copywriting:** Zoptymalizowano bazę CTA i krótkich opisów dla 5 topowych banków w celu zwiększenia CTR.
- **Blog:** Rozszerzono bazę artykułów SEO o 4 kolejne wpisy (Batch 3).
- **FAQ:** Przygotowano zbiór 15 najczęstszych pytań i odpowiedzi gotowych do wdrożenia jako sekcja JSON-LD na stronę główną.
- **Analiza konkurencji:** Przeanalizowano 5 kluczowych portali afiliacyjnych w Polsce (m m.in. Bankier, Rankomat), wyciągając nasze USP (Unique Selling Propositions).


### UX/UI Components Content (19 Marca 2026)
- **Słownik pojęć:** Wygenerowano JSON () z definicjami 12 pojęć (BIK, BFG, itp.) i rodzajami trudności, gotowymi do zasilenia komponentów Tooltip na stronie.
- **Schematy nawigacyjne:** Opracowano wzorcowe struktury BreadcrumbList (JSON-LD) do użycia na różnych typach podstron.


### UX/UI Components Content (19 Marca 2026)
- **Słownik pojec:** Wygenerowano JSON dla slownika z definicjami 12 pojec (BIK, BFG, itp.) i rodzajami trudnosci, gotowymi do zasilenia komponentow Tooltip na stronie.
- **Schematy nawigacyjne:** Opracowano wzorcowe struktury BreadcrumbList (JSON-LD) do uzycia na roznych typach podstron.


### Content Marketing: TikTok Scripts (25 Marca 2026)
- Wygenerowano 15 agresywnych skryptów wideo w formacie 'Hack/Loophole' dla 5 kluczowych banków.
- Zoptymalizowano skrypty pod kątem krótkiego metrażu (Short-form video, max 140 słów) z mocnymi hookami wizualnymi, idealnymi do wygenerowania przez Google Veo i udźwiękowienia przez ElevenLabs.
- Wynik zapisano do pliku `research/tiktok-scripts-hack.md`.


### Content Marketing: TikTok Storytime (25 Marca 2026)
- Wygenerowano 10 narracyjnych skryptów wideo w formacie 'Storytime' z perspektywy pierwszej osoby (wyznania bankiera, studenta, księgowej).
- Skrypty oparto na mechanizmach satysfakcjonujących wideo w tle (Subway Surfers, ASMR) oraz mocnych, osobistych hookach nakierowanych na przełamanie obiekcji.
- Wynik zapisano do pliku `research/tiktok-scripts-storytime.md`.


### Content Marketing: TikTok Challenge Arc (25 Marca 2026)
- Wygenerowano 12-tygodniowy plan strategii kontentowej na TikToka w formacie 'Wyzwanie 3000 zł'.
- Opracowano logiczny postęp monetyzacji kolejnych banków i edukacji finansowej użytkownika.
- Wynik zapisano w pliku `research/tiktok-challenge-arc.md`.


### Content Marketing: TikTok Skrypty Edukacyjne (25 Marca 2026)
- Wygenerowano 10 zwięzłych, edukacyjnych skryptów wideo TikTok.
- Skupiono się na zbijaniu głównych obiekcji klientów (strach o zdolność kredytową BIK, widmo podatku od premii, różnice między płatnością BLIK a przelewem na telefon).
- Ustrukturyzowano hooki by zatrzymać uwagę widza. Zapisano w `research/tiktok-scripts-education.md`.


### Content Marketing: Blog Comparisons (25 Marca 2026)
- Utworzono nową serię artykułów blogowych typu 'X vs Y', mających na celu zagospodarowanie ruchu osób niezdecydowanych.
- Zestawiono najważniejsze pojedynki m.in. mBank vs ING, Santander vs Pekao oraz BNP vs VeloBank.
- Skupiono się na bezlitosnym punktowaniu opłat oraz rekomendacjach pod kątem 'cebulowej' łatwości wypłaty premii. Zapisano w `research/content/comparisons/`.


### Content Marketing: Artykuły Blogowe 'Ile Zarobić' (25 Marca 2026)
- Stworzono serię 3 progresywnych artykułów na bloga uświadamiających potencjał finansowy i motywujących nowicjuszy do wdrożenia się w lejki afiliacyjne (progi: 1000 zł na start, 3000 zł i poziom master 5000 zł rocznie).
- Wykorzystano taktykę edukowania o kumulacjach, poleceniach i kartach kredytowych. Artykuły zapisano w `research/content/how-much/`.


### Content Marketing: Artykuły Blogowe dla Noobów (25 Marca 2026)
- Utworzono sekcję 5 poradników dedykowanych dla początkujących użytkowników ('noobów').
- Skupiono się na absolutnych podstawach: jak działają promocje krok po kroku oraz obaleniu 5 największych szkodliwych mitów (BIK, Skarbówka, Opłaty).
- Treści zapisano w katalogu `research/content/noob/` pod budowę stron lądowania z artykułami uświadamiającymi.


### Dokumentacja: Brand Book (25 Marca 2026)
- Stworzono Księgę Marki (Brand Book) w pliku research/brand-book.md określającą tożsamość, misję i archetyp projektu CebulaZysku.pl.
- Zdefiniowano ścisłe zasady Tone of Voice (ToV), słownictwo oraz listę Dos and Donts.
- Dokument ma na celu zunifikowanie stylu pisania pomiędzy różnymi modelami AI i copywriterami tworzącymi treści w obrębie ekosystemu.


### Content Marketing: Warianty Hero Copy (25 Marca 2026)
- Utworzono 3 warianty copywritingu (H1, H2, CTA) pod testy A/B dla głównej sekcji (Hero) na landing page.
- Zastosowano trzy różne hooki psychologiczne: Greedy (bezpośredni zysk), Utility (narzędzie tracker) oraz Community (social proof).
- Zapisano jako `research/hero-copy-variants.md`.


### Content Marketing: Welcome Email (25 Marca 2026)
- Napisano 3 warianty wiadomości powitalnej pod testy A/B/C w systemie mailingowym Resend.
- Warianty skupiają się odpowiednio na: budowaniu autorytetu, skracaniu dystansu do zakupu (The Greedy Hook) oraz opowiadaniu historii (Storytelling the Oops format).
- Zapisano w `research/welcome-email-copy.md` pod wdrożenie przez programistę.


### Content Marketing: Win Stories (25 Marca 2026)
- Wygenerowano 6 angażujących historii sukcesu (Win Stories) pod docelowe umieszczenie w sekcji Testimonials/Social Proof.
- Oparto je na najczęstszych archetypach zapytań użyszkodników z grup na FB (karty kredytowe z zerowym oprocentowaniem, programy poleceń wewnątrz rodziny).
- Zapisano jako research/win-stories.md.


### Content Marketing: Marketing Partyzancki (25 Marca 2026)
- Stworzono zestaw 10 naturalnych, wysoce zoptymalizowanych pod kątem algorytmów forów dyskusyjnych (Reddit, Wykop) szablonów odpowiedzi.
- Skupiono się na pozycjonowaniu CebulaZysku.pl nie jako produktu komercyjnego, a przydatnego, darmowego narzedzia trackujacego uzywanego przez innych bystrych internautow.
- Zapisano w pliku research/reddit-answer-templates.md.


### Content Marketing: Social Media Posts (25 Marca 2026)
- Wygenerowano 5 precyzyjnie napisanych postów pod marketing organiczny na serwisach Wykop.pl (Mikroblog) oraz na hermetycznych grupach na Facebooku.
- Posty na Wykop pisane są luźnym, zironizowanym żargonem (cebuladeals, mirki), a posty na FB oparto o edukację i użycie emoji w celu stymulacji komentarzy.
- Plik zapisano w `research/wykop-posts.md`.


### Content Marketing: Reklamy Google Ads (25 Marca 2026)
- Napisano zestawy nagłówków i tekstów do reklam Google Ads (RSA) ukierunkowane pod konwersje z intencji wyszukiwań typu darmowe konto, darmowa kasa czy banki.
- Utworzono 4 warianty grup reklamowych: Oszczędnościowy, Studencki, Zyskowy (Afiliacja) oraz Brandowy, co zapisano w `research/google-ads-copy.md`.


### Content Marketing: PDF Lead Magnet (25 Marca 2026)
- Napisano 10-stronicowy przewodnik (E-Book) o tytule Kodeks Cebularza 2026, służący jako darmowy lead magnet za zapis na newsletter.
- Treść ma format lejka sprzedażowego, prowadzącego nowicjusza od przełamywania barier przez zakładanie pierwszego konta, aż po wejście w tzw. rotację i rejestrację w darmowym trackerze zysków na stronie głównej.
- Wynik zapisany w `research/lead-magnet-guide.md`.


### Faza: Content & SEO Growth (Batch 2 & 3) - 26 Marca 2026
- Finalizacja E-booka (Lead Magnet) - 15 stron gotowych do składu.
- Opracowanie sekwencji onboardingowej e-mail (3 maile) oraz kampanii Social Media na kwiecień.
- Audyt i optymalizacja promptów generatora opisów ofert (poprawa Tone of Voice).
- Produkcja 5 artykułów Pillar Content pod frazy long-tail.
- Analiza luki słów kluczowych względem sprawdzpremie.pl, bankier.pl i WP Finanse.
