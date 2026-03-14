# PRD: Admin Panel v2

## Introduction

Rozbudowa panelu admina o trzy kluczowe funkcjonalności: edytor warunków promocji, logi AI weryfikacji warunków oraz placeholder pod tracking konwersji. Celem jest danie adminowi pełnej kontroli nad warunkami (które dziś są read-only z parsera) oraz wglądu w to, jak AI koryguje output regex parsera.

## Goals

1. Admin może przeglądać, edytować, dodawać i usuwać warunki (conditions) per oferta — bez konieczności ręcznej edycji bazy
2. Admin widzi pełną historię korekt AI z diffem regex vs AI output — dla każdego synca
3. Placeholder pod konwersje — strona z komunikatem "coming soon" i przygotowana tabela w DB na przyszłe eventy kliknięć

## User Stories

- Jako admin chcę poprawić `requiredCount` warunku który parser źle sparsował, żeby tracker użytkownika pokazywał poprawną liczbę
- Jako admin chcę dodać warunek którego parser nie wyłapał z feedu, żeby tracker był kompletny
- Jako admin chcę usunąć fałszywy warunek który parser błędnie wygenerował
- Jako admin chcę zobaczyć podgląd "tak to widzi user w trackerze" przed zapisaniem zmian
- Jako admin chcę widzieć listę korekt AI z ostatnich synców, żeby ocenić czy AI pomaga czy przeszkadza
- Jako admin chcę widzieć diff: co parser wyciągnął vs co AI skorygował — per oferta, per sync
- Jako admin chcę mieć placeholder pod konwersje, żeby wiedzieć że ta funkcja jest zaplanowana

## Functional Requirements

### Edytor warunków (`/admin/warunki`)

1. Strona listuje wszystkie aktywne oferty z ich warunkami
2. Po kliknięciu oferty — rozwijany panel z listą warunków
3. Każdy warunek edytowalny inline: `label`, `description`, `type` (dropdown), `requiredCount` (number), `perMonth` (checkbox), `monthsRequired` (number)
4. Przycisk "Dodaj warunek" — nowy wiersz z pustymi polami + autogenerowane ID (`ls_cond_N+1`)
5. Przycisk "Usuń" per warunek (z potwierdzeniem)
6. Podgląd "Tak to zobaczy user" — renderuje warunki jak na stronie oferty (badge z typem, opis, "5x jednorazowo" / "3x miesięcznie przez 3 mies.")
7. Przycisk "Zapisz" → PATCH do `/api/admin/feed` z nowym `conditions` JSONB
8. Po zapisie — oferta dostaje `locked_fields: [..., "conditions"]` automatycznie, żeby następny sync nie nadpisał ręcznych zmian
9. Przycisk "Odblokuj — przywróć z parsera" — usuwa lock i reparsowuje z feedu

### Logi AI weryfikacji (`/admin/ai-logs`)

10. Nowa tabela w DB: `ai_verification_logs` — przechowuje wyniki weryfikacji AI
11. Kolumny: `id`, `offer_id`, `bank_name`, `created_at`, `regex_conditions` (JSONB), `ai_conditions` (JSONB), `corrections` (text[]), `verified` (bool)
12. Strona listuje logi z paginacją (50 per strona), najnowsze na górze
13. Filtr: wszystkie / tylko z korektami / tylko błędy AI
14. Po kliknięciu logu — widok diff: lewa kolumna (regex output), prawa kolumna (AI output), podświetlone różnice
15. Badge z liczbą korekt per log entry
16. Statystyki na górze: łączna liczba weryfikacji, % z korektami, najczęstsze typy korekt

### Placeholder konwersje (`/admin/konwersje`)

17. Strona z komunikatem "Tracking konwersji — coming soon"
18. Krótki opis co będzie: kliknięcia w linki afiliacyjne, CTR, wykres w czasie
19. Tabela `affiliate_clicks` w DB: `id`, `offer_id`, `user_id` (nullable), `clicked_at`, `source_page`
20. Tabela pusta, bez żadnego trackingu na froncie — to na później

## Non-Goals

- Nie budujemy pełnego tracking analytics (to osobny feature)
- Nie budujemy edytora warunków na stronie oferty (tylko w adminie)
- Nie integrujemy z zewnętrznym analytics (Plausible, GA itp.)
- Nie budujemy historii zmian warunków (audit log — osobny feature)

## Technical Considerations

- Edytor warunków korzysta z istniejącego PATCH `/api/admin/feed` — trzeba rozszerzyć o pole `conditions`
- `ai_verification_logs` wymaga nowej migracji Supabase
- `affiliate_clicks` wymaga nowej migracji (placeholder, pusta tabela)
- `verify-conditions-ai.ts` trzeba rozszerzyć o zapis logów do DB
- Podgląd warunków może reużyć logikę z `src/app/oferta/[slug]/page.tsx` (sekcja warunków)
- Strony admina to client components — `adminFetch()` do API calls

## Success Metrics

- Admin jest w stanie poprawić błędny warunek w < 30 sekund
- 100% weryfikacji AI jest logowanych z diffem
- Zero ręcznych zmian w Supabase Dashboard po wdrożeniu edytora

## Open Questions

- Czy potrzebny bulk edit warunków (zaznacz kilka ofert → zmień typ warunku)? — na razie nie
- Czy logi AI powinny być auto-czyszczone po X dniach? — nie, retencja pełna z paginacją
