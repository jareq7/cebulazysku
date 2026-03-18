"use client";

import { useState, useMemo, useEffect } from "react";
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
import { useUserBanks } from "@/context/UserBanksContext";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics-events";

type Difficulty = "easy" | "medium" | "hard";
type SortOption = "reward-desc" | "reward-asc" | "deadline" | "difficulty";
type AccountType = "personal" | "business" | "both";

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

const accountTypeLabels: Record<AccountType, string> = {
  personal: "Osobiste",
  business: "Firmowe",
  both: "Oba",
};

export function OfferFilters({ offers }: { offers: BankOffer[] }) {
  const [activeDifficulties, setActiveDifficulties] = useState<Difficulty[]>([]);
  const [sort, setSort] = useState<SortOption>("reward-desc");
  const [hideYoung, setHideYoung] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("personal");
  const [hideMyBanks, setHideMyBanks] = useState(false);
  const [onlyWithReward, setOnlyWithReward] = useState(true);
  const { userBanks, isLoaded: banksLoaded } = useUserBanks();
  const { user } = useAuth();

  // Wczytaj preferencje użytkownika
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("notification_preferences")
      .select("account_type, show_young")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setAccountType((data.account_type as AccountType) ?? "personal");
          setHideYoung(!(data.show_young ?? true));
        }
      });
  }, [user]);

  const savePrefs = async (updates: Record<string, unknown>) => {
    if (!user) return;
    const supabase = createClient();
    await supabase.from("notification_preferences").upsert(
      { user_id: user.id, ...updates },
      { onConflict: "user_id" }
    );
  };

  const handleAccountType = (type: AccountType) => {
    setAccountType(type);
    savePrefs({ account_type: type });
  };

  const toggleYoung = () => {
    const next = !hideYoung;
    setHideYoung(next);
    savePrefs({ show_young: !next });
  };

  const toggleDifficulty = (d: Difficulty) => {
    setActiveDifficulties((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  // Track view_item_list on mount
  useEffect(() => {
    trackEvent(AnalyticsEvents.VIEW_ITEM_LIST, {
      item_list_name: "all_offers",
      items: offers.slice(0, 10).map((o, i) => ({
        item_id: o.slug,
        item_name: o.bankName,
        price: o.reward,
        currency: "PLN",
        index: i,
      })),
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track search/filter changes
  useEffect(() => {
    if (activeDifficulties.length > 0 || accountType !== "personal" || hideYoung || hideMyBanks) {
      trackEvent(AnalyticsEvents.SEARCH, {
        search_term: [
          ...activeDifficulties,
          accountType !== "personal" ? accountType : "",
          hideYoung ? "hide_young" : "",
          hideMyBanks ? "hide_my_banks" : "",
        ].filter(Boolean).join(","),
      });
    }
  }, [activeDifficulties, accountType, hideYoung, hideMyBanks]);

  const filtered = useMemo(() => {
    let result = [...offers];

    if (activeDifficulties.length > 0) {
      result = result.filter((o) => activeDifficulties.includes(o.difficulty));
    }

    if (accountType === "personal") {
      result = result.filter((o) => !o.isBusiness);
    } else if (accountType === "business") {
      result = result.filter((o) => o.isBusiness);
    }
    // "both" — bez filtrowania

    if (onlyWithReward) {
      result = result.filter((o) => o.hasUserReward);
    }

    if (hideYoung) {
      result = result.filter((o) => !o.forYoung);
    }

    if (hideMyBanks && userBanks.length > 0) {
      result = result.filter((o) => !userBanks.includes(o.bankName));
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
  }, [offers, activeDifficulties, sort, hideYoung, hideMyBanks, userBanks, accountType, onlyWithReward]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filtruj:</span>

          {/* Typ konta */}
          <div className="flex items-center rounded-lg border overflow-hidden">
            {(["personal", "business", "both"] as AccountType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleAccountType(type)}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  accountType === type
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                {accountTypeLabels[type]}
              </button>
            ))}
          </div>

          {/* Tylko z premią / Wszystkie */}
          <div className="flex items-center rounded-lg border overflow-hidden">
            <button
              onClick={() => setOnlyWithReward(true)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                onlyWithReward
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              Tylko z premią
            </button>
            <button
              onClick={() => setOnlyWithReward(false)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                !onlyWithReward
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              Wszystkie
            </button>
          </div>

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
          <Badge
            variant={hideYoung ? "default" : "outline"}
            className="cursor-pointer select-none"
            onClick={toggleYoung}
          >
            {hideYoung ? "✕ Dla młodych ukryte" : "Ukryj: dla młodych"}
          </Badge>
          {banksLoaded && userBanks.length > 0 && (
            <Badge
              variant={hideMyBanks ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => setHideMyBanks(!hideMyBanks)}
            >
              {hideMyBanks ? "✕ Moje banki ukryte" : "Ukryj: moje banki"}
            </Badge>
          )}
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
