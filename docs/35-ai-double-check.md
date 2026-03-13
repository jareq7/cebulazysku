# 35. AI Double-Check — weryfikacja wygenerowanych opisów

> **Data:** 13 marca 2026 r.

## Mechanizm

Po wygenerowaniu opisu oferty przez Gemini, uruchamiany jest drugi prompt weryfikujący. Gemini sprawdza własny draft i poprawia ewentualne błędy.

## Co sprawdza weryfikacja

1. **Kwota premii** — czy `reward` zł pojawia się poprawnie wszędzie
2. **Kompletność warunków** — czy `conditions` są zgodne z danymi z feedu
3. **Wiarygodność** — czy `pros`/`cons` bazują na faktach, nie hallucynacjach
4. **Limit znaków** — czy `short_description` mieści się w 220 znakach

## Flow

```
Dane oferty → Gemini (generowanie) → draft JSON
                                        ↓
              Gemini (weryfikacja) ← draft + dane źródłowe
                                        ↓
                               poprawiony JSON → zapis do DB
```

Jeśli weryfikacja zawiedzie (błąd JSON, timeout), zapisywany jest oryginalny draft jako fallback.

## Wpływ na performance

- **2 wywołania Gemini** na ofertę zamiast 1
- `MAX_PER_RUN` zmniejszony z 3 do 1 (mieści się w 60s limitu Vercel)
- 3 crony nocne (01:15, 01:30, 01:45) = **3 oferty/noc** z double-checkiem

## Pliki

- `src/lib/generate-offer-content.ts` — funkcje `generateOfferContent()`, `verifyOfferContent()`, `sanitize()`
- `src/app/api/cron/generate-descriptions/route.ts` — `MAX_PER_RUN = 1`
