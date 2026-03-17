// @author Claude Code (claude-opus-4-6) | 2026-03-17
"use client";

import { useTrackPageView } from "@/hooks/useTrackPageView";

export function PageViewTracker() {
  useTrackPageView();
  return null;
}
