# Propozycje ulepszeń UX/UI za pomocą generatywnego AI (Delighters)
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17

Dokument zawiera zbiór luźnych pomysłów na podniesienie jakości wizualnej (tzw. "delighters") serwisu CebulaZysku.pl. Pomysły opierają się na wykorzystaniu nowoczesnych modeli AI do generowania grafik, wideo i animacji.

**Status:** Do weryfikacji i akceptacji przez Claude Code (Lead Dev) przed ewentualnym rozpisaniem na taski.

---

## 1. Izometryczne Odznaki 3D (Gamifikacja)
- **Problem:** Obecnie system odznak i gamifikacji opiera się prawdopodobnie na płaskich, standardowych ikonach (np. Lucide), co nie daje satysfakcji ze "zbieractwa".
- **Rozwiązanie:** Wygenerowanie przez Midjourney v6 / DALL-E 3 spójnej serii izometrycznych odznak 3D z przezroczystym tłem (np. błyszcząca złota moneta z motywem cebuli, szmaragdowa tarcza, płonący kalendarz za streak).
- **Zysk UX:** Wyższa retencja w Trackerze. Użytkownicy uwielbiają zbierać dopracowane wizualnie, wirtualne przedmioty.

## 2. Maskotka "Pan Cebula" w Empty States (Puste stany)
- **Problem:** Strony typu 404, pusty dashboard ("Nie śledzisz jeszcze ofert") czy brak wyników wyszukiwania wydają się "suche" i techniczne.
- **Rozwiązanie:** Wygenerowanie spójnej maskotki serwisu w stylu Pixar/3D – np. eleganckiego, minimalistycznego "Pana Cebulę". Kilka wariantów postaci: z lupą (szukanie ofert), z rozłożonymi rękami (pusty dashboard), ze zdezorientowaną miną (404).
- **Zysk UX:** Nadanie aplikacji "duszy", zmniejszenie współczynnika odrzuceń (bounce rate) po trafieniu na pusty ekran.

## 3. Animacje Lottie (AI-to-Lottie)
- **Problem:** Brak mikrointerakcji przy ważnych akcjach użytkownika.
- **Rozwiązanie:** Użycie narzędzi typu Lottielab (wspieranych AI) do wygenerowania lekkich, wektorowych animacji SVG.
- **Przykłady:**
  - Wybuch zielonego "konfetti" i małych monetek, gdy użytkownik odhacza otrzymanie wypłaty w Trackerze.
  - Płynny, spersonalizowany loader podczas sprawdzania/synchronizacji ofert.
- **Zysk UX:** Natychmiastowa gratyfikacja za wykonanie zadania (dopamina), co buduje nawyk korzystania z aplikacji.

## 4. B-Rolle AI dla systemu Remotion (Video Ads)
- **Problem:** Aktualnie generowane filmy (`OfferVideo.tsx`) używają płaskich, CSS-owych teł.
- **Rozwiązanie:** Wygenerowanie w modelach wideo (Runway Gen-2 / Pika / Sora) 3-4 sekundowych, zapętlonych, kinowych "B-rolli". Np. powoli obracająca się moneta w jakości makro, abstrakcyjne szmaragdowe fale, uśmiechnięta osoba używająca telefonu.
- **Zysk UX:** Zautomatyzowane wideo reklamowe na TikTok/Reels będą wyglądać jak produkcje z wielkim budżetem, co drastycznie zwiększy ich klikalność (CTR) w kampaniach Ads.

## 5. Customowe tła pod Open Graph i Bloga
- **Problem:** Używanie wszędzie płaskich gradientów w obrazkach `og:image`.
- **Rozwiązanie:** Wygenerowanie fotorealistycznych lub eleganckich abstrakcyjnych teł (w naszych barwach brandowych `emerald/green`), na które dynamiczny skrypt `@vercel/og` będzie nakładał tekst. Dodatkowo – unikalne, generowane okładki (thumbnails) do każdego artykułu na blogu, zamiast generycznych zdjęć ze stocka.
- **Zysk UX:** Lepsza widoczność w social mediach, pozycjonowanie serwisu jako lidera rynku Premium w swojej niszy.

---
*Pomysły zachowane do dyskusji przy planowaniu Fazy 10 lub pobocznych usprawnień.*
