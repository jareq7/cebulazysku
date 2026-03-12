"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { TrackerProvider } from "@/context/TrackerContext";
import { UserBanksProvider } from "@/context/UserBanksContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <UserBanksProvider>
          <TrackerProvider>
            {children}
            <Toaster position="top-center" richColors closeButton />
          </TrackerProvider>
        </UserBanksProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
