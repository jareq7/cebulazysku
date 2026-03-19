// @author Claude Code (claude-opus-4-6) | 2026-03-19
// Admin API: Roadmap — auto-synced from AI-TASKS.md + manual DB items

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";
import { parseAiTasks } from "@/lib/parse-ai-tasks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  try {
    // Parse AI-TASKS.md for auto items
    const aiTasks = parseAiTasks();

    // Also load manual items from DB
    const supabase = createAdminClient();
    const { data: dbItems } = await supabase
      .from("roadmap_items")
      .select("*")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });

    // Merge: AI tasks first (by status), then DB manual items
    const items = [
      ...aiTasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority === "high" ? 0 : t.priority === "medium" ? 1 : 2,
        category: t.category,
        worker: t.worker,
        date: t.date,
        source: "ai-tasks" as const,
        created_at: t.date || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: t.status === "done" ? (t.date || new Date().toISOString()) : null,
      })),
      ...(dbItems || []).map((item) => ({
        ...item,
        source: "manual" as const,
        worker: null,
      })),
    ];

    return NextResponse.json({ items });
  } catch (err) {
    console.error("Roadmap GET error:", err);
    return NextResponse.json({ error: "Failed to load roadmap" }, { status: 500 });
  }
}

// POST, PATCH, DELETE — for manual DB items only (unchanged)

export async function POST(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  try {
    const { title, description, status, priority, category } = await request.json();
    if (!title) {
      return NextResponse.json({ error: "Tytuł jest wymagany" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("roadmap_items")
      .insert({
        title,
        description: description || null,
        status: status || "planned",
        priority: priority ?? 0,
        category: category || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ item: { ...data, source: "manual" } });
  } catch (err) {
    console.error("Roadmap POST error:", err);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  try {
    const { id, ...updates } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Can't edit AI-TASKS items from admin
    if (typeof id === "string" && id.startsWith("ai-")) {
      return NextResponse.json(
        { error: "AI Tasks items are read-only. Edit AI-TASKS.md instead." },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();
    if (updates.status === "done" && !updates.completed_at) {
      updates.completed_at = new Date().toISOString();
    }
    if (updates.status && updates.status !== "done") {
      updates.completed_at = null;
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("roadmap_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (err) {
    console.error("Roadmap PATCH error:", err);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (typeof id === "string" && id.startsWith("ai-")) {
      return NextResponse.json(
        { error: "AI Tasks items are read-only. Edit AI-TASKS.md instead." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("roadmap_items").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Roadmap DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
