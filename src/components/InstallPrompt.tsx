"use client";

import { useState, useEffect } from "react";
import { X, Share, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISSED_KEY = "pwa_install_dismissed";
const DISMISSED_DAYS = 14;

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

function wasDismissedRecently(): boolean {
  try {
    const ts = localStorage.getItem(DISMISSED_KEY);
    if (!ts) return false;
    const dismissedAt = parseInt(ts, 10);
    return Date.now() - dismissedAt < DISMISSED_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

// Typed BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Don't show if already installed or dismissed recently
    if (isInStandaloneMode() || wasDismissedRecently()) return;

    const ios = isIOS();
    setIsIOSDevice(ios);

    if (ios) {
      // iOS — show manual instructions after 3s
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }

    // Android/Chrome — capture install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {}
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="mx-auto max-w-lg rounded-2xl border bg-card shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
            <Smartphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Zainstaluj CebulaZysku</p>

            {isIOSDevice ? (
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Dotknij{" "}
                <span className="inline-flex items-center gap-0.5 font-medium text-foreground">
                  <Share className="h-3 w-3" /> Udostępnij
                </span>
                , a następnie{" "}
                <span className="font-medium text-foreground">
                  „Dodaj do ekranu głównego"
                </span>{" "}
                — będzie działać jak aplikacja.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                Dodaj do ekranu głównego i korzystaj jak z aplikacji — bez przeglądarki.
              </p>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Zamknij"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!isIOSDevice && deferredPrompt && (
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              className="flex-1 gap-2"
              onClick={handleInstall}
            >
              <Download className="h-3.5 w-3.5" />
              Zainstaluj
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDismiss}>
              Nie teraz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
