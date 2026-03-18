-- @author Claude Code (claude-opus-4-6) | 2026-03-18
-- Add network column to affiliate_clicks for multi-source tracking

ALTER TABLE affiliate_clicks ADD COLUMN IF NOT EXISTS network text;
