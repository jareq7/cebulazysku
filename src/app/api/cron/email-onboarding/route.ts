// @author Claude Code (claude-opus-4-6) | 2026-03-30
// Onboarding drip email sequence: day 1, day 3, day 7 after subscription confirmation
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";
import { onboardingEmail1, onboardingEmail2, onboardingEmail3, onboardingEmail4Referral } from "@/lib/email-templates";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Drip schedule: step → days after onboarding_started_at
const DRIP_SCHEDULE = [
  { step: 1, daysAfter: 1, emailFn: onboardingEmail1 },
  { step: 2, daysAfter: 3, emailFn: onboardingEmail2 },
  { step: 3, daysAfter: 7, emailFn: onboardingEmail3 },
  { step: 4, daysAfter: 10, emailFn: onboardingEmail4Referral },
] as const;

function verifyAuth(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (process.env.VERCEL_ENV === "production") return true;
  return false;
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const stats = { sent: 0, skipped: 0, errors: 0 };

  try {
    // Get active subscribers who haven't completed onboarding (step < 3)
    const { data: subscribers, error } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, name, unsubscribe_token, onboarding_step, onboarding_started_at")
      .eq("status", "active")
      .not("onboarding_started_at", "is", null)
      .lt("onboarding_step", 4);

    if (error) throw error;
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ ok: true, message: "No subscribers pending onboarding", ...stats });
    }

    for (const sub of subscribers) {
      const startedAt = new Date(sub.onboarding_started_at);
      const currentStep = sub.onboarding_step ?? 0;

      // Find the next step to send
      const nextDrip = DRIP_SCHEDULE.find((d) => d.step === currentStep + 1);
      if (!nextDrip) {
        stats.skipped++;
        continue;
      }

      // Check if enough days have passed
      const triggerDate = new Date(startedAt);
      triggerDate.setDate(triggerDate.getDate() + nextDrip.daysAfter);

      if (now < triggerDate) {
        stats.skipped++;
        continue;
      }

      // Deduplication: check email_sends for this type today
      const emailType = `onboarding_${nextDrip.step}`;
      const { data: alreadySent } = await supabase
        .from("email_sends")
        .select("id")
        .eq("email", sub.email)
        .eq("type", emailType)
        .limit(1);

      if (alreadySent && alreadySent.length > 0) {
        // Already sent this step — update DB step and skip
        await supabase
          .from("newsletter_subscribers")
          .update({ onboarding_step: nextDrip.step })
          .eq("id", sub.id);
        stats.skipped++;
        continue;
      }

      // Generate and send email
      const name = sub.name || sub.email.split("@")[0];
      const { subject, html } = nextDrip.emailFn({
        name,
        unsubscribeToken: sub.unsubscribe_token,
      });

      const result = await sendEmail({ to: sub.email, subject, html });

      if (result.success) {
        // Record send
        await supabase.from("email_sends").insert({
          user_id: null,
          type: emailType,
          offer_id: null,
          email: sub.email,
          sent_at: new Date().toISOString(),
          sent_date: today,
        });

        // Update onboarding step
        await supabase
          .from("newsletter_subscribers")
          .update({ onboarding_step: nextDrip.step })
          .eq("id", sub.id);

        stats.sent++;
      } else {
        stats.errors++;
      }
    }

    return NextResponse.json({ ok: true, ...stats });
  } catch (err) {
    console.error("email-onboarding cron error:", err);
    return NextResponse.json(
      { error: "Cron failed", details: String(err) },
      { status: 500 }
    );
  }
}
