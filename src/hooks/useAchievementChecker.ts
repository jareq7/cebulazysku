"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTracker } from "@/context/TrackerContext";
import { useOffers } from "@/hooks/useOffers";
import { toast } from "sonner";
import { getAchievement } from "@/lib/achievements";

interface UnlockedAchievement {
  achievement_type: string;
  unlocked_at: string;
}

async function fetchUnlocked(): Promise<UnlockedAchievement[]> {
  try {
    const res = await fetch("/api/gamification/achievements");
    if (!res.ok) return [];
    const data = await res.json();
    return data.achievements || [];
  } catch {
    return [];
  }
}

async function unlockAchievement(type: string): Promise<boolean> {
  try {
    const res = await fetch("/api/gamification/achievements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ achievement_type: type }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function useAchievementChecker() {
  const { user } = useAuth();
  const { trackedOffers } = useTracker();
  const { offers: bankOffers } = useOffers();
  const [unlockedTypes, setUnlockedTypes] = useState<Set<string>>(new Set());
  const initialLoadDone = useRef(false);
  const prevTrackedCount = useRef(0);

  // Load existing achievements on mount
  useEffect(() => {
    if (!user) {
      setUnlockedTypes(new Set());
      initialLoadDone.current = false;
      return;
    }

    fetchUnlocked().then((achievements) => {
      setUnlockedTypes(new Set(achievements.map((a) => a.achievement_type)));
      initialLoadDone.current = true;
    });
  }, [user]);

  const tryUnlock = useCallback(
    async (type: string) => {
      if (unlockedTypes.has(type)) return;

      const success = await unlockAchievement(type);
      if (success) {
        setUnlockedTypes((prev) => new Set([...prev, type]));
        const achievement = getAchievement(type);
        if (achievement) {
          toast.success(`${achievement.icon} ${achievement.name}`, {
            description: achievement.description,
            duration: 5000,
          });
        }
      }
    },
    [unlockedTypes]
  );

  // Check achievements whenever tracked offers or conditions change
  useEffect(() => {
    if (!user || !initialLoadDone.current || trackedOffers.length === 0) return;

    const check = async () => {
      const trackedCount = trackedOffers.length;

      // --- Offer count achievements ---
      if (trackedCount >= 1) await tryUnlock("pierwsza_cebulka");
      if (trackedCount >= 3) await tryUnlock("cebularz");
      if (trackedCount >= 5) await tryUnlock("cebulowy_baron");
      if (trackedCount >= 10) await tryUnlock("cebulowy_magnat");

      // --- Unique banks achievement ---
      const uniqueBanks = new Set<string>();
      trackedOffers.forEach((tracked) => {
        const offer = bankOffers.find((o) => o.id === tracked.offerId);
        if (offer) uniqueBanks.add(offer.bankName);
      });
      if (uniqueBanks.size >= 5) await tryUnlock("odkrywca");

      // --- Money achievements ---
      let totalPotential = 0;
      trackedOffers.forEach((tracked) => {
        const offer = bankOffers.find((o) => o.id === tracked.offerId);
        if (offer) totalPotential += offer.reward;
      });
      if (totalPotential >= 1000) await tryUnlock("tysiac");
      if (totalPotential >= 5000) await tryUnlock("piec_tysiecy");

      // --- Perfekcjonista: all conditions met in any offer ---
      for (const tracked of trackedOffers) {
        const offer = bankOffers.find((o) => o.id === tracked.offerId);
        if (!offer || offer.conditions.length === 0) continue;

        let allMet = true;
        for (const condition of offer.conditions) {
          const months = condition.perMonth ? condition.monthsRequired : 1;
          const startDate = new Date(tracked.startedAt);

          for (let m = 0; m < months; m++) {
            const d = new Date(startDate.getFullYear(), startDate.getMonth() + m, 1);
            const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

            const trackedCond = tracked.conditions.find(
              (c) => c.conditionId === condition.id
            );
            const count = trackedCond?.completedCounts[monthKey] || 0;

            if (count < condition.requiredCount) {
              allMet = false;
              break;
            }
          }
          if (!allMet) break;
        }

        if (allMet) {
          await tryUnlock("perfekcjonista");
          break;
        }
      }
    };

    // Small delay to avoid checking during rapid state changes
    const timer = setTimeout(check, 500);
    return () => clearTimeout(timer);
  }, [user, trackedOffers, bankOffers, tryUnlock]);

  // Update ref for tracking count changes
  useEffect(() => {
    prevTrackedCount.current = trackedOffers.length;
  }, [trackedOffers.length]);
}
