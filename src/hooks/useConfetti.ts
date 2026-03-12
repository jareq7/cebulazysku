"use client";

import { useCallback } from "react";

export function useConfetti() {
  const fire = useCallback((variant: "complete" | "payout" = "complete") => {
    import("canvas-confetti").then(({ default: confetti }) => {
      if (variant === "payout") {
        // Big celebration — złote konfetti
        const end = Date.now() + 2000;
        const colors = ["#059669", "#10b981", "#fbbf24", "#f59e0b"];
        (function frame() {
          confetti({
            particleCount: 6,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors,
          });
          confetti({
            particleCount: 6,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors,
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      } else {
        // Warunki spełnione — skromniejsze konfetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#059669", "#10b981", "#34d399", "#6ee7b7"],
        });
      }
    });
  }, []);

  return { fire };
}
