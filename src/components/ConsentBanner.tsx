// @author Claude Code (claude-opus-4-6) | 2026-03-17
// TODO: Jarek dostarczy swój obrandowany banner — to jest wersja bazowa do adaptacji
"use client";

import { useState } from "react";
import { useConsent } from "@/hooks/useConsent";

export function ConsentBanner() {
  const { showBanner, acceptAll, rejectAll, saveCustom } = useConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);
  const [personalization, setPersonalization] = useState(true);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[9999] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-background/95 backdrop-blur-md shadow-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🧅</span>
          <div className="flex-1">
            <h3 className="font-semibold text-sm sm:text-base">
              Cebulowe ciasteczka
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Używamy cookies żeby mierzyć ruch i pokazywać Ci trafniejsze reklamy promocji bankowych.
              Możesz wybrać które ciasteczka akceptujesz.{" "}
              <a
                href="/polityka-prywatnosci"
                className="underline hover:text-foreground"
              >
                Polityka prywatności
              </a>
            </p>

            {showDetails && (
              <div className="mt-4 space-y-3 border-t pt-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="rounded border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium">Niezbędne</span>
                    <p className="text-xs text-muted-foreground">
                      Wymagane do działania strony. Nie można wyłączyć.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium">Analityczne</span>
                    <p className="text-xs text-muted-foreground">
                      Google Analytics — pomagają nam zrozumieć jak korzystasz ze strony.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ads}
                    onChange={(e) => setAds(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium">Reklamowe</span>
                    <p className="text-xs text-muted-foreground">
                      Meta, TikTok, Google Ads — trafniejsze reklamy promocji bankowych.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={personalization}
                    onChange={(e) => setPersonalization(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium">Personalizacja</span>
                    <p className="text-xs text-muted-foreground">
                      Lepsze dopasowanie treści i remarketing.
                    </p>
                  </div>
                </label>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={acceptAll}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                Akceptuję wszystkie
              </button>
              {showDetails ? (
                <button
                  onClick={() => saveCustom(analytics, ads, personalization)}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Zapisz wybór
                </button>
              ) : (
                <button
                  onClick={() => setShowDetails(true)}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Dostosuj
                </button>
              )}
              <button
                onClick={rejectAll}
                className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Tylko niezbędne
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
