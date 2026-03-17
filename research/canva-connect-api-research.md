# Research: Canva Connect API — integracja z CebulaZysku.pl
// @author Claude Code (claude-opus-4-6) | 2026-03-18

## 1. Czym jest Canva Connect API?

Canva Connect API pozwala programmatycznie tworzyć designy z szablonów, eksportować je do PNG/JPG/PDF/MP4 i zarządzać assetami. Kluczowa funkcja dla nas: **Autofill API** — podajesz template + dane (teksty, obrazki) → Canva generuje gotowy design.

## 2. Kluczowe endpointy

### 2.1 Autofill — tworzenie designów z szablonów
```
POST https://api.canva.com/rest/v1/autofills
Authorization: Bearer {token}

{
  "brand_template_id": "DAGxxx...",
  "title": "Post - mBank 720 zł",
  "data": {
    "bank_name": { "type": "text", "text": "mBank" },
    "reward_amount": { "type": "text", "text": "720 zł" },
    "bank_logo": { "type": "image", "asset_id": "abc123" }
  }
}
```
- **Rate limit:** 60 req/min/user
- **Obsługuje:** text fields, image fields, chart fields
- **Wynik:** asynchroniczny job → poll `GET /v1/autofills/{jobId}` → design z edit_url, view_url, thumbnail

### 2.2 Export — generowanie plików
```
POST https://api.canva.com/rest/v1/exports
{
  "design_id": "DAGxxx...",
  "format": { "type": "png", "lossless": true }
}
```
- **Formaty:** PNG, JPG (quality 1-100), PDF, GIF, MP4, PPTX
- **Rate limit:** 20 req/min/user, 750/5min/integration, 5000/24h
- **Custom dimensions:** do 25 000 px
- **Wynik:** asynchroniczny → URL do pobrania (ważny 24h)

### 2.3 Brand Templates — lista szablonów
```
GET https://api.canva.com/rest/v1/brand-templates
  ?dataset=non_empty    // tylko szablony z polami do autofill
  &limit=100
```
- Zwraca: id, title, thumbnail, create_url, view_url
- Filtr `dataset=non_empty` → szablony kompatybilne z Autofill

### 2.4 Assets — upload obrazków (np. loga banków)
```
POST https://api.canva.com/rest/v1/assets/upload
```
- Upload logotypów banków jako assety → potem użycie w Autofill jako `asset_id`

## 3. Autentykacja

**OAuth 2.0** — wymaga interakcji użytkownika (Jarek musi raz zalogować się przez Canva):

1. Utworzyć integrację w Canva Developer Portal (https://www.canva.com/developers/)
2. Otrzymać `CANVA_CLIENT_ID` + wygenerować `CANVA_CLIENT_SECRET`
3. Ustawić redirect URL (np. `https://cebulazysku.pl/api/canva/callback`)
4. User (Jarek) klika "Connect to Canva" → OAuth popup → token
5. Token refreshowalny — przechowywany w DB

**Wymagane scopes:**
- `design:content:write` — tworzenie designów (autofill)
- `design:content:read` — eksport designów
- `design:meta:read` — odczyt metadanych
- `asset:read`, `asset:write` — zarządzanie assetami (loga)
- `brandtemplate:meta:read` — listowanie szablonów
- `brandtemplate:content:read` — odczyt zawartości szablonów

**UWAGA:** Canva wymaga Canva Pro/Teams/Enterprise dla Brand Templates (Autofill). Jarek ma Canva Pro — powinno wystarczyć.

## 4. Zastosowania dla CebulaZysku

### 4.1 Blog Cover Images (priorytet 🔴)
**Flow:** Nowy artykuł → API pobiera szablon "Blog Cover" → Autofill: tytuł, kategoria, motyw kolorystyczny → Export PNG → Upload do Supabase → wyświetlenie na blogu

**Szablon Canva:** Jarek tworzy raz template w Canvie (16:9, szmaragdowa paleta, logo CebulaZysku). Pola do podmianki:
- `{{title}}` — tytuł artykułu
- `{{category}}` — kategoria (poradnik, słowniczek, etc.)

### 4.2 Social Media Posts per Oferta (priorytet 🟡)
**Flow:** Nowa/zaktualizowana oferta → API generuje post na IG/FB/TikTok → Export PNG → opcjonalnie auto-publish

**Szablony (3 warianty):**
- Post kwadratowy (1080x1080) — "mBank — do 720 zł premii!"
- Story (1080x1920) — pion z CTA "Link w bio"
- Karuzela (1080x1350) — slajdy z warunkami

**Pola:** `{{bank_name}}`, `{{reward}}`, `{{deadline}}`, `{{bank_logo}}`

### 4.3 OG Images (priorytet 🟡)
Zamiast @vercel/og (edge, ograniczone style) — Canva templates z pełną kontrolą wizualną:
- Template "OG Oferta" — logo banku + kwota
- Template "OG Blog" — tytuł + kategoria
- Template "OG Default" — logo CebulaZysku

### 4.4 TikTok Thumbnails/Covers (priorytet 🟢)
Cover frame do filmików generowanych przez Remotion — spójna estetyka z resztą brandu.

### 4.5 Bannery reklamowe (priorytet 🟢)
Auto-generowane bannery do Google Ads / Meta Ads z aktualną najlepszą ofertą.

## 5. Porównanie z alternatywami

| Feature | Canva Connect API | @vercel/og (Satori) | Midjourney |
|---------|------------------|---------------------|------------|
| **Szablony z brandingiem** | ✅ Pełne (Canva editor) | ❌ Ręczny JSX | ❌ Prompt-based |
| **Podmiana tekstu/logo** | ✅ Autofill API | ✅ Props w JSX | ❌ Nie programmatycznie |
| **Export PNG/JPG** | ✅ Wysokiej jakości | ✅ Edge rendering | ✅ Ale manual |
| **Social media formaty** | ✅ Gotowe templates | ❌ Trzeba kodować | ❌ Tylko obrazy |
| **Koszt** | Canva Pro (darmowe API) | Darmowe | $10/mies. |
| **Automatyzacja** | ✅ Pełna (API) | ✅ Pełna (edge) | ❌ Discord manual |
| **Jakość wizualna** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ (ograniczone) | ⭐⭐⭐⭐⭐ |
| **Szybkość** | ~5-10s (async) | ~50ms (edge) | ~60s |
| **Rate limit** | 60/min autofill, 20/min export | Brak (edge) | N/A |

**Rekomendacja:** Canva do blog covers, social media, bannerów (wysoka jakość, brandowany). @vercel/og do OG images (ultra szybkie, edge). Midjourney odpada (brak automatyzacji).

## 6. Architektura integracji

```
┌─────────────────────────────────────────────────────┐
│                   CebulaZysku                        │
│                                                      │
│  Cron / Admin trigger                                │
│         │                                            │
│         ▼                                            │
│  src/lib/canva.ts ──────► Canva Connect API          │
│    │  autofill(template, data)    POST /v1/autofills  │
│    │  export(designId, format)    POST /v1/exports    │
│    │  listTemplates()             GET /v1/brand-templates │
│    │                                                 │
│    ▼                                                 │
│  Supabase (blog_posts.cover_image_url)               │
│  Public CDN (OG images, social media posts)           │
└─────────────────────────────────────────────────────┘
```

**Nowy moduł:** `src/lib/canva.ts`
**Nowe env vars:** `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`, `CANVA_REFRESH_TOKEN`
**Nowy endpoint:** `/api/canva/callback` (OAuth redirect)
**DB:** pole `cover_image_url` w `blog_posts`, nowa tabela `canva_tokens` (OAuth tokens)

## 7. Ograniczenia i ryzyka

1. **Brand Templates wymagają Canva Pro/Teams** — Jarek ma Pro, OK
2. **OAuth wymaga jednorazowej interakcji usera** — Jarek musi raz kliknąć "Connect"
3. **Rate limits:** 60 autofill/min, 20 export/min — wystarczające dla naszego użycia (kilka designów dziennie)
4. **Async workflow:** Autofill i export to joby asynchroniczne — trzeba pollować status (2-10 sekund)
5. **Template maintenance:** Szablony trzeba tworzyć ręcznie w edytorze Canva — ale raz stworzone, mogą być używane nieskończenie
6. **Export URLs wygasają po 24h** — trzeba pobierać i hostować na własnym CDN/Supabase Storage

## 8. Plan wdrożenia (fazy)

### Faza 1: Setup (1 dzień)
- Utworzyć integrację w Canva Developer Portal
- Zaimplementować OAuth flow (`/api/canva/callback`)
- `src/lib/canva.ts` — klient API (autofill, export, templates)

### Faza 2: Blog Covers (2 dni)
- Jarek tworzy 2 szablony w Canvie (Styl A: 3D Isometric, Styl B: Macro)
- Dodać pole `cover_image_url` do `blog_posts`
- Admin panel: przycisk "Generuj cover" przy artykule → Canva autofill → export PNG → upload Supabase
- Frontend: wyświetlanie cover na liście blogów i detalu

### Faza 3: Social Media Posts (3 dni)
- Jarek tworzy szablony: post IG, story, karuzela
- Cron: nowa/zaktualizowana oferta → generuj warianty → zapisz do Supabase Storage
- Admin panel: podgląd wygenerowanych grafik, przycisk "Pobierz" / "Opublikuj"

### Faza 4: Auto-publishing (przyszłość)
- Integracja z Ayrshare/Metricool do auto-publikacji na social media
- Pętla: oferta → Canva → PNG → Ayrshare → TikTok/IG/FB
