// @author Claude Code (claude-opus-4-6) | 2026-03-17
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getSavedConsent,
  updateConsent,
  needsConsentBanner,
  type ConsentSettings,
  type ConsentState,
} from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics-events";

const ALL_GRANTED: ConsentSettings = {
  analytics_storage: "granted",
  ad_storage: "granted",
  ad_personalization: "granted",
  ad_user_data: "granted",
};

const ALL_DENIED: ConsentSettings = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_personalization: "denied",
  ad_user_data: "denied",
};

export function useConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<ConsentSettings>(ALL_DENIED);

  useEffect(() => {
    const saved = getSavedConsent();
    if (saved) {
      setConsent(saved);
      // Re-apply saved consent on load
      updateConsent(saved);
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = useCallback(() => {
    setConsent(ALL_GRANTED);
    updateConsent(ALL_GRANTED);
    setShowBanner(false);
    trackEvent(AnalyticsEvents.COOKIE_CONSENT, {
      analytics: "granted",
      ads: "granted",
      personalization: "granted",
    });
  }, []);

  const rejectAll = useCallback(() => {
    setConsent(ALL_DENIED);
    updateConsent(ALL_DENIED);
    setShowBanner(false);
    trackEvent(AnalyticsEvents.COOKIE_CONSENT, {
      analytics: "denied",
      ads: "denied",
      personalization: "denied",
    });
  }, []);

  const saveCustom = useCallback(
    (analytics: boolean, ads: boolean, personalization: boolean) => {
      const toState = (v: boolean): ConsentState => (v ? "granted" : "denied");
      const settings: ConsentSettings = {
        analytics_storage: toState(analytics),
        ad_storage: toState(ads),
        ad_personalization: toState(personalization),
        ad_user_data: toState(personalization),
      };
      setConsent(settings);
      updateConsent(settings);
      setShowBanner(false);
      trackEvent(AnalyticsEvents.COOKIE_CONSENT, {
        analytics: settings.analytics_storage,
        ads: settings.ad_storage,
        personalization: settings.ad_personalization,
      });
    },
    []
  );

  const reopenBanner = useCallback(() => {
    setShowBanner(true);
  }, []);

  return {
    showBanner,
    consent,
    acceptAll,
    rejectAll,
    saveCustom,
    reopenBanner,
  };
}
