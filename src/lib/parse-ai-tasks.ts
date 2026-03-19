// @author Claude Code (claude-opus-4-6) | 2026-03-19
// Parses AI-TASKS.md into structured roadmap items

import { readFileSync } from "fs";
import { join } from "path";

export interface ParsedTask {
  id: string;
  title: string;
  description: string | null;
  status: "planned" | "in_progress" | "done";
  worker: "claude" | "gemini" | null;
  priority: string | null; // 🔴 🟡 🟢
  category: string | null;
  date: string | null;
}

function extractPriority(line: string): string | null {
  if (line.includes("🔴")) return "high";
  if (line.includes("🟡")) return "medium";
  if (line.includes("🟢")) return "low";
  return null;
}

function extractWorkerFromLine(line: string): "claude" | "gemini" | null {
  const lower = line.toLowerCase();
  if (lower.includes("claude")) return "claude";
  if (lower.includes("gemini")) return "gemini";
  return null;
}

function cleanTitle(raw: string): string {
  return raw
    .replace(/^- \[[ x]\] /, "")
    .replace(/\*\*/g, "")
    .replace(/🔴|🟡|🟢/g, "")
    .replace(/✅.*$/, "")
    .trim();
}

function splitTitleDesc(text: string): { title: string; description: string | null } {
  const dashIdx = text.indexOf(" — ");
  if (dashIdx > 0) {
    return {
      title: text.slice(0, dashIdx).trim(),
      description: text.slice(dashIdx + 3).trim() || null,
    };
  }
  return { title: text.trim(), description: null };
}

function categoryFromTitle(title: string): string | null {
  const lower = title.toLowerCase();
  if (lower.includes("newsletter") || lower.includes("email")) return "feature";
  if (lower.includes("video") || lower.includes("voiceover") || lower.includes("tiktok")) return "content";
  if (lower.includes("seo") || lower.includes("breadcrumb") || lower.includes("json-ld")) return "seo";
  if (lower.includes("ui") || lower.includes("ux") || lower.includes("tooltip") || lower.includes("skeleton") || lower.includes("drawer")) return "ux";
  if (lower.includes("migracja") || lower.includes("migration") || lower.includes("db") || lower.includes("deploy")) return "infra";
  if (lower.includes("research") || lower.includes("analiza") || lower.includes("audit")) return "research";
  if (lower.includes("blog") || lower.includes("faq") || lower.includes("copy") || lower.includes("memy")) return "content";
  if (lower.includes("share") || lower.includes("social")) return "feature";
  if (lower.includes("conversand") || lower.includes("affiliate") || lower.includes("routing")) return "feature";
  if (lower.includes("admin")) return "feature";
  if (lower.includes("pipeline") || lower.includes("autonomiczny")) return "feature";
  return null;
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

  // Parse In Progress table
  const inProgressMatch = content.match(/## In Progress\s*\n\n\|[^\n]+\n\|[^\n]+\n([\s\S]*?)(?=\n---|\n## )/);
  if (inProgressMatch) {
    const rows = inProgressMatch[1].trim().split("\n").filter((r) => r.startsWith("|"));
    for (const row of rows) {
      const cols = row.split("|").map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 2 && cols[0] !== "(pusto)" && !cols[0].startsWith("—")) {
        tasks.push({
          id: `ai-inprog-${idx++}`,
          title: cols[0],
          description: cols[3] || null,
          status: "in_progress",
          worker: cols[1]?.toLowerCase().includes("gemini") ? "gemini" : "claude",
          priority: "high",
          category: categoryFromTitle(cols[0]),
          date: null,
        });
      }
    }
  }

  // Parse Backlog — Gemini
  const geminiBacklog = content.match(/## Backlog — Gemini[^\n]*\n([\s\S]*?)(?=\n## )/);
  if (geminiBacklog) {
    const lines = geminiBacklog[1].trim().split("\n").filter((l) => l.startsWith("- ["));
    for (const line of lines) {
      const isDone = line.startsWith("- [x]");
      if (isDone) continue; // skip done items in backlog
      const raw = cleanTitle(line);
      if (!raw || raw.startsWith("(Brak")) continue;
      const { title, description } = splitTitleDesc(raw);
      tasks.push({
        id: `ai-gemini-${idx++}`,
        title,
        description,
        status: "planned",
        worker: "gemini",
        priority: extractPriority(line),
        category: categoryFromTitle(title),
        date: null,
      });
    }
  }

  // Parse Backlog — Claude Code
  const claudeBacklog = content.match(/## Backlog — Claude Code[^\n]*\n([\s\S]*?)(?=\n---|\n## )/);
  if (claudeBacklog) {
    const lines = claudeBacklog[1].trim().split("\n").filter((l) => l.startsWith("- ["));
    for (const line of lines) {
      const isDone = line.startsWith("- [x]");
      if (isDone) continue;
      const raw = cleanTitle(line);
      if (!raw) continue;
      const { title, description } = splitTitleDesc(raw);
      tasks.push({
        id: `ai-claude-${idx++}`,
        title,
        description,
        status: "planned",
        worker: "claude",
        priority: extractPriority(line),
        category: categoryFromTitle(title),
        date: null,
      });
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
          description: cols[3] || null,
          status: "done",
          worker: cols[2]?.toLowerCase().includes("gemini") ? "gemini" : "claude",
          priority: null,
          category: categoryFromTitle(cols[1]),
          date: cols[0] || null,
        });
      }
    }
  }

  return tasks;
}
