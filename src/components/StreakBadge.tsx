"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export function StreakBadge() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<StreakData | null>(null);

  useEffect(() => {
    if (!user) return;

    // Record activity and get streak
    fetch("/api/gamification/streak", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setStreak(d.streak))
      .catch(() => {});
  }, [user]);

  if (!streak || streak.current_streak === 0) return null;

  return (
    <Card className="border-orange-200 dark:border-orange-800/40 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/40">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {streak.current_streak}
              </p>
              <p className="text-sm font-medium text-orange-600/80 dark:text-orange-400/80">
                {streak.current_streak === 1 ? "dzień" : 
                 streak.current_streak < 5 ? "dni" : "dni"} streak 🔥
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Rekord: {streak.longest_streak} dni
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
