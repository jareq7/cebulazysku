import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";
import { deadlineReminderEmail, weeklySummaryEmail, newsletterDigestEmail } from "@/lib/email-templates";
import { fetchOffersFromDB } from "@/lib/offers";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

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
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const isMonday = new Date().getDay() === 1;

  const stats = { deadline_sent: 0, weekly_sent: 0, newsletter_sent: 0, skipped: 0, errors: 0 };

  try {
    // --- DEADLINE REMINDERS ---
    // Get all tracked offers where the offer has a deadline in 1, 3, or 7 days
    const now = new Date();
    const deadlineDays = [1, 3, 7];
    const deadlineDates = deadlineDays.map((d) => {
      const dt = new Date(now);
      dt.setDate(dt.getDate() + d);
      return dt.toISOString().slice(0, 10);
    });

    // Fetch tracked offers + offer details (only offers with upcoming deadlines)
    const { data: trackedWithOffers, error: fetchError } = await supabase
      .from("tracked_offers")
      .select(`
        user_id,
        offer_id,
        offers!inner (
          id, slug, bank_name, offer_name, reward, deadline, is_business, for_young
        )
      `)
      .not("offers.deadline", "is", null)
      .neq("offers.deadline", "")
      .eq("offers.is_active", true);

    if (fetchError) throw fetchError;

    // Filter to only offers with deadline in 1/3/7 days
    const upcoming = (trackedWithOffers || []).filter((row) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const deadline = (row.offers as any)?.deadline as string | undefined;
      if (!deadline) return false;
      return deadlineDates.includes(deadline.slice(0, 10));
    });

    // Get unique user IDs for batch loading preferences and emails
    const userIds = [...new Set(upcoming.map((r) => r.user_id))];

    if (userIds.length > 0) {
      // Fetch notification preferences
      const { data: prefs } = await supabase
        .from("notification_preferences")
        .select("user_id, email_deadline_reminders, account_type, show_young")
        .in("user_id", userIds);

      const prefMap = new Map(
        (prefs || []).map((p) => [p.user_id, {
          deadlineReminders: p.email_deadline_reminders !== false,
          accountType: (p.account_type as string) ?? "personal",
          showYoung: p.show_young !== false,
        }])
      );

      // Fetch emails + names from auth admin in one pass
      const emailMap = new Map<string, string>();
      const nameMap = new Map<string, string>();
      for (const uid of userIds) {
        const { data: ud } = await supabase.auth.admin.getUserById(uid);
        if (ud.user) {
          if (ud.user.email) emailMap.set(uid, ud.user.email);
          const name = ud.user.user_metadata?.name ?? ud.user.email?.split("@")[0] ?? "cebularzu";
          nameMap.set(uid, name);
        }
      }

      // Check already sent today (deduplication)
      const { data: alreadySent } = await supabase
        .from("email_sends")
        .select("user_id, type, offer_id")
        .in("user_id", userIds)
        .gte("sent_at", today + "T00:00:00Z");

      const sentSet = new Set(
        (alreadySent || []).map((s) => `${s.user_id}|${s.type}|${s.offer_id}`)
      );

      for (const row of upcoming) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const offer = row.offers as any;
        const deadline = offer.deadline?.slice(0, 10);
        const daysLeft = deadlineDates.indexOf(deadline) >= 0
          ? deadlineDays[deadlineDates.indexOf(deadline)]
          : null;
        if (!daysLeft) continue;

        const type = `deadline_${daysLeft}d`;
        const dedupKey = `${row.user_id}|${type}|${row.offer_id}`;
        if (sentSet.has(dedupKey)) { stats.skipped++; continue; }

        const prefs = prefMap.get(row.user_id);
        const wantsEmail = prefs ? prefs.deadlineReminders : true;
        if (!wantsEmail) { stats.skipped++; continue; }

        // Pomiń oferty niezgodne z typem konta użytkownika
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const offerObj = row.offers as any;
        const accountType = prefs?.accountType ?? "personal";
        if (offerObj?.is_business && accountType === "personal") { stats.skipped++; continue; }
        if (!offerObj?.is_business && accountType === "business") { stats.skipped++; continue; }
        if (offerObj?.for_young && prefs && !prefs.showYoung) { stats.skipped++; continue; }

        const email = emailMap.get(row.user_id);
        if (!email) { stats.skipped++; continue; }

        const userName = nameMap.get(row.user_id) || "cebularzu";
        const { subject, html } = deadlineReminderEmail({
          userName,
          bankName: offer.bank_name,
          offerName: offer.offer_name,
          reward: offer.reward || 0,
          daysLeft,
          offerSlug: offer.slug,
        });

        const result = await sendEmail({ to: email, subject, html });
        if (result.success) {
          await supabase.from("email_sends").insert({
            user_id: row.user_id,
            type,
            offer_id: row.offer_id,
            email,
            sent_at: new Date().toISOString(),
            sent_date: today,
          });
          stats.deadline_sent++;
        } else {
          stats.errors++;
        }
      }
    }

    // --- WEEKLY SUMMARY (only on Mondays) ---
    if (isMonday) {
      const { data: allTracked } = await supabase
        .from("tracked_offers")
        .select(`
          user_id,
          offer_id,
          offers!inner (
            id, slug, bank_name, offer_name, reward
          )
        `)
        .eq("offers.is_active", true);

      if (allTracked && allTracked.length > 0) {
        // Group by user
        const byUser = new Map<string, typeof allTracked>();
        for (const row of allTracked) {
          if (!byUser.has(row.user_id)) byUser.set(row.user_id, []);
          byUser.get(row.user_id)!.push(row);
        }

        const weeklyUserIds = [...byUser.keys()];

        // Fetch preferences
        const { data: weeklyPrefs } = await supabase
          .from("notification_preferences")
          .select("user_id, email_weekly_summary")
          .in("user_id", weeklyUserIds);

        const weeklyPrefMap = new Map(
          (weeklyPrefs || []).map((p) => [p.user_id, p.email_weekly_summary === true])
        );

        // Check dedup
        const { data: weeklySent } = await supabase
          .from("email_sends")
          .select("user_id")
          .in("user_id", weeklyUserIds)
          .eq("type", "weekly_summary")
          .gte("sent_at", today + "T00:00:00Z");

        const weeklySentSet = new Set((weeklySent || []).map((s) => s.user_id));

        for (const [userId, rows] of byUser) {
          if (!weeklyPrefMap.get(userId)) { stats.skipped++; continue; }
          if (weeklySentSet.has(userId)) { stats.skipped++; continue; }

          // Get email + name from auth admin
          const { data: userData } = await supabase.auth.admin.getUserById(userId);
          const email = userData.user?.email;
          if (!email) { stats.skipped++; continue; }
          const userName = userData.user?.user_metadata?.name ?? email.split("@")[0] ?? "cebularzu";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const offers = rows.map((r) => (r.offers as any)).filter(Boolean);
          const totalReward = offers.reduce((sum: number, o: { reward?: number }) => sum + (o.reward || 0), 0);

          const { subject, html } = weeklySummaryEmail({
            userName,
            trackedCount: rows.length,
            totalReward,
            offers: offers.map((o: { bank_name: string; offer_name: string; reward: number; slug: string }) => ({
              bankName: o.bank_name,
              offerName: o.offer_name,
              reward: o.reward || 0,
              slug: o.slug,
            })),
          });

          const result = await sendEmail({ to: email, subject, html });
          if (result.success) {
            await supabase.from("email_sends").insert({
              user_id: userId,
              type: "weekly_summary",
              offer_id: null,
              email,
              sent_at: new Date().toISOString(),
              sent_date: today,
            });
            stats.weekly_sent++;
          } else {
            stats.errors++;
          }
        }
      }
    }

    // --- NEWSLETTER DIGEST (only on Mondays) ---
    if (isMonday) {
      const { data: subscribers } = await supabase
        .from("newsletter_subscribers")
        .select("id, email, name, unsubscribe_token")
        .eq("status", "active");

      if (subscribers && subscribers.length > 0) {
        const offers = await fetchOffersFromDB();
        const topOffers = offers
          .sort((a, b) => b.reward - a.reward)
          .slice(0, 8)
          .map((o) => ({ bankName: o.bankName, reward: o.reward, slug: o.slug }));

        // Count new offers from last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { count: newOffersCount } = await supabase
          .from("offers")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true)
          .gte("created_at", weekAgo.toISOString());

        // Check dedup for newsletter digest
        const subscriberEmails = subscribers.map((s) => s.email);
        const { data: nlSent } = await supabase
          .from("email_sends")
          .select("email")
          .in("email", subscriberEmails)
          .eq("type", "newsletter_digest")
          .gte("sent_at", today + "T00:00:00Z");

        const nlSentSet = new Set((nlSent || []).map((s) => s.email));

        for (const sub of subscribers) {
          if (nlSentSet.has(sub.email)) { stats.skipped++; continue; }

          const { subject, html } = newsletterDigestEmail({
            name: sub.name || sub.email.split("@")[0],
            offers: topOffers,
            newOffersCount: newOffersCount || 0,
            unsubscribeToken: sub.unsubscribe_token,
          });

          const result = await sendEmail({ to: sub.email, subject, html });
          if (result.success) {
            await supabase.from("email_sends").insert({
              user_id: null,
              type: "newsletter_digest",
              offer_id: null,
              email: sub.email,
              sent_at: new Date().toISOString(),
              sent_date: today,
            });
            stats.newsletter_sent++;
          } else {
            stats.errors++;
          }
        }
      }
    }

    return NextResponse.json({
      ok: true,
      ...stats,
      is_monday: isMonday,
    });
  } catch (err) {
    console.error("email-notifications cron error:", err);
    return NextResponse.json({ error: "Cron failed", details: String(err) }, { status: 500 });
  }
}
