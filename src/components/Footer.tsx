"use client";

import Link from "next/link";
import Image from "next/image";
import { useConsent } from "@/hooks/useConsent";

export function Footer() {
  const { reopenBanner } = useConsent();
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Image
                src="/logo-icon.png"
                alt="CebulaZysku logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="bg-gradient-to-r from-emerald-700 to-green-500 bg-clip-text text-transparent">
                CebulaZysku
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Obieramy premie bankowe warstwa po warstwie.
              Łupimy legalnie!
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Nawigacja</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Oferty bankowe
                </Link>
              </li>
              <li>
                <Link href="/jak-to-dziala" className="hover:text-foreground transition-colors">
                  Jak to działa?
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dla-firm" className="hover:text-foreground transition-colors">
                  Dla firm
                </Link>
              </li>
              <li>
                <Link href="/archiwum" className="hover:text-foreground transition-colors">
                  Archiwum
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Informacje</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/o-nas" className="hover:text-foreground transition-colors">
                  O nas
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-foreground transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/przewodnik" className="hover:text-foreground transition-colors">
                  Przewodnik
                </Link>
              </li>
              <li>
                <Link href="/slownik" className="hover:text-foreground transition-colors">
                  Słownik
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Prawne</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/polityka-prywatnosci" className="hover:text-foreground transition-colors">
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link href="/regulamin" className="hover:text-foreground transition-colors">
                  Regulamin
                </Link>
              </li>
              <li>
                <button
                  onClick={reopenBanner}
                  className="hover:text-foreground transition-colors"
                >
                  Ustawienia cookies
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CebulaZysku. Wszystkie prawa
          zastrzeżone. 🧅
        </div>
      </div>
    </footer>
  );
}
