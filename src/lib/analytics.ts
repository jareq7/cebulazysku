// @author Claude Code (claude-opus-4-6) | 2026-03-17

import type { AnalyticsEvent } from "./analytics-events";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Push event to dataLayer (picked up by GTM)
 */
export function trackEvent(event: AnalyticsEvent | string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

/**
 * Push user data for enhanced conversions (SHA-256 hashed email)
 */
export async function setUserData(email: string) {
  if (typeof window === "undefined") return;
  const hashed = await hashEmail(email);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "user_data_set",
    user_data: { sha256_email_address: hashed },
  });
}

/**
 * SHA-256 hash email for enhanced conversions (no raw PII in dataLayer)
 */
async function hashEmail(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Capture UTM params from URL → sessionStorage
 */
export function captureUTM() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const utmData: Record<string, string> = {};
  let hasUTM = false;

  for (const key of utmKeys) {
    const value = params.get(key);
    if (value) {
      utmData[key] = value.toLowerCase();
      hasUTM = true;
    }
  }

  if (hasUTM) {
    sessionStorage.setItem("utm_data", JSON.stringify(utmData));
  }
}

/**
 * Get stored UTM params from sessionStorage
 */
export function getUTM(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("utm_data") || "{}");
  } catch {
    return {};
  }
}

// Consent types for Consent Mode v2
export type ConsentState = "granted" | "denied";

export interface ConsentSettings {
  analytics_storage: ConsentState;
  ad_storage: ConsentState;
  ad_personalization: ConsentState;
  ad_user_data: ConsentState;
}

const CONSENT_KEY = "cz_consent";

/**
 * Set default consent (denied) — called before GTM loads
 */
export function setConsentDefault() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // gtag-compatible consent default
  window.dataLayer.push({
    "0": "consent",
    "1": "default",
    "2": {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_personalization: "denied",
      ad_user_data: "denied",
      wait_for_update: 500,
    },
  });
}

/**
 * Update consent after user choice
 */
export function updateConsent(settings: ConsentSettings) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "0": "consent",
    "1": "update",
    "2": settings,
  });

  // Persist to localStorage + cookie (for SSR)
  localStorage.setItem(CONSENT_KEY, JSON.stringify(settings));
  document.cookie = `${CONSENT_KEY}=${encodeURIComponent(JSON.stringify(settings))};max-age=31536000;path=/;SameSite=Lax`;
}

/**
 * Load saved consent from localStorage
 */
export function getSavedConsent(): ConsentSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(CONSENT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Check if consent banner needs to be shown
 */
export function needsConsentBanner(): boolean {
  return getSavedConsent() === null;
}
