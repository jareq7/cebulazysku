# PRD: Homepage FAQ Section

## 1. Introduction / Overview

Strona główna CebulaZysku nie odpowiada na typowe pytania użytkowników — "czy to bezpieczne?", "czy tracę BIK?", "kiedy dostanę premię?". Gemini przygotował 15 pytań i odpowiedzi w `research/faq-homepage.json`. Trzeba je wyświetlić na landing page jako accordion + dodać JSON-LD FAQPage schema dla SEO.

## 2. Goals

1. Zmniejszyć bounce rate — użytkownik znajduje odpowiedzi bez opuszczania strony
2. Zwiększyć zaufanie — pytania o bezpieczeństwo, podatki, BFG rozwiewają obawy
3. SEO boost — FAQPage schema pozwala Google wyświetlać pytania w rich snippets
4. Zero nowych tabel — dane statyczne z JSON, bez DB

## 3. User Stories

- **US1:** Jako użytkownik scrolluję stronę główną i widzę sekcję FAQ z klikalnymi pytaniami — klikam pytanie, rozwija się odpowiedź
- **US2:** Jako Google bot czytam FAQPage JSON-LD i wyświetlam pytania w search results
- **US3:** Jako admin mogę w przyszłości edytować FAQ z pliku (nie z kodu)

## 4. Functional Requirements

### FR1: Komponent FAQ Accordion
- Nowy komponent `src/components/HomepageFaq.tsx` (client component — potrzebuje stanu)
- Accordion z shadcn/ui (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`)
- Dane z `research/faq-homepage.json` — zaimportowane statycznie (nie fetch)
- Max 2 kolumny na desktop (md:grid-cols-2), 1 na mobile
- Styl: emerald accent (spójny z resztą strony)

### FR2: JSON-LD FAQPage Schema
- Dodać FAQPage structured data do strony głównej via istniejący `<JsonLd>` komponent
- Format: `@type: FAQPage` z `mainEntity` array of `Question` + `acceptedAnswer`
- Generowany z tego samego JSON co accordion

### FR3: Umiejscowienie na stronie
- Sekcja FAQ wstawiona **między "Dlaczego warto?" a końcowym CTA** (przed `<section>` "Gotowy na obieranie?")
- Heading: `h2` "Najczęstsze pytania 🧅" z podtytułem "Wszystko co musisz wiedzieć o premiach bankowych"

### FR4: Accessibility
- Accordion musi być keyboard-navigable (shadcn/ui zapewnia to out of the box)
- `aria-expanded` na triggerach
- Odpowiedzi nie mogą mieć surowego HTML — plain text only

## 5. Non-functional Requirements

- **Performance:** Dane statyczne, zero fetchy — nie wpływa na TTFB
- **SEO:** FAQPage schema musi przejść walidację w Google Rich Results Test
- **Responsywność:** Mobile-first, czytelne na 320px+

## 6. Design

- Tło: lekko szare (`bg-muted/30`) lub emerald subtle — spójne z trust section
- Accordion trigger: bold tekst, emerald chevron, hover highlight
- Accordion content: `text-muted-foreground`, `text-sm`, `leading-relaxed`
- 2 kolumny na desktop (7-8 pytań na kolumnę), 1 na mobile

## 7. Out of Scope

- Admin UI do edycji FAQ (przyszłość — US3)
- FAQ na podstronach ofert (osobny task)
- Wyszukiwarka w FAQ
- Kategorie/tagi pytań

## 8. Technical Notes

- Dane: `research/faq-homepage.json` (14 pytań od Gemini, zweryfikowane)
- Skopiować JSON do `src/data/faq.ts` jako typed export (nie importować z research/)
- Typ: `{ question: string; answer: string }[]`
- Komponent shadcn Accordion już zainstalowany (`@radix-ui/react-accordion`)
