// @author Claude Code (claude-opus-4-6) | 2026-03-17
"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics-events";

interface TrackViewItemProps {
  itemId: string;
  itemName: string;
  itemCategory: string;
  price: number;
}

export function TrackViewItem({ itemId, itemName, itemCategory, price }: TrackViewItemProps) {
  useEffect(() => {
    trackEvent(AnalyticsEvents.VIEW_ITEM, {
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          item_category: itemCategory,
          price,
          currency: "PLN",
        },
      ],
      value: price,
      currency: "PLN",
    });
  }, [itemId, itemName, itemCategory, price]);

  return null;
}
