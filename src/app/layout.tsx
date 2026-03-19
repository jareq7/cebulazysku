import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrackingPixels, GTMNoScript } from "@/components/TrackingPixels";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cebulazysku.pl"),
  title: {
    default: "CebulaZysku – Obierz premie bankowe warstwa po warstwie",
    template: "%s | CebulaZysku",
  },
  description:
    "Obierz kolejne warstwy zysku z promocji bankowych. Porównuj oferty, śledź warunki i zbieraj premie. Łupimy banki legalnie!",
  manifest: "/manifest.json",
  themeColor: "#059669",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CebulaZysku",
  },
  openGraph: {
    title: "CebulaZysku – Obierz premie bankowe warstwa po warstwie",
    description:
      "Obierz kolejne warstwy zysku z promocji bankowych. Porównuj oferty i zbieraj premie. Łupimy banki legalnie!",
    type: "website",
    locale: "pl_PL",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CebulaZysku – porównywarka premii bankowych",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <TrackingPixels />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GTMNoScript />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Przejdź do treści
        </a>
        <ServiceWorkerRegister />
        <InstallPrompt />
        <Providers>
          <TooltipProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main id="main-content" className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster richColors position="bottom-right" />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
