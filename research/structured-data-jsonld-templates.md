# Szablony JSON-LD (Structured Data) dla podstrony Oferty
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17

Poniżej znajdują się gotowe szablony do zintegrowania w pliku `src/app/oferta/[slug]/page.tsx`. Zawierają zmienne dynamiczne podpięte pod strukturę danych w naszej bazie (obiekt `offer`).

Możesz wstawić te obiekty do zmiennych przed instrukcją `return` w komponencie strony i podpiąć je pod nasz standardowy komponent `<JsonLd data={...} />`.

## 1. Schemat główny: Product + Offer

Ten schemat mówi Google: "To jest produkt finansowy stworzony przez dany bank, a nasza strona to oferta, która pozwala go 'kupić' (założyć) z nagrodą (bonusem gotówkowym)". Wartość nagrody podajemy jako dodatnią lub traktujemy jako `price: 0`, a nagrodę opisujemy w opisie. W SEO afiliacyjnym dobrze działa podawanie kwoty bonusu w polu `price`.

```tsx
const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": `${offer.bankName} - ${offer.offerName}`,
  "image": offer.bankLogo && offer.bankLogo.startsWith('http') ? offer.bankLogo : "https://cebulazysku.pl/logo-wide.png",
  "description": offer.shortDescription || `Otwórz konto w banku ${offer.bankName} i zgarnij gwarantowane ${offer.reward} zł premii. Sprawdź naszą instrukcję krok po kroku!`,
  "brand": {
    "@type": "Brand",
    "name": offer.bankName
  },
  "offers": {
    "@type": "Offer",
    "url": `https://cebulazysku.pl/oferta/${offer.slug}`,
    "priceCurrency": "PLN",
    "price": offer.reward.toString(),
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": offer.bankName
    },
    ...(offer.deadline && { "priceValidUntil": new Date(offer.deadline).toISOString().split('T')[0] })
  }
};
```

## 2. Schemat: HowTo (Instrukcja Krok po Kroku)

Ten schemat wygeneruje w Google Rich Snippets w postaci kafelków (krok 1, krok 2). Idealnie pasuje do naszej tablicy warunków `offer.conditions`.

```tsx
const howToJsonLd = offer.conditions.length > 0 ? {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": `Jak zdobyć ${offer.reward} zł w banku ${offer.bankName}`,
  "description": `Instrukcja krok po kroku, jak założyć ${offer.offerName} i spełnić warunki, aby otrzymać premię.`,
  // Szacowany czas na wykonanie wszystkich kroków (np. 1 miesiąc)
  "totalTime": "P1M",
  // Mapujemy warunki z bazy na kroki instrukcji
  "step": offer.conditions.map((condition, index) => ({
    "@type": "HowToStep",
    "name": condition.label,
    "text": condition.description + (condition.requiredCount > 1 ? ` (Wykonaj ${condition.requiredCount} razy)` : ""),
    "url": `https://cebulazysku.pl/oferta/${offer.slug}#warunki`
  }))
} : null;
```

## Implementacja w renderze (oferta/[slug]/page.tsx)

W obszarze zwracanym (return) po prostu dokładasz render tagów (najlepiej na samej górze pliku, w pobliżu innych komponentów JsonLd).

```tsx
return (
  <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
    <JsonLd data={breadcrumbJsonLd} />
    {faqJsonLd && <JsonLd data={faqJsonLd} />}
    {/* Dodane nowe schematy: */}
    <JsonLd data={productJsonLd} />
    {howToJsonLd && <JsonLd data={howToJsonLd} />}
    
    <TrackViewItem ... />
    ...
```
