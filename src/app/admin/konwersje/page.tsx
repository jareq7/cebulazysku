// @author Claude Code (claude-opus-4-6) | 2026-03-17 — full conversions dashboard

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  MousePointerClick,
  TrendingUp,
  Globe,
  RefreshCw,
} from "lucide-react";

interface ConversionsData {
  totalClicks: number;
  daily: { date: string; clicks: number }[];
  topOffers: { offer_id: string; clicks: number }[];
  utmSources: { source: string; clicks: number }[];
  period: number;
}

export default function KonwersjePage() {
  const [data, setData] = useState<ConversionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const adminPassword = localStorage.getItem("adminPassword") || "";
      const res = await fetch(`/api/admin/conversions?days=${days}`, {
        headers: { "x-admin-password": adminPassword },
      });
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const maxDaily = data ? Math.max(...data.daily.map((d) => d.clicks), 1) : 1;
  const maxOffer = data?.topOffers?.[0]?.clicks || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Konwersje</h1>
        <div className="flex items-center gap-2">
          {[7, 14, 30, 90].map((d) => (
            <Button
              key={d}
              variant={days === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDays(d)}
            >
              {d}d
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={MousePointerClick}
          label="Kliknięcia"
          value={data?.totalClicks ?? 0}
          loading={loading}
        />
        <StatCard
          icon={TrendingUp}
          label="Śr. dziennie"
          value={data ? Math.round(data.totalClicks / Math.max(data.daily.length, 1)) : 0}
          loading={loading}
        />
        <StatCard
          icon={BarChart3}
          label="Unikalne oferty"
          value={data?.topOffers?.length ?? 0}
          loading={loading}
        />
        <StatCard
          icon={Globe}
          label="Źródła ruchu"
          value={data?.utmSources?.length ?? 0}
          loading={loading}
        />
      </div>

      {/* Daily chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kliknięcia dziennie</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              Ładowanie...
            </div>
          ) : data && data.daily.length > 0 ? (
            <div className="flex items-end gap-[2px] h-48">
              {data.daily.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 group relative"
                  title={`${d.date}: ${d.clicks}`}
                >
                  <div
                    className="bg-emerald-500 hover:bg-emerald-400 transition-colors rounded-t-sm w-full min-h-[2px]"
                    style={{ height: `${(d.clicks / maxDaily) * 100}%` }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    {d.date}: {d.clicks}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              Brak danych za wybrany okres
            </div>
          )}
          {data && data.daily.length > 0 && (
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{data.daily[0]?.date}</span>
              <span>{data.daily[data.daily.length - 1]?.date}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top offers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top oferty (kliknięcia)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Ładowanie...</p>
            ) : data?.topOffers && data.topOffers.length > 0 ? (
              <div className="space-y-3">
                {data.topOffers.map((o, i) => (
                  <div key={o.offer_id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="truncate font-medium">
                        {i + 1}. {o.offer_id}
                      </span>
                      <span className="text-muted-foreground ml-2 shrink-0">
                        {o.clicks}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(o.clicks / maxOffer) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Brak danych</p>
            )}
          </CardContent>
        </Card>

        {/* UTM sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Źródła ruchu (UTM)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Ładowanie...</p>
            ) : data?.utmSources && data.utmSources.length > 0 ? (
              <div className="space-y-3">
                {data.utmSources.map((s) => (
                  <div key={s.source} className="flex justify-between text-sm">
                    <span className="font-medium">{s.source}</span>
                    <span className="text-muted-foreground">{s.clicks}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Brak danych UTM</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {loading ? "—" : value.toLocaleString("pl-PL")}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
