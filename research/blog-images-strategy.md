# Strategia Grafik Blogowych dla CebulaZysku.pl
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17

Aby wzmocnić pozycjonowanie (EEAT) i CTR (Click-Through Rate) naszych artykułów blogowych, nie możemy polegać na darmowych, generycznych zdjęciach ze stocków (np. Unsplash, Pexels). Musimy stworzyć spójny język wizualny, który będzie kojarzony wyłącznie z naszą marką (CebulaZysku). 

Ponieważ jesteśmy w niszy finansowej, nasze grafiki muszą budzić **zaufanie, profesjonalizm**, ale jednocześnie zachowywać nasz "cebulowy", **humorystyczny sznyt**.

## 1. Narzędzie do Generowania (Rekomendacja)
Obecnie najlepszym narzędziem do generowania wysokiej jakości okładek (Cover Images) pod artykuły blogowe jest **Midjourney v6**. Oferuje on najbardziej artystyczne i spójne "czucie" tekstur, co pozwala nam narzucić konkretną paletę kolorystyczną.

*Alternatywa:* DALL-E 3 (jeśli zależy nam na wektorowych, prostych ilustracjach) lub Ideogram (jeśli potrzebujemy koniecznie napisów na obrazku).

## 2. Spójność Wizualna (Brand Identity)
Każda grafika powinna mieć dwa punkty styczne:
1.  **Kolorystyka:** Dominujące odcienie **szmaragdu (Emerald)**, głębokiej zieleni oraz akcenty złota/żółci (symbolizujące pieniądze/monety).
2.  **Motyw Przewodni:** Subtelne przemycenie elementu nawiązującego do cebuli lub warstw, banknotów, cyfrowych interfejsów bankowych. Styl "3D Isometric" lub "Modern Corporate Illustration".

## 3. Parametry Techniczne
*   **Proporcje (Aspect Ratio):** 16:9 (`--ar 16:9` w Midjourney). Jest to optymalny format dla okładek na stronach, miniaturytek w listach artykułów oraz jako fallback dla Open Graph.
*   **Format pliku:** Ostatecznie kompresowane do formatu `.webp` (np. przez squoosh.app) przed uploadem do Supabase, w celu optymalizacji Lighthouse. Zalecany rozmiar to max 100-150 KB.

## 4. Szablony Promptów (Dla Midjourney v6)

Poniżej przygotowane formuły promptów, które Jarek lub Claude mogą kopiować i wklejać do Discorda, podmieniając jedynie słowo kluczowe pod dany artykuł.

### Styl A: "Premium 3D Isometric" (Rekomendowany dla poradników i analiz)
Ten styl to piękne, trójwymiarowe, "czyste" kompozycje na gładkim tle, nawiązujące do aplikacji bankowych i nowoczesnych technologii.

**Baza Promptu:**
> `3d isometric illustration of [TEMAT ARTYKUŁU], emerald green and gold color palette, soft clean lighting, soft shadows, modern UI/UX corporate style, high quality, 8k, simple emerald background, clay render style --ar 16:9 --v 6.0`

**Przykłady:**
*   *Dla artykułu o BLIK:* "3d isometric illustration of a smartphone screen showing a 6-digit payment code with flying gold coins around it, emerald green and gold color palette..."
*   *Dla artykułu o karencji:* "3d isometric illustration of a floating glowing calendar with a clock and gold coins, emerald green and gold color palette..."

### Styl B: "Minimalistyczne Fotorealistyczne" (Dla trudniejszych tematów prawnych / podatkowych)
Ten styl imituje wysokiej klasy fotografię produktową, budującą zaufanie (EEAT).

**Baza Promptu:**
> `close up macro photography of [TEMAT ARTYKUŁU], dark emerald green background with soft cinematic studio lighting, shallow depth of field, sharp focus, high end commercial photography, 8k --ar 16:9 --v 6.0`

**Przykłady:**
*   *Dla artykułu o podatkach:* "close up macro photography of a gold coin resting on top of a tax document, dark emerald green background with soft cinematic studio lighting..."
*   *Dla artykułu o kartach:* "close up macro photography of two sleek bank cards floating elegantly, dark emerald green background with soft cinematic studio lighting..."

## 5. Proces (Workflow)
1. Napisanie artykułu.
2. Wybór stylu (A lub B).
3. Wygenerowanie 4 propozycji w Midjourney.
4. Upscale wybranej grafiki (U1-U4).
5. (Opcjonalnie) Nałożenie naszego logo "CebulaZysku" w rogu w programie Figma/Canva.
6. Kompresja do WEBP.
7. Dodanie grafiki do artykułu z atrybutem `alt` zawierającym słowa kluczowe (np. "Karta kredytowa a debetowa w promocji - grafika 3d").
