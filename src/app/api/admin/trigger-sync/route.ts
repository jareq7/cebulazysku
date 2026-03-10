import { NextRequest, NextResponse } from "next/server";
import { runSync } from "@/app/api/sync-offers/route";
import { verifyAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  try {
    const result = await runSync();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Manual sync failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
