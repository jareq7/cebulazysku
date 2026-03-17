"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => { if (mq.matches) setMobileOpen(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Image
            src="/logo-icon.png"
            alt="CebulaZysku logo"
            width={44}
            height={44}
            className="rounded-lg"
            priority
          />
          <span className="bg-gradient-to-r from-emerald-700 to-green-500 bg-clip-text text-transparent">
            CebulaZysku
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Oferty
          </Link>
          <Link
            href="/jak-to-dziala"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Jak to działa?
          </Link>
          <Link
            href="/ranking"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Ranking
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user.name}
                </span>
                <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Wyloguj
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/logowanie">
                <Button variant="ghost" size="sm">
                  Zaloguj się
                </Button>
              </Link>
              <Link href="/rejestracja">
                <Button size="sm">Załóż konto</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          <Link
            href="/"
            className="block text-sm font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Oferty
          </Link>
          <Link
            href="/jak-to-dziala"
            className="block text-sm font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Jak to działa?
          </Link>
          <Link
            href="/ranking"
            className="block text-sm font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Ranking
          </Link>
          <Link
            href="/blog"
            className="block text-sm font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Blog
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="block text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="w-full gap-2"
              >
                <LogOut className="h-4 w-4" />
                Wyloguj ({user.name})
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/logowanie" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Zaloguj się
                </Button>
              </Link>
              <Link href="/rejestracja" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full">
                  Załóż konto
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
