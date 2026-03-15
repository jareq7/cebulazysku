<!-- @cebulazysku.pl/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_15817684.js.map Gemini CLI (gemini-3-pro-preview) | 2026-03-14 — Research: Server-side Remotion Rendering -->

# Research: Server-side Remotion Rendering

**Kontekst:** Projekt wykorzystuje bibliotekę **Remotion** do tworzenia programatycznych reklam wideo (`src/remotion/OfferVideo.tsx`). Kod wideo jest gotowy i wysokiej jakości.
**Cel:** Znalezienie optymalnego sposobu na **renderowanie** tego kodu do plików `.mp4` w środowisku produkcyjnym, biorąc pod uwagę limity Vercel i budżet MVP.

## Wymagania
- Renderowanie plików MP4 z istniejącego komponentu `OfferVideo.tsx`.
- Automatyzacja procesu (bez konieczności odpalania renderowania lokalnie przez dewelopera).
- Minimalizacja kosztów.

## Analiza Opcji Renderowania

### 1. Remotion Lambda (AWS) - Złoty Standard
Oficjalne rozwiązanie chmurowe od twórców Remotion.
*   **Jak działa:** Rozbija wideo na kawałki i renderuje równolegle na wielu funkcjach AWS Lambda.
*   **Zalety:** Ekstremalnie szybkie, skalowalne, pełna zgodność z biblioteką.
*   **Wady:** Wymaga konfiguracji konta AWS (IAM, S3, Lambda). Generuje koszty (choć małe przy tej skali).
*   **Ocena:** Najlepsze rozwiązanie docelowe, ale może być nadmiarowe na start.

### 2. GitHub Actions (Renderowanie "w tle") - Opcja Budżetowa
Użycie darmowych runnerów CI/CD do wygenerowania wideo.
*   **Jak działa:** Trigger (np. po dodaniu oferty) uruchamia workflow, który stawia środowisko Node+FFmpeg, renderuje wideo i wysyła je na storage (np. R2, S3, Google Drive).
*   **Zalety:** **Darmowe** (w ramach 2000 min/miesiąc na GitHub). Prosta integracja.
*   **Wady:** Wolniejsze niż Lambda (renderowanie na jednym rdzeniu). Asynchroniczne (trzeba czekać na wynik).
*   **Ocena:** **Rekomendowane dla MVP.** Pozwala na automatyzację bez kosztów chmurowych.

### 3. Vercel Serverless Functions - Odradzane
Próba renderowania bezpośrednio w API Next.js.
*   **Problem:** Limity czasu (Hobby: 10s, Pro: 60s). Renderowanie wideo 60s/30fps zajmie znacznie więcej niż 10-60 sekund. Ryzyko timeoutów i błędów pamięci.
*   **Ocena:** Niezalecane.

### 4. Self-hosted Render Server
Dedykowany VPS (np. Hetzner, DigitalOcean) z Node.js i FFmpeg.
*   **Zalety:** Pełna kontrola, stały koszt.
*   **Wady:** Trzeba zarządzać serwerem (aktualizacje, security).
*   **Ocena:** Dobra alternatywa, jeśli mamy już VPS-a, ale przy serverless (Vercel/Supabase) to dodatkowy klamot do utrzymania.

---

## Rekomendacja: GitHub Actions

Dla etapu MVP i stacku opartego o Vercel, **GitHub Actions** jest najrozsądniejszym wyborem.

**Proponowany workflow:**
1.  **Trigger:** Webhook z panelu admina (gdy oferta jest gotowa) lub ręczny `workflow_dispatch`.
2.  **Akcja:**
    *   Checkout kodu.
    *   `npm install`.
    *   Pobranie danych oferty (tytuł, kwota, logo) z argumentów wejściowych.
    *   `npx remotion render src/remotion/index.ts ...`
    *   Upload pliku MP4 na zewnętrzny hosting (np. Cloudflare R2 - darmowy tier).
3.  **Wynik:** Link do wideo wraca do admina lub jest zapisywany w Supabase.

To rozwiązanie nie generuje dodatkowych kosztów i nie obciąża aplikacji webowej.
