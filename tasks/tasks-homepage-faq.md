# Tasks: Homepage FAQ Section

## Relevant Files

- `research/faq-homepage.json` — Source FAQ data from Gemini
- `src/data/faq.ts` — Typed FAQ data export
- `src/components/HomepageFaq.tsx` — FAQ accordion component
- `src/app/page.tsx` — Landing page (add FAQ section + JSON-LD)
- `tasks/prd-homepage-faq.md` — PRD

## Tasks

### 1.0 Data layer
- [x] 1.1 Create `src/data/faq.ts` — typed export from JSON
- [x] 1.2 Verify all 14 questions are correct Polish, no HTML

### 2.0 FAQ Accordion component
- [x] 2.1 Verify shadcn Accordion is installed
- [x] 2.2 Create `src/components/HomepageFaq.tsx` — accordion, 2-col grid, emerald styling

### 3.0 Landing page integration
- [x] 3.1 Add FAQ section to `page.tsx` between "Dlaczego warto?" and CTA
- [x] 3.2 Add FAQPage JSON-LD schema to page

### 4.0 Verify
- [x] 4.1 Build check
