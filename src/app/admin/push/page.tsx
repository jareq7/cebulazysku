"use client";

import { adminFetch } from "@/lib/admin-fetch";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Loader2, Send, CheckCircle } from "lucide-react";

export default function AdminPushPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    sent: number;
    failed: number;
    total: number;
    cleaned: number;
  } | null>(null);
  const [error, setError] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setResult(null);

    try {
      const res = await adminFetch("/api/admin/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Nie udało się wysłać powiadomień.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Błąd połączenia.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Push notyfikacje</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Wyślij powiadomienie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <Label htmlFor="push-title">Tytuł</Label>
              <Input
                id="push-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nowa oferta!"
                required
              />
            </div>
            <div>
              <Label htmlFor="push-body">Treść</Label>
              <textarea
                id="push-body"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="mBank oferuje 300 zł premii za otwarcie konta!"
                required
              />
            </div>
            <div>
              <Label htmlFor="push-url">URL (po kliknięciu)</Label>
              <Input
                id="push-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {result && (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 text-sm border border-emerald-200 dark:border-emerald-800/40">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">
                    Wysłano!
                  </span>
                </div>
                <p className="text-emerald-600 dark:text-emerald-400">
                  Dostarczono: {result.sent}/{result.total} •
                  Nieudane: {result.failed}
                  {result.cleaned > 0 && ` • Wyczyszczono: ${result.cleaned} wygasłych`}
                </p>
              </div>
            )}

            <Button type="submit" disabled={sending} className="gap-2">
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {sending ? "Wysyłanie..." : "Wyślij do wszystkich"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-sm mb-2">Konfiguracja VAPID</h3>
          <p className="text-xs text-muted-foreground mb-2">
            Push notyfikacje wymagają kluczy VAPID. Wygeneruj je komendą:
          </p>
          <code className="block bg-muted rounded p-2 text-xs font-mono">
            npx web-push generate-vapid-keys
          </code>
          <p className="text-xs text-muted-foreground mt-2">
            Ustaw w Vercel env vars:
          </p>
          <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
            <li>• <code>NEXT_PUBLIC_VAPID_PUBLIC_KEY</code></li>
            <li>• <code>VAPID_PRIVATE_KEY</code></li>
            <li>• <code>VAPID_EMAIL</code> (opcjonalny, domyślnie mailto:kontakt@cebulazysku.pl)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
