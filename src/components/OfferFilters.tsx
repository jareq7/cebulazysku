"use client";

import { useState, useMemo } from "react";
import { BankOffer, getDifficultyLabel } from "@/data/banks";
import { OfferCard } from "@/components/OfferCard";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type SortOption = "reward-desc" | "reward-asc" | "deadline" | "difficulty";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

const sortLabels: Record<SortOption, string> = {
  "reward-desc": "Premia: od najwyższej",
  "reward-asc": "Premia: od najniższej",
  deadline: "Termin: najbliższy",
  difficulty: "Trudność: od najłatwiejszej",
};

const difficultyOrder: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export function OfferFilters({ offers }: { offers: BankOffer[] }) {
  const [activeDifficulties, setActiveDifficulties] = useState<Difficulty[]>([]);
  const [sort, setSort] = useState<SortOption>("reward-desc");

  const toggleDifficulty = (d: Difficulty) => {
    setActiveDifficulties((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const filtered = useMemo(() => {
    let result = [...offers];

    if (activeDifficulties.length > 0) {
      result = result.filter((o) => activeDifficulties.includes(o.difficulty));
    }

    switch (sort) {
      case "reward-desc":
        result.sort((a, b) => b.reward - a.reward);
        break;
      case "reward-asc":
        result.sort((a, b) => a.reward - b.reward);
        break;
      case "deadline":
        result.sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        break;
      case "difficulty":
        result.sort(
          (a, b) =>
            difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        );
        break;
    }

    return result;
  }, [offers, activeDifficulties, sort]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filtruj:</span>
          {difficulties.map((d) => (
            <Badge
              key={d}
              variant={activeDifficulties.includes(d) ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => toggleDifficulty(d)}
            >
              {getDifficultyLabel(d)}
            </Badge>
          ))}
        </div>

        <div className="sm:ml-auto">
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as SortOption)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {sortLabels[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Brak ofert spełniających wybrane kryteria.
          </p>
          <button
            onClick={() => setActiveDifficulties([])}
            className="mt-2 text-sm text-primary underline"
          >
            Wyczyść filtry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
