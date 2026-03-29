// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-29 — code review fixes: shared slugify, Button asChild, a11y, next/image
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BankOffer } from "@/data/banks";
import { polishSlugify } from "@/lib/slugify";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

interface ArchiveFiltersProps {
  offers: BankOffer[];
}

function bankNameToSlug(name: string): string {
  return polishSlugify(name);
}

export function ArchiveFilters({ offers }: ArchiveFiltersProps) {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rewardRange, setRewardRange] = useState<"all" | "low" | "mid" | "high">("all");

  // Extract unique banks
  const banks = useMemo(() => {
    const bankMap = new Map<string, { name: string; count: number; logo: string; color: string }>();
    for (const o of offers) {
      const slug = bankNameToSlug(o.bankName);
      const existing = bankMap.get(slug);
      if (existing) {
        existing.count++;
      } else {
        bankMap.set(slug, {
          name: o.bankName,
          count: 1,
          logo: o.bankLogo,
          color: o.bankColor,
        });
      }
    }
    return Array.from(bankMap.entries())
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [offers]);

  // Stats
  const totalReward = offers.reduce((sum, o) => sum + o.reward, 0);

  // Filter
  const filtered = useMemo(() => {
    let result = [...offers];

    if (selectedBank) {
      result = result.filter(
        (o) => bankNameToSlug(o.bankName) === selectedBank
      );
    }

    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.bankName.toLowerCase().includes(q) ||
          o.offerName.toLowerCase().includes(q)
      );
    }

    if (rewardRange === "low") {
      result = result.filter((o) => o.reward <= 200);
    } else if (rewardRange === "mid") {
      result = result.filter((o) => o.reward > 200 && o.reward <= 400);
    } else if (rewardRange === "high") {
      result = result.filter((o) => o.reward > 400);
    }

    return result;
  }, [offers, selectedBank, searchQuery, rewardRange]);

  const hasFilters = selectedBank || searchQuery || rewardRange !== "all";

  const clearFilters = () => {
    setSelectedBank(null);
    setSearchQuery("");
    setRewardRange("all");
  };

  return (
    <div>
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{offers.length}</p>
            <p className="text-xs text-muted-foreground">ofert w archiwum</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{banks.length}</p>
            <p className="text-xs text-muted-foreground">banków</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {totalReward.toLocaleString("pl-PL")} zł
            </p>
            <p className="text-xs text-muted-foreground">premii w historii</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {Math.max(...offers.map((o) => o.reward), 0)} zł
            </p>
            <p className="text-xs text-muted-foreground">najwyższa premia</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Szukaj po nazwie banku lub oferty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Szukaj ofert w archiwum"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "low", "mid", "high"] as const).map((range) => {
            const labels = {
              all: "Wszystkie",
              low: "≤200 zł",
              mid: "201-400 zł",
              high: ">400 zł",
            };
            return (
              <Button
                key={range}
                variant={rewardRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setRewardRange(range)}
                className="text-xs"
              >
                {labels[range]}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Bank pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={!selectedBank ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedBank(null)}
          className="text-xs"
        >
          Wszystkie banki ({offers.length})
        </Button>
        {banks.map((bank) => (
          <Button
            key={bank.slug}
            variant={selectedBank === bank.slug ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedBank(bank.slug === selectedBank ? null : bank.slug)}
            className="text-xs gap-1.5"
          >
            {bank.logo && bank.logo.startsWith("http") ? (
              <Image
                src={bank.logo}
                alt=""
                className="h-4 w-4 rounded object-contain"
                width={16}
                height={16}
              />
            ) : (
              <div
                className="h-4 w-4 rounded text-white text-[8px] flex items-center justify-center font-bold"
                style={{ backgroundColor: bank.color }}
              >
                {bank.name.charAt(0)}
              </div>
            )}
            {bank.name} ({bank.count})
          </Button>
        ))}
      </div>

      {/* Active filters indicator */}
      {hasFilters && (
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Pokazuję {filtered.length} z {offers.length} ofert
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs gap-1 ml-auto"
          >
            <X className="h-3 w-3" />
            Wyczyść filtry
          </Button>
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-2xl">
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
          <p className="text-muted-foreground text-sm">
            Brak ofert pasujących do filtrów.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="mt-3"
          >
            Wyczyść filtry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((offer) => (
            <Card
              key={offer.id}
              className="opacity-75 grayscale hover:opacity-100 hover:grayscale-0 focus-within:opacity-100 focus-within:grayscale-0 transition-all"
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  {offer.bankLogo && offer.bankLogo.startsWith("http") ? (
                    <Image
                      src={offer.bankLogo}
                      alt={`${offer.bankName} logo`}
                      className="h-10 w-10 rounded-xl object-contain bg-white p-1 shrink-0 opacity-50"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold shrink-0 opacity-50"
                      style={{ backgroundColor: offer.bankColor }}
                    >
                      {offer.bankName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{offer.bankName}</p>
                      <Link href={`/bank/${bankNameToSlug(offer.bankName)}`}>
                        <Badge variant="outline" className="text-[10px] cursor-pointer">
                          hub →
                        </Badge>
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {offer.offerName}
                    </p>
                    {offer.deadline && (
                      <p className="text-[10px] text-muted-foreground">
                        wygasła: {new Date(offer.deadline).toLocaleDateString("pl-PL")}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-muted-foreground">
                      {offer.reward} zł
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      było do zdobycia
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="gap-1" asChild>
                    <Link href={`/oferta/${offer.slug}`}>
                      Szczegóły <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
