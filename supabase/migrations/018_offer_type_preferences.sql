-- 018_offer_type_preferences.sql
-- Typ oferty (firmowa/dla młodych) + preferencje użytkownika

-- Kolumna is_business w offers
ALTER TABLE offers ADD COLUMN IF NOT EXISTS is_business boolean NOT NULL DEFAULT false;

-- Uzupełnij na podstawie istniejących danych z leadstar_product_id
UPDATE offers SET is_business = true WHERE leadstar_product_id = '12';

-- Preferencje użytkownika dot. typów ofert
-- account_type: 'personal' (domyślnie), 'business', 'both'
ALTER TABLE notification_preferences
  ADD COLUMN IF NOT EXISTS account_type text NOT NULL DEFAULT 'personal',
  ADD COLUMN IF NOT EXISTS show_young boolean NOT NULL DEFAULT true;
