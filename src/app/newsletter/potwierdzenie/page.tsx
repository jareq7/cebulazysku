// @author Claude Code (claude-opus-4-6) | 2026-03-26
import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Subskrypcja potwierdzona — CebulaZysku",
  robots: "noindex",
};

export default function NewsletterConfirmedPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Subskrypcja potwierdzona!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Witaj w gronie cebularzy! Od teraz będziesz otrzymywać powiadomienia
          o najlepszych premiach bankowych prosto na swoją skrzynkę.
        </p>
        <div className="pt-4">
          <Link
            href="/ranking"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Zobacz ranking ofert →
          </Link>
        </div>
      </div>
    </main>
  );
}
