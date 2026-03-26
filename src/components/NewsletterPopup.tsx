// @author Claude Code (claude-opus-4-6) | 2026-03-26
"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Mail, Loader2 } from "lucide-react";

const DISMISS_KEY = "newsletter_popup_dismissed";
const SHOW_DELAY_MS = 30_000; // 30 seconds
const SCROLL_THRESHOLD = 0.4; // 40% of page

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {}
  }, []);

  useEffect(() => {
    // Don't show if previously dismissed (within 7 days)
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (dismissed && Date.now() - Number(dismissed) < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    } catch {}

    let shown = false;
    const show = () => {
      if (!shown) {
        shown = true;
        setVisible(true);
      }
    };

    // Timer trigger
    const timer = setTimeout(show, SHOW_DELAY_MS);

    // Scroll trigger
    const onScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= SCROLL_THRESHOLD) {
        show();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "popup" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Coś poszło nie tak.");
        return;
      }

      setStatus("success");
      setMessage(data.message);

      // Auto-dismiss after success
      setTimeout(dismiss, 4000);
    } catch {
      setStatus("error");
      setMessage("Błąd połączenia. Spróbuj ponownie.");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Popup */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Zamknij"
        >
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sprawdź skrzynkę!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-3xl mb-2">🧅</p>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Nie przegap żadnej premii!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dołącz do cebularzy i otrzymuj powiadomienia o najlepszych
                ofertach bankowych prosto na maila.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj@email.pl"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Zapisuję się!"
                )}
              </button>
              {status === "error" && (
                <p className="text-sm text-red-600 text-center">{message}</p>
              )}
            </form>

            <p className="text-xs text-gray-400 text-center mt-3">
              Bez spamu. Wypisanie jednym kliknięciem. RODO.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
