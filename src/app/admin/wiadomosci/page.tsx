"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertTriangle,
  Mail,
  MailOpen,
  Clock,
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .catch(() => setError("Nie udało się załadować wiadomości."))
      .finally(() => setLoading(false));
  }, []);

  const toggleRead = async (id: string, currentRead: boolean) => {
    const res = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_read: !currentRead }),
    });

    if (res.ok) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: !currentRead } : m))
      );
    }
  };

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

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Wiadomości ({messages.length})
          {unread > 0 && (
            <Badge variant="destructive" className="ml-2 text-xs">
              {unread} nowych
            </Badge>
          )}
        </h1>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={`transition-colors ${
              !msg.is_read
                ? "border-primary/30 bg-primary/5"
                : ""
            }`}
          >
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {msg.is_read ? (
                    <MailOpen className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Mail className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{msg.name}</p>
                    <span className="text-xs text-muted-foreground">
                      &lt;{msg.email}&gt;
                    </span>
                    {!msg.is_read && (
                      <Badge className="text-xs">Nowa</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(msg.created_at).toLocaleString("pl-PL")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => toggleRead(msg.id, msg.is_read)}
                    >
                      {msg.is_read ? "Oznacz jako nieprzeczytane" : "Oznacz jako przeczytane"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Brak wiadomości.
          </p>
        )}
      </div>
    </div>
  );
}
