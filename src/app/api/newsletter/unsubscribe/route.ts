// @author Claude Code (claude-opus-4-6) | 2026-03-26
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabase = createAdminClient();

  const { data: subscriber } = await supabase
    .from("newsletter_subscribers")
    .select("id, status")
    .eq("unsubscribe_token", token)
    .maybeSingle();

  if (!subscriber) {
    return NextResponse.redirect(
      new URL("/newsletter/wypisano?error=invalid", request.url)
    );
  }

  if (subscriber.status !== "unsubscribed") {
    await supabase
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id);
  }

  return NextResponse.redirect(new URL("/newsletter/wypisano", request.url));
}
