// @author Claude Code (claude-opus-4-6) | 2026-03-14

"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { conditionTypeLabels, ConditionType } from "@/data/banks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Save,
  Unlock,
  Lock,
  Search,
  Eye,
} from "lucide-react";

interface Condition {
  id: string;
  type: ConditionType;
  label: string;
  description: string;
  requiredCount: number;
  perMonth: boolean;
  monthsRequired: number;
}

interface Offer {
  id: string;
  slug: string;
  bank_name: string;
  offer_name: string;
  reward: number;
  is_active: boolean;
  conditions: Condition[];
  locked_fields: string[];
  leadstar_benefits_html: string | null;
}

const CONDITION_TYPES: ConditionType[] = [
  "transfer", "card_payment", "blik_payment", "income", "standing_order",
  "direct_debit", "mobile_app_login", "online_payment", "contactless_payment",
  "setup", "savings", "other",
];

function ConditionPreview({ condition }: { condition: Condition }) {
  const freq = condition.perMonth
    ? `${condition.requiredCount}x miesięcznie przez ${condition.monthsRequired} mies.`
    : condition.requiredCount > 1
      ? `${condition.requiredCount}x jednorazowo`
      : "Jednorazowo";

  return (
    <div className="rounded-lg border p-3 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{condition.label}</span>
        <Badge variant="secondary" className="text-xs">
          {conditionTypeLabels[condition.type]}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{condition.description}</p>
      <p className="text-xs text-muted-foreground">{freq}</p>
    </div>
  );
}

function ConditionEditor({
  condition,
  onChange,
  onRemove,
}: {
  condition: Condition;
  onChange: (updated: Condition) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Label</label>
          <input
            className="w-full rounded border px-2 py-1.5 text-sm bg-background"
            value={condition.label}
            onChange={(e) => onChange({ ...condition, label: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Typ</label>
          <select
            className="w-full rounded border px-2 py-1.5 text-sm bg-background"
            value={condition.type}
            onChange={(e) => onChange({ ...condition, type: e.target.value as ConditionType })}
          >
            {CONDITION_TYPES.map((t) => (
              <option key={t} value={t}>{conditionTypeLabels[t]}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Opis</label>
        <input
          className="w-full rounded border px-2 py-1.5 text-sm bg-background"
          value={condition.description}
          onChange={(e) => onChange({ ...condition, description: e.target.value.slice(0, 200) })}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Ilość</label>
          <input
            type="number"
            min={1}
            max={100}
            className="w-full rounded border px-2 py-1.5 text-sm bg-background"
            value={condition.requiredCount}
            onChange={(e) => onChange({ ...condition, requiredCount: Math.max(1, parseInt(e.target.value) || 1) })}
          />
        </div>
        <div className="flex items-end gap-2 pb-1">
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={condition.perMonth}
              onChange={(e) => onChange({ ...condition, perMonth: e.target.checked, monthsRequired: e.target.checked ? Math.max(1, condition.monthsRequired) : 1 })}
              className="rounded"
            />
            Miesięcznie
          </label>
        </div>
        {condition.perMonth && (
          <div>
            <label className="text-xs font-medium text-muted-foreground">Ile miesięcy</label>
            <input
              type="number"
              min={1}
              max={24}
              className="w-full rounded border px-2 py-1.5 text-sm bg-background"
              value={condition.monthsRequired}
              onChange={(e) => onChange({ ...condition, monthsRequired: Math.max(1, parseInt(e.target.value) || 1) })}
            />
          </div>
        )}
        <div className="flex items-end">
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={onRemove}>
            <Trash2 className="h-4 w-4 mr-1" /> Usuń
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function WarunkiPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editedConditions, setEditedConditions] = useState<Record<string, Condition[]>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      const res = await adminFetch("/api/admin/feed");
      const data = await res.json();
      setOffers((data.offers || []).filter((o: Offer) => o.is_active));
    } catch {
      setMessage({ type: "error", text: "Nie udało się załadować ofert" });
    } finally {
      setLoading(false);
    }
  }

  function getConditions(offerId: string): Condition[] {
    if (editedConditions[offerId]) return editedConditions[offerId];
    const offer = offers.find((o) => o.id === offerId);
    return offer?.conditions || [];
  }

  function setConditionsForOffer(offerId: string, conditions: Condition[]) {
    setEditedConditions((prev) => ({ ...prev, [offerId]: conditions }));
  }

  function updateCondition(offerId: string, index: number, updated: Condition) {
    const conditions = [...getConditions(offerId)];
    conditions[index] = updated;
    setConditionsForOffer(offerId, conditions);
  }

  function removeCondition(offerId: string, index: number) {
    if (!confirm("Na pewno usunąć ten warunek?")) return;
    const conditions = getConditions(offerId).filter((_, i) => i !== index);
    // Re-index IDs
    const reindexed = conditions.map((c, i) => ({ ...c, id: `ls_cond_${i + 1}` }));
    setConditionsForOffer(offerId, reindexed);
  }

  function addCondition(offerId: string) {
    const conditions = getConditions(offerId);
    const newCondition: Condition = {
      id: `ls_cond_${conditions.length + 1}`,
      type: "other",
      label: "",
      description: "",
      requiredCount: 1,
      perMonth: false,
      monthsRequired: 1,
    };
    setConditionsForOffer(offerId, [...conditions, newCondition]);
  }

  async function saveConditions(offerId: string) {
    const conditions = getConditions(offerId);
    if (conditions.some((c) => !c.label.trim())) {
      setMessage({ type: "error", text: "Wszystkie warunki muszą mieć label" });
      return;
    }

    setSaving(offerId);
    try {
      const res = await adminFetch("/api/admin/feed", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: offerId, conditions }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      // Update local state
      setOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, conditions: data.offer.conditions, locked_fields: data.offer.locked_fields } : o));
      setEditedConditions((prev) => { const next = { ...prev }; delete next[offerId]; return next; });
      setMessage({ type: "success", text: "Warunki zapisane. Pole zablokowane przed nadpisaniem przez sync." });
    } catch {
      setMessage({ type: "error", text: "Nie udało się zapisać warunków" });
    } finally {
      setSaving(null);
    }
  }

  async function unlockConditions(offerId: string) {
    if (!confirm("Na pewno? Warunki zostaną przywrócone z parsera feedu.")) return;

    setSaving(offerId);
    try {
      const res = await adminFetch("/api/admin/feed", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: offerId, unlock_conditions: true }),
      });
      if (!res.ok) throw new Error("Unlock failed");
      const data = await res.json();
      setOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, conditions: data.offer.conditions, locked_fields: data.offer.locked_fields } : o));
      setEditedConditions((prev) => { const next = { ...prev }; delete next[offerId]; return next; });
      setMessage({ type: "success", text: "Warunki przywrócone z parsera feedu." });
    } catch {
      setMessage({ type: "error", text: "Nie udało się odblokować warunków" });
    } finally {
      setSaving(null);
    }
  }

  const filtered = offers.filter((o) =>
    o.bank_name.toLowerCase().includes(search.toLowerCase()) ||
    o.offer_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-8 text-muted-foreground">Ładowanie ofert...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edytor warunków</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Przeglądaj i edytuj warunki promocji per oferta. Ręczne zmiany blokują nadpisanie przez sync.
        </p>
      </div>

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300" : "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300"}`}>
          {message.text}
          <button className="ml-2 underline" onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          className="w-full rounded-lg border px-9 py-2 text-sm bg-background"
          placeholder="Szukaj po nazwie banku lub oferty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filtered.map((offer) => {
          const isExpanded = expandedId === offer.id;
          const conditions = getConditions(offer.id);
          const hasEdits = !!editedConditions[offer.id];
          const isLocked = offer.locked_fields?.includes("conditions");
          const isPreviewing = showPreview === offer.id;

          return (
            <Card key={offer.id}>
              <CardHeader
                className="pb-3 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : offer.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-base">{offer.offer_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{offer.bank_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLocked && (
                      <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300">
                        <Lock className="h-3 w-3" /> Ręcznie edytowane
                      </Badge>
                    )}
                    <Badge variant="secondary">{conditions.length} warunków</Badge>
                    <span className="font-bold text-emerald-600">{offer.reward} zł</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-4">
                  {/* Toggle: edit vs preview */}
                  <div className="flex gap-2">
                    <Button
                      variant={isPreviewing ? "outline" : "default"}
                      size="sm"
                      onClick={() => setShowPreview(isPreviewing ? null : offer.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {isPreviewing ? "Edytuj" : "Podgląd usera"}
                    </Button>
                  </div>

                  {isPreviewing ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Tak to zobaczy user w trackerze:</p>
                      {conditions.map((c) => (
                        <ConditionPreview key={c.id} condition={c} />
                      ))}
                      {conditions.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">Brak warunków</p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {conditions.map((condition, index) => (
                          <ConditionEditor
                            key={condition.id}
                            condition={condition}
                            onChange={(updated) => updateCondition(offer.id, index, updated)}
                            onRemove={() => removeCondition(offer.id, index)}
                          />
                        ))}
                      </div>

                      <Button variant="outline" size="sm" onClick={() => addCondition(offer.id)}>
                        <Plus className="h-4 w-4 mr-1" /> Dodaj warunek
                      </Button>
                    </>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={() => saveConditions(offer.id)}
                      disabled={saving === offer.id || !hasEdits}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {saving === offer.id ? "Zapisuję..." : "Zapisz"}
                    </Button>
                    {isLocked && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => unlockConditions(offer.id)}
                        disabled={saving === offer.id}
                      >
                        <Unlock className="h-4 w-4 mr-1" /> Przywróć z parsera
                      </Button>
                    )}
                    {hasEdits && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditedConditions((prev) => { const next = { ...prev }; delete next[offer.id]; return next; })}
                      >
                        Anuluj zmiany
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          {search ? "Brak ofert pasujących do wyszukiwania" : "Brak aktywnych ofert"}
        </p>
      )}
    </div>
  );
}
