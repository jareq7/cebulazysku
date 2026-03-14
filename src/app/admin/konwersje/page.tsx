// @author Claude Code (claude-opus-4-6) | 2026-03-14

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, MousePointerClick, TrendingUp, Eye } from "lucide-react";

export default function KonwersjePage() {
  const placeholderStats = [
    { label: "Kliknięcia w linki", value: "—", icon: MousePointerClick },
    { label: "Wyświetlenia ofert", value: "—", icon: Eye },
    { label: "CTR", value: "—", icon: TrendingUp },
    { label: "Konwersje", value: "—", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Tracking konwersji</h1>
        <Badge variant="outline" className="text-amber-600 border-amber-300">Coming soon</Badge>
      </div>

      <Card>
        <CardContent className="py-8 text-center space-y-3">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-lg font-semibold">Wkrótce dostępne</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Tracking konwersji pozwoli Ci śledzić kliknięcia w linki afiliacyjne,
            mierzyć CTR per oferta i analizować trendy w czasie.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {placeholderStats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="opacity-50">
            <CardHeader className="pb-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-muted-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Planowane funkcje</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Tracking kliknięć w linki afiliacyjne (per oferta, per dzień)</li>
            <li>• CTR: wyświetlenia strony oferty vs kliknięcia w link</li>
            <li>• Wykres konwersji w czasie (dziennie / tygodniowo)</li>
            <li>• Top oferty wg kliknięć</li>
            <li>• Źródła ruchu (organic, direct, referral)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
