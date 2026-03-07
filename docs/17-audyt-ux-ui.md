# 17. Audyt UX/UI — CebulaZysku

[← Powrót do spisu treści](./README.md)

---

## 1. Podsumowanie

Audyt przeprowadzony 7 marca 2026. Przegląd obejmuje wszystkie strony i komponenty serwisu pod kątem: spójności wizualnej, responsywności, accessibility, typografii, kolorystyki, interakcji i ogólnego user experience.

**Ogólna ocena: 7/10** — solidna baza, wymaga poprawek kolorystyki CSS variables i kilku usprawnień UX.

---

## 2. Krytyczne problemy 🔴

### 2.1 CSS variables nadal w tonacji amber/brąz

**Problem:** Plik `globals.css` definiuje `--primary` w oklch hue ~55 (amber/brąz), podczas gdy cała strona używa Tailwind `emerald-*` klas. To powoduje:
- Przyciski `<Button>` (używają `bg-primary`) są w kolorze brązowym, a nie zielonym
- Focus ringi i linki `text-primary` są brązowe
- Niespójność: akcenty emerald na kartach vs brązowe przyciski

**Rozwiązanie:** Zmienić `--primary` i powiązane zmienne na odcień zielony (oklch hue ~145-155).

| Zmienna | Obecna wartość (amber) | Docelowa (green) |
|---------|----------------------|-------------------|
| `--primary` | `oklch(0.55 0.16 55)` | `oklch(0.45 0.15 155)` |
| `--primary-foreground` | `oklch(0.99 0 0)` | `oklch(0.99 0 0)` (bez zmian) |
| `--ring` | `oklch(0.55 0.16 55)` | `oklch(0.45 0.15 155)` |
| `--secondary` | `oklch(0.955 0.02 85)` | `oklch(0.955 0.02 150)` |
| `--accent` | `oklch(0.94 0.04 85)` | `oklch(0.94 0.04 150)` |

Analogicznie dla dark mode.

### 2.2 Social proof z fałszywą liczbą

**Problem:** Sekcja na stronie głównej mówi "Ponad 1 200 cebularzy już obiera premie". To hardkodowana liczba — jeśli strona jest nowa, to wprowadza użytkowników w błąd.

**Rozwiązanie:** Albo (a) usunąć do czasu osiągnięcia realnych liczb, albo (b) zastąpić prawdziwą metryką z Supabase (`select count(*) from auth.users`), albo (c) zmienić copy na coś nieokreślonego jak "Dołącz do społeczności cebularzy".

---

## 3. Ważne problemy 🟠

### 3.1 Brak logo banków na kartach ofert

**Problem:** Karty ofert (`OfferCard`) pokazują tylko kolorowy kwadrat z pierwszą literą nazwy banku (np. "m" dla mBank). Logo bankowe (`bank_logo`) jest w bazie danych ale nie jest używane na kartach.

**Rozwiązanie:** Użyć `<img src={offer.bankLogo} />` z fallbackiem na kolorowy kwadrat z literą jeśli brak logo.

### 3.2 Brak stanu ładowania na stronie głównej

**Problem:** Strona główna to Server Component (async) — nie ma loading skeleton. Przy wolnym Supabase użytkownik widzi białą stronę.

**Rozwiązanie:** Dodać `loading.tsx` w `src/app/` z skeleton UI (karty, hero section).

### 3.3 Formularz kontaktowy nie wysyła maili

**Problem:** `kontakt/page.tsx` ma `setSent(true)` ale nie robi żadnego API call. Użytkownik myśli że wysłał wiadomość, a nic się nie dzieje.

**Status:** Zaplanowane jako punkt 3 na liście priorytetów.

### 3.4 Mobile menu nie zamyka się po resize

**Problem:** Jeśli użytkownik otworzy hamburger menu na mobile, potem powiększy okno do desktop — menu mobilne zostaje otwarte w tle. Brak nasłuchiwania na zmianę rozmiaru okna.

**Rozwiązanie:** Dodać `useEffect` z `matchMedia` listener lub zamknąć menu przy resize.

### 3.5 Oferty bez `conditions` pokazują pustą sekcję

**Problem:** Oferty z LeadStar (bez ręcznego wzbogacenia) nie mają `conditions`, `pros`, `cons`, `faq`. Na stronie oferty wyświetlają się puste sekcje "Warunki do spełnienia", "Zalety i wady".

**Rozwiązanie:** Warunkowe renderowanie — ukrywać sekcje gdy dane są puste. Alternatywnie wyświetlać HTML z LeadStar (`leadstar_description_html`) jako fallback.

### 3.6 Brak favicon

**Problem:** Nie znaleziono pliku `favicon.ico` ani `icon.png` w `public/` ani w `src/app/`. Przeglądarka pokazuje domyślną ikonkę.

**Rozwiązanie:** Wygenerować favicon z logo (logo-icon.png) i dodać jako `src/app/favicon.ico` lub `src/app/icon.png`.

---

## 4. Umiarkowane problemy 🟡

### 4.1 Checkbox na rejestracji — niestylowany

**Problem:** Checkbox akceptacji regulaminu w `rejestracja/page.tsx` używa natywnego `<input type="checkbox">` z `border-gray-300`. Nie pasuje do reszty UI (shadcn/ui).

**Rozwiązanie:** Użyć shadcn `<Checkbox>` komponent.

### 4.2 Brak animacji przejść między stronami

**Problem:** Przejścia między stronami są natychmiastowe (brak smooth transitions). Nie jest to krytyczne, ale obniża perceived quality.

**Rozwiązanie:** Opcjonalne — `framer-motion` z `AnimatePresence` lub Next.js built-in `loading.tsx`.

### 4.3 ThemeToggle brak labela

**Problem:** Przycisk zmiany motywu nie ma `aria-label`. Screen readery nie wiedzą co robi.

**Rozwiązanie:** Dodać `aria-label="Przełącz motyw"`.

### 4.4 Blog ma tylko 1 artykuł

**Problem:** Sekcja bloga jest prawie pusta (1 artykuł). Wygląda na niedokończoną.

**Status:** Zaplanowane jako punkt 5 na liście priorytetów.

### 4.5 Footer link "Blog" — niewidoczna sekcja

**Problem:** Footer zawiera link do `/blog` ale blog nie jest prominentny w nawigacji. Na mobile trzeba scrollować.

### 4.6 Sekcja "Min. czas: 2 mies." — hardkodowana

**Problem:** W stats na hero hardkodowano "2 mies." — to nie jest dynamiczne. Powinno się liczyć z danych ofert lub usunąć.

### 4.7 "Sprawdź oferty" CTA prowadzi do rejestracji

**Problem:** Przycisk "Sprawdź oferty" w hero prowadzi do `/rejestracja`, nie do sekcji ofert `/#oferty`. Użytkownik klika żeby zobaczyć oferty, a dostaje formularz rejestracji.

**Rozwiązanie:** Zmienić `href` na `/#oferty` lub dodać drugi CTA.

---

## 5. Drobne usprawnienia 🔵

### 5.1 Brak stanu hover na kartach ofert w mobile (touch)
### 5.2 Tekst "Zaktualizowano" na kartach — data może być stara jeśli sync nie działa
### 5.3 Badge "Polecane" na kartach — brak ofert z `featured = true` w DB (nigdy nie wyświetlone)
### 5.4 Sekcja "Zobacz też inne oferty" robi drugi fetch do Supabase (async IIFE) — mogłaby użyć danych z pierwszego fetch
### 5.5 OfferCard `daysLeft` może być ujemne (deadline minął) — wyświetla "0 dni" ale nie informuje że oferta wygasła
### 5.6 Breadcrumbs na mobile mogą się zawijać — brak `overflow-hidden` / `text-ellipsis`

---

## 6. Accessibility (a11y)

| Element | Status | Problem |
|---------|--------|---------|
| Alt text na logo | ✅ OK | `alt="CebulaZysku logo"` |
| Semantic HTML | ✅ OK | `<nav>`, `<main>`, `<footer>`, `<section>` |
| Focus visible | ✅ OK | Tailwind `ring` system |
| Color contrast | ⚠️ | `text-muted-foreground` na jasnym tle — sprawdzić kontrast ratio |
| Keyboard navigation | ⚠️ | Mobile menu nie obsługuje `Escape` do zamknięcia |
| Screen reader | ⚠️ | ThemeToggle bez `aria-label`, hamburger bez `aria-expanded` |
| Skip to content | ❌ | Brak "Skip to main content" linku |

---

## 7. Responsywność

| Breakpoint | Status | Uwagi |
|------------|--------|-------|
| Mobile (<640px) | ✅ OK | Hamburger menu, stacked layout |
| Tablet (640-1024px) | ✅ OK | 2-column grids |
| Desktop (>1024px) | ✅ OK | 3-4 column grids, sidebar |
| Ultra-wide (>1440px) | ⚠️ | `max-w-7xl` ogranicza — OK, ale dużo pustej przestrzeni |

---

## 8. Rekomendowane priorytety napraw

| # | Problem | Wpływ | Nakład |
|---|---------|-------|--------|
| 1 | **CSS variables → green** | 🔴 Krytyczny — niespójne przyciski | Mały (1 plik) |
| 2 | **Favicon** | 🔴 Brak ikony w przeglądarce | Mały |
| 3 | **CTA "Sprawdź oferty" → #oferty** | 🟠 UX — mylący flow | 1 linia |
| 4 | **Logo banków na kartach** | 🟠 Wizualny upgrade | Średni |
| 5 | **Ukrywanie pustych sekcji na ofertach** | 🟠 Puste treści | Średni |
| 6 | **Loading skeleton** | 🟠 Perceived performance | Średni |
| 7 | **Social proof — usunąć/zmienić** | 🟠 Wiarygodność | Mały |
| 8 | **Mobile menu auto-close** | 🟡 Edge case | Mały |
| 9 | **Checkbox shadcn** | 🟡 Spójność | Mały |
| 10 | **Skip to content + aria labels** | 🟡 Accessibility | Mały |

---

## 9. Status

📋 **Audyt ukończony** — 7 marca 2026

Rekomendacja: naprawić punkty 1-7 przed dalszym rozwojem (backend kontaktowy, admin panel, etc.).
