"use client";

import { adminFetch } from "@/lib/admin-fetch";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";

interface SyncLog {
  id: string;
  created_at: string;
  offers_found: number;
  offers_created: number;
  offers_updated: number;
  offers_deactivated: number;
  duration_ms: number;
  errors: string[];
}

interface SyncResult {
  success?: boolean;
  error?: string;
  offers_found?: number;
  created?: number;
  updated?: number;
  deactivated?: number;
  rewards_updated?: number;
  quality_issues?: number;
  scraped_from_pages?: number;
  ai_parser?: string;
  errors?: number;
  duration_ms?: number;
}

export default function AdminSyncPage() {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);
  const [enrichResult, setEnrichResult] = useState<{
    error?: string; processed?: number; enriched?: number; scraped?: number;
    failed?: number; remaining?: string; duration_ms?: number;
  } | null>(null);

  const fetchLogs = () => {
    setLoading(true);
    adminFetch("/api/admin/sync-logs")
      .then((r) => r.json())
      .then((d) => setLogs(d.logs || []))
      .catch(() => setError("Nie udało się załadować logów."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const triggerSync = async () => {
    setSyncing(true);
    setLastResult(null);
    setError("");
    try {
      const res = await adminFetch("/api/admin/trigger-sync", { method: "POST" });

      // Zabezpieczenie przed non-JSON odpowiedzią (np. timeout HTML z Vercel)
      const text = await res.text();
      let data: SyncResult;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: `Serwer zwrócił nieoczekiwaną odpowiedź (HTTP ${res.status}). Możliwy timeout (>60s) lub błąd serwera. Sprawdź logi Vercel.` };
      }

      if (res.ok && !data.error) {
        setLastResult(data);
        fetchLogs();
      } else {
        setLastResult({ error: data.error || "Nieznany błąd" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się połączyć z serwerem.";
      setLastResult({ error: msg });
    } finally {
      setSyncing(false);
    }
  };

  const triggerEnrich = async () => {
    setEnriching(true);
    setEnrichResult(null);
    try {
      const res = await adminFetch("/api/admin/enrich", { method: "POST" });
      const text = await res.text();
      let data: Record<string, unknown>;
      try { data = JSON.parse(text); } catch { data = { error: `HTTP ${res.status} — nieoczekiwana odpowiedź` }; }
      setEnrichResult(data);
    } catch (err) {
      setEnrichResult({ error: err instanceof Error ? err.message : "Błąd połączenia" });
    } finally {
      setEnriching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && logs.length === 0) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="mx-auto h-8 w-8 text-destructive mb-2" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sync logi ({logs.length})</h1>
        <div className="flex gap-2">
          <Button onClick={triggerSync} disabled={syncing || enriching} className="gap-2" size="sm">
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {syncing ? "Synchronizuję..." : "Uruchom sync"}
          </Button>
          <Button onClick={triggerEnrich} disabled={syncing || enriching} variant="outline" className="gap-2" size="sm" title="Parsuje kwoty premii przez AI dla ofert z reward=0 (max 8 na raz)">
            {enriching ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>🤖</span>}
            {enriching ? "Przetwarzam AI..." : "Wzbogać AI"}
          </Button>
        </div>
      </div>

      {lastResult && (
        <div className={`rounded-lg border p-4 text-sm ${lastResult.error ? "border-red-300 bg-red-50 dark:bg-red-950/20" : "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20"}`}>
          {lastResult.error ? (
            <div className="flex items-start gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Sync nie powiódł się</p>
                <p className="text-xs mt-1 font-mono">{lastResult.error}</p>
              </div>
            </div>
          ) : (
            <div className="text-emerald-800 dark:text-emerald-300">
              <p className="font-medium mb-2">✓ Sync zakończony ({((lastResult.duration_ms || 0) / 1000).toFixed(1)}s)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div><span className="text-muted-foreground">Znalezionych:</span> <strong>{lastResult.offers_found}</strong></div>
                <div><span className="text-muted-foreground">Nowych:</span> <strong className="text-emerald-600">+{lastResult.created}</strong></div>
                <div><span className="text-muted-foreground">Zaktualizowanych:</span> <strong>{lastResult.updated}</strong></div>
                <div><span className="text-muted-foreground">Dezaktywowanych:</span> <strong>{lastResult.deactivated}</strong></div>
                {(lastResult.quality_issues ?? 0) > 0 && (
                  <div><span className="text-muted-foreground">Problemy jakości:</span> <strong className="text-amber-600">{lastResult.quality_issues}</strong></div>
                )}
                {(lastResult.scraped_from_pages ?? 0) > 0 && (
                  <div><span className="text-muted-foreground">Scrapowane:</span> <strong>{lastResult.scraped_from_pages}</strong></div>
                )}
                {(lastResult.rewards_updated ?? 0) > 0 && (
                  <div><span className="text-muted-foreground">Premie zaktualizowane:</span> <strong>{lastResult.rewards_updated}</strong></div>
                )}
                {(lastResult.errors ?? 0) > 0 && (
                  <div><span className="text-muted-foreground">Błędy:</span> <strong className="text-red-600">{lastResult.errors}</strong></div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {enrichResult && (
        <div className={`rounded-lg border p-4 text-sm ${enrichResult.error ? "border-red-300 bg-red-50 dark:bg-red-950/20" : "border-blue-300 bg-blue-50 dark:bg-blue-950/20"}`}>
          {enrichResult.error ? (
            <div className="flex items-start gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Wzbogacanie nie powiodło się</p>
                <p className="text-xs mt-1 font-mono">{String(enrichResult.error)}</p>
              </div>
            </div>
          ) : (
            <div className="text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-2">🤖 AI enrichment zakończony ({((Number(enrichResult.duration_ms) || 0) / 1000).toFixed(1)}s)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div><span className="text-muted-foreground">Przetworzonych:</span> <strong>{String(enrichResult.processed)}</strong></div>
                <div><span className="text-muted-foreground">Uzupełnionych:</span> <strong className="text-emerald-600">{String(enrichResult.enriched)}</strong></div>
                <div><span className="text-muted-foreground">Przez scraping:</span> <strong>{String(enrichResult.scraped)}</strong></div>
                <div><span className="text-muted-foreground">Nie znaleziono:</span> <strong className="text-amber-600">{String(enrichResult.failed)}</strong></div>
              </div>
              {enrichResult.remaining && String(enrichResult.remaining) !== "brak" && (
                <p className="text-xs mt-2 text-amber-600">⚠️ {String(enrichResult.remaining)}</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {new Date(log.created_at).toLocaleString("pl-PL")}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                    <span>Znalezionych: {log.offers_found}</span>
                    <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      +{log.offers_created} nowych
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      ↻{log.offers_updated} aktual.
                    </Badge>
                    {log.offers_deactivated > 0 && (
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                        −{log.offers_deactivated} dezaktyw.
                      </Badge>
                    )}
                    <span className="text-muted-foreground">
                      {(log.duration_ms / 1000).toFixed(1)}s
                    </span>
                    {log.errors && log.errors.length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {log.errors.length} błędów
                      </Badge>
                    )}
                  </div>
                  {log.errors && log.errors.length > 0 && (
                    <div className="mt-2 text-xs text-red-500 space-y-0.5">
                      {log.errors.slice(0, 3).map((err, i) => (
                        <p key={i} className="truncate">
                          {err}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {logs.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Brak logów sync.
          </p>
        )}
      </div>
    </div>
  );
}
