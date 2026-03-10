# AI Parser Kwot Premii (Gemini Flash)

## Opis funkcjonalności

Automatyczne wyciąganie kwot premii bankowych z opisów HTML feedu LeadStar przy użyciu Google Gemini Flash AI.

**Problem**: Feed XML LeadStar nie ma dedykowanego pola `reward` (kwota premii). Kwota jest ukryta w polach `description` (HTML) i `benefits` (HTML), pomieszana z innymi kwotami (limity wpływów, oprocentowanie, kwoty transakcji). Dotychczas kwoty trzeba było ustawiać ręcznie.

**Rozwiązanie**: Przy każdym sync (codziennym cron lub ręcznym z admina) Gemini Flash analizuje opisy HTML i wyciąga maksymalną kwotę premii pieniężnej.

---

## Architektura

### Pliki

| Plik | Rola |
|---|---|
| `src/lib/gemini.ts` | Klient Gemini API — wysyła prompt, parsuje odpowiedź |
| `src/lib/parse-reward.ts` | Prompt engineering — buduje zapytanie z opisem oferty, interpretuje wynik |
| `src/app/api/sync-offers/route.ts` | Główny sync (cron + manual) — wywołuje parser dla każdej oferty |
| `src/app/api/admin/trigger-sync/route.ts` | Admin trigger — wywołuje wspólny `runSync()` |
| `src/app/api/admin/test-reward-parser/route.ts` | Endpoint testowy — porównuje AI parse vs aktualne dane w DB |

### Przepływ danych

```
Vercel Cron (6:00 UTC) → GET /api/sync-offers
                              ↓
                     fetchLeadStarOffers() — pobiera XML
                              ↓
              dla każdej oferty (18 szt.):
                              ↓
              parseRewardFromDescription() — Gemini Flash
                ├── Buduje prompt z: program_name + description + benefits
                ├── Wysyła do Gemini API (temperature=0)
                └── Parsuje liczbę z odpowiedzi
                              ↓
              Porównuje z aktualnym reward w DB:
                ├── source="leadstar" → zawsze aktualizuje
                ├── source="hybrid" + reward=0 → aktualizuje
                └── source="hybrid" + reward>0 → NIE nadpisuje (ręczna edycja)
                              ↓
                     Zapisuje do Supabase
                              ↓
                     Loguje do sync_log
```

### Logika ochrony ręcznych edycji

Sync **nigdy nie nadpisuje** pól, które admin mógł ręcznie poprawić:

| Pole | source="leadstar" | source="hybrid" |
|---|---|---|
| `reward` | ✅ AI aktualizuje | ⚠️ Tylko jeśli current = 0 |
| `offer_name` | ✅ Z feedu | ❌ Zachowane |
| `bank_name` | ✅ Z feedu | ❌ Zachowane |
| `affiliate_url` | ✅ Z feedu | ✅ Z feedu |
| `description_html` | ✅ Z feedu | ✅ Z feedu |
| `difficulty`, `conditions` | ❌ Nie rusza | ❌ Nie rusza |

---

## Prompt AI

Parser używa precyzyjnego promptu w języku polskim, który:

1. **Szuka tylko premii pieniężnych** (gotówka, przelew, zwrot za zakupy)
2. **Ignoruje**: oprocentowanie, limity wpływów, kwoty wymaganych transakcji
3. **Sumuje części premii** (np. 200 + 500 + 200 = 900 zł)
4. **Nie liczy premii za polecenie** (referral bonuses)
5. **Odpowiada tylko liczbą** (łatwe parsowanie)

---

## Konfiguracja

### Zmienne środowiskowe

```env
# Google AI Studio — darmowy tier (15 req/min, 1M tokenów/dzień)
GEMINI_API_KEY=your_gemini_api_key_here

# Vercel Cron authorization
CRON_SECRET=your_random_secret_here
```

### Jak uzyskać klucz Gemini (za darmo)

1. Wejdź na https://aistudio.google.com/apikey
2. Zaloguj się kontem Google
3. Kliknij **"Create API Key"**
4. Skopiuj klucz
5. Dodaj do `.env.local` jako `GEMINI_API_KEY=...`
6. Dodaj w **Vercel Dashboard** → Settings → Environment Variables

### Koszty

**0 zł/miesiąc** na darmowym tierze Google AI Studio:
- 15 requestów/minutę (potrzebujemy 18/dzień)
- 1 000 000 tokenów/dzień (potrzebujemy ~50 000)
- Brak limitu czasowego na free tier

---

## Testowanie

### Endpoint testowy

```
GET /api/admin/test-reward-parser
```

Zwraca porównanie AI parse vs aktualne dane w DB dla wszystkich 18 ofert:

```json
{
  "total": 18,
  "matches": 16,
  "mismatches": 2,
  "results": [
    {
      "leadstar_id": "6198",
      "bank": "Bank BNP Paribas S.A.",
      "program": "Konto Osobiste w promocji Smak korzyści",
      "ai_parsed": 1000,
      "db_current": 1000,
      "match": "✅",
      "diff": 0
    }
  ]
}
```

### Ręczne uruchomienie sync

Z panelu admina: przycisk "Synchronizuj oferty" wywołuje `POST /api/admin/trigger-sync`.

Odpowiedź zawiera nowe pola:
- `rewards_updated` — ile kwot zostało zmienionych
- `reward_changes` — szczegóły zmian (stara → nowa kwota)
- `ai_parser` — "gemini-flash" lub "disabled" (brak klucza)

---

## Graceful degradation

Jeśli `GEMINI_API_KEY` nie jest ustawiony:
- Sync działa normalnie, ale **nie parsuje kwot**
- Response zawiera `"ai_parser": "disabled"`
- Kwoty trzeba ustawiać ręcznie w panelu admina

Jeśli Gemini API zwróci błąd:
- Błąd jest logowany w `errors[]`
- Kwota oferty nie jest zmieniana
- Sync kontynuuje z pozostałymi ofertami

---

## Znane ograniczenia

1. **AI nie jest 100% trafne** — przy skomplikowanych promocjach (np. "100 zł + 5% na koncie oszczędnościowym do 200 000 zł") może źle zinterpretować kwotę
2. **Nie parsuje warunków** — wyciąga tylko kwotę, nie warunki promocji (te trzeba ręcznie)
3. **Opóźnienie ~1-2s na ofertę** — 18 ofert ≈ 30s total sync time
4. **Free tier może się zmienić** — Google może zmienić limity darmowego API
