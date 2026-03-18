# PRD: Canva Connect API Integration — Blog Covers & Content Pipeline

## 1. Introduction / Overview

CebulaZysku.pl ma blog z 5 opublikowanymi artykułami, ale bez żadnych grafik — wyglądają "łyso". Jarek ma Canva Pro, która udostępnia Connect API z Autofill (programmatyczne tworzenie designów z szablonów) i Export (generowanie PNG/JPG).

Ten feature integruje Canva Connect API do automatycznego generowania blog cover images, z architekturą przygotowaną na social media posty i bannery reklamowe w kolejnych fazach.

## 2. Goals

1. Każdy artykuł blogowy ma profesjonalny cover image w spójnej estetyce CebulaZysku
2. Admin może wygenerować cover jednym kliknięciem (Autofill template + export PNG)
3. OAuth flow pozwala na bezpieczne połączenie z Canva bez hardkodowania tokenów
4. Architektura gotowa na rozszerzenie: social media posty, OG images, bannery

## 3. User Stories

- **US1:** Jako admin klikam "Generuj cover" przy artykule → system tworzy grafikę z szablonu Canva z tytułem artykułu → cover pojawia się na blogu
- **US2:** Jako admin widzę podgląd wygenerowanego covera przed publikacją
- **US3:** Jako admin mogę podłączyć/odłączyć Canva konto przez OAuth w ustawieniach
- **US4:** Jako użytkownik widzę cover image na liście blogów i w detalu artykułu
- **US5:** Jako admin mogę wybrać styl szablonu (A: 3D Isometric, B: Macro Photo) przy generowaniu

## 4. Functional Requirements

### Faza 1: OAuth & Canva Client

1. **FR1:** Nowy moduł `src/lib/canva.ts` — klient Canva Connect API:
   - `getAuthUrl()` — generuje URL do OAuth consent
   - `exchangeCode(code)` — wymienia authorization code na access+refresh token
   - `refreshToken()` — odświeża wygasły token
   - `autofill(templateId, data)` — tworzy design z szablonu
   - `pollAutofillJob(jobId)` — polluje status aż success/failed
   - `exportDesign(designId, format)` — eksportuje do PNG/JPG
   - `pollExportJob(jobId)` — polluje status eksportu
   - `listBrandTemplates()` — lista dostępnych szablonów
2. **FR2:** Nowy endpoint `/api/canva/callback` — OAuth redirect handler
3. **FR3:** Nowy endpoint `/api/canva/connect` — inicjuje OAuth flow (redirect do Canva)
4. **FR4:** Nowa tabela `canva_tokens` w Supabase:
   ```
   id, access_token, refresh_token, expires_at, scope, created_at, updated_at
   ```
   (Jeden wiersz — tylko Jarek się łączy)
5. **FR5:** Env vars: `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET` (już w .env.local)

### Faza 2: Blog Cover Generation

6. **FR6:** Dodać pole `cover_image_url` (text, nullable) do tabeli `blog_posts`
7. **FR7:** W admin panelu blog (`/admin/blog`) przy każdym artykule:
   - Przycisk "Generuj cover" (jeśli brak covera) lub "Regeneruj cover"
   - Dropdown wyboru stylu szablonu (A/B)
   - Po kliknięciu: loading spinner → podgląd covera → "Zapisz" / "Odrzuć"
8. **FR8:** Flow generowania:
   1. Pobierz brand template ID z konfiguracji (mapped do stylu A/B)
   2. `POST /v1/autofills` z danymi: `{ title: post.title, category: post.tags[0] }`
   3. Poll job aż success → otrzymaj design_id
   4. `POST /v1/exports` z design_id, format PNG
   5. Poll export aż success → pobierz URL
   6. Download PNG → upload do Supabase Storage bucket `blog-covers`
   7. Zapisz public URL w `blog_posts.cover_image_url`
9. **FR9:** Nowy endpoint `/api/admin/blog/generate-cover` — przyjmuje `{ postId, templateStyle }`, wykonuje FR8
10. **FR10:** Frontend blog lista (`/blog`) — wyświetlaj cover image nad tytułem
11. **FR11:** Frontend blog detail (`/blog/[slug]`) — hero image na górze artykułu
12. **FR12:** OG meta tag `og:image` na stronach blogowych wskazuje na cover_image_url

### Faza 3: Canva Admin Panel (przyszłość)

13. **FR13:** Strona `/admin/canva` z:
    - Status połączenia z Canva (connected/disconnected)
    - Przycisk Connect/Disconnect
    - Lista Brand Templates z podglądem
    - Historia wygenerowanych designów

## 5. Non-Goals (Out of Scope)

- Social media post generation (Faza 3 w przyszłości)
- Auto-publishing na social media
- Bannery reklamowe
- Generowanie OG images przez Canva (zostawiamy @vercel/og na razie)
- Tworzenie szablonów przez API (Jarek robi to ręcznie w Canva)

## 6. Design Considerations

- Cover images: 16:9 (1200x675), format WEBP/PNG, max 150KB
- Spójna paleta: szmaragd + złoto (zgodnie z blog-images-strategy.md)
- Na liście blogów: cover jako tło karty lub obrazek nad tytułem
- Na detalu: full-width hero image z overlay tytułu
- Loading state: skeleton placeholder podczas generowania (5-10s)

## 7. Technical Considerations

- **Canva OAuth:** Wymaga HTTPS redirect URL na produkcji. Dev: `http://localhost:3000/api/canva/callback`
- **Supabase Storage:** Bucket `blog-covers`, public access, max 5MB per file
- **Async jobs:** Autofill i Export to async — trzeba pollować co 1-2s (max 30s timeout)
- **Token refresh:** Access token wygasa (prawdopodobnie 1-4h). Auto-refresh przed każdym wywołaniem.
- **Brand Templates:** Wymagają Canva Pro (Jarek ma). Template musi mieć zdefiniowane pola "autofill" w edytorze Canvy.
- **Canva redirect URL:** Trzeba ustawić w Canva Developer Portal: produkcja `https://cebulazysku.pl/api/canva/callback`, dev `http://localhost:3000/api/canva/callback`

## 8. Success Metrics

1. Wszystkie 5 opublikowanych artykułów ma cover image w ciągu 1 dnia od wdrożenia
2. Generowanie covera zajmuje <15 sekund od kliknięcia
3. Zero broken images na produkcji
4. Blog CTR wzrasta (mierzalne w GA4 po 2 tygodniach)

## 9. Open Questions

1. Czy Jarek ma już szablony w Canvie z polami do autofill, czy trzeba je stworzyć?
2. Redirect URL na Canva Developer Portal — czy jest ustawiony?
3. Czy Canva Pro plan Jarka to indywidualny czy Teams? (wpływa na Brand Templates access)
