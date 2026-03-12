"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserBanks } from "@/context/UserBanksContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Check, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function fetchBankNames(): Promise<string[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/offers?select=bank_name&is_active=eq.true`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      }
    );
    if (!res.ok) return [];
    const data: { bank_name: string }[] = await res.json();
    const unique = Array.from(new Set(data.map((r) => r.bank_name))).sort();
    return unique;
  } catch {
    return [];
  }
}

export default function OnboardingPage() {
  const { user, isLoading } = useAuth();
  const { setBanks } = useUserBanks();
  const router = useRouter();
  const [banks, setBanksList] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/logowanie");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchBankNames().then((names) => {
      setBanksList(names);
      setLoadingBanks(false);
    });
  }, []);

  // Process referral code if user came via invite link
  useEffect(() => {
    if (!user) return;
    const refCode = sessionStorage.getItem("referral_code");
    if (!refCode) return;
    sessionStorage.removeItem("referral_code");
    fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: refCode, newUserId: user.id }),
    }).catch(() => {});
  }, [user]);

  const toggle = (bank: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(bank)) next.delete(bank);
      else next.add(bank);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await setBanks(Array.from(selected));
    router.push("/dashboard");
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
            <Landmark className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-2xl">W jakich bankach masz już konto?</CardTitle>
          <CardDescription>
            Zaznacz banki, w których jesteś już klientem — ukryjemy oferty, które nie są dla Ciebie dostępne.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loadingBanks ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {banks.map((bank) => {
                const isSelected = selected.has(bank);
                return (
                  <button
                    key={bank}
                    onClick={() => toggle(bank)}
                    className={cn(
                      "relative flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-left text-sm font-medium transition-all",
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-border bg-card hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                    )}
                  >
                    {isSelected && (
                      <span className="absolute right-2 top-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      </span>
                    )}
                    <Landmark className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{bank}</span>
                  </button>
                );
              })}
            </div>
          )}

          {selected.size > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Zaznaczono {selected.size} {selected.size === 1 ? "bank" : "banki/banków"}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1 gap-2"
              onClick={handleSave}
              disabled={saving || loadingBanks}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {selected.size > 0 ? "Zapisz i przejdź dalej" : "Przejdź dalej"}
            </Button>
            <Button variant="ghost" onClick={handleSkip} className="sm:w-auto">
              Pomiń
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
