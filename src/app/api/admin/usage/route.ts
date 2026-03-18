// @author Claude Code (claude-opus-4-6) | 2026-03-18
// Admin API: AI & external service usage dashboard

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

interface UsageData {
  elevenlabs: {
    character_count: number;
    character_limit: number;
    can_extend_character_limit: boolean;
    next_reset: string;
  } | null;
  openrouter: {
    credits_remaining: number;
    credits_used: number;
  } | null;
  canva: {
    connected: boolean;
    expires_at: string | null;
  };
  supabase: {
    blog_posts: number;
    offers: number;
    users: number;
    sync_logs: number;
    canva_tokens: number;
  };
  leadstar: {
    last_sync: string | null;
    offers_found: number;
  };
}

export async function GET(req: NextRequest) {
  const authError = verifyAdmin(req);
  if (authError) return authError;

  const usage: UsageData = {
    elevenlabs: null,
    openrouter: null,
    canva: { connected: false, expires_at: null },
    supabase: { blog_posts: 0, offers: 0, users: 0, sync_logs: 0, canva_tokens: 0 },
    leadstar: { last_sync: null, offers_found: 0 },
  };

  // Parallel fetches
  const results = await Promise.allSettled([
    // ElevenLabs usage
    fetchElevenLabsUsage(),
    // OpenRouter credits
    fetchOpenRouterCredits(),
    // Canva token status
    fetchCanvaStatus(),
    // Supabase table counts
    fetchSupabaseCounts(),
    // Last sync info
    fetchLastSync(),
  ]);

  if (results[0].status === "fulfilled") usage.elevenlabs = results[0].value;
  if (results[1].status === "fulfilled") usage.openrouter = results[1].value;
  if (results[2].status === "fulfilled") usage.canva = results[2].value;
  if (results[3].status === "fulfilled") usage.supabase = results[3].value;
  if (results[4].status === "fulfilled") usage.leadstar = results[4].value;

  return NextResponse.json(usage);
}

async function fetchElevenLabsUsage() {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return null;

  const res = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
    headers: { "xi-api-key": key },
  });
  if (!res.ok) return null;

  const data = await res.json();
  return {
    character_count: data.character_count || 0,
    character_limit: data.character_limit || 0,
    can_extend_character_limit: data.can_extend_character_limit || false,
    next_reset: data.next_character_count_reset_unix
      ? new Date(data.next_character_count_reset_unix * 1000).toISOString()
      : "",
  };
}

async function fetchOpenRouterCredits() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;

  const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) return null;

  const data = await res.json();
  return {
    credits_remaining: data.data?.limit_remaining ?? 0,
    credits_used: data.data?.usage ?? 0,
  };
}

async function fetchCanvaStatus() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/canva_tokens?select=expires_at&limit=1`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    return { connected: false, expires_at: null };
  }
  return { connected: true, expires_at: data[0].expires_at };
}

async function fetchSupabaseCounts() {
  const headers = {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    Prefer: "count=exact",
  };

  const tables = ["blog_posts", "offers", "sync_log", "canva_tokens"];
  const counts = await Promise.all(
    tables.map(async (table) => {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?select=id&limit=0`,
        { headers }
      );
      const count = parseInt(res.headers.get("content-range")?.split("/")[1] || "0", 10);
      return [table, count] as [string, number];
    })
  );

  // Users count from auth (different endpoint)
  let usersCount = 0;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?per_page=1&page=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      usersCount = data.total || data.users?.length || 0;
    }
  } catch {}

  const map = Object.fromEntries(counts);
  return {
    blog_posts: map.blog_posts || 0,
    offers: map.offers || 0,
    users: usersCount,
    sync_logs: map.sync_log || 0,
    canva_tokens: map.canva_tokens || 0,
  };
}

async function fetchLastSync() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/sync_log?select=created_at,offers_found&order=created_at.desc&limit=1`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    return { last_sync: null, offers_found: 0 };
  }
  return {
    last_sync: data[0].created_at,
    offers_found: data[0].offers_found || 0,
  };
}
