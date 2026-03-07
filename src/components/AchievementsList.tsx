"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACHIEVEMENTS, getAchievement } from "@/lib/achievements";
import { Trophy } from "lucide-react";

interface UnlockedAchievement {
  achievement_type: string;
  unlocked_at: string;
}

export function AchievementsList() {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>([]);

  useEffect(() => {
    if (!user) return;

    fetch("/api/gamification/achievements")
      .then((r) => r.json())
      .then((d) => setUnlocked(d.achievements || []))
      .catch(() => {});
  }, [user]);

  const unlockedTypes = new Set(unlocked.map((a) => a.achievement_type));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-amber-500" />
          Odznaki ({unlocked.length}/{ACHIEVEMENTS.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedTypes.has(achievement.type);
            const unlockedData = unlocked.find(
              (a) => a.achievement_type === achievement.type
            );

            return (
              <div
                key={achievement.type}
                className={`rounded-lg border p-3 text-center transition-all ${
                  isUnlocked
                    ? "border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/20"
                    : "opacity-40 grayscale"
                }`}
                title={
                  isUnlocked
                    ? `Odblokowane: ${new Date(unlockedData!.unlocked_at).toLocaleDateString("pl-PL")}`
                    : achievement.description
                }
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <p className="text-xs font-medium leading-tight">
                  {achievement.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
