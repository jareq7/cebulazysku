# PRD: UI Components Upgrade — ROI-driven UX polish

## 1. Introduction / Overview

Strona CebulaZysku ma solidne fundamenty, ale brakuje standardowych komponentów UX które bezpośrednio wpływają na konwersję. Akcje użytkownika są "nieme" (brak toastów), warunki ofert nie mają wyjaśnień (brak tooltipów), filtrowanie na mobile jest nieporęczne (brak drawera), a ładowanie danych pokazuje spinner zamiast skeletonów. To "last mile" UX polish który robi różnicę między "działa" a "wygląda profesjonalnie".

## 2. Goals

1. **Feedback na akcje** — użytkownik wie co się stało po każdym kliknięciu (toast)
2. **Kontekst inline** — terminy bankowe wyjaśnione bez opuszczania strony (tooltip)
3. **Urgency na deadline'y** — wizualne ostrzeżenie że promocja się kończy (alert)
4. **Profesjonalne ładowanie** — skeleton zamiast spinnera (perceived performance)
5. **Mobile-first nawigacja** — drawer na filtry i menu (mobile UX)
6. **Lepszy ranking** — tabela do szybkiego porównania ofert (skanowalność)
7. **SEO breadcrumbs** — strukturalna nawigacja z JSON-LD (SEO)

## 3. Scope — co dodajemy i gdzie

### 3.1 Toast (Sonner) — feedback na akcje
**Gdzie:**
- Kliknięcie linku afiliacyjnego → "Link otwarty w nowej karcie"
- Dodanie oferty do trackera → "Oferta dodana do trackera!"
- Skopiowanie linku (share) → "Link skopiowany!"
- Zapisanie preferencji filtrów → "Filtry zapisane"
- Błędy API → "Coś poszło nie tak, spróbuj ponownie"
- Logowanie/rejestracja → "Zalogowano pomyślnie"

**Komponent:** `sonner` (shadcn toast wrapper) — globalny provider w layout.tsx

### 3.2 Tooltip — wyjaśnienia inline
**Gdzie:**
- Warunki ofert w OfferCard (ikona "?" przy niejasnych warunkach)
- Trudność oferty ("Łatwa" / "Średnia" / "Trudna" — co to znaczy?)
- "BIK", "MCC", "BFG", "karencja" — terminy bankowe na stronach ofert
- Ikony w statystykach hero (co znaczy "Min. czas: 2 mies."?)

**Komponent:** shadcn `Tooltip` (Radix)

### 3.3 Alert — deadline urgency
**Gdzie:**
- Strona oferty: kolorowy banner gdy do końca promocji zostało <7 dni (czerwony) lub <14 dni (żółty)
- OfferCard: pulsująca kropka / badge "Kończy się!" gdy <7 dni
- Dashboard: alert nad tracked offers które mają bliski deadline

**Komponent:** shadcn `Alert` + custom `DeadlineAlert`

### 3.4 Skeleton — loading states
**Gdzie:**
- Dashboard: skeleton grid kart zamiast Loader2 spinner
- OfferFilters: skeleton kart podczas ładowania ofert
- Blog listing: skeleton kart artykułów
- Admin panel: skeleton tabel

**Komponent:** shadcn `Skeleton`

### 3.5 Drawer (Sheet) — mobile UX
**Gdzie:**
- OfferFilters na mobile: przycisk "Filtry" otwiera bottom sheet z filtrami zamiast inline
- Navbar mobile menu: zamienić collapsible div na Sheet (slide-in z lewej)

**Komponent:** shadcn `Sheet` (już zainstalowany) + `Drawer` (Vaul)

### 3.6 Table — ranking
**Gdzie:**
- Strona /ranking: zamienić karty na strukturalną tabelę (desktop) z fallbackiem na karty (mobile)
- Kolumny: pozycja, bank+logo, oferta, trudność, deadline, premia, CTA

**Komponent:** shadcn `Table`

### 3.7 Breadcrumb — nawigacja + SEO
**Gdzie:**
- Strona oferty: już ma breadcrumb tekstowy → zamienić na shadcn Breadcrumb z JSON-LD BreadcrumbList
- Blog detail: Strona główna > Blog > Tytuł
- Ranking: Strona główna > Ranking

**Komponent:** shadcn `Breadcrumb` + JSON-LD

## 4. Priorytety implementacji

| # | Komponent | Wpływ na konwersję | Trudność | Pliki do edycji |
|---|-----------|-------------------|----------|-----------------|
| 1 | Toast (Sonner) | Wysoki — feedback loop | Niska | layout.tsx + 6-8 komponentów |
| 2 | Alert (Deadline) | Wysoki — urgency drives action | Niska | OfferCard, oferta/[slug], dashboard |
| 3 | Tooltip | Średni — edukacja użytkownika | Niska | OfferCard, offer detail, hero |
| 4 | Skeleton | Średni — perceived performance | Niska | dashboard, OfferFilters, blog |
| 5 | Breadcrumb + JSON-LD | Średni — SEO + nawigacja | Niska | oferta/[slug], blog/[slug], ranking |
| 6 | Drawer (mobile filters) | Średni — mobile UX | Średnia | OfferFilters, Navbar |
| 7 | Table (ranking) | Niski — visual upgrade | Średnia | ranking/page.tsx |

## 5. Out of Scope

- Carousel/Slider (testimoniale — nie mamy jeszcze testimoniali)
- Command (⌘K search) — za mało contentu, overkill
- Popover — tooltip wystarczy
- Dialog/Modal na affiliate link — spowalnia konwersję (jeden klik mniej = lepiej)
- Collapsible — mamy accordion
- Toggle Group — obecne buttony działają

## 6. Technical Notes

- Wszystkie komponenty z shadcn/ui — `npx shadcn add [component]`
- Sonner wymaga `<Toaster />` w root layout
- Drawer (Vaul) to osobna paczka — shadcn ją wrappuje
- Skeleton to czysto CSS (animacja pulse), zero JS overhead
- Breadcrumb JSON-LD: `@type: BreadcrumbList` z `itemListElement`
- Alert deadline: obliczenie dni z `offer.deadline` (ISO date string)

## 7. Metryki sukcesu

- Bounce rate na landing page (spadek po FAQ + tooltipach)
- Click-through na affiliate links (wzrost po deadline alerts)
- Mobile engagement (wzrost po drawer filters)
- Core Web Vitals LCP (poprawa po skeletonach)
