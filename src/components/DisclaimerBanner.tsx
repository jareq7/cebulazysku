import { Info } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-800/40">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <Info className="h-4 w-4 shrink-0" />
          <p>
            <strong>Informacja:</strong> CebulaZysku ma charakter informacyjny i nie
            stanowi doradztwa finansowego. Przedstawione oferty mogą ulec
            zmianie – szczegóły na stronach banków.{" "}
            <a href="/o-nas" className="underline hover:text-emerald-900 dark:hover:text-emerald-200">
              Kim jesteśmy?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
