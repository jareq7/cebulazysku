// @author Claude Code (claude-opus-4-6) | 2026-03-29
// Parses AI-TASKS.md into structured roadmap items for /admin/roadmap

import { readFileSync } from "fs";
import { join } from "path";

export interface ParsedTask {
  id: string;
  title: string;
  description: string | null;
  status: "planned" | "in_progress" | "done";
  worker: "claude" | "gemini" | "windsurf" | "jarek" | null;
  priority: string | null;
  category: string | null;
  date: string | null;
}

type Worker = ParsedTask["worker"];

function categoryFromTitle(title: string): string | null {
  const lower = title.toLowerCase();
  if (lower.includes("newsletter") || lower.includes("email") || lower.includes("drip")) return "feature";
  if (lower.includes("video") || lower.includes("voiceover") || lower.includes("tiktok")) return "content";
  if (lower.includes("seo") || lower.includes("breadcrumb") || lower.includes("json-ld") || lower.includes("gsc")) return "seo";
  if (lower.includes("ui") || lower.includes("ux") || lower.includes("widget") || lower.includes("leaderboard")) return "ux";
  if (lower.includes("migracja") || lower.includes("migration") || lower.includes("vps") || lower.includes("elevenlabs")) return "infra";
  if (lower.includes("research") || lower.includes("analiza") || lower.includes("keyword")) return "research";
  if (lower.includes("blog") || lower.includes("faq") || lower.includes("copy") || lower.includes("pepper") || lower.includes("content")) return "content";
  if (lower.includes("social") || lower.includes("community") || lower.includes("gtm") || lower.includes("ga4")) return "feature";
  if (lower.includes("referral") || lower.includes("streak") || lower.includes("gamif")) return "feature";
  if (lower.includes("admin") || lower.includes("pipeline") || lower.includes("kalkulator")) return "feature";
  if (lower.includes("canva") || lower.includes("lead magnet") || lower.includes("pdf")) return "content";
  if (lower.includes("hub") || lower.includes("landing") || lower.includes("strona /")) return "feature";
  return null;
}

/**
 * Detects worker from the section header.
 * "## Backlog — Claude Code" → "claude"
 * "## Backlog — Gemini" → "gemini"
 * "## Backlog — Windsurf" → "windsurf"
 * "## Backlog — Jarek" → "jarek"
 */
function workerFromSection(sectionHeader: string): Worker {
  const lower = sectionHeader.toLowerCase();
  if (lower.includes("claude")) return "claude";
  if (lower.includes("gemini")) return "gemini";
  if (lower.includes("windsurf")) return "windsurf";
  if (lower.includes("jarek")) return "jarek";
  return null;
}

function workerFromDoneColumn(col: string): Worker {
  const lower = col.toLowerCase();
  if (lower.includes("gemini")) return "gemini";
  if (lower.includes("windsurf")) return "windsurf";
  if (lower.includes("jarek")) return "jarek";
  return "claude";
}

/**
 * Extract priority from sprint header context.
 * 🔴 = high, 🟡 = medium, 🟢 = low, ⏸️ = low (blocked)
 */
function extractPriority(context: string): string {
  if (context.includes("🔴")) return "high";
  if (context.includes("🟡")) return "medium";
  if (context.includes("🟢") || context.includes("⏸️")) return "low";
  return "medium";
}

export function parseAiTasks(): ParsedTask[] {
  const filePath = join(process.cwd(), "AI-TASKS.md");
  let content: string;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    return [];
  }

  const tasks: ParsedTask[] = [];
  let idx = 0;

  // Split into major sections by "## Backlog" headers
  const sectionPattern = /^## Backlog — (.+)$/gm;
  const sections: { worker: Worker; start: number; content: string }[] = [];
  let match;

  while ((match = sectionPattern.exec(content)) !== null) {
    sections.push({
      worker: workerFromSection(match[1]),
      start: match.index,
      content: "",
    });
  }

  // Extract content for each section (until next ## or end)
  for (let i = 0; i < sections.length; i++) {
    const start = sections[i].start;
    const end = i + 1 < sections.length
      ? sections[i + 1].start
      : content.indexOf("\n## Done", start) !== -1
        ? content.indexOf("\n## Done", start)
        : content.indexOf("\n## Zależności", start) !== -1
          ? content.indexOf("\n## Zależności", start)
          : content.length;
    sections[i].content = content.slice(start, end);
  }

  // Parse task entries: **C14. Title** ✅ DONE or **C14. Title** (~1h)
  const taskPattern = /^\*\*([A-Z]\d+)\.\s+(.+?)\*\*\s*(.*)?$/;

  for (const section of sections) {
    const lines = section.content.split("\n");
    let currentPriority = "medium";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Track sprint headers for priority context
      if (line.startsWith("### ")) {
        currentPriority = extractPriority(line);
        continue;
      }

      const taskMatch = line.match(taskPattern);
      if (!taskMatch) continue;

      const taskId = taskMatch[1]; // e.g. "C14", "G9", "J1", "W6"
      let titleRaw = taskMatch[2]; // e.g. "Import blog batch 5 do DB"
      const afterTitle = taskMatch[3] || ""; // e.g. "✅ DONE", "(~30 min)", "⏸️ ZABLOKOWANY"

      // Determine status
      let status: ParsedTask["status"] = "planned";
      if (afterTitle.includes("✅") || afterTitle.includes("DONE")) {
        status = "done";
      } else if (afterTitle.includes("⏸️") || afterTitle.includes("ZABLOKOWANY")) {
        status = "planned"; // blocked = planned but low priority
      }

      // Clean title: remove trailing status markers
      titleRaw = titleRaw
        .replace(/\s*✅.*$/, "")
        .replace(/\s*⏸️.*$/, "")
        .trim();

      // Split title — description
      let title = titleRaw;
      let description: string | null = null;
      const dashIdx = titleRaw.indexOf(" — ");
      if (dashIdx > 0) {
        title = titleRaw.slice(0, dashIdx).trim();
        description = titleRaw.slice(dashIdx + 3).trim() || null;
      }

      // Collect subtask lines as extended description
      const subtasks: string[] = [];
      for (let j = i + 1; j < lines.length; j++) {
        const sub = lines[j];
        if (sub.startsWith("- [")) {
          subtasks.push(sub.replace(/^- \[[ x]\] /, "").trim());
        } else if (sub.startsWith("**") || sub.startsWith("### ") || sub.startsWith("---")) {
          break;
        }
      }
      if (subtasks.length > 0 && !description) {
        description = subtasks.slice(0, 3).join("; ");
      }

      tasks.push({
        id: `ai-${taskId.toLowerCase()}`,
        title: `${taskId}. ${title}`,
        description,
        status,
        worker: section.worker,
        priority: status === "done" ? null : currentPriority,
        category: categoryFromTitle(title),
        date: null,
      });
      idx++;
    }
  }

  // Parse Done table
  const doneMatch = content.match(/## Done\s*\n\n\|[^\n]+\n\|[^\n]+\n([\s\S]*?)(?=\n---|\n## |$)/);
  if (doneMatch) {
    const rows = doneMatch[1].trim().split("\n").filter((r) => r.startsWith("|"));
    for (const row of rows) {
      const cols = row.split("|").map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 3) {
        tasks.push({
          id: `ai-done-${idx++}`,
          title: cols[1],
          description: cols.length > 3 ? cols[3] : null,
          status: "done",
          worker: workerFromDoneColumn(cols[2]),
          priority: null,
          category: categoryFromTitle(cols[1]),
          date: cols[0] || null,
        });
      }
    }
  }

  return tasks;
}
