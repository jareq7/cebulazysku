import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrackingPixels } from "@/components/TrackingPixels";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bankpremie.pl"),
  title: {
    default: "BankPremie – Porównaj promocje bankowe i odbieraj premie",
    template: "%s | BankPremie",
  },
  description:
    "Porównaj promocje bankowe i odbieraj premie za założenie konta. Śledź postępy spełniania warunków w jednym miejscu. Nawet 2100 zł w premiach!",
  openGraph: {
    title: "BankPremie – Porównaj promocje bankowe i odbieraj premie",
    description:
      "Porównaj promocje bankowe i odbieraj premie za założenie konta. Nawet 2100 zł w premiach!",
    type: "website",
    locale: "pl_PL",
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
