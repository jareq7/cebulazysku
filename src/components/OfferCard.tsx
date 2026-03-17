"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clock,
  CreditCard,
  Smartphone,
  ArrowRightLeft,
  DollarSign,
  Repeat,
  FileCheck,
  LogIn,
  Globe,
  Wifi,
  UserPlus,
  PiggyBank,
  ListChecks,
} from "lucide-react";
import {
  BankOffer,
  getDifficultyLabel,
  getDifficultyColor,
  ConditionType,
} from "@/data/banks";
import { useUserBanks } from "@/context/UserBanksContext";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics-events";

const iconMap: Record<ConditionType, React.ReactNode> = {
  transfer: <ArrowRightLeft className="h-3.5 w-3.5" />,
  card_payment: <CreditCard className="h-3.5 w-3.5" />,
  blik_payment: <Smartphone className="h-3.5 w-3.5" />,
  income: <DollarSign className="h-3.5 w-3.5" />,
  standing_order: <Repeat className="h-3.5 w-3.5" />,
  direct_debit: <FileCheck className="h-3.5 w-3.5" />,
  mobile_app_login: <LogIn className="h-3.5 w-3.5" />,
  online_payment: <Globe className="h-3.5 w-3.5" />,
  contactless_payment: <Wifi className="h-3.5 w-3.5" />,
  setup: <UserPlus className="h-3.5 w-3.5" />,
  savings: <PiggyBank className="h-3.5 w-3.5" />,
  other: <ListChecks className="h-3.5 w-3.5" />,
};

export function OfferCard({ offer }: { offer: BankOffer }) {
  const { hasBank } = useUserBanks();
  const userHasBank = hasBank(offer.bankName);
  const dlMs = offer.deadline ? new Date(offer.deadline).getTime() : NaN;
  const daysLeft = !isNaN(dlMs)
    ? Math.max(0, Math.ceil((dlMs - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
      {offer.featured && !userHasBank && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-600 to-green-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
          Polecane
        </div>
      )}
      {userHasBank && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-slate-500 to-slate-400 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
          Masz konto
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {offer.bankLogo && offer.bankLogo.startsWith("http") ? (
            <img
              src={offer.bankLogo}
              alt={`${offer.bankName} logo`}
              className="h-12 w-12 rounded-xl object-contain bg-white p-1 shrink-0"
            />
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg shrink-0"
              style={{ backgroundColor: offer.bankColor }}
            >
              {offer.bankName.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{offer.bankName}</p>
            <h3 className="font-semibold text-base leading-tight line-clamp-2">
              {offer.offerName}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-emerald-600">
            {offer.reward}
          </span>
          <span className="text-lg font-semibold text-emerald-600">zł</span>
          <span className="text-sm text-muted-foreground ml-1">premii</span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {offer.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={getDifficultyColor(offer.difficulty)}>
            {getDifficultyLabel(offer.difficulty)}
          </Badge>
          {daysLeft !== null && (
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {daysLeft} dni
            </Badge>
          )}
          {offer.monthlyFee === 0 && (
            <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700">
              Darmowe konto
            </Badge>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Warunki:
          </p>
          {offer.conditions.slice(0, 3).map((c) => (
            <div key={c.id} className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{iconMap[c.type]}</span>
              <span className="truncate">{c.label}</span>
            </div>
          ))}
          {offer.conditions.length > 3 && (
            <p className="text-xs text-muted-foreground">
              +{offer.conditions.length - 3} więcej warunków
            </p>
          )}
        </div>
      </CardContent>

      {offer.lastUpdated && (
        <div className="px-6 pb-2">
          <p className="text-xs text-muted-foreground">
            Zaktualizowano: {new Date(offer.lastUpdated).toLocaleDateString("pl-PL")}
          </p>
        </div>
      )}

      <CardFooter className="mt-auto">
        <Link
          href={`/oferta/${offer.slug}`}
          className="w-full"
          onClick={() => {
            trackEvent(AnalyticsEvents.SELECT_ITEM, {
              item_id: offer.slug,
              item_name: offer.bankName,
              item_list_name: "offers",
              items: [{ item_id: offer.slug, item_name: offer.bankName, price: offer.reward, currency: "PLN" }],
            });
          }}
        >
          <Button className="w-full group/btn gap-2" variant="default">
            Zobacz szczegóły
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
