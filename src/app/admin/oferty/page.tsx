"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  AlertTriangle,
  Search,
  ExternalLink,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  DollarSign,
} from "lucide-react";

interface Offer {
  id: string;
  slug: string;
  bank_name: string;
  offer_name: string;
  short_description: string | null;
  full_description: string | null;
  reward: number;
  difficulty: string;
  source: string;
  is_active: boolean;
  leadstar_id: string | null;
  affiliate_url: string | null;
  leadstar_description_html: string | null;
  leadstar_benefits_html: string | null;
  updated_at: string;
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    short_description: "",
    full_description: "",
    reward: 0,
    difficulty: "medium",
  });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "hidden" | "zero">("all");

  useEffect(() => {
    fetch("/api/admin/offers")
      .then((r) => r.json())
      .then((d) => setOffers(d.offers || []))
      .catch(() => setError("Nie udało się załadować ofert."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = offers.filter((o) => {
    const matchSearch =
      o.bank_name.toLowerCase().includes(search.toLowerCase()) ||
      o.offer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.slug.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    switch (filter) {
      case "active": return o.is_active && o.reward > 0;
      case "hidden": return !o.is_active;
      case "zero": return o.reward === 0;
      default: return true;
    }
  });

  const startEdit = (offer: Offer) => {
    setEditingId(offer.id);
    setEditForm({
      short_description: offer.short_description || "",
      full_description: offer.full_description || "",
      reward: offer.reward,
      difficulty: offer.difficulty,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/offers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...editForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOffers((prev) =>
        prev.map((o) =>
          o.id === editingId
            ? {
                ...o,
                short_description: editForm.short_description,
                full_description: editForm.full_description,
                reward: editForm.reward,
                difficulty: editForm.difficulty,
                updated_at: new Date().toISOString(),
              }
            : o
        )
      );
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd zapisu");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (offer: Offer) => {
    try {
      const res = await fetch("/api/admin/offers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: offer.id, is_active: !offer.is_active }),
      });
      if (!res.ok) throw new Error("Błąd");

      setOffers((prev) =>
        prev.map((o) =>
          o.id === offer.id
            ? { ...o, is_active: !o.is_active, updated_at: new Date().toISOString() }
            : o
        )
      );
    } catch {
      setError("Nie udało się zmienić widoczności.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const activeCount = offers.filter((o) => o.is_active && o.reward > 0).length;
  const zeroCount = offers.filter((o) => o.reward === 0).length;
  const hiddenCount = offers.filter((o) => !o.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Oferty ({offers.length})</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg border p-3 text-center text-sm transition-colors ${
            filter === "all" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
          }`}
        >
          <p className="text-xl font-bold">{offers.length}</p>
          <p className="text-muted-foreground text-xs">Wszystkie</p>
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`rounded-lg border p-3 text-center text-sm transition-colors ${
            filter === "active" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" : "hover:bg-muted/50"
          }`}
        >
          <p className="text-xl font-bold text-emerald-600">{activeCount}</p>
          <p className="text-muted-foreground text-xs">Aktywne</p>
        </button>
        <button
          onClick={() => setFilter("zero")}
          className={`rounded-lg border p-3 text-center text-sm transition-colors ${
            filter === "zero" ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20" : "hover:bg-muted/50"
          }`}
        >
          <p className="text-xl font-bold text-amber-600">{zeroCount}</p>
          <p className="text-muted-foreground text-xs">Premia 0 zł</p>
        </button>
        <button
          onClick={() => setFilter("hidden")}
          className={`rounded-lg border p-3 text-center text-sm transition-colors ${
            filter === "hidden" ? "border-red-500 bg-red-50 dark:bg-red-950/20" : "hover:bg-muted/50"
          }`}
        >
          <p className="text-xl font-bold text-red-500">{hiddenCount}</p>
          <p className="text-muted-foreground text-xs">Ukryte</p>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj po nazwie banku, ofercie lub slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((offer) => (
          <Card key={offer.id} className={`transition-shadow ${!offer.is_active ? "opacity-60" : ""}`}>
            <CardContent className="py-4">
              {/* Header row */}
              <div className="flex items-center gap-3 mb-2">
                {offer.is_active ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {offer.bank_name} — {offer.offer_name}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {offer.reward > 0 ? (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <DollarSign className="h-3 w-3 mr-0.5" />
                      {offer.reward} zł
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      0 zł
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {offer.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 ml-7">
                <span className="font-mono">{offer.slug}</span>
                <span>•</span>
                <span>{offer.source}</span>
                {offer.leadstar_id && (
                  <>
                    <span>•</span>
                    <span>LS: {offer.leadstar_id}</span>
                  </>
                )}
                <span>•</span>
                <span>{new Date(offer.updated_at).toLocaleDateString("pl-PL")}</span>
              </div>

              {/* Description preview */}
              {offer.short_description && (
                <p className="text-xs text-muted-foreground ml-7 mb-2 line-clamp-2">
                  {offer.short_description}
                </p>
              )}
              {!offer.short_description && offer.reward === 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 ml-7 mb-2">
                  ⚠️ Brak opisu i premii. Uzupełnij dane lub ukryj ofertę.
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1 ml-7">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => toggleActive(offer)}
                  title={offer.is_active ? "Ukryj na stronie" : "Pokaż na stronie"}
                >
                  {offer.is_active ? (
                    <><EyeOff className="h-3 w-3" /> Ukryj</>
                  ) : (
                    <><Eye className="h-3 w-3" /> Pokaż</>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => startEdit(offer)}
                >
                  <Edit2 className="h-3 w-3" /> Edytuj
                </Button>
                {offer.affiliate_url && (
                  <a href={offer.affiliate_url} target="_blank" rel="noopener">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                      <ExternalLink className="h-3 w-3" /> Link
                    </Button>
                  </a>
                )}
              </div>

              {/* Inline editor */}
              {editingId === offer.id && (
                <div className="mt-4 ml-7 space-y-3 border-t pt-4">
                  <div>
                    <Label htmlFor="edit-short" className="text-xs">Krótki opis (widoczny na karcie oferty)</Label>
                    <Input
                      id="edit-short"
                      value={editForm.short_description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, short_description: e.target.value })
                      }
                      placeholder="Np. Otwórz konto i zgarnij 300 zł premii..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-full" className="text-xs">Pełny opis (widoczny na stronie oferty)</Label>
                    <textarea
                      id="edit-full"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                      value={editForm.full_description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, full_description: e.target.value })
                      }
                      placeholder="Szczegółowy opis oferty..."
                    />
                    {offer.leadstar_description_html && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        💡 Opis z LeadStar: {offer.leadstar_description_html.replace(/<[^>]*>/g, "").slice(0, 150)}...
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="edit-reward" className="text-xs">Premia (zł)</Label>
                      <Input
                        id="edit-reward"
                        type="number"
                        min={0}
                        value={editForm.reward}
                        onChange={(e) =>
                          setEditForm({ ...editForm, reward: parseInt(e.target.value) || 0 })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-diff" className="text-xs">Trudność</Label>
                      <select
                        id="edit-diff"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                        value={editForm.difficulty}
                        onChange={(e) =>
                          setEditForm({ ...editForm, difficulty: e.target.value })
                        }
                      >
                        <option value="easy">Łatwy</option>
                        <option value="medium">Średni</option>
                        <option value="hard">Trudny</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={saveEdit}
                      disabled={saving}
                      className="gap-1"
                    >
                      {saving ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3" />
                      )}
                      {saving ? "Zapisuję..." : "Zapisz"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelEdit}
                      className="gap-1"
                    >
                      <X className="h-3 w-3" /> Anuluj
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Brak ofert pasujących do wyszukiwania.
          </p>
        )}
      </div>
    </div>
  );
}
