import { Info } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-amber-800">
          <Info className="h-4 w-4 shrink-0" />
          <p>
            <strong>Informacja:</strong> Serwis ma charakter informacyjny i nie
            stanowi doradztwa finansowego. Przedstawione oferty mogą ulec
            zmianie – szczegóły na stronach banków.{" "}
            <a href="/o-nas" className="underline hover:text-amber-900">
              Dowiedz się więcej
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
