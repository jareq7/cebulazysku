// @author Claude Code (claude-opus-4-6) | 2026-03-14

"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";

interface Condition {
  id: string;
  type: string;
  label: string;
  description: string;
  requiredCount: number;
  perMonth: boolean;
  monthsRequired: number;
}

interface LogEntry {
  id: string;
  offer_id: string;
  bank_name: string;
  created_at: string;
  regex_conditions: Condition[];
  ai_conditions: Condition[];
  corrections: string[];
  verified: boolean;
}

interface Stats {
  total_verifications: number;
  with_corrections: number;
  with_corrections_pct: number;
  errors: number;
}

function ConditionDiff({ regex, ai }: { regex: Condition[]; ai: Condition[] }) {
  const maxLen = Math.max(regex.length, ai.length);
  const rows = [];

  for (let i = 0; i < maxLen; i++) {
    const r = regex[i];
    const a = ai[i];
    rows.push({ index: i, regex: r, ai: a });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 text-muted-foreground font-medium">Pole</th>
            <th className="text-left p-2 text-red-600 font-medium">Regex parser</th>
            <th className="text-left p-2 text-emerald-600 font-medium">AI output</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ index, regex: r, ai: a }) => {
            if (!r && a) {
              return (
                <tr key={index} className="border-b bg-emerald-50/50 dark:bg-emerald-950/20">
                  <td className="p-2 font-medium">Warunek {index + 1}</td>
                  <td className="p-2 text-muted-foreground italic">— brak —</td>
                  <td className="p-2">{a.label} ({a.type}, {a.requiredCount}x)</td>
                </tr>
              );
            }
            if (r && !a) {
              return (
                <tr key={index} className="border-b bg-red-50/50 dark:bg-red-950/20">
                  <td className="p-2 font-medium">Warunek {index + 1}</td>
                  <td className="p-2">{r.label} ({r.type}, {r.requiredCount}x)</td>
                  <td className="p-2 text-muted-foreground italic">— usunięty —</td>
                </tr>
              );
            }
            if (!r || !a) return null;

            const diffs: string[] = [];
            if (r.requiredCount !== a.requiredCount) diffs.push("requiredCount");
            if (r.perMonth !== a.perMonth) diffs.push("perMonth");
            if (r.monthsRequired !== a.monthsRequired) diffs.push("monthsRequired");
            if (r.type !== a.type) diffs.push("type");
            if (r.label !== a.label) diffs.push("label");

            if (diffs.length === 0) {
              return (
                <tr key={index} className="border-b">
                  <td className="p-2 font-medium">{r.label}</td>
                  <td className="p-2 text-muted-foreground" colSpan={2}>Bez zmian</td>
                </tr>
              );
            }

            return diffs.map((field) => (
              <tr key={`${index}-${field}`} className="border-b bg-amber-50/50 dark:bg-amber-950/20">
                <td className="p-2 font-medium">{r.label} → <span className="text-muted-foreground">{field}</span></td>
                <td className="p-2 text-red-600 line-through">{String((r as unknown as Record<string, unknown>)[field])}</td>
                <td className="p-2 text-emerald-600 font-medium">{String((a as unknown as Record<string, unknown>)[field])}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function AiLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<"all" | "corrections" | "errors">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const limit = 50;

  useEffect(() => {
    loadLogs();
  }, [page, filter]);

  async function loadLogs() {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/ai-logs?page=${page}&limit=${limit}&filter=${filter}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      setStats(data.stats || null);
    } catch {
      console.error("Failed to load AI logs");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Logi AI weryfikacji</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Historia korekt AI na warunkach sparsowanych przez regex parser.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{stats.total_verifications}</p>
              <p className="text-xs text-muted-foreground">Łącznie weryfikacji</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{stats.with_corrections}</p>
              <p className="text-xs text-muted-foreground">Z korektami</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{stats.with_corrections_pct}%</p>
              <p className="text-xs text-muted-foreground">% z korektami</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
              <p className="text-xs text-muted-foreground">Błędy AI</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "corrections", "errors"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => { setFilter(f); setPage(1); }}
          >
            {f === "all" ? "Wszystkie" : f === "corrections" ? "Z korektami" : "Błędy AI"}
          </Button>
        ))}
      </div>

      {/* Logs */}
      {loading ? (
        <p className="text-muted-foreground">Ładowanie...</p>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Brak logów — logi pojawią się po następnym syncu z AI weryfikacją.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const isExpanded = expandedId === log.id;
            const hasCorrections = log.corrections.length > 0;

            return (
              <Card key={log.id}>
                <CardHeader
                  className="pb-3 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : log.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {log.verified ? (
                        <CheckCircle2 className={`h-5 w-5 ${hasCorrections ? "text-amber-500" : "text-emerald-500"}`} />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <CardTitle className="text-base">{log.bank_name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleString("pl-PL")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasCorrections && (
                        <Badge variant="outline" className="text-amber-600 border-amber-300">
                          {log.corrections.length} korekta{log.corrections.length > 1 ? "y" : ""}
                        </Badge>
                      )}
                      {!log.verified && (
                        <Badge variant="destructive">Błąd AI</Badge>
                      )}
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-4">
                    {/* Corrections list */}
                    {hasCorrections && (
                      <div className="rounded-lg bg-amber-50/50 dark:bg-amber-950/20 p-3">
                        <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-2">Korekty:</p>
                        <ul className="space-y-1">
                          {log.corrections.map((c, i) => (
                            <li key={i} className="text-xs text-amber-700 dark:text-amber-400">• {c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Diff view */}
                    <ConditionDiff regex={log.regex_conditions} ai={log.ai_conditions} />
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Poprzednia
          </Button>
          <span className="text-sm text-muted-foreground">
            Strona {page} z {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Następna <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
