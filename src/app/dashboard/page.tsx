"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTracker } from "@/context/TrackerContext";
import { bankOffers } from "@/data/banks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  Wallet,
  Target,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { ConditionTracker } from "@/components/ConditionTracker";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { trackedOffers } = useTracker();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/logowanie");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const trackedOfferDetails = trackedOffers.map((tracked) => {
    const offer = bankOffers.find((o) => o.id === tracked.offerId);
    return { tracked, offer };
  }).filter((x) => x.offer !== undefined);

  const totalPotential = trackedOfferDetails.reduce(
    (sum, { offer }) => sum + (offer?.reward || 0),
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">
          Cześć, {user.name}! 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Śledź postępy swoich promocji bankowych
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potencjalna premia</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalPotential} zł
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Śledzone oferty</p>
                <p className="text-2xl font-bold">
                  {trackedOfferDetails.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dostępnych ofert</p>
                <p className="text-2xl font-bold">{bankOffers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tracked offers */}
      {trackedOfferDetails.length === 0 ? (
        <div className="space-y-8">
          <Card className="text-center py-16">
            <CardContent>
              <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">
                Nie śledzisz jeszcze żadnej oferty
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Przeglądaj dostępne promocje bankowe i dodaj je do trackera, aby
                śledzić postępy spełniania warunków.
              </p>
              <Link href="/#oferty">
                <Button className="gap-2">
                  Przeglądaj oferty
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-bold mb-4">Polecamy na start</h2>
            <p className="text-muted-foreground mb-6">Najłatwiejsze oferty – idealne na początek</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bankOffers
                .filter((o) => o.difficulty === "easy")
                .slice(0, 3)
                .map((offer) => (
                  <Card key={offer.id} className="flex flex-col justify-between">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold shrink-0"
                          style={{ backgroundColor: offer.bankColor }}
                        >
                          {offer.bankName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{offer.bankName}</p>
                          <p className="font-semibold text-sm truncate">{offer.offerName}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-extrabold text-green-600 mb-2">{offer.reward} zł</p>
                      <Badge variant="secondary" className="text-xs">Łatwy</Badge>
                    </CardContent>
                    <div className="px-6 pb-6">
                      <Link href={`/oferta/${offer.slug}`}>
                        <Button variant="outline" size="sm" className="w-full gap-1">
                          Zobacz szczegóły
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Twoje śledzone oferty</h2>
            <Link href="/#oferty">
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Dodaj ofertę
              </Button>
            </Link>
          </div>

          {trackedOfferDetails.map(({ tracked, offer }) => {
            if (!offer) return null;
            return (
              <ConditionTracker
                key={offer.id}
                offer={offer}
                tracked={tracked}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
