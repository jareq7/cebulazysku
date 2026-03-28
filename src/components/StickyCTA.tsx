// @author Claude Code (claude-opus-4-6) | 2026-03-26
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, Shield, Clock, CheckCircle } from "lucide-react";

interface StickyCTAProps {
  bankName: string;
  reward: number;
  affiliateUrl: string;
  hasUserReward: boolean;
}

export function StickyCTA({ bankName, reward, affiliateUrl, hasUserReward }: StickyCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 400px
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!affiliateUrl || affiliateUrl === "#") return null;

  const handleClick = () => {
    trackEvent("cta_click", {
      variant: "sticky_mobile",
      bank_name: bankName,
      reward,
    });
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur border-t shadow-lg transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{bankName}</p>
            {hasUserReward && (
              <p className="text-lg font-extrabold text-emerald-600">{reward} zł</p>
            )}
          </div>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={handleClick}
          >
            <Button size="lg" className="gap-1.5 whitespace-nowrap">
              {hasUserReward ? "Zgarnij premię" : "Otwórz konto"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
        {/* Trust signals */}
        <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500" />
            Bez zobowiązań
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-emerald-500" />
            5 min
          </span>
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-emerald-500" />
            BFG chroni
          </span>
        </div>
      </div>
    </div>
  );
}
