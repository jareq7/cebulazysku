# Tasks: UI Components Upgrade — ROI-driven UX polish

## Relevant Files

- `src/app/layout.tsx` — Root layout (Toaster provider)
- `src/components/OfferCard.tsx` — Offer card (tooltip, deadline alert, toast)
- `src/components/OfferFilters.tsx` — Filters (toast, mobile drawer)
- `src/components/OfferTrackingActions.tsx` — Tracker actions (toast)
- `src/components/ConditionTracker.tsx` — Condition tracker (toast)
- `src/components/Navbar.tsx` — Navigation (mobile drawer)
- `src/app/oferta/[slug]/page.tsx` — Offer detail (breadcrumb, deadline alert, tooltip)
- `src/app/ranking/page.tsx` — Ranking (table)
- `src/app/dashboard/page.tsx` — Dashboard (skeleton, deadline alert)
- `src/app/blog/[slug]/page.tsx` — Blog detail (breadcrumb)
- `src/components/ui/` — shadcn primitives
- `tasks/prd-ui-components-upgrade.md` — PRD

## Tasks

### 0.0 Setup
- [x] 0.1 Install shadcn components: `sonner`, `tooltip`, `alert`, `skeleton`, `breadcrumb`, `table`, `drawer`

### 1.0 Toast (Sonner) — Claude Code
- [x] 1.1 Add `<Toaster />` + `<TooltipProvider>` to root `layout.tsx`
- [x] 1.2 Add toast to affiliate link click (AffiliateLink.tsx)
- [x] 1.3 Add toast to "dodaj do trackera" action — already had toast (Gemini)
- [x] 1.4 Add toast to condition tracker — skipped (confetti is enough feedback)
- [ ] 1.5 Add toast to filter save (OfferFilters — when preferences saved to Supabase)
- [ ] 1.6 Add toast to login/register success
- [ ] 1.7 Add toast to error states (API failures)

### 2.0 Alert (Deadline urgency) — Claude Code
- [x] 2.1 Create `src/components/DeadlineAlert.tsx` — DeadlineAlert (banner) + DeadlineBadge (inline)
- [x] 2.2 Add DeadlineAlert to offer detail page (`oferta/[slug]`) — above breadcrumb
- [x] 2.3 Add pulsing DeadlineBadge to OfferCard when <7 days (replaces normal "X dni" badge)
- [ ] 2.4 Add deadline alerts to dashboard tracked offers

### 3.0 Tooltip — Gemini (content) + Claude Code (wiring)
- [ ] 3.1 **[Gemini]** Przygotuj słownik terminów bankowych do tooltipów
- [ ] 3.2 **[Gemini]** Przygotuj opisy trudności ofert do tooltipów
- [ ] 3.3 Create `src/data/tooltips.ts` — typed export from glossary JSON
- [ ] 3.4 Create `src/components/GlossaryTooltip.tsx`
- [ ] 3.5 Add difficulty tooltip to OfferCard badge
- [ ] 3.6 Add tooltips to hero stats section (page.tsx)
- [ ] 3.7 Add term tooltips to offer detail description

### 4.0 Skeleton — Claude Code
- [x] 4.1 Create `src/components/OfferCardSkeleton.tsx` — skeleton + grid variant
- [x] 4.2 Replace Loader2 spinner in dashboard with skeleton grid
- [ ] 4.3 Add skeleton fallback to blog listing page

### 5.0 Breadcrumb + JSON-LD — Gemini (schema) + Claude Code (component)
- [ ] 5.1 **[Gemini]** Breadcrumb JSON-LD schema examples
- [ ] 5.2 Create `src/components/Breadcrumb.tsx` — wraps shadcn Breadcrumb + emits JSON-LD
- [ ] 5.3 Replace plain text breadcrumb in `oferta/[slug]/page.tsx`
- [ ] 5.4 Add breadcrumb to `blog/[slug]/page.tsx`
- [ ] 5.5 Add breadcrumb to ranking page

### 6.0 Drawer (mobile UX) — Claude Code
- [ ] 6.1 Refactor OfferFilters: on mobile (<md), show "Filtry" button that opens Drawer with filter controls
- [ ] 6.2 Refactor Navbar: replace collapsible div with Sheet (slide from left) on mobile

### 7.0 Table (ranking) — Claude Code
- [ ] 7.1 Create ranking table view for desktop (md+) with columns: #, bank+logo, oferta, trudność, deadline, premia, CTA
- [ ] 7.2 Keep card view as mobile fallback
- [ ] 7.3 Add responsive switch: table on md+, cards on mobile

### 8.0 Verify
- [ ] 8.1 Build check
- [ ] 8.2 Mobile responsiveness check (320px+)
