// @author Gemini CLI (gemini-3-pro-preview) | 2026-03-14 — Dashboard metadata layout

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Twój Dashboard – Śledź postępy i premie | CebulaZysku",
  description: "Zarządzaj swoimi promocjami bankowymi, śledź warunki w Trackerze i odbieraj odznaki za postępy. Twoje centrum dowodzenia cebularza! 🧅",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
