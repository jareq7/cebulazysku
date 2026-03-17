# Audyt Structured Data (JSON-LD)
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17

Przeanalizowałem obecne wdrożenie znaczników Schema.org w projekcie CebulaZysku.pl i przygotowałem rekomendacje nowych schematów (Product, Offer, HowTo), które podniosą skuteczność SEO.

## Obecny stan wdrożenia
Aplikacja wykorzystuje komponent `JsonLd` w:
1. `app/page.tsx` - typ `WebSite`.
2. `app/oferta/[slug]/page.tsx` - typy `FAQPage` (jeśli są pytania) oraz `BreadcrumbList`.
3. `app/blog/[slug]/page.tsx` - typy `Article` oraz `BreadcrumbList`.
4. `app/ranking/page.tsx` - typ `BreadcrumbList`.

Wdrożenie jest poprawne, dynamiczne i dobrze integruje się z Next.js, ALE jako serwis afiliacyjno-finansowy nie wykorzystujemy w pełni potencjału do wyświetlania Rich Snippets (np. gwiazdek ocen, kwot w Google, kroków instrukcji).

---

## Rekomendowane nowe schematy (do wdrożenia na podstronie oferty)

Zalecam dodanie do `app/oferta/[slug]/page.tsx` połączonego znacznika `Product` z osadzonym `Offer` oraz instrukcją `HowTo` jak zgarnąć premię.

### 1. `Product` & `Offer` (Dla pojedynczej promocji bankowej)
Użycie schematu `Product` dla konta bankowego pozwala na pokazanie w wynikach wyszukiwania oceny (fikcyjnej, ale wyliczanej z trudności lub twardo wpisanej) oraz ceny/premii przez obiekt `Offer` (z ujemną lub dodatnią ceną, albo statusem promocji).

**Przykład JSON-LD do wygenerowania w `oferta/[slug]/page.tsx`:**

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Konto Osobiste - Promocja 500 zł",
  "image": "https://cebulazysku.pl/bank-logo.png",
  "description": "Otwórz konto w banku i zgarnij 500 zł premii gotówkowej. Darmowe konto i karta przy prostych warunkach aktywności.",
  "brand": {
    "@type": "Brand",
    "name": "Nazwa Banku"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://cebulazysku.pl/oferta/slug-oferty",
    "priceCurrency": "PLN",
    "price": "500.00",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Nazwa Banku"
    },
    "priceValidUntil": "2026-12-31" // Opcjonalnie: offer.deadline
  }
}
```

### 2. `HowTo` (Dla instrukcji krok po kroku z warunkami)
Ponieważ nasza strona oferty to w zasadzie "Jak ołupić bank", idealnie pasuje tu format instruktażowy `HowTo`, wykorzystujący listę warunków do spełnienia. Google potrafi wyświetlić te kroki bezpośrednio pod wynikiem wyszukiwania.

**Przykład JSON-LD do wygenerowania w `oferta/[slug]/page.tsx` (na podstawie `offer.conditions`):**

```json
{
  "@context": "https://schema.org/",
  "@type": "HowTo",
  "name": "Jak zdobyć 500 zł premii w Nazwa Banku",
  "description": "Krok po kroku instrukcja jak otworzyć konto i spełnić warunki, aby otrzymać gwarantowaną premię gotówkową.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Założenie konta",
      "text": "Otwórz konto z kartą przez link promocyjny do określonej daty.",
      "url": "https://cebulazysku.pl/oferta/slug-oferty#warunki"
    },
    {
      "@type": "HowToStep",
      "name": "Wpływ min. 1000 zł",
      "text": "Zapewnij jednorazowy wpływ na konto w wysokości min. 1000 zł.",
      "url": "https://cebulazysku.pl/oferta/slug-oferty#warunki"
    }
    // ... iteracja po offer.conditions
  ],
  "totalTime": "P1M" // Estymowany czas (np. miesiąc)
}
```

### 3. Integracja w kodzie:
Możesz przekazać te obiekty jako tablicę do obecnego tagu `JsonLd` lub wyrenderować obok:

```tsx
const productJsonLd = { /* ... */ };
const howToJsonLd = offer.conditions.length > 0 ? { /* ... */ } : null;

// w renderze:
<JsonLd data={productJsonLd} />
{howToJsonLd && <JsonLd data={howToJsonLd} />}
```