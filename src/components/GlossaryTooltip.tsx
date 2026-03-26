// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
"use client";

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import glossaryData from "@/../research/tooltip-glossary.json";

const termMap = new Map(
  glossaryData.terms.map((t) => [t.term.toLowerCase(), t])
);

interface GlossaryTooltipProps {
  term: string;
  children?: React.ReactNode;
}

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const entry = termMap.get(term.toLowerCase());
  if (!entry) return <>{children || term}</>;

  const anchor = entry.term.toLowerCase().replace(/\s+/g, "-");

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/slownik#${anchor}`}
            className="underline decoration-dotted decoration-emerald-400 underline-offset-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-help"
          >
            {children || term}
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs text-sm leading-relaxed"
        >
          <p className="font-semibold mb-0.5">{entry.term}</p>
          <p className="text-muted-foreground">{entry.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
