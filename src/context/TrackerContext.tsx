"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

export interface TrackedCondition {
  conditionId: string;
  completedCounts: Record<string, number>; // key: "YYYY-MM", value: count done
}

export interface TrackedOffer {
  offerId: string;
  startedAt: string;
  conditions: TrackedCondition[];
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
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

function getStorageKey(userId: string) {
  return `bankafiliacje_tracker_${userId}`;
}

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [trackedOffers, setTrackedOffers] = useState<TrackedOffer[]>([]);

  useEffect(() => {
    if (!user) {
      setTrackedOffers([]);
      return;
    }
    try {
      const data = localStorage.getItem(getStorageKey(user.id));
      if (data) setTrackedOffers(JSON.parse(data));
    } catch {
      setTrackedOffers([]);
    }
  }, [user]);

  const persist = useCallback(
    (offers: TrackedOffer[]) => {
      if (!user) return;
      localStorage.setItem(getStorageKey(user.id), JSON.stringify(offers));
    },
    [user]
  );

  const startTracking = useCallback(
    (offerId: string, conditionIds: string[]) => {
      setTrackedOffers((prev) => {
        if (prev.find((o) => o.offerId === offerId)) return prev;
        const next = [
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
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const stopTracking = useCallback(
    (offerId: string) => {
      setTrackedOffers((prev) => {
        const next = prev.filter((o) => o.offerId !== offerId);
        persist(next);
        return next;
      });
    },
    [persist]
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
    (offerId: string, conditionId: string, month: string) => {
      setTrackedOffers((prev) => {
        const next = prev.map((offer) => {
          if (offer.offerId !== offerId) return offer;
          return {
            ...offer,
            conditions: offer.conditions.map((c) => {
              if (c.conditionId !== conditionId) return c;
              return {
                ...c,
                completedCounts: {
                  ...c.completedCounts,
                  [month]: (c.completedCounts[month] || 0) + 1,
                },
              };
            }),
          };
        });
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const decrementCondition = useCallback(
    (offerId: string, conditionId: string, month: string) => {
      setTrackedOffers((prev) => {
        const next = prev.map((offer) => {
          if (offer.offerId !== offerId) return offer;
          return {
            ...offer,
            conditions: offer.conditions.map((c) => {
              if (c.conditionId !== conditionId) return c;
              const current = c.completedCounts[month] || 0;
              return {
                ...c,
                completedCounts: {
                  ...c.completedCounts,
                  [month]: Math.max(0, current - 1),
                },
              };
            }),
          };
        });
        persist(next);
        return next;
      });
    },
    [persist]
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
