"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics-events";

export interface TrackedCondition {
  conditionId: string;
  completedCounts: Record<string, number>; // key: "YYYY-MM", value: count done
}

export interface TrackedOffer {
  offerId: string;
  startedAt: string;
  conditions: TrackedCondition[];
  completedAt?: string | null;
  payoutReceivedAt?: string | null;
  payoutAmount?: number | null;
}

interface TrackerContextType {
  trackedOffers: TrackedOffer[];
  startTracking: (offerId: string, conditionIds: string[]) => void;
  stopTracking: (offerId: string) => void;
  isTracking: (offerId: string) => boolean;
  getTrackedOffer: (offerId: string) => TrackedOffer | undefined;
  incrementCondition: (offerId: string, conditionId: string, month: string) => void;
  decrementCondition: (offerId: string, conditionId: string, month: string) => void;
  getConditionCount: (offerId: string, conditionId: string, month: string) => number;
  markPayoutReceived: (offerId: string, amount: number) => Promise<void>;
  totalEarned: number;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [trackedOffers, setTrackedOffers] = useState<TrackedOffer[]>([]);
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  // Load tracked offers and condition progress from Supabase
  useEffect(() => {
    if (!user) {
      setTrackedOffers([]);
      return;
    }

    async function loadFromDB() {
      // Fetch tracked offers
      const { data: offers } = await supabase
        .from("tracked_offers")
        .select("*")
        .eq("user_id", user!.id);

      if (!offers || offers.length === 0) {
        setTrackedOffers([]);
        return;
      }

      // Fetch all condition progress for this user
      const { data: progress } = await supabase
        .from("condition_progress")
        .select("*")
        .eq("user_id", user!.id);

      // Build TrackedOffer[] from DB rows
      const built: TrackedOffer[] = offers.map((o) => {
        const offerProgress = (progress || []).filter((p) => p.offer_id === o.offer_id);

        // Group by condition_id
        const condMap = new Map<string, Record<string, number>>();
        offerProgress.forEach((p) => {
          if (!condMap.has(p.condition_id)) condMap.set(p.condition_id, {});
          condMap.get(p.condition_id)![p.month] = p.count;
        });

        const conditions: TrackedCondition[] = Array.from(condMap.entries()).map(
          ([conditionId, completedCounts]) => ({ conditionId, completedCounts })
        );

        return {
          offerId: o.offer_id,
          startedAt: o.started_at,
          conditions,
          completedAt: o.completed_at ?? null,
          payoutReceivedAt: o.payout_received_at ?? null,
          payoutAmount: o.payout_amount ?? null,
        };
      });

      setTrackedOffers(built);
    }

    loadFromDB();
  }, [user, supabase]);

  const startTracking = useCallback(
    async (offerId: string, conditionIds: string[]) => {
      if (!user) return;

      // Optimistic update
      setTrackedOffers((prev) => {
        if (prev.find((o) => o.offerId === offerId)) return prev;
        return [
          ...prev,
          {
            offerId,
            startedAt: new Date().toISOString(),
            conditions: conditionIds.map((id) => ({
              conditionId: id,
              completedCounts: {},
            })),
          },
        ];
      });

      // Persist to Supabase
      await supabase.from("tracked_offers").upsert(
        {
          user_id: user.id,
          offer_id: offerId,
          started_at: new Date().toISOString(),
        },
        { onConflict: "user_id,offer_id" }
      );

      trackEvent(AnalyticsEvents.TRACKER_START, { offer_id: offerId, bank_name: "" });
    },
    [user, supabase]
  );

  const stopTracking = useCallback(
    async (offerId: string) => {
      if (!user) return;

      const tracked = trackedOffers.find((o) => o.offerId === offerId);
      const daysTracked = tracked
        ? Math.ceil((Date.now() - new Date(tracked.startedAt).getTime()) / 86400000)
        : 0;

      // Optimistic update
      setTrackedOffers((prev) => prev.filter((o) => o.offerId !== offerId));

      // Delete from Supabase (cascade: condition_progress rows cleaned by offer_id match)
      await supabase
        .from("condition_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("offer_id", offerId);

      await supabase
        .from("tracked_offers")
        .delete()
        .eq("user_id", user.id)
        .eq("offer_id", offerId);

      trackEvent(AnalyticsEvents.TRACKER_STOP, { offer_id: offerId, bank_name: "", days_tracked: daysTracked });
    },
    [user, supabase, trackedOffers]
  );

  const isTracking = useCallback(
    (offerId: string) => trackedOffers.some((o) => o.offerId === offerId),
    [trackedOffers]
  );

  const getTrackedOffer = useCallback(
    (offerId: string) => trackedOffers.find((o) => o.offerId === offerId),
    [trackedOffers]
  );

  const incrementCondition = useCallback(
    async (offerId: string, conditionId: string, month: string) => {
      if (!user) return;

      let newCount = 1;

      // Optimistic update
      setTrackedOffers((prev) =>
        prev.map((offer) => {
          if (offer.offerId !== offerId) return offer;

          // Check if condition already exists
          const existingCond = offer.conditions.find((c) => c.conditionId === conditionId);
          if (existingCond) {
            newCount = (existingCond.completedCounts[month] || 0) + 1;
            return {
              ...offer,
              conditions: offer.conditions.map((c) => {
                if (c.conditionId !== conditionId) return c;
                return {
                  ...c,
                  completedCounts: { ...c.completedCounts, [month]: newCount },
                };
              }),
            };
          } else {
            // Condition not tracked yet — add it
            return {
              ...offer,
              conditions: [
                ...offer.conditions,
                { conditionId, completedCounts: { [month]: 1 } },
              ],
            };
          }
        })
      );

      // Upsert to Supabase
      // First check current value
      const { data: existing } = await supabase
        .from("condition_progress")
        .select("count")
        .eq("user_id", user.id)
        .eq("offer_id", offerId)
        .eq("condition_id", conditionId)
        .eq("month", month)
        .single();

      const dbCount = (existing?.count || 0) + 1;

      await supabase.from("condition_progress").upsert(
        {
          user_id: user.id,
          offer_id: offerId,
          condition_id: conditionId,
          month,
          count: dbCount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,offer_id,condition_id,month" }
      );

      trackEvent(AnalyticsEvents.CONDITION_COMPLETE, {
        offer_id: offerId,
        condition_type: conditionId,
        condition_label: conditionId,
      });
    },
    [user, supabase]
  );

  const decrementCondition = useCallback(
    async (offerId: string, conditionId: string, month: string) => {
      if (!user) return;

      let newCount = 0;

      // Optimistic update
      setTrackedOffers((prev) =>
        prev.map((offer) => {
          if (offer.offerId !== offerId) return offer;
          return {
            ...offer,
            conditions: offer.conditions.map((c) => {
              if (c.conditionId !== conditionId) return c;
              const current = c.completedCounts[month] || 0;
              newCount = Math.max(0, current - 1);
              return {
                ...c,
                completedCounts: { ...c.completedCounts, [month]: newCount },
              };
            }),
          };
        })
      );

      // Update in Supabase
      const { data: existing } = await supabase
        .from("condition_progress")
        .select("count")
        .eq("user_id", user.id)
        .eq("offer_id", offerId)
        .eq("condition_id", conditionId)
        .eq("month", month)
        .single();

      const dbCount = Math.max(0, (existing?.count || 0) - 1);

      await supabase.from("condition_progress").upsert(
        {
          user_id: user.id,
          offer_id: offerId,
          condition_id: conditionId,
          month,
          count: dbCount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,offer_id,condition_id,month" }
      );
    },
    [user, supabase]
  );

  const markPayoutReceived = useCallback(
    async (offerId: string, amount: number) => {
      if (!user) return;
      const now = new Date().toISOString();
      setTrackedOffers((prev) =>
        prev.map((o) =>
          o.offerId !== offerId
            ? o
            : { ...o, payoutReceivedAt: now, payoutAmount: amount }
        )
      );
      await supabase
        .from("tracked_offers")
        .update({ payout_received_at: now, payout_amount: amount })
        .eq("user_id", user.id)
        .eq("offer_id", offerId);

      trackEvent(AnalyticsEvents.PAYOUT_RECEIVED, { offer_id: offerId, bank_name: "", value: amount });
    },
    [user, supabase]
  );

  const totalEarned = trackedOffers.reduce(
    (sum, o) => sum + (o.payoutAmount ?? 0),
    0
  );

  const getConditionCount = useCallback(
    (offerId: string, conditionId: string, month: string) => {
      const offer = trackedOffers.find((o) => o.offerId === offerId);
      if (!offer) return 0;
      const cond = offer.conditions.find((c) => c.conditionId === conditionId);
      return cond?.completedCounts[month] || 0;
    },
    [trackedOffers]
  );

  return (
    <TrackerContext.Provider
      value={{
        trackedOffers,
        startTracking,
        stopTracking,
        isTracking,
        getTrackedOffer,
        incrementCondition,
        decrementCondition,
        getConditionCount,
        markPayoutReceived,
        totalEarned,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const context = useContext(TrackerContext);
  if (!context) throw new Error("useTracker must be used within TrackerProvider");
  return context;
}
