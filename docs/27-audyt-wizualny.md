# 27. Audyt wizualny — favicon, logo, OG image, cleanup

[← Powrót do spisu treści](./README.md)

---

## Data realizacji

10 marca 2026 r. (Faza 0o)

## Problemy wykryte

### 🔴 1. Favicon czarno-biały (1bpp)

**Problem:** Plik `src/app/favicon.ico` zawierał ikony ICO w 1 bit per pixel (czarno-biały). Cebula przy 16x16 i 32x32 była nieczytelna — wyglądała jak domyślna ikona.

**Rozwiązanie:** Wygenerowano nowy favicon.ico z `public/logo-icon.png` (2000x2000 źródło) za pomocą Pillow (Python). Nowy plik zawiera kolorowe ikony 16x16, 32x32 i 48x48 w 32bpp (pełna paleta kolorów).

### 🟡 2. Logo w Navbar i Footer za małe

**Problem:**
- Navbar: logo 36x36px — na retina (2x) to efektywnie 18x18 logicznych pikseli
- Footer: logo 28x28px — jeszcze mniejsze

**Rozwiązanie:**
- Navbar: 36→44px
- Footer: 28→36px

**Zmienione pliki:**
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`

### 🔴 3. Śmieciowe pliki z create-next-app

**Problem:** W `public/` znajdowały się nieużywane pliki domyślne z `create-next-app`:
- `vercel.svg` — logo Vercel (mogło być mylone z favicon)
- `next.svg` — logo Next.js
- `file.svg`, `globe.svg`, `window.svg` — ikony z boilerplate

Żaden z tych plików nie był importowany w kodzie.

**Rozwiązanie:** Usunięto 5 plików.

### 🟡 4. Brak apple-touch-icon w poprawnym rozmiarze

**Problem:** Link `<link rel="apple-touch-icon" href="/icon-192x192.png">` wskazywał na ikonę 192x192, podczas gdy Apple wymaga 180x180.

**Rozwiązanie:**
- Wygenerowano `public/apple-touch-icon.png` (180x180)
- Wygenerowano `public/favicon-32x32.png` (32x32)
- Zaktualizowano `src/app/layout.tsx` z poprawnymi link tagami

### 🟡 5. Brak OG image

**Problem:** Brak `openGraph.images` w metadata — udostępnione linki na Facebooku/LinkedIn/Twitter nie pokazywały żadnego obrazka.

**Rozwiązanie:**
- Wygenerowano `public/og-image.png` (1200x630) — emeraldowe tło, logo cebuli, tytuł, podtytuły
- Dodano do metadata w `src/app/layout.tsx`

### 🟡 6. Brakująca strona /ranking w sitemap

**Problem:** Strona `/ranking` istniała w Navbar, ale brakowało jej w `sitemap.xml`.

**Rozwiązanie:** Dodano `/ranking` do `src/app/sitemap.ts`.

## Weryfikacja produkcyjna

Sprawdzono 14 stron + 5 ofert na produkcji — wszystkie zwracają HTTP 200:

```
200 /
200 /jak-to-dziala
200 /ranking
200 /blog
200 /dashboard
200 /logowanie
200 /rejestracja
200 /o-nas
200 /kontakt
200 /polityka-prywatnosci
200 /regulamin
200 /sitemap.xml
200 /robots.txt
200 /manifest.json
200 /oferta/santander-konto-2
200 /oferta/pekao-konto-1
200 /oferta/mbank-konto-5
200 /oferta/alior-konto-1
200 /oferta/pkobp-konto-1
```

Admin API potwierdza zabezpieczenie: `/api/admin/stats` → HTTP 401 bez credentials.

## Zmienione pliki

| Plik | Zmiana |
|------|--------|
| `src/app/favicon.ico` | Nowy kolorowy ICO (32bpp) |
| `src/components/Navbar.tsx` | Logo 36→44px |
| `src/components/Footer.tsx` | Logo 28→36px |
| `src/app/layout.tsx` | apple-touch-icon, favicon-32x32, OG image |
| `src/app/sitemap.ts` | Dodano /ranking |
| `public/apple-touch-icon.png` | Nowy (180x180) |
| `public/favicon-32x32.png` | Nowy (32x32) |
| `public/og-image.png` | Nowy (1200x630) |
| `public/vercel.svg` | **Usunięty** |
| `public/next.svg` | **Usunięty** |
| `public/file.svg` | **Usunięty** |
| `public/globe.svg` | **Usunięty** |
| `public/window.svg` | **Usunięty** |

## Co jeszcze wymaga uwagi (następna sesja)

- **Treść ofert** — większość ofert ma puste `shortDescription`, `conditions`, `pros`, `cons`, `faq`
- **Blog** — tylko 1 opublikowany post, potrzeba min. 10-15 dla SEO
- **Analytics** — brak GA4 + Google Search Console (env vars prawdopodobnie puste)
- **Event tracking** — brak śledzenia kliknięć w linki afiliacyjne
- **Apka mobilna Android** — planowana jako warunek do wpuszczenia userów
