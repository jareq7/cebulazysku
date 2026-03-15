# 39. AI Verification Layer

> @author Claude Code (claude-opus-4-6) | 2026-03-15

## Opis

Warstwa weryfikacji AI, która sprawdza i koryguje output regex parsera warunków. Regex parser (`parse-leadstar-conditions.ts`) wyciąga warunki z HTML feedu, a AI (`verify-conditions-ai.ts`) je przegląda i poprawia.

## Jak działa

```
LeadStar HTML → regex parser → warunki (draft)
                                   ↓
                           AI verification
                                   ↓
                         warunki (zweryfikowane) → DB
```

1. Regex parser wyciąga warunki z `leadstar_benefits_html`
2. AI dostaje: sparsowane warunki + surowy tekst HTML
3. AI weryfikuje: `requiredCount`, `perMonth`, brakujące warunki, fałszywe warunki
4. Jeśli AI wykryje korekty → zwraca poprawione warunki + listę korekt
5. Wynik zapisywany do `ai_verification_logs` (graceful — nie blokuje synca)

## API

```typescript
verifyConditionsWithAI(
  parsedConditions: Condition[],
  rawBenefitsText: string,
  bankName: string,
  offerId?: string
): Promise<VerificationResult>

interface VerificationResult {
  conditions: Condition[];
  corrections: string[];
  verified: boolean;
}
```

## Integracja z sync

W `/api/sync-offers/route.ts`:
- Po regex parse, przed zapisem do DB
- Wywołuje `verifyConditionsWithAI()` z offerId
- Graceful: jeśli AI fail → używa surowego output parsera
- Loguje wynik do `ai_verification_logs` (async, nie blokuje)

## Pliki

| Plik | Rola |
|------|------|
| `src/lib/verify-conditions-ai.ts` | Logika weryfikacji + zapis logów |
| `src/app/api/sync-offers/route.ts` | Wywołanie po parsowaniu |
| `src/app/api/admin/ai-logs/route.ts` | API do przeglądania logów |
| `src/app/admin/ai-logs/page.tsx` | UI przeglądarka logów |
| `supabase/migrations/019_ai_verification_logs.sql` | Tabela logów |

## Tabela DB

```sql
ai_verification_logs (
  id uuid PK,
  offer_id text NOT NULL,
  bank_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  regex_conditions jsonb DEFAULT '[]',
  ai_conditions jsonb DEFAULT '[]',
  corrections text[] DEFAULT '{}',
  verified boolean DEFAULT false
)
```

Indeksy: `offer_id`, `created_at DESC`, partial na `corrections` (WHERE array_length > 0).
