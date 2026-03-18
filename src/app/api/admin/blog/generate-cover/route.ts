// @author Claude Code (claude-opus-4-6) | 2026-03-18
// Generate blog cover image via Canva Autofill API

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { generateBlogCover, isConnected } from "@/lib/canva";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Template IDs — set these after creating Brand Templates in Canva
const TEMPLATES: Record<string, string> = {
  A: process.env.CANVA_TEMPLATE_A || "", // 3D Isometric style
  B: process.env.CANVA_TEMPLATE_B || "", // Macro Photo style
};

// Check Canva connection status (used by admin panel)
export async function GET(req: NextRequest) {
  const authError = verifyAdmin(req);
  if (authError) return authError;

  try {
    const connected = await isConnected();
    return NextResponse.json({ connected });
  } catch {
    return NextResponse.json({ connected: false });
  }
}

export async function POST(req: NextRequest) {
  const authError = verifyAdmin(req);
  if (authError) return authError;

  try {
    const { postId, templateStyle = "A" } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    // Check Canva connection
    const connected = await isConnected();
    if (!connected) {
      return NextResponse.json(
        { error: "Canva not connected. Visit /api/canva/connect first." },
        { status: 400 }
      );
    }

    // Get template ID
    const templateId = TEMPLATES[templateStyle];
    if (!templateId) {
      return NextResponse.json(
        {
          error: `Template style "${templateStyle}" not configured. Set CANVA_TEMPLATE_${templateStyle} env var.`,
        },
        { status: 400 }
      );
    }

    // Fetch blog post
    const postRes = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${postId}&select=title,slug,tags`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );
    const posts = await postRes.json();

    if (!posts || posts.length === 0) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const post = posts[0];
    const category =
      (Array.isArray(post.tags) && post.tags[0]) || "Poradnik";

    // Generate cover via Canva
    const coverUrl = await generateBlogCover(
      templateId,
      post.title,
      category,
      post.slug
    );

    // Update blog post with cover URL
    await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${postId}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cover_image_url: coverUrl }),
      }
    );

    return NextResponse.json({
      success: true,
      coverUrl,
      designTitle: `Blog Cover — ${post.title}`,
    });
  } catch (err) {
    console.error("Generate cover error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
