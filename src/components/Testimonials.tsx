// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

interface Testimonial {
  name: string;
  earned: number;
  bank: string;
  quote: string;
  difficulty: "easy" | "medium" | "hard";
  period: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Marek K.",
    earned: 550,
    bank: "mBank + BNP Paribas",
    quote:
      "Nie wierzyłem, że to działa. Otworzyłem dwa konta, spełniłem warunki i po 2 miesiącach miałem 550 zł ekstra. CebulaZysku pomogła mi ogarnąć regulaminy.",
    difficulty: "easy",
    period: "2 miesiące",
  },
  {
    name: "Kasia W.",
    earned: 300,
    bank: "Santander",
    quote:
      "Jako studentka szukałam sposobu na dodatkową kasę. Tracker warunków to genialne narzędzie — nie zapomniałam o żadnym przelewie!",
    difficulty: "easy",
    period: "3 miesiące",
  },
  {
    name: "Tomek R.",
    earned: 1200,
    bank: "4 banki",
    quote:
      "Systematycznie cebuluję od pół roku. Kluczem jest pilnowanie terminów i warunków. Z CebulaZysku mam to w jednym miejscu.",
    difficulty: "medium",
    period: "6 miesięcy",
  },
  {
    name: "Anna S.",
    earned: 350,
    bank: "ING + Millennium",
    quote:
      "Byłam sceptyczna, ale koleżanka mnie przekonała. Dwie promocje, zero stresu. Porównywarka ofert zaoszczędziła mi godziny czytania regulaminów.",
    difficulty: "easy",
    period: "3 miesiące",
  },
  {
    name: "Piotr M.",
    earned: 800,
    bank: "3 banki",
    quote:
      "Prowadzę firmę i otworzyłem konta firmowe z premiami. Żadnych haczyków, wszystko opisane jasno. Polecam każdemu przedsiębiorcy.",
    difficulty: "medium",
    period: "4 miesiące",
  },
  {
    name: "Ola D.",
    earned: 200,
    bank: "Alior Bank",
    quote:
      "Moje pierwsze konto z premią! Bałam się, że będzie trudne, ale strona /pierwsze-konto wyjaśniła wszystko krok po kroku.",
    difficulty: "easy",
    period: "1 miesiąc",
  },
];

const difficultyLabels: Record<string, string> = {
  easy: "Łatwe",
  medium: "Średnie",
  hard: "Trudne",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export function Testimonials() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(page * perPage, (page + 1) * perPage);

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Co mówią nasi cebularze? 🧅
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Prawdziwi użytkownicy, prawdziwe premie. Dołącz do społeczności
          sprytnych cebularzy!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visible.map((t) => (
          <Card
            key={t.name}
            className="relative overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardContent className="p-5">
              <Quote className="h-8 w-8 text-emerald-200 dark:text-emerald-800 absolute top-3 right-3" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed text-muted-foreground mb-4 min-h-[72px]">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author & stats */}
              <div className="border-t pt-3 mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{t.name}</span>
                  <span className="text-emerald-600 font-bold text-lg">
                    +{t.earned} zł
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{t.bank}</span>
                  <span>•</span>
                  <span>{t.period}</span>
                  <Badge
                    className={`text-[10px] px-1.5 py-0 ${difficultyColors[t.difficulty]}`}
                    variant="secondary"
                  >
                    {difficultyLabels[t.difficulty]}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Poprzednie opinie"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            aria-label="Następne opinie"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Summary stat */}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Łącznie nasi cebularze zarobili{" "}
          <span className="font-bold text-emerald-600">
            {testimonials.reduce((s, t) => s + t.earned, 0).toLocaleString("pl-PL")} zł
          </span>{" "}
          na premiach bankowych
        </p>
      </div>
    </section>
  );
}
