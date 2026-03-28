// @author Claude Code (claude-opus-4-6) | 2026-03-26
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Globe,
  FileText,
  Link2,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface SeoStats {
  totalPages: number;
  totalBlogPosts: number;
  totalOffers: number;
  totalBankHubs: number;
  totalComparisons: number;
  pagesWithFaq: number;
  internalLinksBank: number;
  internalLinksGlossary: number;
}

interface SitemapUrl {
  loc: string;
  lastmod?: string;
}

export default function AdminSeoPage() {
  const [stats, setStats] = useState<SeoStats | null>(null);
  const [sitemapUrls, setSitemapUrls] = useState<SitemapUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [sitemapLoading, setSitemapLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      const password = sessionStorage.getItem("admin_password");
      const res = await fetch("/api/admin/seo-stats", {
        headers: { "x-admin-password": password || "" },
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }

  async function fetchSitemap() {
    setSitemapLoading(true);
    try {
      const res = await fetch("/sitemap.xml");
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/xml");
      const urls = Array.from(doc.querySelectorAll("url")).map((node) => ({
        loc: node.querySelector("loc")?.textContent || "",
        lastmod: node.querySelector("lastmod")?.textContent || undefined,
      }));
      setSitemapUrls(urls);
    } catch {
      // ignore
    }
    setSitemapLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6" />
            SEO Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Przegląd stanu SEO witryny
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStats}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Odśwież
        </Button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Globe className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.totalPages}</p>
              <p className="text-xs text-muted-foreground">Stron w sitemap</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.totalBlogPosts}</p>
              <p className="text-xs text-muted-foreground">Blogów</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.totalOffers}</p>
              <p className="text-xs text-muted-foreground">Ofert aktywnych</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Link2 className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-3xl font-bold">
                {stats.internalLinksBank + stats.internalLinksGlossary}
              </p>
              <p className="text-xs text-muted-foreground">
                Reguł internal linking
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content coverage */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pokrycie treścią</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Hub pages /bank/[slug]", count: stats.totalBankHubs, target: 12 },
                { label: "Porównania /porownanie/[slug]", count: stats.totalComparisons, target: 28 },
                { label: "Oferty z FAQ", count: stats.pagesWithFaq, target: stats.totalOffers },
                { label: "Blog posts", count: stats.totalBlogPosts, target: 20 },
              ].map((item) => {
                const pct = Math.min(100, Math.round((item.count / item.target) * 100));
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="text-muted-foreground">
                        {item.count}/{item.target}
                        <Badge
                          variant={pct >= 80 ? "default" : pct >= 50 ? "secondary" : "destructive"}
                          className="ml-2 text-[10px]"
                        >
                          {pct}%
                        </Badge>
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Internal Linking */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Internal Linking Engine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Reguły banków</p>
                <p className="text-2xl font-bold">{stats.internalLinksBank}</p>
                <p className="text-xs text-muted-foreground">
                  Auto-link nazw banków → /bank/[slug]
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Reguły słownikowe</p>
                <p className="text-2xl font-bold">{stats.internalLinksGlossary}</p>
                <p className="text-xs text-muted-foreground">
                  Auto-link terminów → /slownik#anchor
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GSC Placeholder */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Google Search Console (wymaga konfiguracji)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Aby zobaczyć dane z GSC (top queries, kliknięcia, CTR, pozycje),
            skonfiguruj Google Search Console API:
          </p>
          <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
            <li>Utwórz Service Account w Google Cloud Console</li>
            <li>Włącz Search Console API</li>
            <li>Dodaj Service Account jako użytkownika w GSC</li>
            <li>
              Dodaj env vars: <code className="text-xs bg-muted px-1 rounded">GSC_SERVICE_ACCOUNT_EMAIL</code>,{" "}
              <code className="text-xs bg-muted px-1 rounded">GSC_PRIVATE_KEY</code>
            </li>
          </ol>
          <div className="flex gap-2">
            <a
              href="https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Acebulazysku.pl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="h-3.5 w-3.5" />
                Otwórz GSC
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Sitemap browser */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Sitemap</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSitemap}
            disabled={sitemapLoading}
          >
            {sitemapLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Załaduj sitemap"
            )}
          </Button>
        </CardHeader>
        {sitemapUrls.length > 0 && (
          <CardContent>
            <div className="max-h-80 overflow-y-auto space-y-1 text-sm">
              {sitemapUrls.map((url) => (
                <div
                  key={url.loc}
                  className="flex items-center justify-between py-1 border-b last:border-0"
                >
                  <a
                    href={url.loc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate mr-4"
                  >
                    {url.loc.replace("https://cebulazysku.pl", "")}
                  </a>
                  {url.lastmod && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {url.lastmod}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {sitemapUrls.length} URLi w sitemap
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
