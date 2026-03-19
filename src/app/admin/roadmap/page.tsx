// @author Claude Code (claude-opus-4-6) | 2026-03-19 — read-only timeline from AI-TASKS.md
"use client";

import { adminFetch } from "@/lib/admin-fetch";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Bot,
  FileText,
  ChevronDown,
  ChevronRight,
  Zap,
  Clock,
  CheckCircle2,
  Circle,
  Map,
} from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string | null;
  status: "planned" | "in_progress" | "done";
  priority: number;
  category: string | null;
  worker: "claude" | "gemini" | null;
  source: "ai-tasks" | "manual";
  date: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  feature: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  bugfix: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  research: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  content: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  infra: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
  seo: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  ux: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
};

const WORKER_COLORS: Record<string, string> = {
  claude: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  gemini: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const PRIORITY_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: "Wysoki", color: "text-red-600 dark:text-red-400" },
  1: { label: "Średni", color: "text-amber-600 dark:text-amber-400" },
  2: { label: "Niski", color: "text-emerald-600 dark:text-emerald-400" },
};

function RoadmapCard({ item }: { item: RoadmapItem }) {
  const [expanded, setExpanded] = useState(false);
  const prio = PRIORITY_LABELS[item.priority];

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-sm ${
        item.status === "in_progress" ? "border-l-4 border-l-amber-500" : ""
      } ${item.status === "done" ? "opacity-70" : ""}`}
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="py-3 px-4">
        <div className="flex items-start gap-3">
          {/* Status icon */}
          <div className="mt-0.5 shrink-0">
            {item.status === "done" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : item.status === "in_progress" ? (
              <Zap className="h-4 w-4 text-amber-500" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2">
              <p className={`text-sm font-medium leading-snug ${item.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                {item.title}
              </p>
              {expanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {item.worker && (
                <Badge className={`text-[10px] px-1.5 py-0 gap-0.5 ${WORKER_COLORS[item.worker]}`}>
                  <Bot className="h-2.5 w-2.5" />
                  {item.worker === "claude" ? "Claude" : "Gemini"}
                </Badge>
              )}
              {item.category && (
                <Badge className={`text-[10px] px-1.5 py-0 ${CATEGORY_COLORS[item.category] || "bg-gray-100 text-gray-600"}`}>
                  {item.category}
                </Badge>
              )}
              {prio && item.status !== "done" && (
                <span className={`text-[10px] font-medium ${prio.color}`}>
                  {prio.label}
                </span>
              )}
              {item.date && item.status === "done" && (
                <span className="text-[10px] text-muted-foreground">{item.date}</span>
              )}
            </div>

            {/* Expanded description */}
            {expanded && item.description && (
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed border-t pt-2">
                {item.description}
              </p>
            )}
            {expanded && !item.description && (
              <p className="mt-2 text-xs text-muted-foreground/50 italic border-t pt-2">
                Brak opisu
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  items: RoadmapItem[];
  defaultCollapsed?: boolean;
  accentColor: string;
}

function Section({ icon, title, subtitle, items, defaultCollapsed, accentColor }: SectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed ?? false);

  return (
    <div>
      <button
        className="flex items-center gap-3 w-full text-left mb-3 group"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentColor}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-base">{title}</h2>
            <Badge variant="outline" className="text-xs">{items.length}</Badge>
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </button>
      {!collapsed && (
        <div className="space-y-2 ml-11 mb-8">
          {items.length > 0 ? (
            items.map((item) => <RoadmapCard key={item.id} item={item} />)
          ) : (
            <p className="text-xs text-muted-foreground py-4">Brak elementów</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminRoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/roadmap")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setError("Nie udało się załadować roadmapy."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const now = items.filter((i) => i.status === "in_progress");
  const next = items.filter((i) => i.status === "planned" && i.priority <= 1);
  const later = items.filter((i) => i.status === "planned" && i.priority > 1);
  const done = items.filter((i) => i.status === "done");

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-6">
        <Map className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Roadmapa</h1>
          <p className="text-sm text-muted-foreground">
            Auto-sync z AI-TASKS.md — {items.length} elementów
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 mb-4">
          {error}
        </div>
      )}

      <Section
        icon={<Zap className="h-4 w-4 text-amber-700 dark:text-amber-400" />}
        title="Teraz"
        subtitle="Aktywnie realizowane"
        items={now}
        accentColor="bg-amber-100 dark:bg-amber-900/30"
      />

      <Section
        icon={<Clock className="h-4 w-4 text-blue-700 dark:text-blue-400" />}
        title="Następne"
        subtitle="Wysoki i średni priorytet"
        items={next}
        accentColor="bg-blue-100 dark:bg-blue-900/30"
      />

      <Section
        icon={<Circle className="h-4 w-4 text-slate-500" />}
        title="Później"
        subtitle="Niski priorytet, wymaga PRD"
        items={later}
        accentColor="bg-slate-100 dark:bg-slate-800"
      />

      <Section
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />}
        title="Zrobione"
        subtitle="Ukończone zadania"
        items={done}
        defaultCollapsed={true}
        accentColor="bg-emerald-100 dark:bg-emerald-900/30"
      />
    </div>
  );
}
