// @author Claude Code (claude-opus-4-6) | 2026-03-26
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";
import { newsletterConfirmEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

const DISPOSABLE_DOMAINS = new Set([
  "tempmail.com", "throwaway.email", "guerrillamail.com", "mailinator.com",
  "yopmail.com", "10minutemail.com", "trashmail.com", "sharklasers.com",
]);

// Simple in-memory rate limit (resets on cold start, good enough for Vercel)
const rateLimitMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + 3600_000 }); // 1h window
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Za dużo prób. Spróbuj ponownie za godzinę." },
      { status: 429 }
    );
  }

  let body: { email?: string; name?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Podaj poprawny adres email." }, { status: 400 });
  }

  const domain = email.split("@")[1];
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return NextResponse.json(
      { error: "Adresy tymczasowe nie są obsługiwane." },
      { status: 400 }
    );
  }

  const source = body.source || "popup";
  const name = body.name?.trim() || null;

  const supabase = createAdminClient();

  // Check if already exists
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, status, confirm_token")
    .eq("email", email)
    .maybeSingle();

  if (existing?.status === "active") {
    return NextResponse.json({ ok: true, message: "Już subskrybujesz!" });
  }

  let confirmToken: string;

  if (existing) {
    // Re-subscribe (was unsubscribed or pending)
    const { data: updated } = await supabase
      .from("newsletter_subscribers")
      .update({
        status: "pending",
        source,
        name: name || existing.confirm_token,
        confirm_token: crypto.randomUUID(),
        unsubscribed_at: null,
      })
      .eq("id", existing.id)
      .select("confirm_token")
      .single();
    confirmToken = updated?.confirm_token;
  } else {
    // New subscriber
    const { data: inserted } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, name, source, status: "pending" })
      .select("confirm_token")
      .single();
    confirmToken = inserted?.confirm_token;
  }

  // Send confirmation email
  const confirmUrl = `https://cebulazysku.pl/api/newsletter/confirm?token=${confirmToken}`;
  const { subject, html } = newsletterConfirmEmail({ email, confirmUrl });
  await sendEmail({ to: email, subject, html });

  return NextResponse.json({
    ok: true,
    message: "Sprawdź skrzynkę — wyślemy link potwierdzający!",
  });
}
