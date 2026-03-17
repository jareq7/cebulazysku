# Strategia Open Graph (OG) Images dla CebulaZysku.pl
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17

Obecnie serwis korzysta z jednego generycznego obrazka `/og-image.png`. Choć to dobry początek, w przypadku agregatora ofert i contentu edukacyjnego w social mediach (Facebook, X, LinkedIn, wykop.pl), click-through rate (CTR) zależy w 90% od miniatury. Użytkownik widzi najpierw grafikę, potem nagłówek.

Aby zmaksymalizować CTR i ułatwić udostępnianie (viralowość i link building), proponuję wdrożyć dynamiczne generowanie obrazków Open Graph za pomocą `@vercel/og` (oparte na Satori).

## 1. Problemy obecnego podejścia
- Generyczne logo i ten sam obrazek dla każdej podstrony. Kiedy user udostępnia ofertę na Facebooku "Zgarnij 500 zł w banku X", w linku widnieje tylko standardowe, ogólne logo CebulaZysku.
- Brak "social proof" i tzw. "hooka" wizualnego (np. brak twarzy eksperta, brak wizualizacji dużej kwoty do zarobienia).
- Blog współdzieli OG image z resztą witryny, przez co treści poradnikowe zlewają się z ofertami w oczach czytelników.

## 2. Rekomendowane wymiary
- Standard branżowy: **1200 x 630 px** (proporcja ~1.91:1)
- Bezpieczna strefa (safe zone): Tekst i logo powinny znajdować się w centralnym obszarze 1080 x 560 px (np. dla prawidłowego cięcia na LinkedIn czy w iMessage).

## 3. Strategia Dynamicznych OG Images (3 szablony)

Najlepsze wyniki przyniesie implementacja `src/app/api/og/route.tsx`, która wygeneruje w locie PNG na podstawie przekazanych parametrów (np. `?title=xxx&amount=500&bank=mbank`).

### Szablon A: Dla pojedynczej oferty (`/oferta/[slug]`)
- **Cel:** Maksymalizacja FOMO (Fear Of Missing Out) i prosta, szybka informacja o zysku.
- **Tło:** Nasz gradient `from-emerald-700 to-green-500` z ewentualnym, subtelnym patternem fal/cebuli (opacity 10%).
- **Elementy centralne:**
  - Ogromny, centralny napis z kwotą, np: **"Zgarnij 500 zł"**.
  - Poniżej/obok czytelne logo banku na białym, zaokrąglonym tle (żeby uwiarygodnić źródło pieniędzy).
  - Poniżej krótki podpis: "Sprawdź proste warunki promocji".
- **Elementy stałe:** W rogu małe logo CebulaZysku + badge np. "Gwarantowane!".

### Szablon B: Dla artykułu na blogu (`/blog/[slug]`)
- **Cel:** Budowanie autorytetu, "Newsowy" wygląd (EEAT).
- **Tło:** Ciemne, eleganckie (np. antracyt/slate-900).
- **Elementy centralne:**
  - Tytuł artykułu wypisany dużą, wyraźną czcionką (np. Font Geist Sans Bold), wyjustowany do lewej.
  - Mały Avatar/Zdjęcie "eksperta/cebularza" + data (np. "Jarek, 15 marca").
- **Stylistyka:** Zbliżona do miniatur YouTube'owych (tzw. "clickbait light", ale profesjonalny).

### Szablon C: Strona główna i Ranking (`/`, `/ranking`)
- **Cel:** Budowanie marki jako narzędzia nr 1 w Polsce.
- **Tło:** Czyste, brandowe, z wykorzystaniem barw szmaragdowych.
- **Elementy centralne:**
  - Logo CebulaZysku zajmujące dużą część ekranu.
  - Napis: "Ranking Promocji Bankowych".
  - Grafika sugerująca portfel/monety/wykresy.

## 4. Architektura techniczna (@vercel/og)
Vercel dostarcza potężne narzędzie Satori, które kompiluje kod HTML/CSS (React) bezpośrednio do obrazka PNG na Edge Network (bardzo tanie i szybkie).

**Zalety Vercel OG:**
- Nie musimy pisać zewnętrznych skryptów w Pythonie.
- Nie zużywamy storage'u (obrazki są generowane w locie i cachowane).
- Możemy wykorzystać nasze fonty Geist.

**Implementacja (przykład draftowy dla Claude Code):**
```tsx
// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const title = searchParams.get('title') || 'Ołup bank z premii';
  const reward = searchParams.get('reward');

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: 'linear-gradient(to right, #047857, #22c55e)', padding: 60, color: 'white', justifyContent: 'center' }}>
        <h1 style={{ fontSize: 72, fontWeight: 800 }}>{title}</h1>
        {type === 'offer' && reward && (
           <h2 style={{ fontSize: 120, color: '#fef08a' }}>{reward} zł</h2>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

Następnie wystarczy w `generateMetadata` danej strony zwrócić adres z podpiętymi query params:
`url: "https://cebulazysku.pl/api/og?type=offer&title=Konto Przekorzystne&reward=400"`
