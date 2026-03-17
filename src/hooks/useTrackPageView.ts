// @author Claude Code (claude-opus-4-6) | 2026-03-17
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent, captureUTM } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics-events";

/**
 * Track SPA page views on route changes + capture UTM on first load
 */
export function useTrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirst = useRef(true);

  useEffect(() => {
    // Capture UTM params on first load
    if (isFirst.current) {
      captureUTM();
      isFirst.current = false;
    }

    // Track page view (skip first render — GTM handles initial pageview)
    trackEvent(AnalyticsEvents.PAGE_VIEW, {
      page_title: document.title,
      page_location: window.location.href,
      page_referrer: document.referrer,
    });
  }, [pathname, searchParams]);
}
