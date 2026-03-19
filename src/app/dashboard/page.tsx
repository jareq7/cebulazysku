"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTracker } from "@/context/TrackerContext";
import { useUserBanks } from "@/context/UserBanksContext";
import { useOffers } from "@/hooks/useOffers";
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
  Landmark,
  X,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { ConditionTracker } from "@/components/ConditionTracker";
import { Skeleton } from "@/components/ui/skeleton";
import { StreakBadge } from "@/components/StreakBadge";
import { AchievementsList } from "@/components/AchievementsList";
import { PushNotificationToggle } from "@/components/PushNotificationToggle";
import { useAchievementChecker } from "@/hooks/useAchievementChecker";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { trackedOffers, totalEarned } = useTracker();
  const { offers: bankOffers } = useOffers();
  const { userBanks, removeBank } = useUserBanks();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-check and award achievements
  useAchievementChecker();

  // Load referral code
  useEffect(() => {
    if (!user) return;
    fetch("/api/referral")
      .then((r) => r.json())
      .then((d) => { if (d.code) setReferralCode(d.code); })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/logowanie");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6 space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
            </CardContent></Card>
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
            </CardContent></Card>
          ))}
        </div>
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
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">
            Cześć, {user.name}! 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Śledź postępy swoich promocji bankowych
          </p>
        </div>
        <PushNotificationToggle />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potencjalna premia</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {totalPotential} zł
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
                <span className="text-lg">🧅</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Obrane premie</p>
                <p className="text-2xl font-bold text-amber-600">
                  {totalEarned > 0 ? `${totalEarned} zł` : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streak */}
      <StreakBadge />

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
                        {offer.bankLogo && offer.bankLogo.startsWith("http") ? (
                          <img
                            src={offer.bankLogo}
                            alt={`${offer.bankName} logo`}
                            className="h-10 w-10 rounded-xl object-contain bg-white p-1 shrink-0"
                          />
                        ) : (
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold shrink-0"
                            style={{ backgroundColor: offer.bankColor }}
                          >
                            {offer.bankName.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{offer.bankName}</p>
                          <p className="font-semibold text-sm truncate">{offer.offerName}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-extrabold text-emerald-600 mb-2">{offer.reward} zł</p>
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

      {/* My banks */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Landmark className="h-4 w-4" />
                Moje banki
              </CardTitle>
              <Link href="/onboarding">
                <Button variant="outline" size="sm">
                  Edytuj
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {userBanks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nie masz zapisanych banków.{" "}
                <Link href="/onboarding" className="text-emerald-600 underline">
                  Dodaj teraz
                </Link>{" "}
                aby ukryć oferty, w których już jesteś klientem.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userBanks.map((bank) => (
                  <div
                    key={bank}
                    className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-sm"
                  >
                    <Landmark className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{bank}</span>
                    <button
                      onClick={() => removeBank(bank)}
                      className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Usuń ${bank}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Referral */}
      {referralCode && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Share2 className="h-4 w-4" />
                Zaproś znajomych
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Podziel się linkiem — gdy znajomy założy konto przez Twoje zaproszenie, oboje zdobędziecie odznakę <strong>Ambasadora</strong>.
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={`${typeof window !== "undefined" ? window.location.origin : "https://cebulazysku.pl"}/zaproszenie/${referralCode}`}
                  className="flex-1 rounded-lg border bg-muted px-3 py-1.5 text-sm font-mono text-muted-foreground"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 gap-1.5"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/zaproszenie/${referralCode}`
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Skopiowano!" : "Kopiuj"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Achievements */}
      <div className="mt-8">
        <AchievementsList />
      </div>
    </div>
  );
}
