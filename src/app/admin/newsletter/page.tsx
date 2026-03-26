// @author Claude Code (claude-opus-4-6) | 2026-03-26
"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Users, UserCheck, Clock, UserX } from "lucide-react";

interface Stats {
  total: number;
  active: number;
  pending: number;
  unsubscribed: number;
}

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: string;
  source: string | null;
  subscribed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
}

export default function AdminNewsletterPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/newsletter");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStats(data.stats);
      setSubscribers(data.subscribers);
    } catch {
      setError("Nie udało się pobrać danych.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = () => {
    const password = sessionStorage.getItem("admin_password") || "";
    window.open(`/api/admin/newsletter?format=csv&auth=${password}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-10">{error}</p>;
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Aktywny</Badge>;
      case "pending":
        return <Badge variant="secondary">Oczekuje</Badge>;
      case "unsubscribed":
        return <Badge variant="outline" className="text-muted-foreground">Wypisany</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Newsletter</h1>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Eksport CSV
        </Button>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Łącznie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                Aktywni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Oczekujący
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserX className="h-4 w-4" />
                Wypisani
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-muted-foreground">{stats.unsubscribed}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscribers table */}
      <Card>
        <CardHeader>
          <CardTitle>Ostatni subskrybenci</CardTitle>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Brak subskrybentów</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium">Imię</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Źródło</th>
                    <th className="pb-2 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b last:border-0">
                      <td className="py-2.5">{sub.email}</td>
                      <td className="py-2.5 text-muted-foreground">{sub.name || "—"}</td>
                      <td className="py-2.5">{statusBadge(sub.status)}</td>
                      <td className="py-2.5 text-muted-foreground">{sub.source || "—"}</td>
                      <td className="py-2.5 text-muted-foreground">
                        {new Date(sub.created_at).toLocaleDateString("pl-PL")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
