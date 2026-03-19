// @author Claude Code (claude-opus-4-6) | 2026-03-19 — refactored mobile menu to Sheet
"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LogOut,
  LayoutDashboard,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Oferty" },
  { href: "/jak-to-dziala", label: "Jak to działa?" },
  { href: "/ranking", label: "Ranking" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
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

        {/* Mobile menu — Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Otwórz menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <Link
                  href="/"
                  className="flex items-center gap-2 font-bold text-lg"
                  onClick={() => setOpen(false)}
                >
                  <Image
                    src="/logo-icon.png"
                    alt="CebulaZysku logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <span className="bg-gradient-to-r from-emerald-700 to-green-500 bg-clip-text text-transparent">
                    CebulaZysku
                  </span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 mt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
            </div>
            <div className="mt-auto pt-6 border-t space-y-3">
              <div className="px-3">
                <ThemeToggle />
              </div>
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Wyloguj ({user.name})
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/logowanie" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Zaloguj się
                    </Button>
                  </Link>
                  <Link href="/rejestracja" onClick={() => setOpen(false)}>
                    <Button size="sm" className="w-full">
                      Załóż konto
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
