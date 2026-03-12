# 31. Onboarding + Filtr „Moje Banki" (Faza 4)

[← Powrót do spisu treści](./README.md)

---

## Cel

Użytkownik oznacza banki, w których już ma konto → serwis personalizuje listę ofert, ukrywając te, które wymagają bycia nowym klientem danego banku.

---

## Baza danych

**Migracja:** `supabase/migrations/014_user_banks.sql`

```sql
CREATE TABLE user_banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, bank_name)
);
```

- RLS: każdy user widzi i zarządza tylko swoimi wpisami
- Kaskadowe usuwanie przy usunięciu konta

---

## UserBanksContext

**`src/context/UserBanksContext.tsx`**

Wzorowany na `TrackerContext`. Ładuje dane z Supabase przy logowaniu, aktualizuje optimistycznie.

```typescript
interface UserBanksContextType {
  userBanks: string[];          // lista nazw banków
  hasBank: (bankName: string) => boolean;
  addBank: (bankName: string) => Promise<void>;
  removeBank: (bankName: string) => Promise<void>;
  setBanks: (bankNames: string[]) => Promise<void>;  // bulk set (onboarding)
  isLoaded: boolean;
}
```

Dodany do `providers.tsx` jako `<UserBanksProvider>` opakowujący `<TrackerProvider>`.

---

## Ekran onboardingu

**`src/app/onboarding/page.tsx`**

Wyświetlany zaraz po rejestracji (redirect z `/rejestracja` zmieniony z `/dashboard` na `/onboarding`).

**Jak działa:**
1. Pobiera unikalne nazwy banków z aktywnych ofert (Supabase REST API, anon key)
2. Wyświetla grid przycisków z nazwami banków
3. Zaznaczone banki → kliknięcie toggleuje stan
4. „Zapisz i przejdź dalej" → `setBanks()` → redirect do `/dashboard`
5. „Pomiń" → redirect do `/dashboard` bez zapisu

Strona jest dostępna ponownie przez link „Edytuj" w dashboardzie.

---

## Filtr „Ukryj: moje banki"

**`src/components/OfferFilters.tsx`**

Badge filtra pojawia się automatycznie **tylko gdy użytkownik ma zapisane banki** (`userBanks.length > 0`). Niezalogowani użytkownicy nie widzą filtra.

```typescript
if (hideMyBanks && userBanks.length > 0) {
  result = result.filter((o) => !userBanks.includes(o.bankName));
}
```

---

## Badge „Masz konto" na kartach ofert

**`src/components/OfferCard.tsx`**

Szara wstążka w prawym górnym rogu karty oferty gdy `hasBank(offer.bankName) === true`.

```
┌─────────────────────────┐
│                [Masz konto]│
│ Pekao                   │
│ Konto Przekorzystne     │
│ 300 zł                  │
└─────────────────────────┘
```

Jeśli oferta jest jednocześnie `featured` i bank jest na liście — wyświetlany jest tylko badge „Masz konto" (priorytet).

---

## Sekcja „Moje banki" w dashboardzie

**`src/app/dashboard/page.tsx`**

Karta z listą zapisanych banków. Każdy bank ma przycisk X do usunięcia. Link „Edytuj" przenosi do `/onboarding`.

Gdy lista jest pusta — komunikat z linkiem do `/onboarding`.

---

## Pliki

| Plik | Opis |
|------|------|
| `supabase/migrations/014_user_banks.sql` | Tabela `user_banks` z RLS |
| `src/context/UserBanksContext.tsx` | Context + hook `useUserBanks()` |
| `src/app/onboarding/page.tsx` | Ekran wyboru banków po rejestracji |
| `src/app/rejestracja/page.tsx` | Redirect po rejestracji → `/onboarding` |
| `src/app/providers.tsx` | Dodano `<UserBanksProvider>` |
| `src/components/OfferFilters.tsx` | Filtr „Ukryj: moje banki" |
| `src/components/OfferCard.tsx` | Badge „Masz konto" |
| `src/app/dashboard/page.tsx` | Sekcja „Moje banki" z zarządzaniem |
