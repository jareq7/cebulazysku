// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-29
// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-30 — W9 fix: pluralize, shared type import
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { pluralize } from "@/lib/pluralize";
import type { LeaderboardEntry } from "@/data/types";

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
  return (
    <span className="text-sm font-bold text-muted-foreground w-5 text-center">
      {rank}
    </span>
  );
}

function getRankBg(rank: number): string {
  if (rank === 1) return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/40";
  if (rank === 2) return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700/40";
  if (rank === 3) return "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40";
  return "";
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then((data) => {
        setEntries(data.entries || []);
        setMonth(data.month || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Ranking cebularzy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-sm text-muted-foreground">
              Ranking pojawi się, gdy pierwsi cebularze zaczną obierać premie.
              Bądź pierwszy! 🧅
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Ranking cebularzy
          </CardTitle>
          {month && (
            <Badge variant="outline" className="text-xs">
              {month}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="divide-y">
          {entries.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 px-6 py-3 ${getRankBg(entry.rank)}`}
            >
              <div className="shrink-0">
                {getRankIcon(entry.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {entry.nickname}
                </p>
                <p className="text-xs text-muted-foreground">
                  {entry.offersCompleted} {pluralize(entry.offersCompleted, "premia", "premie", "premii")}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-emerald-600">
                  {entry.totalEarned.toLocaleString("pl-PL")} zł
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
