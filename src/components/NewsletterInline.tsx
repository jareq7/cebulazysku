// @author Claude Code (claude-opus-4-6) | 2026-03-26
"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "inline" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Coś poszło nie tak.");
        return;
      }

      setStatus("success");
      setMessage(data.message);
    } catch {
      setStatus("error");
      setMessage("Błąd połączenia. Spróbuj ponownie.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
        <p className="font-semibold text-emerald-800 dark:text-emerald-300">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">🧅</span>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
            Newsletter CebulaZysku
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Najlepsze premie bankowe prosto na Twoją skrzynkę. Zero spamu.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="twoj@email.pl"
          required
          className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap flex items-center gap-2"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Zapisz się"
          )}
        </button>
      </form>

      {status === "error" && (
        <p className="text-sm text-red-600 mt-2">{message}</p>
      )}
    </div>
  );
}
