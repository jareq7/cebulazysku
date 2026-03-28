// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const PDF_URL = "/przewodnik-cebularza.pdf"; // Placeholder — Jarek podmieni po Canva design

export function LeadMagnetForm() {
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
        body: JSON.stringify({ email: email.trim(), source: "lead-magnet" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Coś poszło nie tak.");
        return;
      }

      setStatus("success");
      setMessage(data.message || "Zapisano!");
    } catch {
      setStatus("error");
      setMessage("Błąd połączenia. Spróbuj ponownie.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-emerald-800 dark:text-emerald-300 mb-2">
          Gotowe! Pobierz swojego Przewodnika
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {message}
        </p>
        <a href={PDF_URL} download>
          <Button size="lg" className="gap-2">
            <Download className="h-5 w-5" />
            Pobierz PDF
          </Button>
        </a>
        <p className="text-xs text-muted-foreground mt-3">
          Link do pobrania został też wysłany na Twojego maila.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <span className="text-4xl mb-3 block">📖</span>
        <h3 className="font-bold text-xl mb-1">
          Pobierz darmowy Kodeks Cebularza 2026
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          10-stronicowy przewodnik: jak zarabiać do 5000 zł rocznie na premiach
          bankowych. Krok po kroku, bez scamu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="twoj@email.pl"
          required
          className="flex-1 min-w-0 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm whitespace-nowrap flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Download className="w-4 h-4" />
              Pobierz za darmo
            </>
          )}
        </button>
      </form>

      {status === "error" && (
        <p className="text-sm text-red-600 mt-3 text-center">{message}</p>
      )}

      <p className="text-[11px] text-muted-foreground text-center mt-4">
        Zero spamu. Możesz się wypisać w każdej chwili.
      </p>
    </div>
  );
}
