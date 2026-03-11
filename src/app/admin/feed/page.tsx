"use client";

import { adminFetch } from "@/lib/admin-fetch";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  AlertTriangle,
  Lock,
  LockOpen,
  ExternalLink,
  CheckCircle,
  XCircle,
  Search,
  AlertCircle,
} from "lucide-react";

interface QualityFlags {
  reward_zero?: boolean;
  description_empty?: boolean;
  benefits_empty?: boolean;
  scraped_from_page?: boolean;
  scrape_failed?: boolean;
  scrape_failed_reason?: string;
  scrape_reward?: number;
  last_scraped_at?: string;
}

interface FeedOffer {
  id: string;
  slug: string;
  bank_name: string;
  offer_name: string;
  reward: number;
  short_description: string | null;
  difficulty: string;
  is_active: boolean;
  source: string;
  affiliate_url: string | null;
  leadstar_id: string | null;
  leadstar_description_html: string | null;
  leadstar_benefits_html: string | null;
  locked_fields: string[];
  quality_flags: QualityFlags;
  updated_at: string;
}

type EditableField = "bank_name" | "offer_name" | "reward" | "short_description" | "difficulty" | "is_active";

const LOCKABLE_FIELDS: EditableField[] = ["bank_name", "offer_name", "reward", "short_description", "difficulty"];

const FIELD_LABELS: Record<EditableField, string> = {
  bank_name: "Bank",
  offer_name: "Nazwa oferty",
  reward: "Premia (zł)",
  short_description: "Krótki opis",
  difficulty: "Trudność",
  is_active: "Aktywna",
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function QualityBadges({ flags }: { flags: QualityFlags }) {
  const issues = [];
  if (flags.reward_zero) issues.push({ label: "Premia 0 zł", color: "destructive" as const });
  if (flags.description_empty) issues.push({ label: "Brak opisu", color: "destructive" as const });
  if (flags.benefits_empty) issues.push({ label: "Brak warunków", color: "secondary" as const });
  if (flags.scrape_failed) issues.push({
    label: `Scraping: ${flags.scrape_failed_reason || "błąd"}`,
    color: "secondary" as const,
  });
  if (flags.scraped_from_page) issues.push({ label: `Scraped: ${flags.scrape_reward} zł`, color: "secondary" as const });

  if (issues.length === 0) return <span className="text-xs text-emerald-600">✓ OK</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {issues.map((issue) => (
        <Badge key={issue.label} variant={issue.color} className="text-[10px] py-0 px-1.5">
          {issue.label}
        </Badge>
      ))}
    </div>
  );
}

interface EditableCellProps {
  offerId: string;
  field: EditableField;
  value: string | number | boolean;
  locked: boolean;
  hasIssue?: boolean;
  onSave: (offerId: string, field: EditableField, value: string | number | boolean) => Promise<void>;
  onToggleLock: (offerId: string, field: EditableField, currentlyLocked: boolean) => Promise<void>;
}

function EditableCell({ offerId, field, value, locked, hasIssue, onSave, onToggleLock }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(String(value));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    let parsed: string | number | boolean = localValue;
    if (field === "reward") parsed = parseInt(localValue) || 0;
    if (field === "is_active") parsed = localValue === "true";
    await onSave(offerId, field, parsed);
    setSaving(false);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") { setLocalValue(String(value)); setEditing(false); }
  };

  const cellBg = hasIssue ? "bg-red-50 dark:bg-red-950/20" : "";

  if (field === "is_active") {
    return (
      <td className={`px-3 py-2 text-center ${cellBg}`}>
        <button
          onClick={() => onSave(offerId, "is_active", !value)}
          title={value ? "Kliknij żeby ukryć" : "Kliknij żeby pokazać"}
        >
          {value ? (
            <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" />
          ) : (
            <XCircle className="h-4 w-4 text-red-400 mx-auto" />
          )}
        </button>
      </td>
    );
  }

  if (editing) {
    return (
      <td className={`px-2 py-1 ${cellBg}`}>
        <div className="flex items-center gap-1">
          {field === "difficulty" ? (
            <select
              className="text-xs border rounded px-1 py-0.5 bg-background"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              autoFocus
              onKeyDown={handleKeyDown}
            >
              <option value="easy">Łatwy</option>
              <option value="medium">Średni</option>
              <option value="hard">Trudny</option>
            </select>
          ) : (
            <Input
              className="h-6 text-xs px-1.5 min-w-[80px]"
              type={field === "reward" ? "number" : "text"}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              autoFocus
              onKeyDown={handleKeyDown}
            />
          )}
          <Button size="sm" className="h-5 px-1.5 text-[10px]" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : "OK"}
          </Button>
          <Button size="sm" variant="ghost" className="h-5 px-1 text-[10px]" onClick={() => { setLocalValue(String(value)); setEditing(false); }}>✕</Button>
        </div>
      </td>
    );
  }

  return (
    <td className={`px-3 py-2 group relative ${cellBg}`}>
      <div className="flex items-center gap-1.5">
        <span
          className="text-xs cursor-pointer hover:underline truncate max-w-[180px]"
          title={String(value)}
          onClick={() => { setLocalValue(String(value)); setEditing(true); }}
        >
          {field === "reward" ? `${value} zł` : (String(value) || <span className="text-muted-foreground italic">–</span>)}
        </span>
        {LOCKABLE_FIELDS.includes(field) && (
          <button
            onClick={() => onToggleLock(offerId, field, locked)}
            title={locked ? "Odblokuj (sync może nadpisać)" : "Zablokuj (sync nie nadpisze)"}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {locked ? (
              <Lock className="h-3 w-3 text-amber-500" />
            ) : (
              <LockOpen className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        )}
      </div>
    </td>
  );
}

export default function AdminFeedPage() {
  const [offers, setOffers] = useState<FeedOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "issues" | "locked" | "scraped">("all");

  useEffect(() => {
    adminFetch("/api/admin/feed")
      .then((r) => r.json())
      .then((d) => setOffers(d.offers || []))
      .catch(() => setError("Nie udało się załadować danych."))
      .finally(() => setLoading(false));
  }, []);

  const saveField = useCallback(async (offerId: string, field: EditableField, value: string | number | boolean) => {
    const res = await adminFetch("/api/admin/feed", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: offerId, [field]: value }),
    });
    if (!res.ok) throw new Error("Błąd zapisu");

    setOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, [field]: value } : o));
  }, []);

  const toggleLock = useCallback(async (offerId: string, field: EditableField, currentlyLocked: boolean) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    const newLocked = currentlyLocked
      ? offer.locked_fields.filter((f) => f !== field)
      : [...offer.locked_fields, field];

    const res = await adminFetch("/api/admin/feed", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: offerId, locked_fields: newLocked }),
    });
    if (!res.ok) return;

    setOffers((prev) =>
      prev.map((o) => o.id === offerId ? { ...o, locked_fields: newLocked } : o)
    );
  }, [offers]);

  const filtered = offers.filter((o) => {
    const matchSearch =
      !search ||
      o.bank_name.toLowerCase().includes(search.toLowerCase()) ||
      o.offer_name.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    switch (filter) {
      case "issues":
        return o.quality_flags.reward_zero || o.quality_flags.description_empty;
      case "locked":
        return o.locked_fields.length > 0;
      case "scraped":
        return !!o.quality_flags.scraped_from_page;
      default:
        return true;
    }
  });

  const issuesCount = offers.filter((o) => o.quality_flags.reward_zero || o.quality_flags.description_empty).length;
  const lockedCount = offers.filter((o) => o.locked_fields.length > 0).length;

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Podgląd feedu ({offers.length})</h1>
        <p className="text-xs text-muted-foreground">
          Kliknij komórkę żeby edytować • 🔒 blokuje pole przed nadpisaniem przez sync
        </p>
      </div>

      {/* Filtry */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: `Wszystkie (${offers.length})` },
          { key: "issues", label: `Problemy (${issuesCount})`, color: issuesCount > 0 ? "text-red-600" : "" },
          { key: "locked", label: `Zablokowane (${lockedCount})`, color: "text-amber-600" },
          { key: "scraped", label: "Scrapowane" },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === key ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            } ${color || ""}`}
          >
            {label}
          </button>
        ))}

        <div className="relative ml-auto">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Szukaj..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 pl-7 text-xs w-48"
          />
        </div>
      </div>

      {issuesCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            <strong>{issuesCount} ofert</strong> ma problemy z danymi (premia 0 zł lub brak opisu). Sync próbuje automatycznie scrapować stronę banku (max 5/dzień).
          </span>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-muted/50 text-xs text-muted-foreground">
              <th className="px-3 py-2 text-left font-medium">Bank</th>
              <th className="px-3 py-2 text-left font-medium">Nazwa oferty</th>
              <th className="px-3 py-2 text-left font-medium">Premia</th>
              <th className="px-3 py-2 text-left font-medium">Krótki opis</th>
              <th className="px-3 py-2 text-left font-medium">Trudność</th>
              <th className="px-3 py-2 text-center font-medium">Aktywna</th>
              <th className="px-3 py-2 text-left font-medium">Opis z feedu</th>
              <th className="px-3 py-2 text-left font-medium">Warunki z feedu</th>
              <th className="px-3 py-2 text-left font-medium">Flagi</th>
              <th className="px-3 py-2 text-left font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((offer, idx) => {
              const locked = (field: EditableField) => offer.locked_fields.includes(field);
              const hasRewardIssue = !!offer.quality_flags.reward_zero;
              const hasDescIssue = !!offer.quality_flags.description_empty;

              return (
                <tr
                  key={offer.id}
                  className={`border-b transition-colors hover:bg-muted/30 ${
                    idx % 2 === 0 ? "" : "bg-muted/10"
                  } ${!offer.is_active ? "opacity-50" : ""}`}
                >
                  <EditableCell
                    offerId={offer.id}
                    field="bank_name"
                    value={offer.bank_name}
                    locked={locked("bank_name")}
                    onSave={saveField}
                    onToggleLock={toggleLock}
                  />
                  <EditableCell
                    offerId={offer.id}
                    field="offer_name"
                    value={offer.offer_name}
                    locked={locked("offer_name")}
                    onSave={saveField}
                    onToggleLock={toggleLock}
                  />
                  <EditableCell
                    offerId={offer.id}
                    field="reward"
                    value={offer.reward}
                    locked={locked("reward")}
                    hasIssue={hasRewardIssue}
                    onSave={saveField}
                    onToggleLock={toggleLock}
                  />
                  <EditableCell
                    offerId={offer.id}
                    field="short_description"
                    value={offer.short_description || ""}
                    locked={locked("short_description")}
                    hasIssue={hasDescIssue}
                    onSave={saveField}
                    onToggleLock={toggleLock}
                  />
                  <EditableCell
                    offerId={offer.id}
                    field="difficulty"
                    value={offer.difficulty}
                    locked={locked("difficulty")}
                    onSave={saveField}
                    onToggleLock={toggleLock}
                  />
                  <EditableCell
                    offerId={offer.id}
                    field="is_active"
                    value={offer.is_active}
                    locked={false}
                    onSave={saveField}
                    onToggleLock={toggleLock}
                  />
                  {/* Opis z feedu (read-only) */}
                  <td className={`px-3 py-2 max-w-[200px] ${hasDescIssue ? "bg-red-50 dark:bg-red-950/20" : ""}`}>
                    <span className="text-xs text-muted-foreground truncate block max-w-[180px]" title={offer.leadstar_description_html ? stripHtml(offer.leadstar_description_html) : ""}>
                      {offer.leadstar_description_html
                        ? stripHtml(offer.leadstar_description_html).slice(0, 80) + "…"
                        : <span className="text-red-400 italic">brak</span>}
                    </span>
                  </td>
                  {/* Warunki z feedu (read-only) */}
                  <td className={`px-3 py-2 max-w-[200px] ${offer.quality_flags.benefits_empty ? "bg-amber-50 dark:bg-amber-950/20" : ""}`}>
                    <span className="text-xs text-muted-foreground truncate block max-w-[180px]" title={offer.leadstar_benefits_html ? stripHtml(offer.leadstar_benefits_html) : ""}>
                      {offer.leadstar_benefits_html
                        ? stripHtml(offer.leadstar_benefits_html).slice(0, 80) + "…"
                        : <span className="text-amber-400 italic">brak</span>}
                    </span>
                  </td>
                  {/* Flagi jakości */}
                  <td className="px-3 py-2 min-w-[120px]">
                    <QualityBadges flags={offer.quality_flags} />
                  </td>
                  {/* Link */}
                  <td className="px-3 py-2">
                    {offer.affiliate_url && (
                      <a href={offer.affiliate_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Brak ofert pasujących do filtrów.
          </div>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground">
        Kolumny oznaczone 🔒 są chronione przed nadpisaniem przez automatyczny sync z LeadStar. Kliknij ikonę kłódki żeby zmienić status.
      </p>
    </div>
  );
}
