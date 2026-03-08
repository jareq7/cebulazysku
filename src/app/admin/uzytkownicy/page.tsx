"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  AlertTriangle,
  Search,
  Users,
  UserPlus,
  Target,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface UserSummary {
  total_users: number;
  new_last_7_days: number;
  new_last_30_days: number;
  users_tracking: number;
  total_tracked_offers: number;
}

interface UserRow {
  user_id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  tracked_offers_count: number;
  conditions_completed: number;
}

export default function AdminUsersPage() {
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "tracking" | "completed">("date");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => {
        setSummary(d.summary);
        setUsers(d.users || []);
      })
      .catch(() => setError("Nie udało się załadować statystyk użytkowników."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users
    .filter((u) =>
      u.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "tracking":
          return b.tracked_offers_count - a.tracked_offers_count;
        case "completed":
          return b.conditions_completed - a.conditions_completed;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="mx-auto h-8 w-8 text-destructive mb-2" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (d: string | null) => {
    if (!d) return "Nigdy";
    return new Date(d).toLocaleString("pl-PL", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isNew = (d: string) =>
    new Date(d).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Użytkownicy</h1>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Card>
            <CardContent className="pt-5 pb-4 text-center">
              <Users className="mx-auto h-5 w-5 text-blue-500 mb-1" />
              <p className="text-2xl font-bold">{summary.total_users}</p>
              <p className="text-xs text-muted-foreground">Wszystkich</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 text-center">
              <UserPlus className="mx-auto h-5 w-5 text-emerald-500 mb-1" />
              <p className="text-2xl font-bold text-emerald-600">{summary.new_last_7_days}</p>
              <p className="text-xs text-muted-foreground">Nowi (7 dni)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 text-center">
              <UserPlus className="mx-auto h-5 w-5 text-blue-400 mb-1" />
              <p className="text-2xl font-bold text-blue-500">{summary.new_last_30_days}</p>
              <p className="text-xs text-muted-foreground">Nowi (30 dni)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 text-center">
              <Target className="mx-auto h-5 w-5 text-amber-500 mb-1" />
              <p className="text-2xl font-bold text-amber-600">{summary.users_tracking}</p>
              <p className="text-xs text-muted-foreground">Śledzą oferty</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 text-center">
              <TrendingUp className="mx-auto h-5 w-5 text-purple-500 mb-1" />
              <p className="text-2xl font-bold text-purple-600">{summary.total_tracked_offers}</p>
              <p className="text-xs text-muted-foreground">Śledzonych ofert</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj po emailu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {(
            [
              { key: "date", label: "Najnowsi" },
              { key: "tracking", label: "Najwięcej ofert" },
              { key: "completed", label: "Najwięcej warunków" },
            ] as const
          ).map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                sortBy === s.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users list */}
      <div className="space-y-2">
        {filtered.map((user) => (
          <Card key={user.user_id} className="hover:shadow-sm transition-shadow">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-bold shrink-0">
                  {user.email.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    {isNew(user.created_at) && (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] px-1.5 py-0">
                        Nowy
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>Rejestracja: {formatDate(user.created_at)}</span>
                    <span>•</span>
                    <span>Ostatnie logowanie: {formatDateTime(user.last_sign_in_at)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center" title="Śledzonych ofert">
                    <p className={`text-sm font-bold ${user.tracked_offers_count > 0 ? "text-amber-600" : "text-muted-foreground"}`}>
                      {user.tracked_offers_count}
                    </p>
                    <p className="text-[10px] text-muted-foreground">ofert</p>
                  </div>
                  <div className="text-center" title="Spełnionych warunków">
                    <div className="flex items-center gap-0.5 justify-center">
                      {user.conditions_completed > 0 && (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      )}
                      <p className={`text-sm font-bold ${user.conditions_completed > 0 ? "text-emerald-600" : "text-muted-foreground"}`}>
                        {user.conditions_completed}
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">warunków</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Brak użytkowników pasujących do wyszukiwania.
          </p>
        )}
      </div>
    </div>
  );
}
