-- @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-18
-- Add status column to offers table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offer_status') THEN
        CREATE TYPE offer_status AS ENUM ('active', 'expired', 'draft');
    END IF;
END $$;

-- Adding column with default 'active'
ALTER TABLE offers ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'draft'));

-- Update existing offers based on is_active flag
UPDATE offers SET status = 'expired' WHERE is_active = false;
UPDATE offers SET status = 'active' WHERE is_active = true;
