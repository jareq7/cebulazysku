"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTracker, TrackedOffer } from "@/context/TrackerContext";
import { useConfetti } from "@/hooks/useConfetti";
import {
  BankOffer,
  conditionTypeLabels,
  ConditionType,
} from "@/data/banks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  CheckCircle2,
  Circle,
  ExternalLink,
  Trash2,
  CreditCard,
  Smartphone,
  ArrowRightLeft,
  DollarSign,
  Repeat,
  FileCheck,
  LogIn,
  Globe,
  Wifi,
  PartyPopper,
  UserPlus,
  PiggyBank,
  ListChecks,
} from "lucide-react";

const conditionIcons: Record<ConditionType, React.ReactNode> = {
  transfer: <ArrowRightLeft className="h-4 w-4" />,
  card_payment: <CreditCard className="h-4 w-4" />,
  blik_payment: <Smartphone className="h-4 w-4" />,
  income: <DollarSign className="h-4 w-4" />,
  standing_order: <Repeat className="h-4 w-4" />,
  direct_debit: <FileCheck className="h-4 w-4" />,
  mobile_app_login: <LogIn className="h-4 w-4" />,
  online_payment: <Globe className="h-4 w-4" />,
  contactless_payment: <Wifi className="h-4 w-4" />,
  setup: <UserPlus className="h-4 w-4" />,
  savings: <PiggyBank className="h-4 w-4" />,
  other: <ListChecks className="h-4 w-4" />,
};

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const months = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function getMonthsRange(startDate: string, count: number): string[] {
  const start = new Date(startDate);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    result.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }
  return result;
}

interface ConditionTrackerProps {
  offer: BankOffer;
  tracked: TrackedOffer;
}

export function ConditionTracker({ offer, tracked }: ConditionTrackerProps) {
  const { incrementCondition, decrementCondition, getConditionCount, stopTracking, markPayoutReceived } =
    useTracker();
  const { fire: fireConfetti } = useConfetti();
  const [expanded, setExpanded] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [showPayoutInput, setShowPayoutInput] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<string>("");
  const prevCompleteRef = useRef<boolean | null>(null);

  const maxMonths = Math.max(...offer.conditions.map((c) => c.monthsRequired));
  const months = getMonthsRange(tracked.startedAt, maxMonths);

  // Calculate overall progress
  let totalRequired = 0;
  let totalDone = 0;

  offer.conditions.forEach((condition) => {
    const relevantMonths = condition.perMonth
      ? months.slice(0, condition.monthsRequired)
      : [months[0]];

    relevantMonths.forEach((month) => {
      totalRequired += condition.requiredCount;
      const done = getConditionCount(offer.id, condition.id, month);
      totalDone += Math.min(done, condition.requiredCount);
    });
  });

  const progressPercent = totalRequired > 0 ? Math.round((totalDone / totalRequired) * 100) : 0;
  const isComplete = progressPercent === 100;
  const payoutReceived = !!tracked.payoutReceivedAt;

  // Fire confetti when conditions are first completed in this session
  useEffect(() => {
    if (prevCompleteRef.current === null) {
      prevCompleteRef.current = isComplete;
      return;
    }
    if (isComplete && !prevCompleteRef.current) {
      fireConfetti("complete");
    }
    prevCompleteRef.current = isComplete;
  }, [isComplete, fireConfetti]);

  const handlePayoutConfirm = async () => {
    const amount = parseInt(payoutAmount) || offer.reward;
    await markPayoutReceived(offer.id, amount);
    fireConfetti("payout");
    setShowPayoutInput(false);
  };

  return (
    <Card className={`transition-all ${isComplete ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {offer.bankLogo && offer.bankLogo.startsWith("http") ? (
              <img
                src={offer.bankLogo}
                alt={`${offer.bankName} logo`}
                className="h-12 w-12 rounded-xl object-contain bg-white p-1.5 shrink-0"
                loading="lazy"
                width={48}
                height={48}
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: offer.bankColor }}
              >
                {offer.bankName.charAt(0)}
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{offer.offerName}</CardTitle>
              <p className="text-sm text-muted-foreground">{offer.bankName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-2xl font-bold text-emerald-600">
                {offer.reward} zł
              </p>
              <p className="text-xs text-muted-foreground">
                {isComplete ? "Warunki spełnione!" : `${progressPercent}% ukończone`}
              </p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label={expanded ? "Zwiń warunki" : "Rozwiń warunki"}
            >
              {expanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">Postęp</span>
            <span className="font-medium">
              {progressPercent}%
            </span>
          </div>
          <Progress
            value={progressPercent}
            className="h-2.5"
          />
        </div>

        {/* Mobile reward display */}
        <div className="sm:hidden mt-2 flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-600">
            {offer.reward} zł
          </span>
          {payoutReceived ? (
            <Badge className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
              🧅 Obrana!
            </Badge>
          ) : isComplete ? (
            <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Ukończone
            </Badge>
          ) : null}
        </div>

        {/* Payout status */}
        {payoutReceived ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-2.5">
            <span className="text-lg">🧅</span>
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Premia obrana! +{tracked.payoutAmount ?? offer.reward} zł
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {new Date(tracked.payoutReceivedAt!).toLocaleDateString("pl-PL")}
              </p>
            </div>
          </div>
        ) : isComplete && !showPayoutInput ? (
          <div className="mt-3">
            <Button
              size="sm"
              className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => setShowPayoutInput(true)}
            >
              <PartyPopper className="h-4 w-4" />
              Premia wpłynęła na konto!
            </Button>
          </div>
        ) : isComplete && showPayoutInput ? (
          <div className="mt-3 flex gap-2 items-center">
            <input
              type="number"
              className="flex-1 rounded-lg border px-3 py-1.5 text-sm bg-background"
              placeholder={`Kwota (domyślnie ${offer.reward} zł)`}
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePayoutConfirm()}
              autoFocus
            />
            <Button size="sm" onClick={handlePayoutConfirm} className="shrink-0">
              Potwierdź
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowPayoutInput(false)} className="shrink-0">
              Anuluj
            </Button>
          </div>
        ) : null}
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          <Separator />

          {/* Month selector */}
          {months.length > 1 && (
            <div>
              <p className="text-sm font-medium mb-2">Wybierz miesiąc:</p>
              <div className="flex flex-wrap gap-2">
                {months.map((month) => (
                  <Button
                    key={month}
                    variant={selectedMonth === month ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMonth(month)}
                    className="text-xs"
                  >
                    {getMonthLabel(month)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Conditions */}
          <div className="space-y-3">
            <p className="text-sm font-medium">
              Warunki za {getMonthLabel(selectedMonth)}:
            </p>

            {offer.conditions.map((condition) => {
              const monthIndex = months.indexOf(selectedMonth);
              const isRelevantMonth =
                !condition.perMonth
                  ? monthIndex === 0
                  : monthIndex < condition.monthsRequired;

              if (!isRelevantMonth) {
                return (
                  <div
                    key={condition.id}
                    className="rounded-lg border border-dashed p-4 opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">
                        {conditionIcons[condition.type]}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{condition.label}</p>
                        <p className="text-xs text-muted-foreground">
                          Nie dotyczy tego miesiąca
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              const count = getConditionCount(
                offer.id,
                condition.id,
                selectedMonth
              );
              const required = condition.requiredCount;
              const isDone = count >= required;

              return (
                <div
                  key={condition.id}
                  className={`rounded-lg border p-4 transition-all ${
                    isDone ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={
                          isDone ? "text-emerald-600" : "text-muted-foreground"
                        }
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          conditionIcons[condition.type]
                        )}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            isDone ? "text-emerald-700 dark:text-emerald-400" : ""
                          }`}
                        >
                          {condition.label}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {condition.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Zmniejsz ${condition.label}`}
                        onClick={() =>
                          decrementCondition(
                            offer.id,
                            condition.id,
                            selectedMonth
                          )
                        }
                        disabled={count === 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <div className="min-w-[4rem] text-center">
                        <span
                          className={`text-lg font-bold ${
                            isDone ? "text-emerald-600" : ""
                          }`}
                        >
                          {count}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          /{required}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Zwiększ ${condition.label}`}
                        onClick={() =>
                          incrementCondition(
                            offer.id,
                            condition.id,
                            selectedMonth
                          )
                        }
                        disabled={isDone}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Mini progress for this condition */}
                  <div className="mt-2">
                    <Progress
                      value={Math.min(100, (count / required) * 100)}
                      className="h-1.5"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={offer.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="w-full gap-2" size="sm">
                <ExternalLink className="h-4 w-4" />
                Otwórz stronę banku
              </Button>
            </a>
            <Link href={`/oferta/${offer.slug}`} className="flex-1">
              <Button variant="ghost" className="w-full gap-2" size="sm">
                Zobacz szczegóły oferty
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 gap-2"
              onClick={() => stopTracking(offer.id)}
            >
              <Trash2 className="h-4 w-4" />
              Usuń
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
