# 19. Admin Panel (/admin)

[← Powrót do spisu treści](./README.md)

---

## 1. Wprowadzenie

### Cel
Panel administracyjny umożliwiający właścicielowi serwisu zarządzanie ofertami, przeglądanie logów sync XML, odczytywanie wiadomości kontaktowych i monitorowanie statystyk — bez ingerencji w kod.

### Dostęp
- URL: `/admin`
- Zabezpieczenie: hasło z env var `ADMIN_PASSWORD`
- Sesja: `sessionStorage` (trwa do zamknięcia zakładki)

---

## 2. Architektura

```
/admin               → Layout z sidebar + auth gate
/admin/page.tsx      → Dashboard (statystyki)
/admin/oferty        → Lista ofert z wyszukiwarką
/admin/sync          → Logi sync XML + przycisk manual sync
/admin/wiadomosci    → Wiadomości kontaktowe z oznaczaniem
```

### API Routes:
| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/api/admin/auth` | POST | Weryfikacja hasła admina |
| `/api/admin/stats` | GET | Statystyki dashboard |
| `/api/admin/offers` | GET | Lista ofert |
| `/api/admin/sync-logs` | GET | Logi synchronizacji |
| `/api/admin/trigger-sync` | POST | Ręczne uruchomienie sync |
| `/api/admin/messages` | GET | Wiadomości kontaktowe |
| `/api/admin/messages` | PATCH | Oznaczanie przeczytanych |

---

## 3. Sekcje panelu

### 3.1 Dashboard
- Łączna liczba ofert
- Aktywne oferty
- Nieprzeczytane wiadomości
- Szczegóły ostatniego sync (znalezione, utworzone, zaktualizowane, dezaktywowane, czas, błędy)

### 3.2 Oferty
- Lista wszystkich ofert z wyszukiwarką (bank, nazwa, slug)
- Status: aktywna/nieaktywna (ikona)
- Źródło: leadstar/manual/hybrid
- LeadStar ID
- Link do affiliate URL
- Data aktualizacji

### 3.3 Sync logi
- Historia synchronizacji (ostatnie 50)
- Badges kolorystyczne: nowe (zielone), zaktualizowane (niebieskie), dezaktywowane (pomarańczowe)
- Przycisk "Uruchom sync" — manual trigger

### 3.4 Wiadomości
- Lista wiadomości kontaktowych
- Nowe wiadomości wyróżnione (border + tło)
- Oznaczanie jako przeczytane/nieprzeczytane
- Data, nadawca, email, treść

---

## 4. Zabezpieczenia

| Warstwa | Mechanizm |
|---------|-----------|
| Autentykacja | `ADMIN_PASSWORD` env var, weryfikacja server-side |
| Sesja | `sessionStorage` — nie persystuje po zamknięciu zakładki |
| API admin | Używa `createAdminClient()` (service_role key) — server-side only |
| Dane wrażliwe | Service role key nigdy nie trafia do klienta |

### Przyszłe ulepszenia:
- Supabase Auth z rolą `admin` (RLS-based)
- Middleware sprawdzający token w każdym request do `/api/admin/*`
- Audit log zmian

---

## 5. Konfiguracja

### Wymagane env vars:
```env
ADMIN_PASSWORD=twoje-bezpieczne-haslo
```

Dodaj w Vercel → Settings → Environment Variables.

---

## 6. Pliki źródłowe

```
src/app/admin/
├── layout.tsx              # Auth gate + sidebar navigation
├── page.tsx                # Dashboard ze statystykami
├── oferty/page.tsx         # Lista ofert
├── sync/page.tsx           # Logi sync + manual trigger
└── wiadomosci/page.tsx     # Wiadomości kontaktowe

src/app/api/admin/
├── auth/route.ts           # POST — weryfikacja hasła
├── stats/route.ts          # GET — statystyki dashboard
├── offers/route.ts         # GET — lista ofert
├── sync-logs/route.ts      # GET — historia sync
├── trigger-sync/route.ts   # POST — ręczny sync
└── messages/route.ts       # GET + PATCH — wiadomości
```

---

## 7. Status

✅ **MVP ukończone** — 7 marca 2026

- Dashboard ze statystykami
- Lista ofert z wyszukiwarką
- Logi sync z manual trigger
- Wiadomości kontaktowe z oznaczaniem
- Auth gate z hasłem
- Build przechodzi bez błędów
- **Akcja wymagana**: dodać `ADMIN_PASSWORD` w Vercel env vars
