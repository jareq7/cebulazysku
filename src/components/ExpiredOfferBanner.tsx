// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-18
"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ExpiredOfferBannerProps {
  bankName: string;
  expiredDate?: string;
}

export function ExpiredOfferBanner({ bankName, expiredDate }: ExpiredOfferBannerProps) {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/40 p-4 sm:p-6 mb-8 rounded-2xl">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 leading-tight">
            Ta promocja {bankName} już wygasła
          </h3>
          <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-300/80">
            Zakończyła się {expiredDate ? `w dniu ${new Date(expiredDate).toLocaleDateString("pl-PL")}` : "niedawno"}. 
            Nie martw się, mamy dla Ciebie aktualne "cebulki" w naszym rankingu!
          </p>
        </div>
        <Link href="/ranking" className="shrink-0">
          <Button variant="default" className="bg-amber-600 hover:bg-amber-700 text-white border-none gap-2 shadow-sm">
            Zobacz ranking
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
