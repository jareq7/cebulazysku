// @author Claude Code (claude-opus-4-6) | 2026-03-18
"use client";

import { adminFetch } from "@/lib/admin-fetch";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCw,
  Wallet,
  Link2,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react";

interface ConversandOffer {
  id: number;
  name: string;
  payout: number;
  payout_type: string;
  currency: string;
  matched: boolean;
  matchedOfferId: string | null;
  matchedSlug: string | null;
  hasAffiliateUrl: boolean;
  isPreferred: boolean;
}

interface OverviewData {
  balance: { balance: number; currency: string; threshold: number };
  conversandOfferCount: number;
  matchedCount: number;
  unmatchedCount: number;
  withUrlCount: number;
  offers: ConversandOffer[];
}

interface StatEntry {
  date: string;
  program: string;
  clicks: number;
  leads: number;
  commission: number;
}

export default function ConversandAdminPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [stats, setStats] = useState<StatEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/conversand?action=overview");
      if (res.ok) {
        setOverview(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await adminFetch("/api/admin/conversand?action=stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || []);
      }
    } catch {
      // ignore
    } finally {
      setStatsLoading(false);
    }
  };

  const runSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const cronSecret = prompt("Podaj CRON_SECRET:");
      if (!cronSecret) { setSyncing(false); return; }
      const res = await fetch("/api/sync-conversand", {
        method: "POST",
        headers: { Authorization: `Bearer ${cronSecret}` },
      });
      const data = await res.json();
      if (data.success) {
        setSyncResult(`Sync OK: ${data.matched} matched, ${data.new_created} new, ${data.skipped} skipped, ${data.errors} errors (${data.duration_ms}ms)`);
        fetchOverview();
      } else {
        setSyncResult(`Error: ${data.error}`);
      }
    } catch (err) {
      setSyncResult(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Conversand</h1>
          <p className="text-sm text-muted-foreground">
            Sieć CPA — oferty bankowe z prowizją
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchOverview}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Odśwież
          </Button>
          <Button size="sm" onClick={runSync} disabled={syncing}>
            {syncing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            Sync teraz
          </Button>
        </div>
      </div>

      {syncResult && (
        <div className="rounded-lg border p-3 text-sm bg-muted">
          {syncResult}
        </div>
      )}

      {/* Overview cards */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4 text-center">
              <Wallet className="mx-auto h-5 w-5 text-emerald-500 mb-1" />
              <p className="text-xl font-bold text-emerald-600">
                {overview.balance.balance.toFixed(2)} {overview.balance.currency}
              </p>
              <p className="text-xs text-muted-foreground">
                Saldo (próg: {overview.balance.threshold} {overview.balance.currency})
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 text-center">
              <BarChart3 className="mx-auto h-5 w-5 text-blue-500 mb-1" />
              <p className="text-xl font-bold">{overview.conversandOfferCount}</p>
              <p className="text-xs text-muted-foreground">Ofert w Conversand</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 text-center">
              <CheckCircle className="mx-auto h-5 w-5 text-green-500 mb-1" />
              <p className="text-xl font-bold text-green-600">{overview.matchedCount}</p>
              <p className="text-xs text-muted-foreground">Dopasowanych</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 text-center">
              <Link2 className="mx-auto h-5 w-5 text-amber-500 mb-1" />
              <p className="text-xl font-bold text-amber-600">{overview.withUrlCount}</p>
              <p className="text-xs text-muted-foreground">Z linkiem afiliacyjnym</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Statystyki (ostatnie 30 dni)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : stats.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Brak danych statystycznych
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 font-medium">Program</th>
                    <th className="py-2 font-medium text-right">Kliknięcia</th>
                    <th className="py-2 font-medium text-right">Leady</th>
                    <th className="py-2 font-medium text-right">Prowizja</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2">{s.program}</td>
                      <td className="py-2 text-right">{s.clicks}</td>
                      <td className="py-2 text-right">{s.leads}</td>
                      <td className="py-2 text-right font-medium text-emerald-600">
                        {s.commission.toFixed(2)} PLN
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offers list */}
      <Card>
        <CardHeader>
          <CardTitle>Oferty Conversand</CardTitle>
        </CardHeader>
        <CardContent>
          {overview?.offers && overview.offers.length > 0 ? (
            <div className="space-y-2">
              {overview.offers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{offer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {offer.payout} {offer.currency} ({offer.payout_type})
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {offer.matched ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Dopasowane
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                        <XCircle className="h-3 w-3" />
                        Niedopasowane
                      </Badge>
                    )}
                    {offer.hasAffiliateUrl && (
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Link2 className="h-3 w-3" />
                        Link
                      </Badge>
                    )}
                    {offer.isPreferred && (
                      <Badge className="text-xs">Preferred</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Brak ofert
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
