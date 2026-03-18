// @author Claude Code (claude-opus-4-6) | 2026-03-18
// Canva OAuth initiation — redirects admin to Canva consent page

import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/canva";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  // Admin auth check
  const password = req.headers.get("x-admin-password") || req.nextUrl.searchParams.get("key");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate CSRF state
  const state = crypto.randomBytes(16).toString("hex");

  // Build redirect URI based on request origin
  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/canva/callback`;

  // Build Canva auth URL
  const authUrl = getAuthUrl(redirectUri, state);

  // Store state in cookie for verification
  const response = NextResponse.redirect(authUrl);
  response.cookies.set("canva_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600, // 10 minutes
    sameSite: "lax",
  });

  return response;
}
