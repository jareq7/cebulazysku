// @author Claude Code (claude-opus-4-6) | 2026-03-26
"use client";

import { useCallback, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics-events";
import { Facebook, Twitter, Link2, Check, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  /** Short description for share text */
  text?: string;
  /** Content type for analytics */
  contentType?: "offer" | "blog";
  /** Item ID for analytics */
  itemId?: string;
}

export function ShareButtons({
  url,
  title,
  text,
  contentType = "offer",
  itemId,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = url.startsWith("http")
    ? url
    : `https://cebulazysku.pl${url}`;

  const shareText = text || title;

  const track = useCallback(
    (method: string) => {
      trackEvent(AnalyticsEvents.SHARE, {
        method,
        content_type: contentType,
        item_id: itemId,
      });
    },
    [contentType, itemId]
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      track("copy_link");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = fullUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      track("copy_link");
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fullUrl, track]);

  const buttons = [
    {
      label: "Facebook",
      icon: <Facebook className="h-4 w-4" />,
      onClick: () => {
        track("facebook");
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
          "_blank",
          "width=600,height=400"
        );
      },
      className:
        "bg-[#1877F2] text-white hover:bg-[#166FE5]",
    },
    {
      label: "X",
      icon: <Twitter className="h-4 w-4" />,
      onClick: () => {
        track("twitter");
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`,
          "_blank",
          "width=600,height=400"
        );
      },
      className:
        "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200",
    },
    {
      label: "WhatsApp",
      icon: <MessageCircle className="h-4 w-4" />,
      onClick: () => {
        track("whatsapp");
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`,
          "_blank"
        );
      },
      className:
        "bg-[#25D366] text-white hover:bg-[#20BD5A]",
    },
    {
      label: copied ? "Skopiowano!" : "Kopiuj link",
      icon: copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Link2 className="h-4 w-4" />
      ),
      onClick: handleCopy,
      className: copied
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          onClick={btn.onClick}
          aria-label={`Udostępnij przez ${btn.label}`}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${btn.className}`}
        >
          {btn.icon}
          <span className="hidden sm:inline">{btn.label}</span>
        </button>
      ))}
    </div>
  );
}
