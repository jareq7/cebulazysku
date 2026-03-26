// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
import type { BankOffer } from "@/data/banks";
import { getDifficultyLabel, getDifficultyColor } from "@/data/banks";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface ComparisonTableProps {
  offerA: BankOffer;
  offerB: BankOffer;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function ComparisonRow({
  label,
  valueA,
  valueB,
  highlightWinner,
}: {
  label: string;
  valueA: React.ReactNode;
  valueB: React.ReactNode;
  highlightWinner?: "a" | "b" | null;
}) {
  return (
    <tr className="border-b last:border-b-0">
      <td className="py-3 px-4 text-sm font-medium text-muted-foreground bg-muted/30 w-1/4">
        {label}
      </td>
      <td
        className={`py-3 px-4 text-sm w-[37.5%] ${
          highlightWinner === "a" ? "bg-emerald-50 dark:bg-emerald-900/10" : ""
        }`}
      >
        {valueA}
      </td>
      <td
        className={`py-3 px-4 text-sm w-[37.5%] ${
          highlightWinner === "b" ? "bg-emerald-50 dark:bg-emerald-900/10" : ""
        }`}
      >
        {valueB}
      </td>
    </tr>
  );
}

export function ComparisonTable({ offerA, offerB }: ComparisonTableProps) {
  const rewardWinner =
    offerA.reward > offerB.reward ? "a" : offerA.reward < offerB.reward ? "b" : null;

  const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
  const diffWinner =
    difficultyOrder[offerA.difficulty] < difficultyOrder[offerB.difficulty]
      ? "a"
      : difficultyOrder[offerA.difficulty] > difficultyOrder[offerB.difficulty]
      ? "b"
      : null;

  const conditionsWinner =
    offerA.conditions.length < offerB.conditions.length
      ? "a"
      : offerA.conditions.length > offerB.conditions.length
      ? "b"
      : null;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground w-1/4">
              Parametr
            </th>
            <th className="py-3 px-4 text-left w-[37.5%]">
              <div className="flex items-center gap-2">
                {offerA.bankLogo && offerA.bankLogo.startsWith("http") ? (
                  <img
                    src={offerA.bankLogo}
                    alt={offerA.bankName}
                    className="h-8 w-8 rounded-lg object-contain bg-white p-0.5"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-xs"
                    style={{ backgroundColor: offerA.bankColor }}
                  >
                    {offerA.bankName.charAt(0)}
                  </div>
                )}
                <span className="font-semibold text-sm">{offerA.bankName}</span>
              </div>
            </th>
            <th className="py-3 px-4 text-left w-[37.5%]">
              <div className="flex items-center gap-2">
                {offerB.bankLogo && offerB.bankLogo.startsWith("http") ? (
                  <img
                    src={offerB.bankLogo}
                    alt={offerB.bankName}
                    className="h-8 w-8 rounded-lg object-contain bg-white p-0.5"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-xs"
                    style={{ backgroundColor: offerB.bankColor }}
                  >
                    {offerB.bankName.charAt(0)}
                  </div>
                )}
                <span className="font-semibold text-sm">{offerB.bankName}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <ComparisonRow
            label="Oferta"
            valueA={<span className="font-medium">{offerA.offerName}</span>}
            valueB={<span className="font-medium">{offerB.offerName}</span>}
          />
          <ComparisonRow
            label="Premia"
            valueA={
              <span className="text-lg font-bold text-emerald-600">
                {offerA.reward} zł
              </span>
            }
            valueB={
              <span className="text-lg font-bold text-emerald-600">
                {offerB.reward} zł
              </span>
            }
            highlightWinner={rewardWinner}
          />
          <ComparisonRow
            label="Trudność"
            valueA={
              <Badge className={getDifficultyColor(offerA.difficulty)}>
                {getDifficultyLabel(offerA.difficulty)}
              </Badge>
            }
            valueB={
              <Badge className={getDifficultyColor(offerB.difficulty)}>
                {getDifficultyLabel(offerB.difficulty)}
              </Badge>
            }
            highlightWinner={diffWinner}
          />
          <ComparisonRow
            label="Liczba warunków"
            valueA={`${offerA.conditions.length} warunków`}
            valueB={`${offerB.conditions.length} warunków`}
            highlightWinner={conditionsWinner}
          />
          <ComparisonRow
            label="Deadline"
            valueA={formatDate(offerA.deadline)}
            valueB={formatDate(offerB.deadline)}
          />
          <ComparisonRow
            label="Opłata miesięczna"
            valueA={
              offerA.monthlyFee === 0 ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Darmowe
                </span>
              ) : (
                `${offerA.monthlyFee} zł/mies.`
              )
            }
            valueB={
              offerB.monthlyFee === 0 ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Darmowe
                </span>
              ) : (
                `${offerB.monthlyFee} zł/mies.`
              )
            }
          />
          <ComparisonRow
            label="Darmowe jeśli"
            valueA={offerA.freeIf || "Bezwarunkowo darmowe"}
            valueB={offerB.freeIf || "Bezwarunkowo darmowe"}
          />
          <ComparisonRow
            label="Zalety"
            valueA={
              <ul className="space-y-1">
                {offerA.pros.slice(0, 3).map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs">{p}</span>
                  </li>
                ))}
              </ul>
            }
            valueB={
              <ul className="space-y-1">
                {offerB.pros.slice(0, 3).map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs">{p}</span>
                  </li>
                ))}
              </ul>
            }
          />
          <ComparisonRow
            label="Wady"
            valueA={
              <ul className="space-y-1">
                {offerA.cons.slice(0, 3).map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-xs">{c}</span>
                  </li>
                ))}
              </ul>
            }
            valueB={
              <ul className="space-y-1">
                {offerB.cons.slice(0, 3).map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-xs">{c}</span>
                  </li>
                ))}
              </ul>
            }
          />
        </tbody>
      </table>
    </div>
  );
}
