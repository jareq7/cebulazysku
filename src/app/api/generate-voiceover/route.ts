import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateVoiceover, generateVoiceoverScript } from "@/lib/elevenlabs";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  // Skip auth in dev
  if (process.env.NODE_ENV === "development") return true;

  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  return false;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { offerId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { offerId } = body;
  if (!offerId) {
    return NextResponse.json({ error: "offerId is required" }, { status: 400 });
  }

  // 1. Fetch offer from Supabase
  const supabase = createAdminClient();
  const { data: offer, error: fetchError } = await supabase
    .from("offers")
    .select("bank_name, offer_name, reward, conditions, pros")
    .eq("id", offerId)
    .single();

  if (fetchError || !offer) {
    return NextResponse.json(
      { error: fetchError?.message || "Offer not found" },
      { status: 404 }
    );
  }

  try {
    // 2. Generate voiceover script
    const conditions = Array.isArray(offer.conditions) ? offer.conditions : [];
    const pros = Array.isArray(offer.pros) ? offer.pros : [];

    const script = generateVoiceoverScript(
      offer.bank_name,
      offer.reward || 0,
      conditions as { label: string }[],
      pros as string[]
    );

    // 3. Generate MP3 audio via ElevenLabs
    const audioBuffer = await generateVoiceover({ text: script });

    // 4. Save MP3 to public/audio/voiceovers/{offerId}.mp3
    const voiceoversDir = path.join(process.cwd(), "public", "audio", "voiceovers");
    await mkdir(voiceoversDir, { recursive: true });

    const filePath = path.join(voiceoversDir, `${offerId}.mp3`);
    await writeFile(filePath, audioBuffer);

    const audioUrl = `/audio/voiceovers/${offerId}.mp3`;

    return NextResponse.json({ success: true, audioUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[generate-voiceover] Error for offer ${offerId}:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
