// @author Claude Code (claude-opus-4-6) | 2026-03-18
"use client";

import { adminFetch } from "@/lib/admin-fetch";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Mic,
  Bot,
  Palette,
  Database,
  RefreshCw,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsageData {
  elevenlabs: {
    character_count: number;
    character_limit: number;
    can_extend_character_limit: boolean;
    next_reset: string;
  } | null;
  openrouter: {
    credits_remaining: number;
    credits_used: number;
  } | null;
  canva: {
    connected: boolean;
    expires_at: string | null;
  };
  supabase: {
    blog_posts: number;
    offers: number;
    users: number;
    sync_logs: number;
    canva_tokens: number;
  };
  leadstar: {
    last_sync: string | null;
    offers_found: number;
  };
}

function ProgressBar({
  value,
  max,
  color = "bg-emerald-500",
}: {
  value: number;
  max: number;
  color?: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const warn = pct > 80;
  return (
    <div className="w-full bg-muted rounded-full h-2.5 mt-2">
      <div
        className={`h-2.5 rounded-full transition-all ${warn ? "bg-amber-500" : color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function formatNumber(n: number): string {
  return n.toLocaleString("pl-PL");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminUsagePage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsage = () => {
    setLoading(true);
    setError("");
    adminFetch("/api/admin/usage")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setError("Nie udało się pobrać danych."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-500 mb-2" />
        <p className="text-muted-foreground">{error || "Brak danych"}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={fetchUsage}>
          Spróbuj ponownie
        </Button>
      </div>
    );
  }

  const elevenPct = data.elevenlabs
    ? Math.round((data.elevenlabs.character_count / data.elevenlabs.character_limit) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Zużycie zasobów</h1>
        </div>
        <Button variant="outline" size="sm" onClick={fetchUsage} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Odśwież
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ElevenLabs */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Mic className="h-4 w-4 text-violet-500" />
                ElevenLabs (TTS)
              </CardTitle>
              {data.elevenlabs ? (
                <Badge
                  variant={elevenPct > 80 ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {elevenPct}%
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">Brak klucza</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {data.elevenlabs ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Znaki użyte</span>
                  <span className="font-mono font-medium">
                    {formatNumber(data.elevenlabs.character_count)} / {formatNumber(data.elevenlabs.character_limit)}
                  </span>
                </div>
                <ProgressBar
                  value={data.elevenlabs.character_count}
                  max={data.elevenlabs.character_limit}
                  color="bg-violet-500"
                />
                {data.elevenlabs.next_reset && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Reset: {formatDate(data.elevenlabs.next_reset)}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Brak klucza ELEVENLABS_API_KEY
              </p>
            )}
          </CardContent>
        </Card>

        {/* OpenRouter */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Bot className="h-4 w-4 text-blue-500" />
                OpenRouter (AI)
              </CardTitle>
              {data.openrouter ? (
                <Badge variant="secondary" className="text-xs">Aktywny</Badge>
              ) : (
                <Badge variant="outline" className="text-xs">Brak klucza</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {data.openrouter ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zużyte kredyty</span>
                  <span className="font-mono font-medium">
                    ${data.openrouter.credits_used.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pozostałe</span>
                  <span className="font-mono font-medium">
                    ${data.openrouter.credits_remaining.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Brak klucza OPENROUTER_API_KEY
              </p>
            )}
          </CardContent>
        </Card>

        {/* Canva */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4 text-pink-500" />
                Canva (Design)
              </CardTitle>
              {data.canva.connected ? (
                <Badge className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Połączony
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">Niepołączony</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {data.canva.connected ? (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status tokenu</span>
                  <span className="font-medium">
                    {data.canva.expires_at && new Date(data.canva.expires_at) > new Date()
                      ? "Aktywny"
                      : "Wygasły"}
                  </span>
                </div>
                {data.canva.expires_at && (
                  <p className="text-xs text-muted-foreground">
                    Wygasa: {formatDate(data.canva.expires_at)}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Połącz Canva w zakładce Blog
              </p>
            )}
          </CardContent>
        </Card>

        {/* LeadStar Sync */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-orange-500" />
                LeadStar (Feed)
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {data.supabase.offers} ofert
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ostatni sync</span>
                <span className="font-medium">
                  {data.leadstar.last_sync
                    ? formatDate(data.leadstar.last_sync)
                    : "Nigdy"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ofert w feedzie</span>
                <span className="font-mono font-medium">
                  {data.leadstar.offers_found}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Synców w logach</span>
                <span className="font-mono font-medium">
                  {data.supabase.sync_logs}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supabase DB summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-500" />
            Supabase (Baza danych)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Oferty", value: data.supabase.offers },
              { label: "Artykuły", value: data.supabase.blog_posts },
              { label: "Użytkownicy", value: data.supabase.users },
              { label: "Sync logi", value: data.supabase.sync_logs },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-2xl font-bold">{formatNumber(item.value)}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gemini info */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Bot className="h-4 w-4 shrink-0" />
            <span>
              <strong>Gemini</strong> — darmowy tier (bez API monitoringu zużycia).
              Modele: gemini-2.0-flash, gemini-2.0-flash-lite.
              Limit: ~1500 req/dzień.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
