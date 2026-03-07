# 23. Push Notyfikacje

[← Powrót do spisu treści](./README.md)

---

## 1. Wprowadzenie

### Cel
Umożliwić wysyłanie push notyfikacji do użytkowników — powiadomienia o nowych ofertach, przypomnienia o warunkach, milestone'y streaka itp.

---

## 2. Architektura

```
Użytkownik (Dashboard)
  ├── PushNotificationToggle → subscribe/unsubscribe
  └── Service Worker (sw.js) → push event → showNotification

Admin (/admin/push)
  └── POST /api/admin/push/send → web-push library → Push Service → SW
```

### Komponenty:
- **Frontend**: `PushNotificationToggle` — przycisk włącz/wyłącz na dashboard
- **Service Worker**: obsługa zdarzeń `push` i `notificationclick`
- **Backend Subscribe**: `/api/push/subscribe` — zapis/usuwanie subskrypcji
- **Backend Send**: `/api/admin/push/send` — masowe wysyłanie z admin panelu
- **Supabase**: tabela `push_subscriptions` przechowuje endpointy

---

## 3. Tabela SQL

### Plik: `supabase/migrations/006_push_subscriptions.sql`

```sql
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT UNIQUE NOT NULL,
  keys_p256dh TEXT NOT NULL,
  keys_auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- RLS: user widzi/dodaje/usuwa swoje, service_role full access
```

---

## 4. Konfiguracja VAPID

Push notyfikacje wymagają kluczy VAPID (Voluntary Application Server Identification).

### Generowanie kluczy:
```bash
npx web-push generate-vapid-keys
```

### Env vars (Vercel):
| Zmienna | Opis |
|---------|------|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Klucz publiczny (do frontend) |
| `VAPID_PRIVATE_KEY` | Klucz prywatny (tylko backend) |
| `VAPID_EMAIL` | Email kontaktowy (opcjonalny) |

---

## 5. API Endpoints

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/api/push/subscribe` | POST | Zapisz subskrypcję push |
| `/api/push/subscribe` | DELETE | Usuń subskrypcję push |
| `/api/admin/push/send` | POST | Wyślij push do wszystkich |

### Payload wysyłania:
```json
{
  "title": "Nowa oferta!",
  "body": "mBank oferuje 300 zł premii",
  "url": "/oferta/mbank-konto-1"
}
```

### Response:
```json
{
  "sent": 42,
  "failed": 2,
  "total": 44,
  "cleaned": 1
}
```

Wygasłe subskrypcje (410/404) są automatycznie czyszczone.

---

## 6. Service Worker

### Zdarzenia push w `public/sw.js`:
- **`push`** — parsuje JSON payload, pokazuje notyfikację systemową
- **`notificationclick`** — otwiera URL z payloadu, focusuje istniejącą kartę lub otwiera nową

---

## 7. Pliki źródłowe

```
src/components/PushNotificationToggle.tsx    # Przycisk włącz/wyłącz
src/app/api/push/subscribe/route.ts          # Subscribe/unsubscribe API
src/app/api/admin/push/send/route.ts         # Admin: wyślij do wszystkich
src/app/admin/push/page.tsx                  # Admin: formularz wysyłania
public/sw.js                                 # Push + notification handlers
supabase/migrations/006_push_subscriptions.sql
```

---

## 8. Status

✅ **Ukończone** — 7 marca 2026

- Subscribe/unsubscribe z dashboard
- Masowe wysyłanie z admin panelu
- Service worker: push + click handlers
- Auto-cleanup wygasłych subskrypcji
- Build przechodzi bez błędów
- **Akcje wymagane**:
  1. `npx web-push generate-vapid-keys` → dodać klucze do Vercel env vars
  2. Uruchomić SQL z `006_push_subscriptions.sql` w Supabase Dashboard
