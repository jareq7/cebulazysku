-- @author Claude Code (claude-opus-4-6) | 2026-03-18
-- Roadmap Kanban board for admin panel

CREATE TABLE IF NOT EXISTS roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'done')),
  priority integer NOT NULL DEFAULT 0, -- lower = higher priority, used for ordering
  category text, -- e.g. 'feature', 'bugfix', 'research', 'content', 'infra'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
