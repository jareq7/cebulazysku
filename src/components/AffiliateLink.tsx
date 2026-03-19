// @author Claude Code (claude-opus-4-6) | 2026-03-17
"use client";

import { useCallback } from "react";
import { trackEvent, getUTM } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics-events";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface AffiliateLinkProps {
  href: string;
  offerId: string;
  bankName: string;
  reward: number;
  sourcePage: string;
  className?: string;
  children: React.ReactNode;
}

export function AffiliateLink({
  href,
  offerId,
  bankName,
  reward,
  sourcePage,
  className,
  children,
}: AffiliateLinkProps) {
  const { user } = useAuth();

  const handleClick = useCallback(() => {
    const utm = getUTM();

    // DataLayer events
    trackEvent(AnalyticsEvents.AFFILIATE_CLICK, {
      offer_id: offerId,
      bank_name: bankName,
      reward,
      source_page: sourcePage,
      user_logged_in: !!user,
    });

    trackEvent(AnalyticsEvents.BEGIN_CHECKOUT, {
      items: [{ item_id: offerId, item_name: bankName, price: reward, currency: "PLN" }],
      value: reward,
      currency: "PLN",
    });

    trackEvent(AnalyticsEvents.GENERATE_LEAD, {
      items: [{ item_id: offerId, item_name: bankName, price: reward, currency: "PLN" }],
      value: reward,
      currency: "PLN",
    });

    // Server-side tracking via beacon (non-blocking)
    const payload = JSON.stringify({
      offerId,
      sourcePage,
      ...utm,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track-click", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track-click", {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      });
    }

    toast.success(`Otwieramy stronę ${bankName}`, {
      description: "Link otwarty w nowej karcie",
      duration: 3000,
    });
  }, [offerId, bankName, reward, sourcePage, user]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
