// @author Claude Code (claude-opus-4-6) | 2026-03-17
"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics-events";

interface TrackBlogReadProps {
  articleId: string;
  articleTitle: string;
}

/**
 * Fires blog_read event when user scrolls 75% of the article.
 * Renders nothing — just attaches a scroll observer.
 */
export function TrackBlogRead({ articleId, articleTitle }: TrackBlogReadProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;

    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;

      if (scrollPercent >= 0.75 && !fired.current) {
        fired.current = true;
        trackEvent(AnalyticsEvents.BLOG_READ, {
          article_id: articleId,
          article_title: articleTitle,
        });
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [articleId, articleTitle]);

  return null;
}
