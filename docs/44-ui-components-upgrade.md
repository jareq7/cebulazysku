# 44. UI Components Upgrade — Toast, Alerts, Skeleton, Sheet Navbar

> **Data:** 2026-03-19
> **Autor:** Claude Code (claude-opus-4-6)
> **PRD:** `tasks/prd-ui-components-upgrade.md`
> **Tasks:** `tasks/tasks-ui-components-upgrade.md`

## Co zostało zrobione

Upgrade UX strony o 7 nowych komponentów shadcn/ui, z czego 5 zostało wdrożonych w tej sesji. Celem jest poprawa konwersji (feedback na akcje, urgency na deadline'y) i profesjonalizm (skeleton loading, slide-in menu).

## Zainstalowane komponenty shadcn

| Komponent | Paczka | Status |
|-----------|--------|--------|
| Sonner (toast) | `sonner` | ✅ Wdrożony |
| Alert | `@radix-ui/react-alert` | ✅ Wdrożony |
| Skeleton | CSS only | ✅ Wdrożony |
| Tooltip | `@radix-ui/react-tooltip` | ⏳ Provider gotowy, czeka na Gemini glossary |
| Breadcrumb | `@radix-ui/react-breadcrumb` | ⏳ Zainstalowany, czeka na Gemini schema |
| Table | native HTML | ⏳ Zainstalowany, opcjonalny (ranking) |
| Drawer | `vaul` | ⏳ Zainstalowany, do mobile filters |

## Wdrożone funkcjonalności

### 1. Toast (Sonner)
- `<Toaster />` w `layout.tsx` (globalny, `richColors`, `position="bottom-right"`)
- `<TooltipProvider>` w `layout.tsx` (gotowy na tooltips)
- Toast na klik afiliacyjny w `AffiliateLink.tsx` → "Otwieramy stronę {bank}"
- Toast na dodanie do trackera już istniał (OfferTrackingActions — Gemini)

### 2. DeadlineAlert + DeadlineBadge
- Nowy komponent `src/components/DeadlineAlert.tsx`
- `DeadlineAlert` — banner: czerwony gdy <7 dni, żółty gdy <14 dni, ukryty >14 dni
- `DeadlineBadge` — inline pulsujący badge "X dni!" na OfferCard gdy <7 dni
- Wstawiony na stronie oferty (`oferta/[slug]/page.tsx`) powyżej breadcrumba
- OfferCard: DeadlineBadge zastępuje normalny "X dni" badge gdy <7 dni

### 3. Skeleton loading
- Nowy komponent `src/components/OfferCardSkeleton.tsx` + `OfferGridSkeleton`
- Dashboard: skeleton grid (4 karty + 2 tracked offers) zamiast Loader2 spinner

### 4. Sheet Navbar (mobile)
- Refaktor `Navbar.tsx`: mobile menu z collapsible div → `Sheet` (slide-in z lewej, 272px)
- Logo w sheet header, linki z hover highlight, auth buttons na dole
- Auto-close na klik linku, obsługa Escape (Radix built-in)

## Co czeka na Gemini

- **Tooltip glossary** (`research/tooltip-glossary.json`) — 12 terminów bankowych + opisy trudności
- **Breadcrumb JSON-LD schema** (`research/breadcrumb-schema.json`) — przykłady dla 3 typów stron

## Odłożone

- Mobile drawer na filtry ofert (OfferFilters)
- Table view w rankingu (obecny layout już działa dobrze)
- Toast na login/register i error states
