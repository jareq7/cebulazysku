# 15. Automatyczny sync ofert z LeadStar XML

[← Powrót do spisu treści](./README.md)

---

## 1. Wprowadzenie

### Problem
Oferty w Supabase muszą być aktualne — linki afiliacyjne, opisy i dostępność zmieniają się w feedzie LeadStar XML. Dotychczas sync wymagał ręcznego wywołania `curl POST /api/sync-offers`.

### Cel
Automatyczne uruchamianie synchronizacji raz dziennie przez Vercel Cron Jobs, bez ingerencji człowieka.

---

## 2. Jak to działa

```
Vercel Cron (0 6 * * * = codziennie o 6:00 UTC)
    │
    ▼
GET /api/sync-offers  (Authorization: Bearer CRON_SECRET)
    │
    ├── Fetch XML z LeadStar
    ├── Dla każdej oferty: INSERT lub UPDATE w Supabase
    ├── Soft delete: oferty nieobecne w XML → is_active = false
    └── Zapis logu do tabeli sync_log
```

### Harmonogram
- **Vercel Hobby**: max 1 cron/dzień → `0 6 * * *` (codziennie o 6:00 UTC = 7:00 CET / 8:00 CEST)
- **Vercel Pro**: można zwiększyć do `0 */6 * * *` (co 6 godzin)

---

## 3. Architektura

### Endpoint: `/api/sync-offers`

| Metoda | Wywołanie | Autoryzacja |
|--------|-----------|-------------|
| **GET** | Vercel Cron Jobs | `Authorization: Bearer CRON_SECRET` |
| **POST** | Ręczne (curl) | `Authorization: Bearer SYNC_SECRET` |

Obie metody wywołują tę samą funkcję `runSync()`.

### Funkcja `runSync()`

1. **Fetch XML** — pobiera oferty z LeadStar (`fetchLeadStarOffers()`)
2. **Upsert** — dla każdej oferty sprawdza czy istnieje po `leadstar_id`:
   - Istnieje → `UPDATE` (aktualizuje dane LeadStar, NIE nadpisuje ręcznych pól: `conditions`, `faq`, `pros`, `cons`)
   - Nie istnieje → `INSERT` nowa oferta
3. **Soft delete** — porównuje aktywne oferty w DB z feedem:
   - Oferty z `source = "leadstar"` lub `"hybrid"` nieobecne w XML → `is_active = false`
   - Oferty `source = "manual"` nie są dotykane
4. **Log** — zapisuje wynik do tabeli `sync_log`

### Chronione pola (NIE nadpisywane przez sync)

| Pole | Powód |
|------|-------|
| `conditions` | Ręcznie dodane warunki |
| `faq` | Ręcznie dodane FAQ |
| `pros` / `cons` | Ręcznie dodane zalety/wady |
| `difficulty` | Ręczna ocena trudności |
| `reward` | Ręcznie ustawiona kwota premii |
| `bank_color` | Ręcznie ustawiony kolor |
| `monthly_fee` / `free_if` | Ręcznie dodane info o opłatach |

---

## 4. Konfiguracja

### `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/sync-offers",
      "schedule": "0 6 * * *"
    }
  ]
}
```

### Env vars (Vercel Dashboard)

| Zmienna | Wartość | Opis |
|---------|---------|------|
| `CRON_SECRET` | (automatycznie ustawiana przez Vercel) | Weryfikacja wywołania crona |
| `SYNC_SECRET` | `<YOUR_SYNC_SECRET>` | Ręczne wywołanie sync |
| `SUPABASE_SERVICE_ROLE_KEY` | (z Supabase Dashboard) | Zapis do DB (bypasses RLS) |

---

## 5. Tabela `sync_log`

| Kolumna | Typ | Opis |
|---------|-----|------|
| `id` | uuid | PK |
| `offers_found` | int | Ile ofert w feedzie XML |
| `offers_created` | int | Ile nowych ofert dodano |
| `offers_updated` | int | Ile istniejących zaktualizowano |
| `offers_deactivated` | int | Ile dezaktywowano (soft delete) |
| `errors` | jsonb | Lista błędów (pusta jeśli OK) |
| `duration_ms` | int | Czas wykonania w ms |
| `created_at` | timestamptz | Kiedy sync się odbył |

---

## 6. Pliki źródłowe

| Plik | Opis |
|------|------|
| `vercel.json` | Konfiguracja Vercel Cron Jobs |
| `src/app/api/sync-offers/route.ts` | GET + POST handler z `runSync()` |
| `src/lib/leadstar.ts` | Parser XML, generator slug/id |
| `src/lib/supabase/admin.ts` | Service role client |

---

## 7. Troubleshooting

### Problem: Vercel Cron wywołuje GET, nie POST
- **Przyczyna**: Dokumentacja Vercel jednoznacznie mówi że cron jobs wywołują GET
- **Rozwiązanie**: Wyodrębniono wspólną logikę do `runSync()` i dodano GET handler obok istniejącego POST. Oba weryfikują autoryzację i wywołują tę samą funkcję.

### Problem: Soft delete dotykał oferty hybrid
- **Przyczyna**: Pierwotna logika sprawdzała tylko `source = "leadstar"`, ale oferty wzbogacone ręcznie mają `source = "hybrid"` i też mają `leadstar_id`
- **Rozwiązanie**: Zmieniono filtr na `.in("source", ["leadstar", "hybrid"])` żeby soft delete obejmował też oferty hybrid nieobecne w feedzie

---

## 8. Ręczny test

```bash
# Test via POST (ręczne wywołanie)
curl -X POST https://cebulazysku.pl/api/sync-offers \
  -H "Authorization: Bearer <YOUR_SYNC_SECRET>"

# Test via GET (symulacja crona)
curl https://cebulazysku.pl/api/sync-offers \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## 9. Status

✅ **Ukończone** — 7 marca 2026

- `vercel.json` z cron schedule (raz dziennie o 6:00 UTC)
- GET + POST handlers z autoryzacją (CRON_SECRET + SYNC_SECRET)
- Soft delete ofert nieobecnych w feedzie
- Logi sync w tabeli `sync_log`
- Build przechodzi bez błędów
