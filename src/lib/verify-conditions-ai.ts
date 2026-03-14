// @author Claude Code (claude-opus-4-6) | 2026-03-14

import type { Condition, ConditionType } from "@/data/banks";
import { askAI } from "@/lib/ai-client";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * AI verification layer for parsed conditions.
 * Takes regex-parsed conditions + raw feed text and asks AI to verify/correct them.
 *
 * Flow: parse-leadstar-conditions.ts (regex) → verify-conditions-ai.ts (AI check) → DB
 *
 * AI does NOT generate conditions from scratch — it only reviews and corrects the parser output.
 */

const VALID_TYPES: ConditionType[] = [
  "transfer", "card_payment", "blik_payment", "income", "standing_order",
  "direct_debit", "mobile_app_login", "online_payment", "contactless_payment",
  "setup", "savings", "other",
];

interface VerifiedCondition {
  id: string;
  type: ConditionType;
  label: string;
  description: string;
  requiredCount: number;
  perMonth: boolean;
  monthsRequired: number;
}

interface VerificationResult {
  conditions: Condition[];
  corrections: string[];
  verified: boolean;
}

export async function verifyConditionsWithAI(
  parsedConditions: Condition[],
  rawBenefitsText: string,
  bankName: string,
  offerId?: string,
): Promise<VerificationResult> {
  if (parsedConditions.length === 0) {
    return { conditions: [], corrections: [], verified: true };
  }

  const prompt = `Jesteś ekspertem od promocji bankowych w Polsce. Twoim zadaniem jest ZWERYFIKOWANIE i POPRAWIENIE listy warunków promocji, które zostały wyekstrahowane przez parser regex z opisu oferty bankowej.

SUROWY TEKST Z FEEDU (${bankName}):
"""
${rawBenefitsText.slice(0, 3000)}
"""

WARUNKI WYEKSTRAHOWANE PRZEZ PARSER:
${JSON.stringify(parsedConditions, null, 2)}

ZADANIE: Sprawdź każdy warunek i popraw błędy. Zwróć uwagę na:

1. **requiredCount** — czy liczba się zgadza z tekstem? Np. "wykonać 5 transakcji" → requiredCount: 5, NIE 1
2. **perMonth vs jednorazowo** — czy warunek jest miesięczny czy jednorazowy? "w ciągu 10 dni" to jednorazowo. "w każdym miesiącu" to miesięcznie.
3. **monthsRequired** — ile miesięcy trzeba spełniać warunek? Domyślnie 1 jeśli jednorazowo.
4. **type** — czy typ warunku jest poprawny? Dozwolone: ${VALID_TYPES.join(", ")}
5. **label** — czy czytelnie opisuje warunek? Jeśli requiredCount > 1, label powinien zawierać liczbę.
6. **brakujące warunki** — czy parser pominął jakiś ważny warunek trackable z tekstu?
7. **fałszywe warunki** — czy parser dodał coś co nie jest warunkiem (np. opis, intro, podsumowanie)?

WAŻNE:
- NIE wymyślaj warunków których nie ma w tekście
- Poprawiaj TYLKO to co jest błędne
- Jeśli wszystko jest OK, zwróć te same warunki bez zmian
- description max 200 znaków

Odpowiedz WYŁĄCZNIE poprawnym JSON (bez markdown, bez komentarzy):

{
  "conditions": [
    {
      "id": "ls_cond_1",
      "type": "card_payment",
      "label": "5x płatność kartą",
      "description": "wykonać 5 transakcji kartą w ciągu 10 dni od otwarcia konta",
      "requiredCount": 5,
      "perMonth": false,
      "monthsRequired": 1
    }
  ],
  "corrections": ["Poprawiono requiredCount z 1 na 5 dla warunku płatności kartą", "Dodano brakujący warunek wpływu na konto"]
}

Jeśli nie ma żadnych poprawek, corrections powinno być pustą tablicą [].`;

  try {
    const raw = await askAI(prompt, 2000);

    // Extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("[AI-verify] Could not extract JSON from response");
      return { conditions: parsedConditions, corrections: [], verified: false };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed.conditions)) {
      console.warn("[AI-verify] Invalid response structure");
      return { conditions: parsedConditions, corrections: [], verified: false };
    }

    // Validate and sanitize AI output
    const verified: Condition[] = parsed.conditions
      .slice(0, 10)
      .map((c: VerifiedCondition, i: number): Condition | null => {
        if (!c.type || !c.label || !c.description) return null;

        return {
          id: `ls_cond_${i + 1}`,
          type: VALID_TYPES.includes(c.type) ? c.type : "other",
          label: String(c.label).slice(0, 80),
          description: String(c.description).slice(0, 200),
          requiredCount: Math.max(1, Math.min(100, Number(c.requiredCount) || 1)),
          perMonth: Boolean(c.perMonth),
          monthsRequired: Math.max(1, Math.min(24, Number(c.monthsRequired) || 1)),
        };
      })
      .filter((c: Condition | null): c is Condition => c !== null);

    const corrections = Array.isArray(parsed.corrections)
      ? parsed.corrections.map(String)
      : [];

    if (corrections.length > 0) {
      console.log(`[AI-verify] ${bankName}: ${corrections.length} correction(s): ${corrections.join("; ")}`);
    }

    const result: VerificationResult = {
      conditions: verified.length > 0 ? verified : parsedConditions,
      corrections,
      verified: true,
    };

    // Log to DB (graceful — don't block sync on log failure)
    await saveVerificationLog(offerId, bankName, parsedConditions, result);

    return result;
  } catch (err) {
    console.error(`[AI-verify] Failed for ${bankName}:`, err instanceof Error ? err.message : String(err));

    const failResult: VerificationResult = { conditions: parsedConditions, corrections: [], verified: false };
    await saveVerificationLog(offerId, bankName, parsedConditions, failResult);

    return failResult;
  }
}

async function saveVerificationLog(
  offerId: string | undefined,
  bankName: string,
  regexConditions: Condition[],
  result: VerificationResult,
): Promise<void> {
  if (!offerId) return;
  try {
    const supabase = createAdminClient();
    await supabase.from("ai_verification_logs").insert({
      offer_id: offerId,
      bank_name: bankName,
      regex_conditions: regexConditions,
      ai_conditions: result.conditions,
      corrections: result.corrections,
      verified: result.verified,
    });
  } catch (err) {
    console.warn("[AI-verify] Failed to save log:", err instanceof Error ? err.message : String(err));
  }
}
