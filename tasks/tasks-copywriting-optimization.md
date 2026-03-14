# Task List — Optymalizacja Copywritingu i Formatowania

## Faza 0: Przygotowanie
- [ ] 0.0 Create feature branch `feature/copywriting-optimization`
- [ ] 0.1 Review existing descriptions in DB (manual check)

## Faza 1: Infrastruktura Techniczna
- [ ] 1.1 Update `src/lib/offers.ts` — Allow Markdown/HTML in `fullDescription`
- [ ] 1.2 Update `src/app/oferta/[slug]/page.tsx` — Add Markdown rendering (simple or `react-markdown`)
- [ ] 1.3 Verify if formatting is preserved when fetching from DB

## Faza 2: Prompt Engineering
- [ ] 2.1 Update `src/lib/generate-offer-content.ts` — New prompt with modular structure
- [ ] 2.2 Update `src/lib/generate-offer-content.ts` — Update verification prompt
- [ ] 2.3 Local test of the prompt with sample data

## Faza 3: Re-generacja Danych
- [ ] 3.1 Create a temporary API route or script to trigger re-generation for all offers
- [ ] 3.2 Run the re-generation process
- [ ] 3.3 Verify results in Supabase dashboard or UI

## Faza 4: UI / UX Polishing
- [ ] 4.1 Adjust CSS/Tailwind for the new description structure (spacing, lists)
- [ ] 4.2 Final audit of humor balance and clarity

## Faza 5: Sprzątanie i Merge
- [ ] 5.1 Remove temporary scripts/routes
- [ ] 5.2 Merge to `main`
