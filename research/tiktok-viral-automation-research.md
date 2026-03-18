# Raport: Automatyzacja Viralowych Wideo na TikTok / Reels (Nisza Finansowa)
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17

Niniejszy raport to głęboka analiza technologii, formatów i przepływów pracy (pipelines) niezbędnych do zbudowania zautomatyzowanej fabryki treści wideo (tzw. "Faceless Channel" / kanał bez twarzy) dla CebulaZysku.pl na platformach takich jak TikTok, Instagram Reels i YouTube Shorts.

---

## 1. AI vs Spam: Jak się wybić i nie zostać zbanowanym?

Platformy takie jak TikTok i YouTube wprowadzają coraz bardziej rygorystyczne filtry przeciwko tzw. "AI slop" (niskiej jakości, automatycznie generowanym treściom), które zalewają sieć od 2024 roku.

**Czego unikać (Co wygląda jak spam):**
*   Wideo złożone wyłącznie z tanich, darmowych "stockowych" przebitek (ludzie liczący pieniądze na kalkulatorze).
*   Głosy starszej generacji AI (roboci "Google Translate" vibe) lub darmowe głosy z CapCut.
*   Brak dynamicznych napisów i pustka dźwiękowa (brak efektów SFX, takich jak "whoosh", dzwonek kasy).
*   Generyczne porady z ChatGPT ("Zawsze oszczędzaj 20% swojej pensji").

**Co ma szansę na virala (High-Quality AI Faceless):**
*   **Wysoka autentyczność:** Użycie narzędzi takich jak ElevenLabs dla absolutnie naturalnego głosu (słychać wdech, oddech, emocje).
*   **Unikalny format wizualny:** Zamiast zdjęć stockowych – dynamiczne generowanie interfejsu (np. animowany fake iPhone pokazujący przelew na 500 zł), format Reddit Stories ze split-screenem lub AI Avatary "prezenterów".
*   **Zasada 3 Sekund:** Pierwsze 3 sekundy wideo (Hook) decydują o zasięgu. Hook musi być szokujący, przerywający scrollowanie (pattern interrupt).
*   **Curiosity Gap:** Budowanie napięcia w tytule ("Sekret banków, o którym Ci nie powiedzą...").

---

## 2. Formaty i Hooki działające w niszy finansowej

W niszy finansowo-afiliacyjnej (tzw. Wealth Niche / Make Money Online), najlepiej konwertują następujące formaty:

### A) The "Hack" / Loophole Format
*   **Hook:** "Jak w 5 minut wyrwać od banku 500 zł, absolutnie legalnie."
*   **Struktura:** (1) Mocne otwarcie -> (2) Pokazanie problemu (inflacja) -> (3) Pokazanie rozwiązania z ekranem (CebulaZysku) -> (4) Instrukcja gdzie znaleźć link (Bio).
*   **Wizualia:** Dynamiczne zbliżenia na aplikację bankową, zielone napisy z kwotami.

### B) The "Storytime" / Confession Format
*   **Hook:** "Jestem byłym pracownikiem banku. Oto jak oni zarabiają na Tobie, i jak Ty możesz na nich." (Głos z efektem zniekształcenia lub z zacienioną postacią AI).
*   **Struktura:** Budowanie intrygi wokół "systemu", który faworyzuje tych, którzy czytają regulaminy.
*   **Wizualia:** Split-screen (na górze tekst, na dole np. satysfakcjonująca animacja cięcia mydła / Minecraft parkour) – ten format ekstremalnie podbija Watch Time u młodszych odbiorców.

### C) The Checklist / Challenge
*   **Hook:** "Wyzwanie: Wyciągamy z polskiego systemu bankowego 3000 zł do końca roku. Dzień 1."
*   **Struktura:** Codzienny/cotygodniowy update pokazujący odhaczanie kolejnych kont na naszym Trackerze.

---

## 3. Tech Stack: Narzędzia do produkcji automatycznej

Aby kanał był prawdziwie zautomatyzowany ("set and forget"), musimy zbudować potężny stack technologiczny połączony przez API.

| Kategoria | Rekomendowane Narzędzie | Koszt | Dlaczego to? |
| :--- | :--- | :--- | :--- |
| **Orkiestracja (Mózg)** | **Make.com** (lub n8n) | $19/mc | Wizualne budowanie pipeline'u, łatwiejsze webhooki niż w stricte kodowym cronie, natywne integracje z social mediami. |
| **Skrypty (Mózg)** | **Claude 3.5 Sonnet / GPT-4o** | API | Najlepsze rozumienie kontekstu polskiego. Należy wyposażyć je w ogromny "Prompt System" uczący dynamiki TikToka (krótkie zdania, slang). |
| **Voiceover (Głos)** | **ElevenLabs** | od $22/mc | Nie ma dla nich alternatywy. Wymagany model `eleven_multilingual_v2` i dobry "Voice Clone" młodego, dynamicznego Polaka (np. klon głosu youtubera). |
| **Video Engine** | **Remotion** | Darmowe (Self-hosted) | Renderowanie Reacta do MP4! Mamy to już w projekcie (`OfferVideo.tsx`). To nasza przewaga – nie płacimy abonamentów np. dla InVideo/Pictory, a generujemy dokładnie to, czego chcemy. |
| **B-Rolls (Przebitki)** | **Pexels API** lub **Runway/Pika** | API | Automatyczne pobieranie klipów o tematyce "pieniądze, luksus, telefon" podkładanych pod sceny w Remotion. |
| **Napisy (Captions)** | **Whisper (OpenAI) + Remotion** | API | Słowo po słowie (tzw. Hormozi Style Captions). Dynamiczne powiększanie fontu przy krzyku. |
| **Publikacja** | **Ayrshare / Metricool / API** | API | Zdalne rzucanie MP4 na 3 platformy jednocześnie (TikTok, YT, IG). |

---

## 4. Architektura Pipeline'u (Krok po Kroku)

Jak wygląda pełny cykl życia jednego virala bez ingerencji człowieka:

1.  **Trigger (Cron/Make.com):** Codziennie o 10:00 uruchamia się skrypt.
2.  **Research (Data Fetch):** Skrypt uderza do naszej bazy `cebulazysku.pl` po "Aktualną Ofertę Dnia" (np. mBank 500 zł).
3.  **Copywriting (LLM):** Skrypt przesyła parametry oferty do Claude. Claude pisze tekst na 50-60 sekund z mocnym Hookiem, dzieląc go na sceny. (Zwraca JSON w formacie: `[{ "text": "...", "keyword_for_broll": "money" }]`).
4.  **TTS (ElevenLabs):** Skrypt uderza do ElevenLabs, aby zamienić cały "text" na audio. Zapisuje MP3 i generuje "timestamps" dla każdego słowa (do napisów).
5.  **Render (Remotion - GitHub Actions / Lambda):** Orkiestrator uderza w webhooka do AWS Lambda (bądź naszego serwera Node), przekazując JSON ze skryptem, MP3 i logami. Remotion układa z tego animację React, podkłada tło, "podbija" napisy i kompiluje to do surowego MP4 (1080x1920).
6.  **Upload & SEO:** Wideo wędruje do Metricool API. Generowany jest opis (z hashtagami jak #finanse #oszczedzanie #promocja) i publikowany równolegle na TikToku, YouTube Shorts i IG Reels.

---

## 5. Tracking wyników i optymalizacja pętli

Wrzucanie filmów to jedno, ale "automatyzacja" powinna sama się uczyć.

*   **Pobieranie Danych:** Za pomocą YouTube Data API v3 oraz nieoficjalnych endpointów / scraperów TikToka, raz na tydzień wyciągamy statystyki naszych wideo (Views, Watch Time, Likes).
*   **Analiza:** Wyniki zapisujemy do naszej bazy (Tabela `social_media_logs`).
*   **A/B Testing (The Holy Grail):** Dla najlepszych ofert (np. tych najłatwiejszych) system generuje 2 WERSJE filmu różniące się TYLKO pierwszym zdaniem (Hookiem). Analiza bazy po 48 godzinach wskazuje, który Hook wygrał. Model LLM dostaje tę informację ("Ten hook miał 100k wyświetleń, tamten 500. Naśladuj ten pierwszy styl"). To tworzy samodoskonalącą się pętlę.

---

## 6. Przykłady kont i Benchmarki

Aby zrozumieć estetykę, należy przeanalizować te konta (głównie rynek US, który jest rok przed Polską):

*   **@facelessfinance (TikTok):** Idealny przykład prostego formatu: tło z GTA Parkour + wciągający glos AI opowiadający historie biznesowe. Łatwe do odtworzenia.
*   **@ecomzone / @digitalincome:** Wykorzystanie AI do generowania zdjęć "bogatego życia", podczas gdy głos lektora tłumaczy suche fakty ekonomiczne.
*   **Biznesowe Shorts w PL (np. fragmenty podcastów):** Uczą nas, że polski widz lubi napisy (żółto-białe, styl Alexa Hormoziego), wycinane tło, i ciągłą zmianę kadrów (zmiana obrazka co 2-3 sekundy).

## 7. Podsumowanie i Koszty operacyjne
Stworzenie tej maszyny to ok. 2-3 tygodnie pracy inżynieryjnej.
Największym wyzwaniem będzie napisanie elastycznego szablonu `Remotion`, który potrafi "połykać" dynamiczne B-rolle i idealnie synchronizować uderzenia napisów z plikiem dźwiękowym z ElevenLabs (tzw. word-level timestamps).

Koszt utrzymania takiego kanału (produkującego 1 wideo dziennie = 30 w miesiącu) zamknie się w kwocie ok. 30-50 USD / miesiąc (koszty ElevenLabs + Make.com + render API). Jeden "Viral", który przekonwertuje na 10 założeń konta z linku z Bio, zwróci ten koszt z nawiązką na kilka miesięcy do przodu. To projekt o ekstremalnym ROI.
