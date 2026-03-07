# 8. Aplikacje Mobilne (iOS + Android)

[← Powrót do spisu treści](./README.md) | [Roadmapa](./03-roadmap.md)

---

**Cel:** Umożliwienie użytkownikom śledzenia postępów i zaznaczania warunków **w czasie rzeczywistym** — np. zaraz po zakupach w sklepie, po otrzymaniu przelewu, po wykonaniu transakcji kartą.

---

## 8.1. Wybór technologii

| Opcja | Plusy | Minusy |
|-------|-------|--------|
| **React Native (Expo)** | Wspólny kod z webem (React), szybki development, OTA updates | Mniej natywne UX |
| **Flutter** | Szybkie UI, hot reload, jeden codebase | Inny język (Dart), brak code sharing z Next.js |
| **PWA (Progressive Web App)** | Najtańsze, zero app store, działa od razu | Ograniczone push notifications na iOS, brak app store |
| **Capacitor (Ionic)** | Opakowuje webową apkę w natywną, code sharing | Ograniczenia wydajności |

**Rekomendacja:** **React Native z Expo** — największy code sharing z istniejącym Next.js (React + TypeScript), bogaty ekosystem, Expo EAS do budowania i dystrybucji.

**Alternatywa na start:** **PWA** jako szybki MVP mobilny (bez app store), potem pełna apka React Native.

## 8.2. Kluczowe funkcje mobilne

- **Quick Track** — szybkie zaznaczanie warunków jednym tapnięciem
  - Widget „Dzisiejsze zadania" na ekranie głównym apki
  - Np. „Zrobiłeś zakupy kartą?" → tap → +1 transakcja
  - Np. „Wpłynął przelew?" → tap → warunek spełniony
- **Push notifications** — natywne powiadomienia
  - „Hej, pamiętaj o transakcji kartą w Santanderze! 🧅"
  - „Jutro mija termin na wpłatę w Aliorze!"
  - „Brawo! Nowa cebulka obrana — 300 zł! 🎉"
- **Offline mode** — zaznaczanie warunków bez internetu, sync po połączeniu
- **Dashboard mobilny** — streaki, odznaki, progress bary
- **Skaner potwierdzeń** (przyszłość) — zdjęcie potwierdzenia przelewu → OCR → auto-zaznaczenie warunku
- **Widgety** — iOS Widget / Android Widget z postępem aktualnych ofert

## 8.3. Architektura mobile ↔ backend

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Apka mobilna  │────▶│   Supabase API  │◀────│   Next.js    │
│  (React Native) │     │  (REST + Auth)  │     │   (web app)  │
└─────────────────┘     └─────────────────┘     └──────────────┘
        │                       │                       │
        │                       ▼                       │
        │               ┌──────────────┐                │
        └──────────────▶│  PostgreSQL   │◀──────────────┘
                        │  (Supabase)   │
                        └──────────────┘
```

- **Wspólny backend** — Supabase obsługuje zarówno web jak i mobile
- **Wspólne API** — ten sam REST/GraphQL endpoint dla obu platform
- **Wspólna auth** — Supabase Auth z JWT, token refresh
- **Realtime sync** — Supabase Realtime Subscriptions
  - User zaznacza warunek na telefonie → natychmiast widoczne na webie
  - Admin zmienia ofertę → natychmiast widoczne w apce
- **Offline-first** — lokalna baza (WatermelonDB lub Supabase offline) → sync przy połączeniu

## 8.4. Struktura projektu mobilnego (osobne repo)

```
cebulazysku-mobile/
├── app/                     # Expo Router (file-based routing)
│   ├── (tabs)/
│   │   ├── index.tsx        # Dashboard z strekami i progress
│   │   ├── offers.tsx       # Lista ofert
│   │   ├── track.tsx        # Quick Track — szybkie zaznaczanie
│   │   └── profile.tsx      # Profil, odznaki, ustawienia
│   ├── offer/[id].tsx       # Szczegóły oferty
│   ├── login.tsx            # Logowanie
│   └── onboarding.tsx       # Onboarding "mam konto w..."
├── components/
│   ├── StreakCounter.tsx     # Licznik streaka z animacją
│   ├── QuickTrackCard.tsx   # Karta szybkiego zaznaczania
│   ├── AchievementBadge.tsx # Odznaka z animacją unlock
│   └── ProgressRing.tsx     # Kołowy progress bar
├── lib/
│   ├── supabase.ts          # Supabase client dla RN
│   ├── notifications.ts     # Expo Notifications setup
│   └── offline.ts           # Offline sync logic
├── assets/                  # Ikony, splash screen, lottie animations
├── app.json                 # Expo config
└── package.json
```

## 8.5. Plan wdrożenia mobilnego

1. **MVP (PWA)** — natychmiastowy dostęp mobilny
   - Service Worker + manifest.json
   - „Dodaj do ekranu głównego" prompt
   - Responsywny dashboard z Quick Track
   - Ograniczone push notifications (Web Push API)

2. **React Native v1** — pełna apka
   - Expo SDK + Expo Router
   - Supabase Auth (email + biometrics)
   - Quick Track z native haptics
   - Push notifications (Expo Notifications)
   - Offline mode podstawowy

3. **React Native v2** — zaawansowane
   - iOS/Android widgety (Expo Widget)
   - Animacje Lottie na achievementy
   - Deep linking (web → apka)
   - App Store + Google Play publikacja
   - OCR skanera potwierdzeń (przyszłość)

## 8.6. Wymagania do publikacji

- Apple Developer Account (99$/rok)
- Google Play Developer Account (25$ jednorazowo)
- Expo EAS (darmowy tier na start, 30 buildów/miesiąc)
- Ikona apki, splash screen, screenshots do store
- Polityka prywatności dostosowana do wymogów App Store i Google Play
