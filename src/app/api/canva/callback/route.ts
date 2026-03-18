// @author Claude Code (claude-opus-4-6) | 2026-03-18
// Canva OAuth callback — exchanges code for tokens, saves to Supabase

import { NextRequest, NextResponse } from "next/server";
import { exchangeCode, saveTokens } from "@/lib/canva";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  // Handle Canva denial
  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/blog?canva=error&reason=${error}`, req.nextUrl.origin)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/admin/blog?canva=error&reason=no_code", req.nextUrl.origin)
    );
  }

  // Verify CSRF state
  const storedState = req.cookies.get("canva_oauth_state")?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      new URL("/admin/blog?canva=error&reason=invalid_state", req.nextUrl.origin)
    );
  }

  try {
    // Exchange code for tokens
    const redirectUri = `${req.nextUrl.origin}/api/canva/callback`;
    const tokens = await exchangeCode(code, redirectUri);

    // Save tokens to Supabase
    await saveTokens(tokens);

    // Redirect to admin with success
    const response = NextResponse.redirect(
      new URL("/admin/blog?canva=connected", req.nextUrl.origin)
    );

    // Clear state cookie
    response.cookies.delete("canva_oauth_state");

    return response;
  } catch (err) {
    console.error("Canva OAuth error:", err);
    return NextResponse.redirect(
      new URL(
        `/admin/blog?canva=error&reason=${encodeURIComponent(String(err))}`,
        req.nextUrl.origin
      )
    );
  }
}
