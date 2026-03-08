"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { TrackerProvider } from "@/context/TrackerContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TrackerProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </TrackerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
