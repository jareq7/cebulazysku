"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CheckCircle,
  MessageSquare,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface Stats {
  totalOffers: number;
  activeOffers: number;
  unreadMessages: number;
  lastSync: {
    created_at: string;
    offers_found: number;
    offers_created: number;
    offers_updated: number;
    offers_deactivated: number;
    duration_ms: number;
    errors: number;
  } | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setError("Nie udało się załadować statystyk."))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Oferty łącznie</p>
                <p className="text-2xl font-bold">{stats?.totalOffers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-sm text-muted-foreground">Aktywne oferty</p>
                <p className="text-2xl font-bold">{stats?.activeOffers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Nieprzeczytane wiadomości
                </p>
                <p className="text-2xl font-bold">{stats?.unreadMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Ostatni sync</p>
                {stats?.lastSync ? (
                  <p className="text-sm font-medium">
                    {new Date(stats.lastSync.created_at).toLocaleString(
                      "pl-PL"
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Brak danych</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last sync details */}
      {stats?.lastSync && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Szczegóły ostatniego sync</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div>
                <p className="text-xs text-muted-foreground">Znalezionych</p>
                <p className="text-lg font-bold">
                  {stats.lastSync.offers_found}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Utworzonych</p>
                <p className="text-lg font-bold text-emerald-600">
                  {stats.lastSync.offers_created}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Zaktualizowanych
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {stats.lastSync.offers_updated}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dezaktywowanych</p>
                <p className="text-lg font-bold text-orange-600">
                  {stats.lastSync.offers_deactivated}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Czas / Błędy</p>
                <p className="text-sm font-medium">
                  {(stats.lastSync.duration_ms / 1000).toFixed(1)}s{" "}
                  {stats.lastSync.errors > 0 && (
                    <Badge variant="destructive" className="ml-1 text-xs">
                      {stats.lastSync.errors} błędów
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
