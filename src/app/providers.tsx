"use client";

import { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { TrackerProvider } from "@/context/TrackerContext";
import { UserBanksProvider } from "@/context/UserBanksContext";
import { ConsentBanner } from "@/components/ConsentBanner";
import { PageViewTracker } from "@/components/PageViewTracker";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <UserBanksProvider>
          <TrackerProvider>
            <Suspense fallback={null}>
              <PageViewTracker />
            </Suspense>
            {children}
            <Toaster position="top-center" richColors closeButton />
            <ConsentBanner />
          </TrackerProvider>
        </UserBanksProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
