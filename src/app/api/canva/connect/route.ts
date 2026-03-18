// @author Claude Code (claude-opus-4-6) | 2026-03-18
// Canva OAuth initiation — redirects admin to Canva consent page (with PKCE)

import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl, generatePKCE } from "@/lib/canva";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  // Admin auth check
  const password = req.headers.get("x-admin-password") || req.nextUrl.searchParams.get("key");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate CSRF state
  const state = crypto.randomBytes(16).toString("hex");

  // Generate PKCE code_verifier + code_challenge
  const { codeVerifier, codeChallenge } = generatePKCE();

  // Build redirect URI based on request origin
  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/canva/callback`;

  // Build Canva auth URL with PKCE
  const authUrl = getAuthUrl(redirectUri, state, codeChallenge);

  // Store state and code_verifier in cookies for callback verification
  const response = NextResponse.redirect(authUrl);
  response.cookies.set("canva_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    sameSite: "lax",
  });
  response.cookies.set("canva_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    sameSite: "lax",
  });

  return response;
}
