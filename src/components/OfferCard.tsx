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
} from "lucide-react";
import {
  BankOffer,
  getDifficultyLabel,
  getDifficultyColor,
  ConditionType,
} from "@/data/banks";

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
};

export function OfferCard({ offer }: { offer: BankOffer }) {
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(offer.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      {offer.featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
          Polecane
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: offer.bankColor }}
          >
            {offer.bankName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{offer.bankName}</p>
            <h3 className="font-semibold text-base leading-tight truncate">
              {offer.offerName}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-amber-600">
            {offer.reward}
          </span>
          <span className="text-lg font-semibold text-amber-600">zł</span>
          <span className="text-sm text-muted-foreground ml-1">premii</span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {offer.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={getDifficultyColor(offer.difficulty)}>
            {getDifficultyLabel(offer.difficulty)}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {daysLeft} dni
          </Badge>
          {offer.monthlyFee === 0 && (
            <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700">
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

      <CardFooter>
        <Link href={`/oferta/${offer.slug}`} className="w-full">
          <Button className="w-full group/btn gap-2" variant="default">
            Zobacz szczegóły
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
