// @author Claude Code (claude-opus-4-6) | 2026-03-30
"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, ExternalLink } from "lucide-react";

interface Offer {
  id: string;
  slug: string;
  bank_name: string;
  offer_name: string;
  reward: number;
  is_business: boolean;
  for_young: boolean;
  deadline: string | null;
  affiliate_url: string | null;
  conditions: { type: string; label: string; requiredCount?: number; perMonth?: boolean }[] | null;
}

const PEPPER_TEMPLATES = [
  { id: "classic", name: "Klasyczna gotówka", forBusiness: false },
  { id: "voucher", name: "Gotówka + Vouchery", forBusiness: false },
  { id: "credit-card", name: "Karta Kredytowa + Bon", forBusiness: false },
  { id: "savings", name: "Lokata / Konto Oszczędnościowe", forBusiness: false },
  { id: "young", name: "Dla Młodych (18-26)", forBusiness: false },
  { id: "business", name: "Konto Firmowe (B2B)", forBusiness: true },
  { id: "cashback", name: "Cashback", forBusiness: false },
  { id: "referral", name: "Bonus za Polecenie", forBusiness: false },
  { id: "comeback", name: "Powrót Legendy", forBusiness: false },
  { id: "no-brainer", name: "No-Brainer (krótka)", forBusiness: false },
] as const;

function generateConditionsSummary(conditions: Offer["conditions"]): string {
  if (!conditions || conditions.length === 0) return "Brak szczegółowych warunków.";
  return conditions
    .map((c) => {
      let text = c.label;
      if (c.requiredCount && c.requiredCount > 1) text += ` (${c.requiredCount}x)`;
      if (c.perMonth) text += " miesięcznie";
      return text;
    })
    .join("\n");
}

function generatePepperPost(offer: Offer, templateId: string): { title: string; body: string } {
  const utm = `?utm_source=pepper&utm_medium=social&utm_campaign=${offer.slug}`;
  const link = `https://cebulazysku.pl/oferta/${offer.slug}${utm}`;
  const conditionsSummary = generateConditionsSummary(offer.conditions);

  switch (templateId) {
    case "classic":
      return {
        title: `Łatwe ${offer.reward} zł w gotówce od ${offer.bank_name} za założenie darmowego konta`,
        body: `Siemano Pepperczyki!\nŚwieżutka promocja od ${offer.bank_name}. Za założenie darmowego konta ${offer.offer_name} i spełnienie prostych warunków zgarniamy **${offer.reward} zł** prosto na konto.\n\n**Warunki w skrócie:**\n${conditionsSummary}\n\n${offer.deadline ? `Promocja ważna do: ${offer.deadline}` : ""}\nPo odebraniu nagrody można zamknąć. Prosty zysk!\n\nSzczegóły i link: ${link}`,
      };

    case "young":
      return {
        title: `Studenci / Młodzi (18-26 lat): ${offer.reward} zł bez opłat od ${offer.bank_name}`,
        body: `Jesteś przed 26 rokiem życia? To dla Ciebie darmowa gotówka. ${offer.bank_name} dosypuje **${offer.reward} zł** na start do konta ${offer.offer_name}.\n\nKonto, karta i bankomaty za 0 zł. Zakładasz, robisz warunki, zgarniasz kasę.\n\n**Warunki:**\n${conditionsSummary}\n\nSzczegóły: ${link}`,
      };

    case "business":
      return {
        title: `B2B: ${offer.reward} zł dla przedsiębiorców (Konto Firmowe) od ${offer.bank_name}`,
        body: `Dla osób na JDG. ${offer.bank_name} daje **${offer.reward} zł** za założenie konta firmowego ${offer.offer_name}.\n\n**Warunki:**\n${conditionsSummary}\n\nFaktury i tak opłacasz — rób to z konta, które Ci za to zapłaci.\n\nSzczegóły: ${link}`,
      };

    case "no-brainer":
      return {
        title: `Błąd w matrixie? ${offer.reward} zł od ${offer.bank_name} za proste warunki`,
        body: `Nie ma co się rozpisywać. Najprostsza promocja tego miesiąca.\nZakładasz konto w ${offer.bank_name}, spełniasz minimalne warunki, zgarniasz **${offer.reward} zł**.\n\nŻadnych wizyt w placówce. Czysty no-brainer.\n\nSzczegóły: ${link}`,
      };

    case "comeback":
      return {
        title: `WRÓCIŁO! Kultowe ${offer.reward} zł od ${offer.bank_name} za proste warunki`,
        body: `Na rynek wjechała odświeżona promocja od ${offer.bank_name}. Znowu dają **${offer.reward} zł** za łatwe zadania.\n\n**Warunki:**\n${conditionsSummary}\n\nIdealne dla początkujących cebulaków. Wbijajcie, póki pula nie wygaśnie!\n\nSzczegóły: ${link}`,
      };

    case "cashback":
      return {
        title: `Do ${offer.reward} zł w zwrotach (cashback za zakupy) z ${offer.bank_name}`,
        body: `Zakładamy konto ${offer.offer_name} w ${offer.bank_name} i cieszymy się zwrotem za codzienne zakupy!\n\nMaksymalnie można wyciągnąć **${offer.reward} zł** na czysto.\n\n**Warunki:**\n${conditionsSummary}\n\nSzczegóły: ${link}`,
      };

    default:
      return {
        title: `${offer.reward} zł premii od ${offer.bank_name} — ${offer.offer_name}`,
        body: `${offer.bank_name} oferuje **${offer.reward} zł** za ${offer.offer_name}.\n\n**Warunki:**\n${conditionsSummary}\n\n${offer.deadline ? `Ważne do: ${offer.deadline}` : ""}\n\nSzczegóły i link do oferty: ${link}`,
      };
  }
}

export default function MarketingPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const [copied, setCopied] = useState<"title" | "body" | "all" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/offers")
      .then((r) => r.json())
      .then((data) => {
        const active = (data.offers || []).filter((o: Offer) => o.reward > 0);
        setOffers(active);
        if (active.length > 0) setSelectedOffer(active[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const offer = offers.find((o) => o.id === selectedOffer);
  const generated = offer ? generatePepperPost(offer, selectedTemplate) : null;

  async function copyToClipboard(text: string, type: "title" | "body" | "all") {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) return <p className="text-muted-foreground p-4">Ładowanie ofert...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Marketing Tools</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generator postów na Pepper.pl</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Oferta</label>
              <Select value={selectedOffer} onValueChange={setSelectedOffer}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz ofertę" />
                </SelectTrigger>
                <SelectContent>
                  {offers.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.bank_name} — {o.reward} zł {o.is_business ? "(firmowe)" : ""}{o.for_young ? "(młodzi)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Szablon</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PEPPER_TEMPLATES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {generated && (
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Tytuł</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generated.title, "title")}
                  >
                    {copied === "title" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-1 text-xs">{copied === "title" ? "Skopiowano!" : "Kopiuj"}</span>
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-md font-medium text-sm">
                  {generated.title}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Treść posta</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generated.body, "body")}
                  >
                    {copied === "body" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-1 text-xs">{copied === "body" ? "Skopiowano!" : "Kopiuj"}</span>
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {generated.body}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(`${generated.title}\n\n${generated.body}`, "all")}
                  className="flex-1"
                >
                  {copied === "all" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied === "all" ? "Skopiowano wszystko!" : "Kopiuj tytuł + treść"}
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href={`https://cebulazysku.pl/oferta/${offer?.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Podgląd oferty
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
