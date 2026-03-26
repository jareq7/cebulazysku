// @author Claude Code (claude-opus-4-6) | 2026-03-26
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";
import { newsletterWelcomeEmail } from "@/lib/email-templates";
import { fetchOffersFromDB } from "@/lib/offers";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabase = createAdminClient();

  const { data: subscriber } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, status, name")
    .eq("confirm_token", token)
    .maybeSingle();

  if (!subscriber) {
    return NextResponse.redirect(
      new URL("/newsletter/wypisano?error=invalid", request.url)
    );
  }

  if (subscriber.status === "active") {
    // Already confirmed
    return NextResponse.redirect(new URL("/newsletter/potwierdzenie", request.url));
  }

  // Activate
  await supabase
    .from("newsletter_subscribers")
    .update({
      status: "active",
      subscribed_at: new Date().toISOString(),
    })
    .eq("id", subscriber.id);

  // Send welcome email with TOP offer
  const offers = await fetchOffersFromDB();
  const topOffer = offers.sort((a, b) => b.reward - a.reward)[0];

  const { subject, html } = newsletterWelcomeEmail({
    name: subscriber.name || subscriber.email.split("@")[0],
    topOffer: topOffer
      ? {
          bankName: topOffer.bankName,
          reward: topOffer.reward,
          slug: topOffer.slug,
        }
      : null,
    unsubscribeToken: (
      await supabase
        .from("newsletter_subscribers")
        .select("unsubscribe_token")
        .eq("id", subscriber.id)
        .single()
    ).data?.unsubscribe_token,
  });

  await sendEmail({ to: subscriber.email, subject, html });

  return NextResponse.redirect(new URL("/newsletter/potwierdzenie", request.url));
}
