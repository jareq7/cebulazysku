// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-29
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BankOffer } from "@/data/banks";
import { getDifficultyLabel, getDifficultyColor } from "@/data/banks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  Clock,
  Wallet,
  Target,
  Zap,
} from "lucide-react";

interface CalculatorExtendedProps {
  offers: BankOffer[];
}

function matchesIncome(offer: BankOffer, monthlyAmount: number): boolean {
  const incomeCondition = offer.conditions.find((c) => c.type === "income");
  if (!incomeCondition) return true;
  const match = incomeCondition.label.match(/(\d[\d\s]*)/);
  if (!match) return true;
  const required = parseInt(match[1].replace(/\s/g, ""), 10);
  return monthlyAmount >= required;
}

function matchesDifficulty(
  offer: BankOffer,
  maxDifficulty: "easy" | "medium" | "hard"
): boolean {
  const levels = { easy: 1, medium: 2, hard: 3 };
  return levels[offer.difficulty] <= levels[maxDifficulty];
}

const formatPLN = (n: number) =>
  n.toLocaleString("pl-PL", { maximumFractionDigits: 0 });

const incomeSteps = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000, 15000];

export function CalculatorExtended({ offers }: CalculatorExtendedProps) {
  const [income, setIncome] = useState(3000);
  const [accountsPerMonth, setAccountsPerMonth] = useState(1);
  const [months, setMonths] = useState(6);
  const [maxDifficulty, setMaxDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [hasTracked, setHasTracked] = useState(false);

  const incomeIndex = incomeSteps.indexOf(income) !== -1 ? incomeSteps.indexOf(income) : 5;

  const matchingOffers = useMemo(() => {
    return offers
      .filter((o) => matchesIncome(o, income) && matchesDifficulty(o, maxDifficulty))
      .sort((a, b) => b.reward - a.reward);
  }, [offers, income, maxDifficulty]);

  // Calculate projected earnings over time
  const projected = useMemo(() => {
    const totalAccounts = accountsPerMonth * months;
    const usableOffers = matchingOffers.slice(0, totalAccounts);
    const totalEarnings = usableOffers.reduce((sum, o) => sum + o.reward, 0);
    const avgReward = matchingOffers.length > 0
      ? matchingOffers.reduce((sum, o) => sum + o.reward, 0) / matchingOffers.length
      : 0;
    // If user wants more accounts than available offers, extrapolate
    const extraAccounts = Math.max(0, totalAccounts - matchingOffers.length);
    const extraEarnings = extraAccounts * avgReward;
    return {
      totalAccounts,
      usableCount: usableOffers.length,
      fromOffers: totalEarnings,
      extrapolated: Math.round(extraEarnings),
      total: Math.round(totalEarnings + extraEarnings),
      perMonth: Math.round((totalEarnings + extraEarnings) / months),
    };
  }, [matchingOffers, accountsPerMonth, months]);

  const handleInteraction = () => {
    if (!hasTracked) {
      trackEvent("calculator_interaction", { source: "calculator_page" });
      setHasTracked(true);
    }
  };

  const handleCalculate = () => {
    trackEvent("calculator_result", {
      income,
      accounts_per_month: accountsPerMonth,
      months,
      max_difficulty: maxDifficulty,
      matching_offers: matchingOffers.length,
      projected_total: projected.total,
    });
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Income slider */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-emerald-600" />
              Miesięczne wpływy na konto
            </label>
            <input
              type="range"
              min={0}
              max={incomeSteps.length - 1}
              value={incomeIndex}
              onChange={(e) => {
                setIncome(incomeSteps[parseInt(e.target.value)]);
                handleInteraction();
              }}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              aria-label="Miesięczne wpływy"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>500 zł</span>
              <span className="font-semibold text-base text-emerald-600">
                {formatPLN(income)} zł
              </span>
              <span>15 000 zł</span>
            </div>
          </div>

          {/* Accounts per month */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              Ile kont otwierasz miesięcznie?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <Button
                  key={n}
                  variant={accountsPerMonth === n ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setAccountsPerMonth(n); handleInteraction(); }}
                  className="flex-1"
                >
                  {n} {n === 1 ? "konto" : n < 5 ? "konta" : "kont"}
                </Button>
              ))}
            </div>
          </div>

          {/* Time horizon */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              Jak długo planujesz?
            </label>
            <div className="flex gap-2">
              {[3, 6, 12].map((m) => (
                <Button
                  key={m}
                  variant={months === m ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setMonths(m); handleInteraction(); }}
                  className="flex-1"
                >
                  {m} {m === 3 ? "miesiące" : "miesięcy"}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              Maksymalny poziom trudności
            </label>
            <div className="flex gap-2">
              {([
                { key: "easy", label: "Łatwe", desc: "Minimum warunków" },
                { key: "medium", label: "Średnie", desc: "Standard" },
                { key: "hard", label: "Trudne", desc: "Wszystkie" },
              ] as const).map(({ key, label, desc }) => (
                <Button
                  key={key}
                  variant={maxDifficulty === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setMaxDifficulty(key); handleInteraction(); }}
                  className="flex-1 flex-col h-auto py-2"
                >
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-[10px] opacity-70">{desc}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <Card className="border-emerald-200 dark:border-emerald-800 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20 p-6 sm:p-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                W ciągu {months} {months === 3 ? "miesięcy" : "miesięcy"} możesz zarobić
              </p>
              <p className="text-5xl sm:text-6xl font-extrabold text-emerald-600 mb-2">
                {formatPLN(projected.total)} zł
              </p>
              <p className="text-sm text-muted-foreground">
                otwierając {projected.totalAccounts} {projected.totalAccounts === 1 ? "konto" : projected.totalAccounts < 5 ? "konta" : "kont"} ({formatPLN(projected.perMonth)} zł/miesiąc)
              </p>
            </div>

            {/* Stats breakdown */}
            <div className="grid grid-cols-3 divide-x">
              <div className="p-4 text-center">
                <p className="text-xl font-bold text-emerald-600">{matchingOffers.length}</p>
                <p className="text-xs text-muted-foreground">pasujących ofert</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-xl font-bold text-emerald-600">{projected.totalAccounts}</p>
                <p className="text-xs text-muted-foreground">kont do otwarcia</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-xl font-bold text-emerald-600">{formatPLN(projected.perMonth)} zł</p>
                <p className="text-xs text-muted-foreground">średnio/miesiąc</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        * Kwoty orientacyjne na podstawie aktualnych promocji ({projected.usableCount} ofert).{projected.extrapolated > 0 ? " Uwzględnia ekstrapolację na podstawie średniej premii." : ""}{" "}
        Rzeczywiste zarobki zależą od spełnienia warunków.
      </p>

      {/* Matching offers list */}
      {matchingOffers.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Oferty pasujące do Twoich parametrów ({matchingOffers.length})
          </h2>
          <div className="space-y-2">
            {matchingOffers.map((offer, i) => (
              <Link
                key={offer.id}
                href={`/oferta/${offer.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
              >
                <span className="text-xs text-muted-foreground w-6 text-right shrink-0">
                  #{i + 1}
                </span>
                {offer.bankLogo && offer.bankLogo.startsWith("http") ? (
                  <Image
                    src={offer.bankLogo}
                    alt={offer.bankName}
                    className="h-8 w-8 rounded-lg object-contain bg-white p-0.5 shrink-0"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-xs shrink-0"
                    style={{ backgroundColor: offer.bankColor }}
                  >
                    {offer.bankName.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{offer.bankName}</p>
                  <p className="text-xs text-muted-foreground truncate">{offer.offerName}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={`${getDifficultyColor(offer.difficulty)} text-xs`}>
                    {getDifficultyLabel(offer.difficulty)}
                  </Badge>
                  <span className="text-sm font-bold text-emerald-600">
                    {offer.reward} zł
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {matchingOffers.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-2xl">
          <Calculator className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
          <p className="text-muted-foreground text-sm mb-2">
            Brak ofert pasujących do podanych parametrów.
          </p>
          <p className="text-xs text-muted-foreground">
            Spróbuj zwiększyć wpływy lub podnieść poziom trudności.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="text-center pt-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/ranking">
              Zobacz ranking ofert
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <Link href="/jak-to-dziala">
              Jak to działa?
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
