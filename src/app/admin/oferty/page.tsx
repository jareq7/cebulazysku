"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  AlertTriangle,
  Search,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Offer {
  id: string;
  slug: string;
  bank_name: string;
  offer_name: string;
  source: string;
  is_active: boolean;
  leadstar_id: string | null;
  affiliate_url: string | null;
  updated_at: string;
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/offers")
      .then((r) => r.json())
      .then((d) => setOffers(d.offers || []))
      .catch(() => setError("Nie udało się załadować ofert."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = offers.filter(
    (o) =>
      o.bank_name.toLowerCase().includes(search.toLowerCase()) ||
      o.offer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.slug.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Oferty ({offers.length})</h1>
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

      <div className="space-y-2">
        {filtered.map((offer) => (
          <Card key={offer.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {offer.is_active ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                    )}
                    <p className="font-medium text-sm truncate">
                      {offer.bank_name} — {offer.offer_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{offer.slug}</span>
                    <span>•</span>
                    <Badge variant="secondary" className="text-xs">
                      {offer.source}
                    </Badge>
                    {offer.leadstar_id && (
                      <>
                        <span>•</span>
                        <span>LS: {offer.leadstar_id}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>
                      {new Date(offer.updated_at).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {offer.affiliate_url && (
                    <a href={offer.affiliate_url} target="_blank" rel="noopener">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
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
