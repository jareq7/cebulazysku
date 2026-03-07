import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_MS = 60_000; // 1 message per minute per IP
const rateLimitMap = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Wszystkie pola są wymagane." },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.length > 100) {
      return NextResponse.json(
        { error: "Imię jest za długie (max 100 znaków)." },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !email.includes("@") || email.length > 255) {
      return NextResponse.json(
        { error: "Podaj poprawny adres email." },
        { status: 400 }
      );
    }

    if (typeof message !== "string" || message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { error: "Wiadomość musi mieć od 10 do 5000 znaków." },
        { status: 400 }
      );
    }

    // Simple rate limiting by IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const lastSent = rateLimitMap.get(ip);
    if (lastSent && Date.now() - lastSent < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: "Poczekaj chwilę przed wysłaniem kolejnej wiadomości." },
        { status: 429 }
      );
    }

    // Honeypot check (optional field from frontend)
    if (body.website) {
      // Bot detected — pretend success
      return NextResponse.json({ success: true });
    }

    // Save to Supabase
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      console.error("Missing Supabase env vars");
      return NextResponse.json(
        { error: "Błąd konfiguracji serwera." },
        { status: 500 }
      );
    }

    const supabase = createClient(url, anonKey);

    const { error } = await supabase.from("contact_messages").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    if (error) {
      console.error("Contact insert error:", error);
      return NextResponse.json(
        { error: "Nie udało się zapisać wiadomości. Spróbuj ponownie." },
        { status: 500 }
      );
    }

    rateLimitMap.set(ip, Date.now());

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Wystąpił błąd serwera." },
      { status: 500 }
    );
  }
}
