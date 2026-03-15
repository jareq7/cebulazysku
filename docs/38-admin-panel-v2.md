# 38. Admin Panel v2

> @author Claude Code (claude-opus-4-6) | 2026-03-15

## Opis

Rozbudowa panelu admina o 6 nowych funkcjonalności w dwóch paczkach.

### Paczka 1 — Nowe strony

#### Edytor warunków (`/admin/warunki`)

Strona do przeglądania i edycji warunków promocji per oferta.

- Lista aktywnych ofert z wyszukiwarką
- Klikalna oferta rozwija panel z listą warunków
- Inline edycja per warunek: `label`, `description`, `type` (dropdown), `requiredCount`, `perMonth`, `monthsRequired`
- Dodawanie / usuwanie warunków
- Podgląd "Tak to zobaczy user" — renderuje warunki jak na stronie oferty
- Zapis → PATCH `/api/admin/feed` z `conditions` JSONB
- Auto-lock: po zapisie oferta dostaje `locked_fields: ["conditions"]` — sync nie nadpisze
- "Odblokuj — przywróć z parsera" — usuwa lock, reparsowuje z HTML feedu
- Badge "Ręcznie edytowane" gdy conditions locked

**Pliki:**
- `src/app/admin/warunki/page.tsx`
- `src/app/api/admin/feed/route.ts` (rozszerzony PATCH)

#### Logi AI (`/admin/ai-logs`)

Przeglądarka logów weryfikacji AI z diffem regex vs AI output.

- Statystyki na górze: łączne weryfikacje, % z korektami, błędy
- Lista logów z paginacją (50/stronę)
- 3 filtry: wszystkie / z korektami / błędy AI
- Rozwijany diff view per log: lewa kolumna (regex), prawa (AI), podświetlone różnice
- Badge z liczbą korekt

**Pliki:**
- `src/app/admin/ai-logs/page.tsx`
- `src/app/api/admin/ai-logs/route.ts`

#### Konwersje placeholder (`/admin/konwersje`)

Strona "coming soon" z opisem planowanych funkcji trackingu konwersji.

**Pliki:**
- `src/app/admin/konwersje/page.tsx`

### Paczka 2 — Rozszerzenia istniejących stron

#### Bulk actions na ofertach (`/admin/oferty`)

- Checkboxy per oferta + "zaznacz wszystkie"
- Toolbar z 3 akcjami: Pokaż / Ukryj / Regeneruj AI (resetuje `ai_generated_at`)
- Visual feedback: ring na zaznaczonych kartach

**Pliki:**
- `src/app/admin/oferty/page.tsx`
- `src/app/api/admin/offers/route.ts` (dodane `ai_generated_at` do allowedFields)

#### Podgląd trackera użytkownika (`/admin/uzytkownicy`)

- Strzałka expand przy userach ze śledzonymi ofertami
- Panel z listą śledzonych ofert: nazwa, premia, data rozpoczęcia
- Paski postępu per warunek (done/total)
- Lazy loading — dane pobierane on-demand per user

**Pliki:**
- `src/app/admin/uzytkownicy/page.tsx`
- `src/app/api/admin/users/tracker/route.ts` (nowy endpoint)

#### Podgląd Markdown w edytorze bloga (`/admin/blog`)

- Przycisk "Podgląd" nad textarea
- Split-view: textarea po lewej, live preview po prawej
- Reużywa komponent `RenderMarkdown`

**Pliki:**
- `src/app/admin/blog/page.tsx`

## Migracje DB

| Migracja | Tabela | Opis |
|----------|--------|------|
| `019_ai_verification_logs.sql` | `ai_verification_logs` | Logi weryfikacji AI (offer_id, regex_conditions, ai_conditions, corrections, verified) |
| `020_affiliate_clicks.sql` | `affiliate_clicks` | Placeholder na tracking kliknięć (offer_id, user_id, clicked_at, source_page) |

## Nawigacja

3 nowe pozycje w `/admin/layout.tsx`:
- Warunki (ikona: ListChecks)
- Logi AI (ikona: Brain)
- Konwersje (ikona: BarChart3)
