# 33. Rozszerzona gamifikacja — Faza 6

[← Powrót do spisu treści](./README.md)

---

## Co zostało dodane

Faza 6 rozszerza bazową gamifikację (streaki + odznaki z fazy 0k) o trzy nowe mechanizmy.

---

## 1. Konfetti (canvas-confetti)

### Kiedy odpala się konfetti

| Zdarzenie | Wariant |
|-----------|---------|
| Wszystkie warunki oferty spełnione | `"complete"` — zielone konfetti z góry ekranu |
| Premia potwierdzona („Premia wpłynęła") | `"payout"` — złoto-zielone strumienie z obu stron |

### Implementacja

Hook `src/hooks/useConfetti.ts` — dynamiczny import `canvas-confetti` (nie blokuje SSR), dwa warianty animacji.

W `ConditionTracker.tsx`:
- `useRef` śledzi poprzednią wartość `isComplete`
- Konfetti odpala się tylko gdy `false → true` (nie przy każdym renderze)
- Konfetti wypłaty odpala się po kliknięciu „Potwierdź" w formularzu kwoty

---

## 2. Status wypłaty premii

### Nowe kolumny w `tracked_offers`

**Migracja:** `supabase/migrations/016_payout_tracking.sql`

```sql
ALTER TABLE tracked_offers
  ADD COLUMN completed_at timestamptz DEFAULT NULL,
  ADD COLUMN payout_received_at timestamptz DEFAULT NULL,
  ADD COLUMN payout_amount integer DEFAULT NULL;
```

### UX flow

```
Warunki spełnione (isComplete = true)
    ↓
Przycisk "Premia wpłynęła na konto! 🎉" (amber)
    ↓
Input z kwotą (domyślnie offer.reward)
    ↓
[Potwierdź] → zapisuje payout_received_at + payout_amount
    ↓
Konfetti payout + banner "Obrana! 🧅 +300 zł"
```

### Dashboard — karta "Obrane premie"

Trzecia karta w summary (zamiast "Dostępnych ofert") pokazuje łączną kwotę z `totalEarned` (suma `payout_amount` ze wszystkich śledzonych ofert gdzie `payoutReceivedAt !== null`).

### TrackerContext

Nowe pole w `TrackedOffer`: `completedAt`, `payoutReceivedAt`, `payoutAmount`.
Nowa metoda: `markPayoutReceived(offerId, amount)` — optimistic update + Supabase PATCH.
Nowe pole w kontekście: `totalEarned: number`.

---

## 3. Program poleceń

### Baza danych

**Migracja:** `supabase/migrations/017_referrals.sql`

```sql
CREATE TABLE user_referrals (
  id uuid PRIMARY KEY,
  referrer_id uuid REFERENCES auth.users(id),
  referred_id uuid REFERENCES auth.users(id),
  code text UNIQUE NOT NULL,
  registered_at timestamptz,
  first_offer_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

### Kod referralowy

Generowany z pierwszych 8 znaków UUID użytkownika (bez myślników, uppercase). Unikalny per user.

### Flow

1. User wchodzi w `/dashboard` → automatycznie pobierany/tworzony kod przez `GET /api/referral`
2. Link `cebulazysku.pl/zaproszenie/[CODE]` wyświetlany w sekcji „Zaproś znajomych"
3. Przycisk „Kopiuj" zapisuje link do schowka z animacją checkmark
4. Osoba zapraszana otwiera link → `sessionStorage.setItem("referral_code", code)` → redirect na `/rejestracja`
5. Po rejestracji → redirect na `/onboarding`
6. Na `/onboarding`: jeśli `referral_code` w sessionStorage → `POST /api/referral` z `{ code, newUserId: user.id }` → zapisuje `referred_id` i `registered_at`

### API `/api/referral`

- `GET` — zwraca kod zapraszającego (tworzy jeśli nie istnieje)
- `POST { code, newUserId }` — rejestruje zaproszenie; ochrona przed self-referral

### Strona zaproszenia

`/zaproszenie/[code]` — natychmiast zapisuje kod w sessionStorage i przekierowuje na `/rejestracja`. Nie wymaga zalogowania.

---

## Pliki

| Plik | Opis |
|------|------|
| `src/hooks/useConfetti.ts` | Hook z animacją konfetti (dynamic import) |
| `src/components/ConditionTracker.tsx` | Konfetti + przycisk „Premia wpłynęła" + banner |
| `src/context/TrackerContext.tsx` | `markPayoutReceived()`, `totalEarned`, nowe pola TrackedOffer |
| `supabase/migrations/016_payout_tracking.sql` | Kolumny payout na tracked_offers |
| `supabase/migrations/017_referrals.sql` | Tabela user_referrals |
| `src/app/api/referral/route.ts` | GET (mój kod) + POST (rejestracja zaproszenia) |
| `src/app/zaproszenie/[code]/page.tsx` | Landing page linku polecającego |
| `src/app/onboarding/page.tsx` | Przetwarza referral_code po rejestracji |
| `src/app/dashboard/page.tsx` | Karta „Obrane premie", sekcja „Zaproś znajomych" |

---

## Migracje do uruchomienia

```sql
-- 016_payout_tracking.sql
ALTER TABLE tracked_offers
  ADD COLUMN IF NOT EXISTS completed_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payout_received_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payout_amount integer DEFAULT NULL;

-- 017_referrals.sql
-- (pełna treść w pliku migracji)
```
