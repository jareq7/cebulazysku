// @author Claude Code (claude-opus-4-6) | 2026-03-19
import { AlertTriangle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeadlineAlertProps {
  deadline: string;
  className?: string;
}

function getDaysLeft(deadline: string): number | null {
  const ms = new Date(deadline).getTime();
  if (isNaN(ms)) return null;
  return Math.max(0, Math.ceil((ms - Date.now()) / (1000 * 60 * 60 * 24)));
}

export function DeadlineAlert({ deadline, className }: DeadlineAlertProps) {
  const daysLeft = getDaysLeft(deadline);
  if (daysLeft === null || daysLeft > 14) return null;

  const isUrgent = daysLeft <= 7;

  return (
    <Alert
      className={`${
        isUrgent
          ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300"
          : "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300"
      } ${className ?? ""}`}
    >
      {isUrgent ? (
        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
      ) : (
        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      )}
      <AlertDescription className="font-medium">
        {daysLeft === 0
          ? "Ostatni dzień promocji!"
          : daysLeft === 1
            ? "Zostal 1 dzień do końca promocji!"
            : `Zostało ${daysLeft} dni do końca promocji!`}
      </AlertDescription>
    </Alert>
  );
}

export function DeadlineBadge({ deadline }: { deadline: string }) {
  const daysLeft = getDaysLeft(deadline);
  if (daysLeft === null || daysLeft > 7) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-0.5 text-xs font-semibold animate-pulse">
      <AlertTriangle className="h-3 w-3" />
      {daysLeft === 0 ? "Ostatni dzień!" : `${daysLeft} dni!`}
    </span>
  );
}
