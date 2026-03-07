# 14. Integracja logo i zmiana kolorystyki

[← Powrót do spisu treści](./README.md)

---

## 1. Wprowadzenie

### Problem
Strona używała emoji 🧅 jako logo i kolorystyki amber/orange (`from-amber-600 to-orange-500`), co nie pasowało do profesjonalnego nowego logo marki CebulaZysku.

### Cel
- Wstawić prawdziwe logo (plik PNG) w nawigację i stopkę
- Zmienić kolorystykę całej strony z amber/orange na emerald/green — zgodnie z kolorami logo
- Sprawdzić poprawność pisowni na całej stronie

---

## 2. Pliki logo

Logo dostarczono w trzech wariantach (każdy w formatach JPG, PNG, SVG):

| Wariant | Plik | Użycie |
|---------|------|--------|
| **1** — Pionowy (tekst pod cebulą) | `logo cebula zysku/*/1.*` | Nie używany na stronie |
| **2** — Ikona (sama cebula) | `logo cebula zysku/*/2.*` → `public/logo-icon.png` | Navbar (36×36px), Footer (28×28px) |
| **3** — Poziomy (tekst obok cebuli) | `logo cebula zysku/*/3.*` → `public/logo-wide.png` | Dostępny, do przyszłego użycia |

### Kolory z logo
- **Dark Green:** `#1B5E20` (odpowiada Tailwind `emerald-800`/`emerald-900`)
- **Light Green:** `#7CB342` (odpowiada Tailwind `green-500`/`green-600`)

Gradient użyty na stronie: `from-emerald-700 to-green-500`

---

## 3. Co zostało zmienione

### Navbar (`src/components/Navbar.tsx`)
- Dodano `import Image from "next/image"`
- Zamieniono emoji `🧅` na `<Image src="/logo-icon.png" width={36} height={36} />`
- Gradient tekstu: `from-amber-600 to-orange-500` → `from-emerald-700 to-green-500`

### Footer (`src/components/Footer.tsx`)
- Dodano `import Image from "next/image"`
- Zamieniono emoji `🧅` na `<Image src="/logo-icon.png" width={28} height={28} />`
- Gradient tekstu: `from-amber-600 to-orange-500` → `from-emerald-700 to-green-500`

### Kolorystyka — zamiana `amber` → `emerald` w 15 plikach

| Plik | Elementy zmienione |
|------|--------------------|
| `src/app/page.tsx` | Hero gradient, badge, heading gradient, strong, stat icons, steps circles, social proof box, trust icons |
| `src/components/OfferCard.tsx` | Featured badge, reward amount, "Darmowe konto" badge |
| `src/components/ConditionTracker.tsx` | Complete border/bg, reward text, done badges, condition highlights, counter |
| `src/components/DisclaimerBanner.tsx` | Background, border, text colors |
| `src/components/OfferTrackingActions.tsx` | Reward amount |
| `src/app/dashboard/page.tsx` | Summary card icons, reward amounts |
| `src/app/oferta/[slug]/page.tsx` | "Darmowe konto" badge, reward, freeIf text, "Zalety" heading |
| `src/app/rejestracja/page.tsx` | Icon background, links |
| `src/app/logowanie/page.tsx` | Icon background, links |
| `src/app/jak-to-dziala/page.tsx` | Step icons, safety box |
| `src/app/o-nas/page.tsx` | Disclaimer box |
| `src/app/polityka-prywatnosci/page.tsx` | Notice box |
| `src/app/regulamin/page.tsx` | Notice box |
| `src/data/banks.ts` | `getDifficultyColor("easy")`: `bg-amber-100` → `bg-emerald-100` |

### Poprawki pisowni
| Lokalizacja | Błąd | Poprawka |
|-------------|------|---------|
| `src/app/page.tsx` linia 96 | "Jak obi**ę**ramy zysk?" | "Jak obi**e**ramy zysk?" |

Przegląd pisowni obejmował wszystkie strony: page.tsx, o-nas, jak-to-dziala, kontakt, regulamin, polityka-prywatnosci, rejestracja, logowanie, dashboard, oferta/[slug], Footer, Navbar, blog. Nie znaleziono innych błędów ortograficznych.

---

## 4. Decyzje techniczne

| Decyzja | Uzasadnienie |
|---------|-------------|
| PNG zamiast SVG dla logo | Next.js `<Image>` z optymalizacją działa najlepiej z rastrami. SVG dostępne w repozytorium na przyszłość. |
| `emerald` zamiast custom CSS variables | Tailwind `emerald-*` scale jest najbliższy kolorom z logo i nie wymaga konfiguracji. |
| Zachowanie emoji 🧅 w treści | Emoji cebuli w nagłówkach i badge'ach to element brandingu (slang cebulowy), nie logo — zostawione celowo. |
| `rounded-lg` na logo | Subtelne zaokrąglenie pasuje do stylu kart i przycisków na stronie. |

---

## 5. Troubleshooting

Brak problemów w trakcie realizacji. Build przeszedł bez błędów za pierwszym razem.

---

## 6. Status

✅ **Ukończone** — 7 marca 2026

- Logo wstawione do Navbara i Footera
- Kolorystyka zmieniona z amber/orange na emerald/green (15 plików)
- Pisownia sprawdzona na całej stronie (1 poprawka)
- Commit: `feat: nowe logo, kolorystyka emerald/green, poprawka pisowni`
