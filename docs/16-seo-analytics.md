# 16. SEO & Analytics

[← Powrót do spisu treści](./README.md)

> **UWAGA:** Ta dokumentacja dotyczy pierwszej, bazowej iteracji SEO i analityki. System śledzenia został zaktualizowany na oparty w 100% o GTM z Consent Mode v2. 
> 👉 Zobacz aktualną dokumentację: [40. Analityka GTM, DataLayer i Consent](./40-analytics-gtm.md)

---

## 1. Wprowadzenie

### Problem
Strona nie miała podpiętego Google Analytics ani Google Search Console. Bez tych narzędzi nie da się mierzyć ruchu, śledzić indeksacji ani optymalizować pozycjonowania.

### Cel
Przygotować infrastrukturę do podpięcia GA4, Google Search Console i Meta Pixel — aktywowaną przez env vars (bez hardkodowania ID).

---

## 2. Co już było zrobione (przed tą fazą)

Strona miała już solidne SEO techniczne:

| Element | Status | Plik |
|---------|--------|------|
| `robots.txt` | ✅ Allow all, disallow /dashboard | `src/app/robots.ts` |
| `sitemap.xml` | ✅ Dynamiczny z ofert i bloga | `src/app/sitemap.ts` |
| Meta tags | ✅ `generateMetadata` na każdej stronie | Każdy `page.tsx` |
| JSON-LD | ✅ WebSite, FAQPage, Article, BreadcrumbList | Komponenty `JsonLd` |
| Open Graph | ✅ Tytuł, opis, typ, locale | `layout.tsx` |
| Canonical URLs | ✅ via `metadataBase` | `layout.tsx` |

---

## 3. Co zostało zrobione w tej fazie

### `src/components/TrackingPixels.tsx`

Zamieniono zakomentowany placeholder na działający komponent sterowany env vars:

| Funkcja | Env var | Opis |
|---------|---------|------|
| **Google Analytics 4** | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ID pomiaru GA4 (np. `G-XXXXXXXXXX`) |
| **Google Search Console** | `NEXT_PUBLIC_GSC_VERIFICATION` | Meta tag weryfikacyjny (hash) |
| **Meta Pixel** | `NEXT_PUBLIC_META_PIXEL_ID` | ID piksela Meta Ads |

Komponent renderuje `<script>` i `<meta>` tagi tylko gdy odpowiedni env var jest ustawiony. Bez env vars — nic nie jest wstrzykiwane.

---

## 4. Jak aktywować

### Google Analytics 4

1. Przejdź do [analytics.google.com](https://analytics.google.com)
2. Utwórz nową usługę (property) dla `cebulazysku.pl`
3. Skopiuj Measurement ID (np. `G-ABC123XYZ`)
4. W Vercel Dashboard → Settings → Environment Variables dodaj:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID = G-ABC123XYZ
   ```
5. Redeploy

### Google Search Console

1. Przejdź do [search.google.com/search-console](https://search.google.com/search-console)
2. Dodaj usługę (property) dla `cebulazysku.pl`
3. Wybierz weryfikację przez meta tag HTML
4. Skopiuj wartość `content` z tagu (np. `abc123def456`)
5. W Vercel Dashboard → Settings → Environment Variables dodaj:
   ```
   NEXT_PUBLIC_GSC_VERIFICATION = abc123def456
   ```
6. Redeploy
7. Wróć do Search Console i kliknij "Weryfikuj"
8. Po weryfikacji wyślij sitemap: `https://cebulazysku.pl/sitemap.xml`

### Meta Pixel (opcjonalnie)

1. Przejdź do [business.facebook.com](https://business.facebook.com) → Events Manager
2. Utwórz nowy Pixel
3. Skopiuj Pixel ID
4. W Vercel Dashboard → Settings → Environment Variables dodaj:
   ```
   NEXT_PUBLIC_META_PIXEL_ID = 123456789
   ```
5. Redeploy

---

## 5. Decyzje techniczne

| Decyzja | Uzasadnienie |
|---------|-------------|
| Env vars zamiast hardkodowanych ID | Bezpieczne, łatwe do zmiany, zero kodu do commitowania |
| `NEXT_PUBLIC_` prefix | Potrzebny żeby wartości trafiły do bundla klienta (skrypty GA/Meta działają w przeglądarce) |
| Warunkowe renderowanie | Brak env var = brak `<script>` = zero overhead |
| Komponent w `<head>` via `layout.tsx` | GA i Meta Pixel muszą być w `<head>` żeby działały na wszystkich stronach |

---

## 6. Pliki źródłowe

| Plik | Opis |
|------|------|
| `src/components/TrackingPixels.tsx` | GA4 + GSC verification + Meta Pixel |
| `src/app/layout.tsx` | Renderuje `<TrackingPixels />` w `<head>` |
| `src/app/robots.ts` | robots.txt z sitemap URL |
| `src/app/sitemap.ts` | Dynamiczny sitemap z ofertami i blogiem |

---

## 7. Troubleshooting

Brak problemów w trakcie realizacji. Komponent był prosty — zamiana komentarzy na warunkowe renderowanie z env vars.

---

## 8. Status

✅ **Ukończone** — 7 marca 2026

> **UWAGA:** Ta dokumentacja opisuje fazę 1 (infrastruktura). Pełna implementacja GTM, DataLayer, Consent Mode v2 i konwersji została opisana w [docs/40-analytics-gtm.md](./40-analytics-gtm.md).

- Infrastruktura GA4, GSC, Meta Pixel gotowa
- Aktywacja przez env vars w Vercel Dashboard
- Build przechodzi bez błędów
- **Akcja wymagana od usera**: dodać env vars w Vercel i utworzyć konta GA4/GSC
