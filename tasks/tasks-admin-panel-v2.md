## Relevant Files

- `supabase/migrations/019_ai_verification_logs.sql` — Migration for ai_verification_logs table
- `supabase/migrations/020_affiliate_clicks.sql` — Migration for affiliate_clicks placeholder table
- `src/lib/verify-conditions-ai.ts` — Add DB logging of verification results
- `src/app/api/admin/feed/route.ts` — Extend PATCH to support conditions field
- `src/app/api/admin/ai-logs/route.ts` — New API route for AI verification logs
- `src/app/admin/warunki/page.tsx` — Conditions editor page
- `src/app/admin/ai-logs/page.tsx` — AI verification logs viewer
- `src/app/admin/konwersje/page.tsx` — Conversions placeholder page
- `src/app/admin/layout.tsx` — Add new nav items

### Notes

- Migracje numerowane od 019 (po istniejących 18 migracjach)
- Admin pages to client components używające `adminFetch()`
- Podgląd warunków reużywa logikę wyświetlania z `/oferta/[slug]/page.tsx`

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. Update the file after completing each sub-task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout branch `feature/admin-panel-v2`

- [x] 1.0 Migracje DB
  - [x] 1.1 Create `supabase/migrations/019_ai_verification_logs.sql`
  - [x] 1.2 Create `supabase/migrations/020_affiliate_clicks.sql`
  - [ ] 1.3 Uruchom migracje na Supabase

- [x] 2.0 Backend: API routes
  - [x] 2.1 Extend PATCH `/api/admin/feed` — conditions + auto-lock
  - [x] 2.2 Extend PATCH `/api/admin/feed` — unlock_conditions action
  - [x] 2.3 Create GET `/api/admin/ai-logs` — logi z paginacją i filtrami
  - [x] 2.4 Stats zintegrowane w tym samym endpoincie (nie osobny route)

- [x] 3.0 Backend: zapis logów AI
  - [x] 3.1 `verify-conditions-ai.ts` — saveVerificationLog() do DB
  - [x] 3.2 Graceful zapis (nie blokuje synca)
  - [x] 3.3 `sync-offers/route.ts` — przekazuje offerId do verifyConditionsWithAI()

- [x] 4.0 Frontend: Edytor warunków (`/admin/warunki`)
  - [x] 4.1 Lista aktywnych ofert z warunkami
  - [x] 4.2 Klikalna oferta rozwija panel
  - [x] 4.3 Inline edycja per warunek (label, description, type, requiredCount, perMonth, monthsRequired)
  - [x] 4.4 "Dodaj warunek" button
  - [x] 4.5 "Usuń warunek" button z confirm
  - [x] 4.6 Podgląd "Tak to zobaczy user"
  - [x] 4.7 "Zapisz" button → PATCH
  - [x] 4.8 "Odblokuj — przywróć z parsera" button
  - [x] 4.9 Badge "Ręcznie edytowane" gdy locked
  - [x] 4.10 Wyszukiwarka ofert

- [x] 5.0 Frontend: Logi AI (`/admin/ai-logs`)
  - [x] 5.1 Statystyki na górze
  - [x] 5.2 Lista logów z paginacją
  - [x] 5.3 Filtry: wszystkie / z korektami / błędy AI
  - [x] 5.4 Log entry card z badges
  - [x] 5.5 Rozwijany diff view
  - [x] 5.6 Empty state

- [x] 6.0 Frontend: Placeholder konwersje (`/admin/konwersje`)
  - [x] 6.1 Coming soon komunikat
  - [x] 6.2 Opis planowanych funkcji
  - [x] 6.3 Placeholder karty statystyk

- [x] 7.0 Nawigacja + cleanup
  - [x] 7.1 3 nowe pozycje w nav
  - [x] 7.2 Build test — PASSED
  - [ ] 7.3 Ręczny test w przeglądarce
  - [ ] 7.4 Ręczny test sync → AI logs
