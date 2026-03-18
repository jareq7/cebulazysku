# Rozszerzony Research: Canva Connect API — Pełna Automatyzacja Grafik
// @author Claude Code (claude-opus-4-6) | 2026-03-18 — wstępny zarys
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-18 — rozszerzenie o detale techniczne, limity i krytyczne wymagania Enterprise

Niniejszy dokument rozszerza wstępne badanie przeprowadzone przez Claude Code. Skupia się na praktycznych aspektach implementacji, ograniczeniach licencyjnych oraz architekturze "Self-Service" dla generowania assetów marketingowych CebulaZysku.pl.

---

## 1. Krytyczne Ograniczenie: Canva Pro vs Enterprise

Podczas głębokiej analizy dokumentacji technicznej (`canva.dev`) wykryto krytyczny szczegół dotyczący dostępności API:

*   **Autofill API oraz Brand Templates API** są dostępne **wyłącznie dla subskrypcji Canva Enterprise**.
*   Subskrypcja **Canva Pro** (którą obecnie posiada Jarek) pozwala na korzystanie z edytora, ale **blokuje programistyczny dostęp** do funkcji automatycznego wypełniania szablonów danymi przez API w celach produkcyjnych.
*   **Wyjątek Deweloperski:** Można ubiegać się o dostęp do "Sandboxa" w portalu deweloperskim Canvy, opisując konkretny przypadek użycia (case study), ale jest on ograniczony czasowo i służy wyłącznie do testów.

**Rekomendacja Biznesowa:** Jeśli nie planujemy przejścia na plan Enterprise, musimy rozważyć alternatywne podejście "Hybrid" (projektowanie w Canvie → eksport ręczny) lub użycie narzędzi typu **BannerBear** / **Cloudinary**, które oferują podobne API bez wymogu planów korporacyjnych.

---

## 2. Detale techniczne Autofill (Gdybyśmy mieli Enterprise)

### 2.1 Mapowanie pól w edytorze
Aby API wiedziało, gdzie wstawić kwotę premii (`reward`), a gdzie nazwę banku, należy w edytorze Canva:
1.  Otworzyć aplikację **Data Autofill** (w panelu Apps).
2.  Zaznaczyć element (tekst/obrazek) i przypisać mu **Data Field Name** (np. `BANK_NAME`).
3.  **Kluczowy krok:** Design musi zostać opublikowany jako **Brand Template**. Dopiero wtedy otrzyma `brand_template_id` widoczny dla API.

### 2.2 Struktura Payloadu
```json
{
  "brand_template_id": "DAGxxx",
  "data": {
    "REWARD": { "type": "text", "text": "500 zł" },
    "BANK_LOGO": { "type": "image", "asset_id": "Mxxx" }
  }
}
```

---

## 3. Zarządzanie Assetami (Bank Logos)

Przed użyciem logotypu w Autofill, obrazek musi znaleźć się w bibliotece Canvy.

*   **Endpoint:** `POST /v1/asset-uploads`
*   **Limity plików:**
    *   Obrazy: do **50 MB** (JPEG, PNG, HEIC, SVG).
    *   Wideo: do **500 MB** (MP4, MOV).
*   **Wymóg techniczny:** Wymagany header `Asset-Upload-Metadata` (Base64 JSON z nazwą pliku) oraz body w formacie `application/octet-stream`.
*   **Przechowywanie:** Assety mają unikalne `asset_id`, które powinniśmy mapować w naszej bazie `banks.id` -> `canva_asset_id`.

---

## 4. Workflow Exportu i Publikacji

Canva Connect API nie posiada przycisku "Opublikuj na TikTok". Workflow musi być orkiestrowany przez nasz system:

1.  **Trigger:** Nowa oferta w bazy danych.
2.  **Autofill (Async):** Wysyłamy dane → otrzymujemy `job_id`.
3.  **Polling Job:** Sprawdzamy `GET /v1/autofills/{jobId}` co 2 sekundy. Wynikiem jest `design_id`.
4.  **Export (Async):** Wysyłamy `POST /v1/exports` dla nowo stworzonego `design_id`.
5.  **Polling Export:** Sprawdzamy `GET /v1/exports/{exportId}`. Wynikiem jest **Download URL**.
6.  **Persistence:** Nasz serwer pobiera plik (URL wygasa po 24h!) i zapisuje go w **Supabase Storage**.
7.  **Publishing:** Używamy API platformy docelowej (np. Meta Graph API dla Instagrama) wysyłając plik z Supabase.

---

## 5. Porównanie z alternatywami (Dla planu Pro)

Jeśli Canva Enterprise jest zbyt droga (koszt to zazwyczaj min. $30/użytkownika/miesiąc przy min. 3 użytkownikach), oto "cebulowe" alternatywy:

| Narzędzie | Model | Zalety | Wady |
| :--- | :--- | :--- | :--- |
| **BannerBear** | SaaS API | Stworzone do autofilla, brak planów Enterprise. | Dodatkowy koszt miesięczny. |
| **Cloudinary** | Image API | Dynamiczne nakładanie tekstu na obrazek przez URL. | Trudniejsze projektowanie szablonu. |
| **Satori / @vercel/og** | Code-based | Całkowicie darmowe, brak limitów. | Ograniczone możliwości designu (tylko to co w CSS). |
| **Manual Canva** | Manual | Pełna kontrola, brak kosztów API. | Brak skalowalności (Jarek musi klikać). |

---

## 6. Rozszerzony Plan Wdrożenia

### Faza 1: Weryfikacja i Sandbox (1-2 dni)
- Jarek sprawdza w panelu Canvy, czy jako user "Pro" może utworzyć integrację typu "Private" i czy widzi Scopes związane z `brandtemplate`.
- Jeśli nie — składamy wniosek o dostęp deweloperski (Sandbox).

### Faza 2: Integracja Assetów (2 dni)
- Skrypt w `scripts/upload-logos-to-canva.ts`.
- Przejście przez wszystkie rekordy w tabeli `banks` i upload ich logotypów do Canvy.
- Zapisanie `canva_asset_id` w tabeli `banks` (wymaga nowej kolumny w Supabase).

### Faza 3: Implementacja Polling Engine (3 dni)
- Budowa solidnej klasy `CanvaClient` w `src/lib/canva.ts` z obsługą:
    - Automatycznego odświeżania tokenów OAuth2.
    - Generycznego mechanizmu `waitForJob<T>(jobId)` z wykładniczym backoffem.
    - Obsługi błędów (np. przekroczenie limitów eksportu 20/min).

### Faza 4: Generator Okładek Bloga (2 dni)
- Stworzenie w edytorze Canva szablonu "Blog Cover v1".
- Dodanie w panelu Admina sekcji "Social Media Hub" dla każdego artykułu.

---

## 7. Podsumowanie dla CEO

Integracja z Canva API to **game-changer wizerunkowy**, który pozwoli nam produkować treści o jakości "topowych portali finansowych" przy zerowym nakładzie pracy ludzkiej po stronie produkcji graficznej. Jednak **wymóg subskrypcji Enterprise** jest istotną barierą wejścia. 

**Kolejny krok:** Jarek, zaloguj się na `canva.com/developers` i spróbuj stworzyć nową aplikację. Jeśli system pozwoli Ci wybrać scope `brandtemplate:content:read`, oznacza to, że mamy zielone światło na Pro. Jeśli nie — musimy zdecydować: upgrade czy BannerBear?
