"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTracker } from "@/context/TrackerContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Plus,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

interface OfferTrackingActionsProps {
  offerId: string;
  conditionIds: string[];
  affiliateUrl: string;
  reward: number;
  deadline: string;
}

export function OfferTrackingActions({
  offerId,
  conditionIds,
  affiliateUrl,
  reward,
  deadline,
}: OfferTrackingActionsProps) {
  const { user } = useAuth();
  const { isTracking, startTracking, stopTracking } = useTracker();

  const tracking = isTracking(offerId);

  const handleToggleTracking = () => {
    if (tracking) {
      stopTracking(offerId);
    } else {
      startTracking(offerId, conditionIds);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Do odebrania</p>
        <p className="text-5xl font-extrabold text-green-600">{reward} zł</p>
        <p className="text-xs text-muted-foreground mt-1">
          Termin: {new Date(deadline).toLocaleDateString("pl-PL")}
        </p>
      </div>

      <Separator />

      <a href={affiliateUrl} target="_blank" rel="noopener noreferrer">
        <Button className="w-full gap-2" size="lg">
          Otwórz konto
          <ExternalLink className="h-4 w-4" />
        </Button>
      </a>

      {user ? (
        <>
          <Button
            variant={tracking ? "destructive" : "outline"}
            className="w-full gap-2"
            onClick={handleToggleTracking}
          >
            {tracking ? (
              <>Przestań śledzić</>
            ) : (
              <>
                Dodaj do trackera
                <Plus className="h-4 w-4" />
              </>
            )}
          </Button>
          {tracking && (
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full gap-2" size="sm">
                <LayoutDashboard className="h-4 w-4" />
                Przejdź do dashboardu
              </Button>
            </Link>
          )}
        </>
      ) : (
        <Link href="/rejestracja">
          <Button variant="outline" className="w-full gap-2">
            Zaloguj się, aby śledzić
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Link afiliacyjny – klikając, wspierasz nasz serwis. Nie ponosisz żadnych
        dodatkowych kosztów.
      </p>
    </div>
  );
}
