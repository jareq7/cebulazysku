// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { BankOffer } from "@/data/banks";
import { getDifficultyLabel, getDifficultyColor } from "@/data/banks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface PremiumCalculatorProps {
  offers: BankOffer[];
}

function matchesIncome(offer: BankOffer, monthlyAmount: number): boolean {
  const incomeCondition = offer.conditions.find((c) => c.type === "income");
  if (!incomeCondition) return true;
  // Extract number from label (e.g., "Wpływ min. 1000 zł/mies.")
  const match = incomeCondition.label.match(/(\d[\d\s]*)/);
  if (!match) return true;
  const required = parseInt(match[1].replace(/\s/g, ""), 10);
  return monthlyAmount >= required;
}

export function PremiumCalculator({ offers }: PremiumCalculatorProps) {
  const [amount, setAmount] = useState(3000);
  const [hasTracked, setHasTracked] = useState(false);

  const matchingOffers = useMemo(() => {
    return offers
      .filter((o) => o.hasUserReward && matchesIncome(o, amount))
      .sort((a, b) => b.reward - a.reward);
  }, [offers, amount]);

  const totalPotential = matchingOffers.reduce((sum, o) => sum + o.reward, 0);

  const handleSliderChange = (value: number) => {
    setAmount(value);
    if (!hasTracked) {
      trackEvent("calculator_interaction", { initial_amount: value });
      setHasTracked(true);
    }
  };

  const handleCalculate = () => {
    trackEvent("calculator_result", {
      amount,
      matching_offers: matchingOffers.length,
      total_potential: totalPotential,
      offer_ids: matchingOffers.map((o) => o.slug),
    });
  };

  // Format number with spaces (Polish style)
  const formatPLN = (n: number) =>
    n.toLocaleString("pl-PL", { maximumFractionDigits: 0 });

  // Slider steps
  const steps = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000, 15000];
  const sliderIndex = steps.indexOf(amount) !== -1 ? steps.indexOf(amount) : 5;

  return (
    <Card className="border-emerald-200 dark:border-emerald-800 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-emerald-600" />
          Ile możesz zarobić na premiach?
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Slider */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Ile miesięcznie przelewasz na konto?
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min={0}
              max={steps.length - 1}
              value={sliderIndex}
              onChange={(e) => {
                const newAmount = steps[parseInt(e.target.value)];
                handleSliderChange(newAmount);
              }}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>500 zł</span>
              <span className="font-semibold text-base text-emerald-600">
                {formatPLN(amount)} zł
              </span>
              <span>15 000 zł</span>
            </div>
          </div>
        </div>

        {/* Result */}
        <div
          className="text-center py-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl cursor-pointer"
          onClick={handleCalculate}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
        >
          <p className="text-sm text-muted-foreground mb-1">
            Możesz zarobić nawet
          </p>
          <p className="text-4xl font-extrabold text-emerald-600">
            {formatPLN(totalPotential)} zł
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            z {matchingOffers.length} dostępn{matchingOffers.length === 1 ? "ej" : matchingOffers.length < 5 ? "ych" : "ych"} promocji
          </p>
        </div>

        {/* Matching offers */}
        {matchingOffers.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Pasujące oferty:
            </p>
            {matchingOffers.slice(0, 5).map((offer) => (
              <Link
                key={offer.id}
                href={`/oferta/${offer.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
              >
                {offer.bankLogo && offer.bankLogo.startsWith("http") ? (
                  <img
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
                  <p className="text-xs text-muted-foreground truncate">
                    {offer.offerName}
                  </p>
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
            {matchingOffers.length > 5 && (
              <p className="text-xs text-muted-foreground text-center">
                +{matchingOffers.length - 5} więcej ofert
              </p>
            )}
          </div>
        )}

        {matchingOffers.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Przy tym wpływie nie mamy pasujących ofert. Spróbuj zwiększyć kwotę!
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center pt-2">
          <Link href="/rejestracja">
            <Button className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Zacznij zarabiać — załóż konto
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
