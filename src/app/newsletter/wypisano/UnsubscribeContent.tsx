// @author Claude Code (claude-opus-4-6) | 2026-03-26
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailX } from "lucide-react";

export function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error === "invalid") {
    return (
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <MailX className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Nieprawidłowy link
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Link do wypisania jest nieprawidłowy lub wygasł. Jeśli nadal
          otrzymujesz niechciane maile, napisz do nas.
        </p>
        <div className="pt-4">
          <Link
            href="/kontakt"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Skontaktuj się z nami
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
        <MailX className="w-8 h-8 text-amber-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Wypisano z newslettera
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Szkoda, że odchodzisz! Nie będziesz już otrzymywać wiadomości od
        CebulaZysku. Jeśli zmienisz zdanie — zawsze możesz wrócić.
      </p>
      <div className="pt-4">
        <Link
          href="/"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </div>
  );
}
