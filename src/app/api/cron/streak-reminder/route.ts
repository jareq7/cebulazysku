// @author Claude Code (claude-opus-4-6) | 2026-03-30
// Streak break reminder: push + email fallback for users about to lose their streak
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";
import webpush from "web-push";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cebulazysku.pl";

function verifyAuth(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (process.env.VERCEL_ENV === "production") return true;
  return false;
}

function streakBreakEmail(userName: string): { subject: string; html: string } {
  const subject = "Twój streak jest zagrożony!";
  const html = `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
  <div style="background:linear-gradient(135deg,#059669 0%,#10b981 100%);padding:28px 32px;text-align:center;">
    <h1 style="margin:0;color:white;font-size:22px;">🧅 CebulaZysku</h1>
  </div>
  <div style="padding:32px;">
    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">Hej <strong>${userName}</strong>!</p>
    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">Nie widzieliśmy Cię wczoraj. Twój streak jest zagrożony! 🔥</p>
    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">Wejdź na dashboard i odznacz dzisiejsze warunki, żeby nie stracić postępów.</p>
    <p style="text-align:center;margin-top:24px;">
      <a href="${BASE_URL}/dashboard" style="display:inline-block;background:#059669;color:white!important;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;">Wróć do Trackera →</a>
    </p>
    <p style="color:#9ca3af;font-size:13px;margin-top:24px;">Każdy dzień przerwy to warstwa cebuli, którą oddajesz bankowi 🧅</p>
  </div>
  <div style="padding:20px 32px;border-top:1px solid #f0f0f0;text-align:center;">
    <p style="margin:0;color:#9ca3af;font-size:12px;">
      <a href="${BASE_URL}/dashboard" style="color:#6b7280;text-decoration:underline;">Zarządzaj powiadomieniami</a>
    </p>
  </div>
</div>
</body></html>`;
  return { subject, html };
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const stats = { push_sent: 0, email_sent: 0, skipped: 0, errors: 0 };

  try {
    // Find users with active streaks whose last activity was yesterday
    // (They need to act today or lose their streak)
    const { data: atRisk, error } = await supabase
      .from("user_streaks")
      .select("user_id, current_streak, last_activity_date")
      .eq("last_activity_date", yesterday)
      .gt("current_streak", 0);

    if (error) throw error;
    if (!atRisk || atRisk.length === 0) {
      return NextResponse.json({ ok: true, message: "No at-risk streaks", ...stats });
    }

    const userIds = atRisk.map((r) => r.user_id);

    // Deduplication: check if already notified today
    const { data: alreadySent } = await supabase
      .from("email_sends")
      .select("user_id")
      .in("user_id", userIds)
      .eq("type", "streak_reminder")
      .gte("sent_at", today + "T00:00:00Z");

    const sentSet = new Set((alreadySent || []).map((s) => s.user_id));

    // Check notification preferences
    const { data: prefs } = await supabase
      .from("notification_preferences")
      .select("user_id, email_deadline_reminders")
      .in("user_id", userIds);

    const prefMap = new Map(
      (prefs || []).map((p) => [p.user_id, p.email_deadline_reminders !== false])
    );

    // Setup web-push if VAPID keys available
    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
    const pushEnabled = vapidPublic && vapidPrivate;
    if (pushEnabled) {
      webpush.setVapidDetails(
        process.env.VAPID_EMAIL || "mailto:kontakt@cebulazysku.pl",
        vapidPublic,
        vapidPrivate
      );
    }

    for (const row of atRisk) {
      if (sentSet.has(row.user_id)) {
        stats.skipped++;
        continue;
      }

      if (!prefMap.get(row.user_id) && prefMap.has(row.user_id)) {
        stats.skipped++;
        continue;
      }

      let pushSent = false;

      // Try push notification first
      if (pushEnabled) {
        const { data: subs } = await supabase
          .from("push_subscriptions")
          .select("endpoint, keys_p256dh, keys_auth")
          .eq("user_id", row.user_id);

        if (subs && subs.length > 0) {
          const payload = JSON.stringify({
            title: "Twój streak jest zagrożony! 🔥",
            body: `Masz ${row.current_streak}-dniowy streak. Wejdź na dashboard, żeby go nie stracić!`,
            url: "/dashboard",
            icon: "/icon-192x192.png",
          });

          for (const sub of subs) {
            try {
              await webpush.sendNotification(
                { endpoint: sub.endpoint, keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth } },
                payload
              );
              pushSent = true;
              stats.push_sent++;
            } catch {
              // Push failed, will fall back to email
            }
          }
        }
      }

      // Email fallback if push didn't work
      if (!pushSent) {
        const { data: userData } = await supabase.auth.admin.getUserById(row.user_id);
        const email = userData.user?.email;
        if (!email) {
          stats.skipped++;
          continue;
        }

        const userName = userData.user?.user_metadata?.name ?? email.split("@")[0];
        const { subject, html } = streakBreakEmail(userName);

        const result = await sendEmail({ to: email, subject, html });
        if (result.success) {
          stats.email_sent++;
        } else {
          stats.errors++;
          continue;
        }
      }

      // Record send for deduplication
      await supabase.from("email_sends").insert({
        user_id: row.user_id,
        type: "streak_reminder",
        offer_id: null,
        email: null,
        sent_at: new Date().toISOString(),
        sent_date: today,
      });
    }

    return NextResponse.json({ ok: true, ...stats });
  } catch (err) {
    console.error("streak-reminder cron error:", err);
    return NextResponse.json(
      { error: "Cron failed", details: String(err) },
      { status: 500 }
    );
  }
}
