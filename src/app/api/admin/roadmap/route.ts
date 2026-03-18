// @author Claude Code (claude-opus-4-6) | 2026-03-18
// Admin API: Roadmap Kanban CRUD

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("roadmap_items")
      .select("*")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ items: data || [] });
  } catch (err) {
    console.error("Roadmap GET error:", err);
    return NextResponse.json({ error: "Failed to load roadmap" }, { status: 500 });
  }
}

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
    return NextResponse.json({ item: data });
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

    updates.updated_at = new Date().toISOString();

    // If moving to done, set completed_at
    if (updates.status === "done" && !updates.completed_at) {
      updates.completed_at = new Date().toISOString();
    }
    // If moving out of done, clear completed_at
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

    const supabase = createAdminClient();
    const { error } = await supabase.from("roadmap_items").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Roadmap DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
