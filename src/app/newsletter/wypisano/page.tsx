// @author Claude Code (claude-opus-4-6) | 2026-03-26
import { Metadata } from "next";
import { Suspense } from "react";
import { UnsubscribeContent } from "./UnsubscribeContent";

export const metadata: Metadata = {
  title: "Wypisano z newslettera — CebulaZysku",
  robots: "noindex",
};

export default function NewsletterUnsubscribedPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <Suspense>
        <UnsubscribeContent />
      </Suspense>
    </main>
  );
}
