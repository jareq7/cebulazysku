<!-- @author Gemini CLI (gemini-3-pro-preview) | 2026-03-14 — Research: Mobile App Stack -->

# Research: React Native Mobile App Stack dla CebulaZysku

Celem jest wybór optymalnego stacku technologicznego dla aplikacji mobilnej, która pozwoli użytkownikom na szybkie śledzenie postępów ("Quick Track") i odbieranie powiadomień push.

## 1. Expo vs Bare React Native

**Rekomendacja: Expo (Managed Workflow)**

*   **Dlaczego Expo:**
    *   Szybszy development i łatwiejsze aktualizacje (OTA updates przez Expo EAS).
    *   Doskonałe wsparcie dla powiadomień Push (Expo Notifications).
    *   Wsparcie dla biometrii (FaceID/Fingerprint) i bezpiecznego storage'u.
    *   Możliwość "development builds", które dają elastyczność Bare Workflow bez jego skomplikowania.
*   **Bare React Native:** Tylko jeśli będziemy potrzebować bardzo specyficznych bibliotek natywnych, których Expo nie obsługuje (mało prawdopodobne przy obecnych wymaganiach).

## 2. Współdzielenie typów i logiki (Monorepo)

Aby uniknąć duplikacji kodu (DRY), aplikacja mobilna powinna współdzielić typy z projektem Next.js.

*   **Podejście:** Wykorzystanie struktury Monorepo (np. **Turborepo** lub **pnpm workspaces**).
*   **Co współdzielimy:**
    *   Interfejsy TS (`Condition`, `Offer`, `User`).
    *   Logikę walidacji (Zod schemas).
    *   Logikę pomocniczą (np. obliczanie dat, formatowanie walut).
*   **Wyzwanie:** Konfiguracja `metro.config.js` w React Native, aby poprawnie resolwował pakiety z monorepo.

## 3. Supabase Auth w Mobile

Integracja Auth w mobilce różni się od webowej (brak ciasteczek sesyjnych).

*   **Biblioteka:** `@supabase/supabase-js`.
*   **Przechowywanie sesji:** `AsyncStorage` (z `react-native-async-storage/async-storage`) lub bardziej bezpieczny `expo-secure-store`.
*   **Flow:**
    1. Logowanie przez email/password lub OAuth (Google/Apple).
    2. Supabase zwraca Access Token i Refresh Token.
    3. Tokeny są zapisywane w `SecureStore`.
    4. Subskrypcja na `onAuthStateChange` aktualizuje stan aplikacji.
*   **Deep Linking:** Konfiguracja URL schemes (np. `cebulazysku://`) dla resetu hasła i logowania socjalnego.

## 4. Architektura danych i Stan

*   **Querying:** `TanStack Query` (React Query) — identycznie jak na webie. Pozwala na cache'owanie danych ofert i łatwe odświeżanie ("Pull to refresh").
*   **Offline Mode:** Wykorzystanie `persistQueryClient` dla podstawowego dostępu do ofert bez internetu.

## 5. Roadmapa Implementacji

1.  Inicjalizacja projektu Expo.
2.  Konfiguracja Supabase Client z bezpiecznym storage'em.
3.  Ekran logowania i dashboardu (klonowanie logiki z web).
4.  Implementacja powiadomień Push (EAS Build).
5.  "Quick Track" widget (iOS/Android) — opcjonalnie w fazie V2.

---

**Wniosek:** Expo to obecnie standard dla aplikacji tego typu. Pozwoli nam dowieźć MVP na iOS i Androida w ułamku czasu, jaki zająłby Bare Workflow.
