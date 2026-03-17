"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTracker } from "@/context/TrackerContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ExternalLink,
  Plus,
  ArrowRight,
  LayoutDashboard,
  CheckCircle2,
  X,
} from "lucide-react";

import { AffiliateLink } from "@/components/AffiliateLink";

interface OfferTrackingActionsProps {
  offerId: string;
  bankName: string;
  conditionIds: string[];
  affiliateUrl: string;
  reward: number;
  deadline: string;
}

export function OfferTrackingActions({
  offerId,
  bankName,
  conditionIds,
  affiliateUrl,
  reward,
  deadline,
}: OfferTrackingActionsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { isTracking, startTracking, stopTracking } = useTracker();
  const [justAdded, setJustAdded] = useState(false);

  const tracking = isTracking(offerId);

  const handleStartTracking = () => {
    startTracking(offerId, conditionIds);
    setJustAdded(true);
    toast.success("Oferta dodana do trackera!", {
      description: "Przejdź do dashboardu, aby śledzić postępy.",
      action: {
        label: "Dashboard →",
        onClick: () => router.push("/dashboard"),
      },
      duration: 6000,
    });
  };

  const handleStopTracking = () => {
    stopTracking(offerId);
    setJustAdded(false);
    toast("Oferta usunięta z trackera");
  };

  const deadlineMs = deadline ? new Date(deadline).getTime() : NaN;
  const daysLeft = !isNaN(deadlineMs)
    ? Math.max(0, Math.ceil((deadlineMs - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Do odebrania</p>
        <p className="text-5xl font-extrabold text-emerald-600">{reward} zł</p>
        {daysLeft !== null && (
          <p className="text-xs text-muted-foreground mt-1">
            Zostało {daysLeft} dni
          </p>
        )}
      </div>

      <Separator />

      {/* Step 1: Open bank account - always primary CTA */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Krok 1
        </p>
        <AffiliateLink
          href={affiliateUrl}
          offerId={offerId}
          bankName={bankName}
          reward={reward}
          sourcePage={`/oferta/${offerId}`}
        >
          <Button className="w-full gap-2 h-12 text-base font-bold shadow-md hover:shadow-lg transition-shadow" size="lg">
            Otwórz konto w banku
            <ExternalLink className="h-5 w-5" />
          </Button>
        </AffiliateLink>
      </div>

      {/* Step 2: Track - prominent when not tracking */}
      {user ? (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Krok 2
          </p>
          {tracking ? (
            <div className="space-y-2">
              {/* Success state after tracking */}
              <div className="rounded-lg border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-center">
                <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-600 mb-1" />
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Śledzisz tę ofertę
                </p>
              </div>
              <Link href="/dashboard">
                <Button className="w-full gap-2 h-11 font-semibold bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                  <LayoutDashboard className="h-4 w-4" />
                  Przejdź do dashboardu
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground hover:text-red-500 gap-1"
                onClick={handleStopTracking}
              >
                <X className="h-3 w-3" />
                Przestań śledzić
              </Button>
            </div>
          ) : (
            <Button
              className="w-full gap-2 h-auto py-3 font-semibold border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 whitespace-normal text-sm"
              variant="outline"
              size="lg"
              onClick={handleStartTracking}
            >
              <Plus className="h-5 w-5 shrink-0" />
              Śledź postępy w trackerze
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Krok 2
          </p>
          <Link href="/rejestracja">
            <Button
              className="w-full gap-2 h-auto py-3 font-semibold border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 whitespace-normal text-sm"
              variant="outline"
              size="lg"
            >
              Załóż konto i śledź postępy
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Button>
          </Link>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Link afiliacyjny – klikając, wspierasz nasz serwis. Nie ponosisz żadnych
        dodatkowych kosztów.
      </p>
    </div>
  );
}
