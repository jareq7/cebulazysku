import type { Condition, ConditionType } from "@/data/banks";

/**
 * Parses Leadstar benefits HTML into structured conditions for the tracker.
 * Pure text parsing — no AI needed. Extracts trackable actions from the HTML.
 */

const VALID_TYPES: ConditionType[] = [
  "transfer", "card_payment", "blik_payment", "income", "standing_order",
  "direct_debit", "mobile_app_login", "online_payment", "contactless_payment",
  "setup", "savings", "other",
];

interface ParsedAction {
  label: string;
  description: string;
  type: ConditionType;
  requiredCount: number;
  perMonth: boolean;
  monthsRequired: number;
}

function stripHtml(html: string): string {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&[a-zA-Z]+;/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|li|ul|ol|h[1-6])[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function detectType(text: string): ConditionType {
  const t = text.toLowerCase();

  // Karta + BLIK razem → card_payment (częstszy warunek, sprawdzaj PRZED samym BLIK)
  if (/\bkart[ąa].*\bblik|\bblik.*\bkart[ąa]/.test(t)) return "card_payment";

  // Karta — PRZED contactless (bo "płatności kartą ... telefon" to karta, nie telefon)
  if (/p[łl]atno[śs].*kart|transakcj.*kart|kart.*transakcj|zap[łl]a[ćc].*kart|kart.*debetow|transakcj.*bezgot[óo]wkow|zrobieni.*transakcj.*kart/.test(t)) return "card_payment";

  // Płatność telefonem / portfel cyfrowy / zbliżeniowo — PRZED BLIK
  // (bo "płatności telefonem (np. BLIK)" to contactless, nie BLIK)
  if (/p[łl]atno[śs].*telefon|portfel.*cyfrow|apple pay|google pay|samsung pay/.test(t)) return "contactless_payment";
  if (/p[łl]atno[śs].*zbli[żz]eniow|zbli[żz]eniow/.test(t)) return "contactless_payment";
  if (/p[łl]atno[śs].*mobiln/.test(t)) return "contactless_payment";

  // Przelew BLIK (np. na numer telefonu)
  if (/przelew.*blik|blik.*przelew/.test(t)) return "blik_payment";

  // BLIK (samodzielny)
  if (/\bblik/i.test(t)) return "blik_payment";

  // Przelew (ale nie wpływ)
  if (/przelew/.test(t) && !/wp[łl]yw/.test(t)) return "transfer";

  // Wpływ / wpłata / wynagrodzenie (gotówkowe wykluczenia to opis warunku, nie negacja)
  if (/wp[łl]yw.*min|wp[łl]yw.*z[łl]|zapewni[ćc].*wp[łl]yw|jednorazow.*wp[łl]yw|wynagrodzeni/.test(t)) return "income";

  // Zlecenie stałe
  if (/zleceni.*sta[łl]/.test(t)) return "standing_order";

  // Polecenie zapłaty
  if (/poleceni.*zap[łl]aty/.test(t)) return "direct_debit";

  // Logowanie
  if (/zalogowa|zaloguj|logowani.*aplik/.test(t)) return "mobile_app_login";

  // Oszczędności / saldo / lokata
  if (/lokata|oszcz[ęe]dno[śs]ciow|saldo.*min|moje cele|skarbonk/.test(t)) return "savings";

  // Otwarcie konta / założenie
  if (/otworzy[ćc].*kont|za[łl]o[żz]eni.*kont|otwarci.*kont|otw[óo]rz.*kont/.test(t)) return "setup";
  if (/za[łl]o[żz]y[ćc].*firm|zarejestrow.*firm/.test(t)) return "setup";
  if (/z[łl]o[żz]y[ćc].*wniosek/.test(t)) return "setup";

  // Płatność online
  if (/p[łl]atno[śs][ćc].*online|zakup.*online|allegro/.test(t)) return "online_payment";

  return "other";
}

function extractCount(text: string): number {
  const t = text.toLowerCase();

  // "min. 5 transakcji", "minimum 5 płatności", "co najmniej 5"
  const minMatch = t.match(/(?:min(?:imum|\.)?|co najmniej)\s*(\d+)\s*(?:transakcj|p[łl]atno[śs]|przelew|p[łl]atno[śs]ci)/);
  if (minMatch) return parseInt(minMatch[1]);

  // "5 transakcji", "10 płatności"
  const countMatch = t.match(/(\d+)\s*(?:transakcj|p[łl]atno[śs]ci|przelew[óo]w|p[łl]atno[śs])/);
  if (countMatch) return parseInt(countMatch[1]);

  // "wykonać 5 płatności"
  const doMatch = t.match(/wykona[ćc]\s*(?:min(?:imum|\.)?\.?\s*)?(\d+)/);
  if (doMatch) return parseInt(doMatch[1]);

  return 1;
}

function extractMonths(text: string): { perMonth: boolean; monthsRequired: number } {
  const t = text.toLowerCase();

  // "w każdym z 5 kolejnych miesięcy", "w każdym z trzech kolejnych miesięcy"
  const wordToNum: Record<string, number> = {
    "dwóch": 2, "dwoch": 2, "trzech": 3, "czterech": 4, "pięciu": 5, "pieciu": 5,
    "sześciu": 6, "szesciu": 6,
  };

  const monthMatch = t.match(/(?:ka[żz]d(?:ym|ego).*?|przez\s+)(\d+|dwóch|dwoch|trzech|czterech|pięciu|pieciu|sześciu|szesciu)\s*(?:kolejnych\s*)?(?:pe[łl]nych\s*)?miesi[ęe]c/);
  if (monthMatch) {
    const val = monthMatch[1];
    const n = wordToNum[val] ?? parseInt(val);
    if (n > 0) return { perMonth: true, monthsRequired: n };
  }

  // "w każdym z kolejnych miesięcy" (bez konkretnej liczby)
  if (/w ka[żz]dym z kolejnych miesi[ęe]c/.test(t)) {
    return { perMonth: true, monthsRequired: 3 }; // default 3 months if unspecified
  }

  // "miesięcznie", "co miesiąc", "w każdym miesiącu"
  if (/miesi[ęe]czni|co miesi[ąa]c|w ka[żz]dym miesi[ąa]cu|ka[żz]dego miesi[ąa]ca/.test(t)) {
    return { perMonth: true, monthsRequired: 3 }; // default 3 months if unspecified
  }

  return { perMonth: false, monthsRequired: 1 };
}

function makeLabel(type: ConditionType, description: string, count: number): string {
  const short = description.slice(0, 60);

  switch (type) {
    case "income": {
      // Szukaj kwoty wpływu, obsługując spacje i grosze (tylko po przecinku/kropce)
      const incMatch = description.match(/wp[łl]yw.*?(?:min\.?\s*)?(\d[\d\s,.]*)\s*z[łl]/i)
        || description.match(/min\.?\s*(\d[\d\s,.]*)\s*z[łl]/i);
      
      let amt = "";
      if (incMatch) {
        // Usuwamy tylko grosze po przecinku/kropce, np. 500,00 -> 500
        amt = incMatch[1].replace(/\s/g, "").replace(/[,.](00|--)$/, "");
        // Jeśli zostały jakieś przecinki/kropki wewnątrz (np. 1.500), czyścimy je
        amt = amt.replace(/[,.]/g, "");
      }
      
      return amt ? `Wpływ min. ${amt} zł` : "Wpływ na konto";
    }
    case "card_payment":
      return count > 1 ? `${count}x płatność kartą` : "Płatność kartą";
    case "blik_payment":
      return count > 1 ? `${count}x płatność BLIK` : "Płatność BLIK";
    case "contactless_payment":
      return count > 1 ? `${count}x płatność telefonem` : "Płatność telefonem";
    case "transfer":
      return count > 1 ? `${count}x przelew` : "Przelew wychodzący";
    case "standing_order":
      return "Zlecenie stałe";
    case "direct_debit":
      return "Polecenie zapłaty";
    case "mobile_app_login":
      return "Logowanie do aplikacji";
    case "setup":
      return short.toLowerCase().includes("otwórz") || short.toLowerCase().includes("założ") ? "Założenie konta" : short;
    case "savings": {
      const savMatch = description.match(/(\d[\d\s,.]*)\s*z[łl]/);
      const savAmt = savMatch ? savMatch[1].replace(/\s/g, "").replace(/[,.](00|--)$/, "").replace(/[,.]/g, "") : "";
      return savAmt ? `Saldo min. ${savAmt} zł` : "Oszczędności";
    }
    case "online_payment":
      return count > 1 ? `${count}x płatność online` : "Płatność online";
    default:
      return short.length > 50 ? short.slice(0, 47) + "..." : short;
  }
}

/**
 * Splits benefits text into individual actionable items.
 */
function splitIntoBlocks(text: string): string[] {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const blocks: string[] = [];
  let current = "";

  for (const line of lines) {
    // Top-level: "1)", "1.", "KROK 1"
    const isTopLevel = /^(?:\d+[.),]\s|KROK\s+\d)/i.test(line);
    // Named sub-level: "a.", "a)", "b.", "b)"
    const isNamedSub = /^[a-z][.)]\s/i.test(line);
    // Bullet: "-", "–", "•"
    const isBullet = /^[-–•*]\s/.test(line);

    if (isTopLevel || isNamedSub || isBullet) {
      if (current) blocks.push(current);
      current = line;
    } else {
      if (current) {
        current += " " + line;
      } else {
        current = line;
      }
    }
  }
  if (current) blocks.push(current);

  return blocks;
}


/**
 * Determines if a text block contains a trackable action (vs intro/summary text).
 */
function isTrackableAction(text: string): boolean {
  const t = text.toLowerCase();

  // Skip pure intro/summary lines (but allow "otwórz konto")
  if (/^jak (?:otrzyma[ćc]|zyska[ćc]|odebra[ćc])/.test(t)) return false;
  if (/^klient mo[żz]e/.test(t)) return false;
  if (/^premia (?:wyp[łl]acan|zostan)/.test(t)) return false;
  if (/^warunkiem otrzymania/.test(t)) return false;

  // Skip "utrzymać zgody" — not a trackable action
  if (/^utrzyma[ćc].*zgod/.test(t)) return false;

  // Must contain an action verb or specific condition keyword
  // Polish verbs: wykonaj, zapewnij, zapłać, zaloguj, otwórz, włóż, kup, pobierz, aktywuj
  return /wykona[ćc]|zapewni[ćc]|z[łl]o[żz]y[ćc]|otworzy[ćc]|za[łl]o[żz]y[ćc]|zalogowa[ćc]|zarejestrowa[ćc]|op[łl]aci[ćc]|ustawi[ćc]|zawrze[ćc]|przyst[ąa]pi[ćc]|transakcj|p[łl]atno[śs]|przelew|wp[łl]yw|wp[łl]at|logowani|saldo|lokata|portfel.*cyfrow|zrobieni|otw[óo]rz|zap[łl]a[ćc]|zaloguj|pobierz|aktywuj|kup/.test(t);
}


/**
 * Deduplicates conditions by merging similar ones.
 * If same type appears as both one-time and monthly, keep the monthly one.
 */
function dedup(actions: ParsedAction[]): ParsedAction[] {
  const seen = new Map<string, ParsedAction>();

  for (const a of actions) {
    // Key by type + requiredCount (allow different counts for same type)
    const key = `${a.type}-${a.requiredCount}`;

    if (seen.has(key)) {
      const existing = seen.get(key)!;
      // Prefer monthly over one-time, and more months over fewer
      if (
        (a.perMonth && !existing.perMonth) ||
        (a.monthsRequired > existing.monthsRequired) ||
        (!existing.perMonth && a.description.length > existing.description.length)
      ) {
        seen.set(key, a);
      }
    } else {
      seen.set(key, a);
    }
  }

  return Array.from(seen.values());
}

/**
 * Try to split a block into multiple actions if it contains several distinct trackable items.
 * E.g. "zapewnić wpływ 500 zł, - wykonać 5 transakcji kartą" → 2 separate actions.
 */
function splitMultiAction(block: string): string[] {
  // Split on bullet separators within merged text
  const parts = block.split(/\s+-\s+/).filter(p => p.trim().length > 10);
  if (parts.length > 1) return parts;
  // Split on comma + action verb
  const commaParts = block.split(/,\s*(?=(?:wykona[ćc]|zapewni[ćc]|z[łl]o[żz]y[ćc]|utrzyma[ćc]))/i);
  if (commaParts.length > 1) return commaParts;
  return [block];
}

/**
 * Annotate blocks with monthly context from their parent (top-level) block.
 * E.g. "2. W każdym z 5 kolejnych miesięcy:" sets context for sub-items a., b.
 */
interface AnnotatedBlock {
  text: string;
  parentMonths: { perMonth: boolean; monthsRequired: number };
}

function annotateBlocks(blocks: string[]): AnnotatedBlock[] {
  const result: AnnotatedBlock[] = [];
  let currentParentMonths = { perMonth: false, monthsRequired: 1 };

  for (const block of blocks) {
    const isTopLevel = /^\d+[.),]\s/.test(block) || /^KROK\s+\d/i.test(block);

    if (isTopLevel) {
      // Check if this top-level block sets monthly context
      const months = extractMonths(block);
      if (months.perMonth) {
        currentParentMonths = months;
      } else {
        currentParentMonths = { perMonth: false, monthsRequired: 1 };
      }
    }

    result.push({ text: block, parentMonths: { ...currentParentMonths } });
  }

  return result;
}

export function parseLeadstarConditions(benefitsHtml: string): Condition[] {
  if (!benefitsHtml || benefitsHtml.trim().length < 10) return [];

  const text = stripHtml(benefitsHtml);
  const blocks = splitIntoBlocks(text);
  const annotated = annotateBlocks(blocks);
  const actions: ParsedAction[] = [];

  for (const { text: block, parentMonths } of annotated) {
    if (!isTrackableAction(block)) continue;

    // Block's own monthly context (e.g. "c. ... w każdym z trzech kolejnych miesięcy ...")
    const blockMonths = extractMonths(block);
    // Effective context: block > parent > default
    const effectiveMonths = blockMonths.perMonth ? blockMonths : parentMonths;

    const subActions = splitMultiAction(block);
    for (const sub of subActions) {
      if (!isTrackableAction(sub) && subActions.length > 1) continue;

      const type = detectType(sub);
      const count = extractCount(sub);
      // Own month info > block/parent context > default
      const subMonths = extractMonths(sub);
      const perMonth = subMonths.perMonth || effectiveMonths.perMonth;
      const monthsRequired = subMonths.perMonth
        ? subMonths.monthsRequired
        : effectiveMonths.perMonth
          ? effectiveMonths.monthsRequired
          : 1;

      const description = sub
        .replace(/^\d+[.)]\s*/, "")
        .replace(/^KROK\s+\d+\s*:?\s*/i, "")
        .replace(/^[a-z][.)]\s*/i, "")
        .trim()
        .slice(0, 200);

      if (description.length < 10) continue;

      actions.push({
        label: makeLabel(type, description, count),
        description,
        type,
        requiredCount: count,
        perMonth,
        monthsRequired,
      });
    }
  }

  // Filter out vague "other" conditions that are just details of another condition
  const filtered = actions.filter(a => {
    if (a.type !== "other") return true;
    // Keep "other" only if it has a clear label (not a description fragment)
    return a.description.length > 30 && !/^w tym samym czasie|^tego samego dnia/.test(a.description.toLowerCase());
  });

  const deduped = dedup(filtered);

  // Limit to 10 conditions max, assign IDs
  return deduped.slice(0, 10).map((a, i): Condition => ({
    id: `ls_cond_${i + 1}`,
    type: VALID_TYPES.includes(a.type) ? a.type : "other",
    label: a.label,
    description: a.description,
    requiredCount: a.requiredCount,
    perMonth: a.perMonth,
    monthsRequired: a.monthsRequired,
  }));
}
