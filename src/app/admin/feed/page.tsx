"use client";

import { adminFetch } from "@/lib/admin-fetch";
import { useEffect, useState, useCallback, useRef } from "react";
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
  // Quality check (cron dzienny)
  reward_mismatch?: boolean;
  page_unreachable?: boolean;
  page_js_only?: boolean;
  checked_reward?: number;
  last_checked_at?: string;
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
  first_seen_at: string | null;
  updated_at: string;
}

type EditableField = "bank_name" | "offer_name" | "reward" | "short_description" | "difficulty" | "is_active";

const LOCKABLE_FIELDS: EditableField[] = ["bank_name", "offer_name", "reward", "short_description", "difficulty"];

// Definicje kolumn z domyślnymi szerokościami
const COLUMNS = [
  { key: "first_seen_at", label: "Pierwsza data", defaultWidth: 110 },
  { key: "bank_name", label: "Bank", defaultWidth: 140 },
  { key: "offer_name", label: "Nazwa oferty", defaultWidth: 180 },
  { key: "reward", label: "Premia", defaultWidth: 100 },
  { key: "short_description", label: "Krótki opis", defaultWidth: 200 },
  { key: "difficulty", label: "Trudność", defaultWidth: 90 },
  { key: "is_active", label: "Aktywna", defaultWidth: 70 },
  { key: "leadstar_description_html", label: "Opis z feedu", defaultWidth: 200 },
  { key: "leadstar_benefits_html", label: "Warunki z feedu", defaultWidth: 200 },
  { key: "quality_flags", label: "Flagi", defaultWidth: 140 },
  { key: "affiliate_url", label: "Link", defaultWidth: 50 },
] as const;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function isNew(firstSeenAt: string | null): boolean {
  if (!firstSeenAt) return false;
  const days = (Date.now() - new Date(firstSeenAt).getTime()) / (1000 * 60 * 60 * 24);
  return days <= 7;
}

function QualityBadges({ flags }: { flags: QualityFlags }) {
  const issues = [];
  if (flags.reward_zero) issues.push({ label: "Premia 0 zł", color: "destructive" as const });
  if (flags.description_empty) issues.push({ label: "Brak opisu", color: "destructive" as const });
  if (flags.benefits_empty) issues.push({ label: "Brak warunków", color: "secondary" as const });
  if (flags.reward_mismatch) issues.push({ label: `Niezgodność! Strona: ${flags.checked_reward} zł`, color: "destructive" as const });
  if (flags.page_unreachable) issues.push({ label: "Strona niedostępna", color: "destructive" as const });
  if (flags.page_js_only) issues.push({ label: "JS-only (nie sprawdzono)", color: "secondary" as const });
  if (flags.scrape_failed) issues.push({ label: `Scraping: ${flags.scrape_failed_reason || "błąd"}`, color: "secondary" as const });
  if (flags.scraped_from_page) issues.push({ label: `Scraped: ${flags.scrape_reward} zł`, color: "secondary" as const });

  const checkedAt = flags.last_checked_at
    ? new Date(flags.last_checked_at).toLocaleDateString("pl-PL")
    : null;

  if (issues.length === 0) return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-emerald-600">✓ OK</span>
      {checkedAt && <span className="text-[10px] text-muted-foreground">sprawdzone {checkedAt}</span>}
    </div>
  );
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-1">
        {issues.map((issue) => (
          <Badge key={issue.label} variant={issue.color} className="text-[10px] py-0 px-1.5 whitespace-nowrap">
            {issue.label}
          </Badge>
        ))}
      </div>
      {checkedAt && <span className="text-[10px] text-muted-foreground">sprawdzone {checkedAt}</span>}
    </div>
  );
}

interface EditableCellProps {
  offerId: string;
  field: EditableField;
  value: string | number | boolean;
  locked: boolean;
  hasIssue?: boolean;
  width: number;
  onSave: (offerId: string, field: EditableField, value: string | number | boolean) => Promise<void>;
  onToggleLock: (offerId: string, field: EditableField, currentlyLocked: boolean) => Promise<void>;
}

function EditableCell({ offerId, field, value, locked, hasIssue, width, onSave, onToggleLock }: EditableCellProps) {
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
      <td className={`px-3 py-2 text-center ${cellBg}`} style={{ width, minWidth: width }}>
        <button onClick={() => onSave(offerId, "is_active", !value)} title={value ? "Kliknij żeby ukryć" : "Kliknij żeby pokazać"}>
          {value
            ? <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" />
            : <XCircle className="h-4 w-4 text-red-400 mx-auto" />}
        </button>
      </td>
    );
  }

  if (editing) {
    return (
      <td className={`px-2 py-1 ${cellBg}`} style={{ width, minWidth: width }}>
        <div className="flex items-center gap-1">
          {field === "difficulty" ? (
            <select
              className="text-xs border rounded px-1 py-0.5 bg-background w-full"
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
              className="h-6 text-xs px-1.5 w-full"
              type={field === "reward" ? "number" : "text"}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              autoFocus
              onKeyDown={handleKeyDown}
            />
          )}
          <Button size="sm" className="h-5 px-1.5 text-[10px] shrink-0" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : "OK"}
          </Button>
          <Button size="sm" variant="ghost" className="h-5 px-1 text-[10px] shrink-0" onClick={() => { setLocalValue(String(value)); setEditing(false); }}>✕</Button>
        </div>
      </td>
    );
  }

  return (
    <td className={`px-3 py-2 group ${cellBg}`} style={{ width, minWidth: width, maxWidth: width }}>
      <div className="flex items-center gap-1.5 overflow-hidden">
        <span
          className="text-xs cursor-pointer hover:underline truncate flex-1"
          title={String(value)}
          onClick={() => { setLocalValue(String(value)); setEditing(true); }}
        >
          {field === "reward"
            ? `${value} zł`
            : String(value) || <span className="text-muted-foreground italic">–</span>}
        </span>
        {LOCKABLE_FIELDS.includes(field) && (
          <button
            onClick={() => onToggleLock(offerId, field, locked)}
            title={locked ? "Odblokuj (sync może nadpisać)" : "Zablokuj (sync nie nadpisze)"}
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            {locked
              ? <Lock className="h-3 w-3 text-amber-500" />
              : <LockOpen className="h-3 w-3 text-muted-foreground" />}
          </button>
        )}
      </div>
    </td>
  );
}

// Hook do resize kolumn
function useResizableColumns() {
  const defaultWidths = Object.fromEntries(COLUMNS.map((c) => [c.key, c.defaultWidth]));
  const [widths, setWidths] = useState<Record<string, number>>(defaultWidths);
  const dragging = useRef<{ col: string; startX: number; startWidth: number } | null>(null);

  const startResize = useCallback((col: string, e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = { col, startX: e.clientX, startWidth: widths[col] };

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const diff = ev.clientX - dragging.current.startX;
      const newWidth = Math.max(50, dragging.current.startWidth + diff);
      setWidths((prev) => ({ ...prev, [dragging.current!.col]: newWidth }));
    };

    const onMouseUp = () => {
      dragging.current = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [widths]);

  return { widths, startResize };
}

// Wspólny wiersz tabeli
function OfferRow({
  offer,
  widths,
  onSave,
  onToggleLock,
  idx,
}: {
  offer: FeedOffer;
  widths: Record<string, number>;
  onSave: (id: string, field: EditableField, value: string | number | boolean) => Promise<void>;
  onToggleLock: (id: string, field: EditableField, locked: boolean) => Promise<void>;
  idx: number;
}) {
  const locked = (field: EditableField) => offer.locked_fields.includes(field);
  const hasRewardIssue = !!offer.quality_flags.reward_zero;
  const hasDescIssue = !!offer.quality_flags.description_empty;
  const offerIsNew = isNew(offer.first_seen_at);

  return (
    <tr className={`border-b transition-colors hover:bg-muted/30 ${idx % 2 === 0 ? "" : "bg-muted/10"}`}>
      <td className="px-3 py-2" style={{ width: widths.first_seen_at, minWidth: widths.first_seen_at }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">
            {offer.first_seen_at ? new Date(offer.first_seen_at).toLocaleDateString("pl-PL") : "–"}
          </span>
          {offerIsNew && (
            <Badge className="text-[10px] py-0 px-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 w-fit">
              Nowa
            </Badge>
          )}
        </div>
      </td>
      <EditableCell offerId={offer.id} field="bank_name" value={offer.bank_name} locked={locked("bank_name")} width={widths.bank_name} onSave={onSave} onToggleLock={onToggleLock} />
      <EditableCell offerId={offer.id} field="offer_name" value={offer.offer_name} locked={locked("offer_name")} width={widths.offer_name} onSave={onSave} onToggleLock={onToggleLock} />
      <EditableCell offerId={offer.id} field="reward" value={offer.reward} locked={locked("reward")} hasIssue={hasRewardIssue} width={widths.reward} onSave={onSave} onToggleLock={onToggleLock} />
      <EditableCell offerId={offer.id} field="short_description" value={offer.short_description || ""} locked={locked("short_description")} hasIssue={hasDescIssue} width={widths.short_description} onSave={onSave} onToggleLock={onToggleLock} />
      <EditableCell offerId={offer.id} field="difficulty" value={offer.difficulty} locked={locked("difficulty")} width={widths.difficulty} onSave={onSave} onToggleLock={onToggleLock} />
      <EditableCell offerId={offer.id} field="is_active" value={offer.is_active} locked={false} width={widths.is_active} onSave={onSave} onToggleLock={onToggleLock} />
      <td className={`px-3 py-2 ${hasDescIssue ? "bg-red-50 dark:bg-red-950/20" : ""}`} style={{ width: widths.leadstar_description_html, minWidth: widths.leadstar_description_html, maxWidth: widths.leadstar_description_html }}>
        <span className="text-xs text-muted-foreground truncate block" title={offer.leadstar_description_html ? stripHtml(offer.leadstar_description_html) : ""}>
          {offer.leadstar_description_html ? stripHtml(offer.leadstar_description_html) : <span className="text-red-400 italic">brak</span>}
        </span>
      </td>
      <td className={`px-3 py-2 ${offer.quality_flags.benefits_empty ? "bg-amber-50 dark:bg-amber-950/20" : ""}`} style={{ width: widths.leadstar_benefits_html, minWidth: widths.leadstar_benefits_html, maxWidth: widths.leadstar_benefits_html }}>
        <span className="text-xs text-muted-foreground truncate block" title={offer.leadstar_benefits_html ? stripHtml(offer.leadstar_benefits_html) : ""}>
          {offer.leadstar_benefits_html ? stripHtml(offer.leadstar_benefits_html) : <span className="text-amber-400 italic">brak</span>}
        </span>
      </td>
      <td className="px-3 py-2" style={{ width: widths.quality_flags, minWidth: widths.quality_flags }}>
        <QualityBadges flags={offer.quality_flags} />
      </td>
      <td className="px-3 py-2 text-center" style={{ width: widths.affiliate_url, minWidth: widths.affiliate_url }}>
        {offer.affiliate_url && (
          <a href={offer.affiliate_url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground mx-auto" />
          </a>
        )}
      </td>
    </tr>
  );
}

function TableHeader({
  widths,
  startResize,
}: {
  widths: Record<string, number>;
  startResize: (col: string, e: React.MouseEvent) => void;
}) {
  return (
    <thead>
      <tr className="border-b bg-muted/50 text-xs text-muted-foreground">
        {COLUMNS.map((col) => (
          <th key={col.key} className="relative px-3 py-2 text-left font-medium select-none" style={{ width: widths[col.key], minWidth: widths[col.key] }}>
            <span className="truncate block pr-2">{col.label}</span>
            <div className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-primary/40 active:bg-primary/60 transition-colors" onMouseDown={(e) => startResize(col.key, e)} />
          </th>
        ))}
      </tr>
    </thead>
  );
}

function OffersTable({
  offers,
  widths,
  startResize,
  onSave,
  onToggleLock,
  emptyMessage,
}: {
  offers: FeedOffer[];
  widths: Record<string, number>;
  startResize: (col: string, e: React.MouseEvent) => void;
  onSave: (id: string, field: EditableField, value: string | number | boolean) => Promise<void>;
  onToggleLock: (id: string, field: EditableField, locked: boolean) => Promise<void>;
  emptyMessage: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="border-collapse" style={{ tableLayout: "fixed", width: COLUMNS.reduce((s, c) => s + widths[c.key], 0) }}>
        <TableHeader widths={widths} startResize={startResize} />
        <tbody>
          {offers.map((offer, idx) => (
            <OfferRow key={offer.id} offer={offer} widths={widths} onSave={onSave} onToggleLock={onToggleLock} idx={idx} />
          ))}
        </tbody>
      </table>
      {offers.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</div>
      )}
    </div>
  );
}

function InactiveOffersTable({
  offers,
  widths,
  onSave,
  onToggleLock,
}: {
  offers: FeedOffer[];
  widths: Record<string, number>;
  onSave: (id: string, field: EditableField, value: string | number | boolean) => Promise<void>;
  onToggleLock: (id: string, field: EditableField, locked: boolean) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className={`transition-transform inline-block ${expanded ? "rotate-90" : ""}`}>▶</span>
        Nieaktywne / wycofane z feedu ({offers.length})
        <span className="text-xs font-normal">— ukryte na stronie, nie ma ich w aktualnym feedzie LeadStar</span>
      </button>

      {expanded && (
        <div className="overflow-x-auto rounded-lg border border-dashed border-muted-foreground/30">
          <table className="border-collapse opacity-70" style={{ tableLayout: "fixed", width: COLUMNS.reduce((s, c) => s + widths[c.key], 0) }}>
            <thead>
              <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                {COLUMNS.map((col) => (
                  <th key={col.key} className="px-3 py-2 text-left font-medium" style={{ width: widths[col.key], minWidth: widths[col.key] }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, idx) => (
                <OfferRow key={offer.id} offer={offer} widths={widths} onSave={onSave} onToggleLock={onToggleLock} idx={idx} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminFeedPage() {
  const [offers, setOffers] = useState<FeedOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "issues" | "new" | "locked" | "scraped" | "mismatch">("all");
  const { widths, startResize } = useResizableColumns();

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
    setOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, locked_fields: newLocked } : o));
  }, [offers]);

  const matchesSearch = (o: FeedOffer) =>
    !search ||
    o.bank_name.toLowerCase().includes(search.toLowerCase()) ||
    o.offer_name.toLowerCase().includes(search.toLowerCase());

  const matchesFilter = (o: FeedOffer) => {
    switch (filter) {
      case "issues": return !!(o.quality_flags.reward_zero || o.quality_flags.description_empty);
      case "new": return isNew(o.first_seen_at);
      case "locked": return o.locked_fields.length > 0;
      case "scraped": return !!o.quality_flags.scraped_from_page;
      case "mismatch": return !!(o.quality_flags.reward_mismatch || o.quality_flags.page_unreachable);
      default: return true;
    }
  };

  const activeOffers = offers.filter((o) => o.is_active && matchesSearch(o) && matchesFilter(o));
  const inactiveOffers = offers.filter((o) => !o.is_active && matchesSearch(o) && matchesFilter(o));

  const issuesCount = offers.filter((o) => o.quality_flags.reward_zero || o.quality_flags.description_empty).length;
  const newCount = offers.filter((o) => isNew(o.first_seen_at)).length;
  const lockedCount = offers.filter((o) => o.locked_fields.length > 0).length;
  const mismatchCount = offers.filter((o) => o.quality_flags.reward_mismatch || o.quality_flags.page_unreachable).length;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <AlertTriangle className="mx-auto h-8 w-8 text-destructive mb-2" />
      <p className="text-muted-foreground">{error}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Podgląd feedu ({offers.length})</h1>
        <p className="text-xs text-muted-foreground">
          Kliknij komórkę żeby edytować • 🔒 blokuje pole przed sync • Przeciągnij krawędź nagłówka żeby zmienić szerokość
        </p>
      </div>

      {/* Filtry */}
      <div className="flex flex-wrap gap-2 items-center">
        {[
          { key: "all", label: `Wszystkie (${offers.length})`, color: "" },
          { key: "new", label: `Nowe (${newCount})`, color: newCount > 0 ? "text-emerald-600" : "" },
          { key: "issues", label: `Problemy (${issuesCount})`, color: issuesCount > 0 ? "text-red-600" : "" },
          { key: "locked", label: `Zablokowane (${lockedCount})`, color: "text-amber-600" },
          { key: "mismatch", label: `Niezgodności (${mismatchCount})`, color: mismatchCount > 0 ? "text-red-600" : "" },
          { key: "scraped", label: "Scrapowane", color: "" },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === key ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            } ${color}`}
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

      {(issuesCount > 0 || mismatchCount > 0) && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {issuesCount > 0 && <><strong>{issuesCount} ofert</strong> ma braki w danych (premia 0 lub pusty opis). </>}
            {mismatchCount > 0 && <><strong className="text-red-600">{mismatchCount} ofert</strong> ma niezgodność premii między naszą bazą a stroną banku. </>}
            Quality check: co 30 min w godz. 2–7 UTC (12 uruchomień × 5 ofert = 60/noc). Przy większej liczbie ofert rotacja automatyczna.
          </span>
        </div>
      )}

      {/* Tabela aktywnych */}
      <OffersTable
        offers={activeOffers}
        widths={widths}
        startResize={startResize}
        onSave={saveField}
        onToggleLock={toggleLock}
        emptyMessage="Brak aktywnych ofert pasujących do filtrów."
      />

      {/* Tabela nieaktywnych */}
      {inactiveOffers.length > 0 && (
        <InactiveOffersTable
          offers={inactiveOffers}
          widths={widths}
          onSave={saveField}
          onToggleLock={toggleLock}
        />
      )}

      <p className="text-[10px] text-muted-foreground">
        🔒 Zablokowane pola nie są nadpisywane przez sync z LeadStar. Hover na komórce → kliknij kłódkę żeby zablokować/odblokować.
      </p>
    </div>
  );
}
