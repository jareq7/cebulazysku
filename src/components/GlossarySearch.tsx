// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface GlossaryTerm {
  term: string;
  tooltip: string;
}

export function GlossarySearch({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim().length >= 2
    ? terms.filter(
        (t) =>
          t.term.toLowerCase().includes(query.toLowerCase()) ||
          t.tooltip.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Szukaj terminu… (np. BIK, karencja, rotacja)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {query.trim().length >= 2 && (
        <div className="mt-3 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Nie znaleziono terminu „{query}". Może warto sprawdzić pełną listę poniżej?
            </p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                Znaleziono: {filtered.length}
              </p>
              {filtered.map((item) => (
                <Card key={item.term}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{item.term}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.tooltip}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
