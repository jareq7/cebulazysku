-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Zespół CebulaZysku',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  reading_time TEXT NOT NULL DEFAULT '5 min',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public can read published posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Service role full access on blog"
  ON blog_posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed with existing static blog post
INSERT INTO blog_posts (slug, title, excerpt, content, author, published_at, reading_time, tags, is_published)
VALUES (
  'jak-bezpiecznie-korzystac-z-promocji-bankowych',
  'Jak bezpiecznie korzystać z promocji bankowych?',
  'Dowiedz się, na co zwrócić uwagę przy korzystaniu z promocji bankowych. Praktyczne porady dotyczące bezpieczeństwa i unikania pułapek.',
  E'## Czym są promocje bankowe?\n\nPromocje bankowe to oferty kierowane najczęściej do nowych klientów, którzy otwierają konto osobiste i spełniają określone warunki. W zamian bank wypłaca premię pieniężną – zazwyczaj od 100 do 400 zł.\n\n## Na co zwrócić uwagę?\n\n### 1. Sprawdź warunki dokładnie\n\nKażda promocja ma swój regulamin. Najważniejsze elementy to:\n- **Minimalna kwota wpływu** – często wymaga regularnego zasilania konta\n- **Liczba transakcji** – ile płatności kartą lub BLIK musisz wykonać\n- **Okres promocji** – ile miesięcy musisz spełniać warunki\n\n### 2. Upewnij się, że konto jest bezpłatne\n\nWiele kont jest darmowych pod warunkiem spełnienia określonych kryteriów (np. wpływ min. 1000 zł/mies.). Sprawdź, czy po zakończeniu promocji nie będziesz ponosić dodatkowych opłat.\n\n### 3. Zwróć uwagę na BFG\n\nBankowy Fundusz Gwarancyjny chroni depozyty do 100 000 EUR. Korzystaj wyłącznie z ofert licencjonowanych banków objętych gwarancją BFG.\n\n### 4. Nie podawaj danych w podejrzanych miejscach\n\nZakładaj konta wyłącznie przez oficjalne strony banków. Nigdy nie podawaj danych logowania osobom trzecim.\n\n## Podsumowanie\n\nPromocje bankowe to bezpieczny sposób na dodatkowe środki, o ile podchodzisz do nich świadomie. Sprawdzaj warunki, korzystaj z licencjonowanych banków i śledź postępy za pomocą narzędzi takich jak CebulaZysku.',
  'Zespół CebulaZysku',
  '2026-03-01T00:00:00Z',
  '4 min',
  ARRAY['poradnik', 'bezpieczeństwo', 'promocje bankowe'],
  true
) ON CONFLICT (slug) DO NOTHING;
