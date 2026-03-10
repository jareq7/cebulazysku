import { NextRequest, NextResponse } from "next/server";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000;
const attempts = new Map<string, { count: number; firstAt: number }>();

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // Rate limit check
  const now = Date.now();
  const record = attempts.get(ip);
  if (record) {
    if (now - record.firstAt > WINDOW_MS) {
      attempts.set(ip, { count: 1, firstAt: now });
    } else if (record.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Zbyt wiele prób. Poczekaj minutę." },
        { status: 429 }
      );
    } else {
      record.count++;
    }
  } else {
    attempts.set(ip, { count: 1, firstAt: now });
  }

  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured" },
      { status: 500 }
    );
  }

  if (password === adminPassword) {
    // Reset on success
    attempts.delete(ip);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
