-- Add for_young flag to offers (konta dla młodych)
ALTER TABLE offers ADD COLUMN IF NOT EXISTS for_young BOOLEAN DEFAULT false;
