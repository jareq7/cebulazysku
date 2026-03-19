# 43. Homepage FAQ Section

> **Data:** 2026-03-19
> **Autor:** Claude Code (claude-opus-4-6)
> **PRD:** `tasks/prd-homepage-faq.md`
> **Tasks:** `tasks/tasks-homepage-faq.md`

## Co zostało zrobione

Dodano sekcję FAQ na stronę główną z 15 najczęściej zadawanymi pytaniami o premie bankowe. Pytania dotyczą bezpieczeństwa, podatków, BIK, karencji, BLIK vs karta, zamykania kont itp.

## Implementacja

### Nowe pliki
- `src/data/faq.ts` — typed export 15 pytań (`FaqItem[]`)
- `src/components/HomepageFaq.tsx` — client component, accordion 2-kolumnowy

### Zmiany
- `src/app/page.tsx` — dodano sekcję FAQ między "Dlaczego warto?" a CTA + FAQPage JSON-LD schema

### Komponent
- shadcn `Accordion` (Radix UI) z `type="multiple"` (wiele otwartych naraz)
- 2 kolumny na desktop (`md:grid-cols-2`), 1 na mobile
- Dane z `src/data/faq.ts` (statyczny import, zero fetchy)

### SEO
- JSON-LD `FAQPage` schema z `mainEntity` → `Question` + `acceptedAnswer`
- Pozwala Google wyświetlać pytania w rich snippets

## Źródło danych

Pytania przygotował Gemini CLI (`research/faq-homepage.json`), zweryfikowane i skopiowane do `src/data/faq.ts` jako typed export.
