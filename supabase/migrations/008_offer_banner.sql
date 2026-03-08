-- Add banner_url column to offers table for LeadStar creative banners
ALTER TABLE offers ADD COLUMN IF NOT EXISTS banner_url TEXT;
