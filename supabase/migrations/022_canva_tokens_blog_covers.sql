-- @author Claude Code (claude-opus-4-6) | 2026-03-18
-- Canva Connect API integration: OAuth tokens + blog cover images

-- Canva OAuth tokens (single row — only Jarek connects)
CREATE TABLE IF NOT EXISTS canva_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  scope text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog posts: add cover image URL
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_image_url text;

-- Create storage bucket for blog covers (if not exists via Supabase dashboard)
-- Note: Supabase Storage buckets are created via dashboard or API, not SQL.
-- Bucket name: blog-covers, public: true
