// @author Claude Code (claude-opus-4-6) | 2026-03-26
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, Sparkles, Timer, Users } from "lucide-react";

type HeroVariant = "A" | "B" | "C";

const VARIANTS: Record<
  HeroVariant,
  {
    h1: string;
    h1Highlight: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
    ctaSecondaryHref: string;
    icon: typeof Sparkles;
  }
> = {
  A: {
    h1: "Przestań płacić bankom.",
    h1Highlight: "Zacznij na nich zarabiać.",
    subtitle:
      "Polskie banki rozdają tysiące złotych za samo założenie darmowego konta. Wejdź do rankingu, wybierz promocję i odbierz gwarantowaną nagrodę.",
    cta: "Gdzie zapłacą mi najwięcej?",
    ctaSecondary: "To legalne i wolne od podatku",
    ctaSecondaryHref: "/jak-to-dziala",
    icon: Sparkles,
  },
  B: {
    h1: "Odbieraj premie od banków.",
    h1Highlight: "My przypilnujemy haczyków.",
    subtitle:
      "Koniec z ręcznym spisywaniem warunków. Nasz darmowy Tracker śledzi regulaminy i terminy, a Ty w spokoju zgarniasz premie co miesiąc.",
    cta: "Załóż darmowy Tracker",
    ctaSecondary: "Zobacz ranking bez logowania",
    ctaSecondaryHref: "/#oferty",
    icon: Timer,
  },
  C: {
    h1: "Dołącz do Cebularzy.",
    h1Highlight: "Rozdano już ponad 250 000 zł.",
    subtitle:
      "Nie jesteśmy kolejnym portalem finansowym. Wyciągamy od korporacji to, co nam się należy. Załóż konto, wykonaj kilka płatności i zgarnij premię.",
    cta: "Chcę zgarnąć pierwszą premię",
    ctaSecondary: "Zobacz ile można zarobić",
    ctaSecondaryHref: "/#oferty",
    icon: Users,
  },
};

function getVariant(): HeroVariant {
  if (typeof window === "undefined") return "A";

  const stored = localStorage.getItem("hero_variant");
  if (stored && (stored === "A" || stored === "B" || stored === "C")) {
    return stored as HeroVariant;
  }

  const variants: HeroVariant[] = ["A", "B", "C"];
  const picked = variants[Math.floor(Math.random() * variants.length)];
  localStorage.setItem("hero_variant", picked);
  return picked;
}

interface HeroABTestProps {
  offerCount: number;
  totalEarnings: number;
}

export function HeroABTest({ offerCount, totalEarnings }: HeroABTestProps) {
  const [variant, setVariant] = useState<HeroVariant | null>(null);

  useEffect(() => {
    const v = getVariant();
    setVariant(v);
    trackEvent("hero_variant_view", { variant: v });
  }, []);

  // SSR/initial render: show nothing to avoid hydration mismatch
  if (!variant) return null;

  const data = VARIANTS[variant];

  const handleCtaClick = () => {
    trackEvent("hero_cta_click", { variant });
  };

  return (
    <div className="text-center">
      <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-sm">
        <data.icon className="h-4 w-4 text-emerald-600" />
        {offerCount} ofert do ołupienia
      </Badge>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
        {data.h1}{" "}
        <span className="bg-gradient-to-r from-emerald-700 to-green-500 bg-clip-text text-transparent">
          {data.h1Highlight}
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
        {data.subtitle} Aktualnie do obrania nawet{" "}
        <strong className="text-emerald-600 font-bold">{totalEarnings} zł</strong>!
      </p>
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link href="/#oferty" onClick={handleCtaClick}>
          <Button size="lg" className="gap-2 text-base px-8">
            {data.cta}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
        <Link href={data.ctaSecondaryHref}>
          <Button variant="outline" size="lg" className="text-base px-8">
            {data.ctaSecondary}
          </Button>
        </Link>
      </div>
    </div>
  );
}
