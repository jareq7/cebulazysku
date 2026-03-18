// @author Claude Code (claude-opus-4-6) | 2026-03-18
"use client";

import { adminFetch } from "@/lib/admin-fetch";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  X,
  Map,
} from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string | null;
  status: "planned" | "in_progress" | "done";
  priority: number;
  category: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

const COLUMNS: { key: RoadmapItem["status"]; label: string; color: string }[] = [
  { key: "planned", label: "Planowane", color: "bg-blue-500" },
  { key: "in_progress", label: "W trakcie", color: "bg-amber-500" },
  { key: "done", label: "Zrobione", color: "bg-emerald-500" },
];

const CATEGORIES = [
  { value: "", label: "Bez kategorii" },
  { value: "feature", label: "Feature" },
  { value: "bugfix", label: "Bugfix" },
  { value: "research", label: "Research" },
  { value: "content", label: "Content" },
  { value: "infra", label: "Infra" },
  { value: "seo", label: "SEO" },
  { value: "ux", label: "UX/UI" },
];

const CATEGORY_COLORS: Record<string, string> = {
  feature: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  bugfix: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  research: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  content: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  infra: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
  seo: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "ux": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
};

export default function AdminRoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState<RoadmapItem["status"]>("planned");
  const [saving, setSaving] = useState(false);
  const [moving, setMoving] = useState<string | null>(null);

  const fetchItems = () => {
    setLoading(true);
    adminFetch("/api/admin/roadmap")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setError("Nie udało się załadować roadmapy."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDesc.trim() || null,
          category: newCategory || null,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems((prev) => [data.item, ...prev]);
      setNewTitle("");
      setNewDesc("");
      setNewCategory("");
      setShowAdd(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd dodawania");
    } finally {
      setSaving(false);
    }
  };

  const moveItem = async (id: string, newStatus: RoadmapItem["status"]) => {
    setMoving(id);
    try {
      const res = await adminFetch("/api/admin/roadmap", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems((prev) => prev.map((item) => (item.id === id ? data.item : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd przesuwania");
    } finally {
      setMoving(null);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Usunąć ten element?")) return;
    try {
      const res = await adminFetch("/api/admin/roadmap", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Nie udało się usunąć.");
    }
  };

  const getNextStatus = (s: RoadmapItem["status"]): RoadmapItem["status"] | null =>
    s === "planned" ? "in_progress" : s === "in_progress" ? "done" : null;

  const getPrevStatus = (s: RoadmapItem["status"]): RoadmapItem["status"] | null =>
    s === "done" ? "in_progress" : s === "in_progress" ? "planned" : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Map className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Roadmapa</h1>
          <Badge variant="secondary" className="text-xs">{items.length} elementów</Badge>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAdd ? "Anuluj" : "Dodaj"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40">
          {error}
          <button className="ml-2 underline text-xs" onClick={() => setError("")}>zamknij</button>
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <Input
              placeholder="Tytuł zadania"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && addItem()}
            />
            <Input
              placeholder="Opis (opcjonalnie)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm flex-1"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm flex-1"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as RoadmapItem["status"])}
              >
                {COLUMNS.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
              <Button onClick={addItem} disabled={saving || !newTitle.trim()} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Dodaj
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colItems = items.filter((item) => item.status === col.key);
          return (
            <div key={col.key} className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <h2 className="font-semibold text-sm">{col.label}</h2>
                <Badge variant="outline" className="text-xs ml-auto">{colItems.length}</Badge>
              </div>

              <div className="space-y-2 min-h-[100px]">
                {colItems.map((item) => (
                  <Card key={item.id} className="group">
                    <CardContent className="py-3 px-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-snug">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 mt-2">
                            {item.category && (
                              <Badge className={`text-[10px] px-1.5 py-0 ${CATEGORY_COLORS[item.category] || "bg-gray-100 text-gray-600"}`}>
                                {item.category}
                              </Badge>
                            )}
                            {item.completed_at && (
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(item.completed_at).toLocaleDateString("pl-PL")}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          {getPrevStatus(item.status) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => moveItem(item.id, getPrevStatus(item.status)!)}
                              disabled={moving === item.id}
                              aria-label="Przesuń w lewo"
                            >
                              {moving === item.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <ChevronLeft className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                          {getNextStatus(item.status) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => moveItem(item.id, getNextStatus(item.status)!)}
                              disabled={moving === item.id}
                              aria-label="Przesuń w prawo"
                            >
                              {moving === item.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => deleteItem(item.id)}
                            aria-label="Usuń"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {colItems.length === 0 && (
                  <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded-lg">
                    Brak elementów
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
