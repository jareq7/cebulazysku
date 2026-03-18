// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-18
"use client";

import { useState, useEffect } from "react";
import { BankOffer } from "@/data/banks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface ProfitCalculatorProps {
  offers: BankOffer[];
}

export function ProfitCalculator({ offers }: ProfitCalculatorProps) {
  const [step, setStep] = useState(1);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  const availableOffers = offers.filter(o => !selectedBanks.includes(o.bankName));
  const potentialEarnings = availableOffers.reduce((sum, o) => sum + o.reward, 0);

  // Unikalne banki z ofert
  const allBanks = Array.from(new Set(offers.map(o => o.bankName))).sort();

  useEffect(() => {
    if (step === 2) {
      let start = 0;
      const end = potentialEarnings;
      if (start === end) return;

      const duration = 1500;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedTotal(end);
          clearInterval(timer);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#059669', '#34d399']
          });
        } else {
          setAnimatedTotal(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [step, potentialEarnings]);

  const toggleBank = (bankName: string) => {
    setSelectedBanks(prev => 
      prev.includes(bankName) 
        ? prev.filter(b => b !== bankName)
        : [...prev, bankName]
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/30 shadow-xl">
      <CardHeader className="bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/30 py-6">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
          <Wallet className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Kalkulator Zysku</span>
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-extrabold">
          {step === 1 ? "Gdzie masz już konto?" : "Twoja ukryta cebula 🧅"}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Zaznacz banki, w których <strong>posiadasz już</strong> konto osobiste. 
              Pokażemy Ci, ile pieniędzy czeka na Ciebie w pozostałych bankach!
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allBanks.map(bank => (
                <div 
                  key={bank}
                  onClick={() => toggleBank(bank)}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer
                    ${selectedBanks.includes(bank) 
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" 
                      : "border-transparent bg-muted/50 hover:bg-muted"}
                  `}
                >
                  <div className={`
                    w-5 h-5 rounded-md border flex items-center justify-center transition-colors
                    ${selectedBanks.includes(bank) ? "bg-emerald-500 border-emerald-500" : "bg-background border-input"}
                  `}>
                    {selectedBanks.includes(bank) && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <span className="text-sm font-medium">{bank}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-bold gap-2 mt-4 shadow-lg shadow-emerald-500/20"
              onClick={() => setStep(2)}
            >
              Oblicz mój zysk
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-8 py-4">
            <div className="space-y-2">
              <p className="text-muted-foreground font-medium">Tyle pieniędzy leży na stole:</p>
              <div className="text-6xl sm:text-7xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                {animatedTotal} <span className="text-3xl sm:text-4xl font-bold">zł</span>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30">
              <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-bold">Masz do zgarnięcia {availableOffers.length} premii!</span>
              </div>
              <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 leading-relaxed">
                Straciłeś te pieniądze tylko dlatego, że jeszcze nie obierasz z nami cebuli. 
                Pora to zmienić i zacząć łupić banki legalnie!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 h-12"
                onClick={() => setStep(1)}
              >
                Zmień banki
              </Button>
              <Link href="/ranking" className="flex-1">
                <Button size="lg" className="w-full h-12 gap-2 font-bold shadow-lg shadow-emerald-500/20">
                  Odbierz swoje {potentialEarnings} zł
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
