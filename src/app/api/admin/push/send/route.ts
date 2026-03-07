import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import webpush from "web-push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
    const vapidEmail = process.env.VAPID_EMAIL || "mailto:kontakt@cebulazysku.pl";

    if (!vapidPublic || !vapidPrivate) {
      return NextResponse.json(
        { error: "VAPID keys not configured" },
        { status: 500 }
      );
    }

    webpush.setVapidDetails(vapidEmail, vapidPublic, vapidPrivate);

    const { title, body, url } = await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ sent: 0, failed: 0, total: 0 });
    }

    const payload = JSON.stringify({
      title,
      body,
      url: url || "/",
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
    });

    let sent = 0;
    let failed = 0;
    const expiredEndpoints: string[] = [];

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys_p256dh,
              auth: sub.keys_auth,
            },
          },
          payload
        );
        sent++;
      } catch (err: unknown) {
        failed++;
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 410 || statusCode === 404) {
          expiredEndpoints.push(sub.endpoint);
        }
      }
    }

    // Clean up expired subscriptions
    if (expiredEndpoints.length > 0) {
      await supabase
        .from("push_subscriptions")
        .delete()
        .in("endpoint", expiredEndpoints);
    }

    return NextResponse.json({
      sent,
      failed,
      total: subscriptions.length,
      cleaned: expiredEndpoints.length,
    });
  } catch (err) {
    console.error("Push send error:", err);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
