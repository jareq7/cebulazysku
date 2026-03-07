"use client";

import { useState } from "react";
import { Mail, Send, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend-only – no backend
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-extrabold">Kontakt</h1>
      </div>
      <p className="text-muted-foreground mb-10">
        Masz pytanie, sugestię lub chcesz nawiązać współpracę? Napisz do nas.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Wyślij wiadomość</CardTitle>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center py-8">
                <Send className="mx-auto h-10 w-10 text-green-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">Wiadomość wysłana!</h3>
                <p className="text-sm text-muted-foreground">
                  Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Imię</Label>
                  <Input
                    id="name"
                    placeholder="Twoje imię"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="twoj@email.pl"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="message">Wiadomość</Label>
                  <textarea
                    id="message"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Twoja wiadomość..."
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Wyślij wiadomość
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Contact info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">E-mail</p>
                  <a
                    href="mailto:kontakt@cebulazysku.pl"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    kontakt@cebulazysku.pl
                  </a>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Czas odpowiedzi</p>
                  <p className="text-sm text-muted-foreground">
                    Staramy się odpowiadać w ciągu 24 godzin w dni robocze.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-3">
                Najczęstsze powody kontaktu
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Pytania dotyczące promocji bankowych</li>
                <li>• Zgłoszenie nieaktualnej oferty</li>
                <li>• Propozycja współpracy (banki, partnerzy)</li>
                <li>• Problemy techniczne z serwisem</li>
                <li>• Żądania dotyczące danych osobowych (RODO)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
