# Instrukcja konfiguracji — krok po kroku

Cześć! Ten dokument wyjaśnia co musisz zrobić, żeby wszystkie nowe funkcje zadziałały.
Nie musisz nic programować — tylko wkleić tekst i ustawić kilka zmiennych.

---

## CZĘŚĆ 1: Tworzenie tabel w Supabase

### Co to jest i po co?
Supabase to baza danych Twojej aplikacji (jak wielki Excel w chmurze).
Nowe funkcje (formularz kontaktowy, blog, odznaki, powiadomienia) potrzebują
nowych "tabel" (arkuszy) w tej bazie. Musisz je ręcznie utworzyć.

### Jak to zrobić:

**Krok 1.** Otwórz przeglądarkę: https://supabase.com/dashboard

**Krok 2.** Zaloguj się (GitHub lub email — tym samym co zawsze)

**Krok 3.** Kliknij swój projekt (ten z CebulaZysku)

**Krok 4.** Po lewej stronie znajdź i kliknij **"SQL Editor"**
(ikona wygląda jak `>_` — taka konsola/terminal)

**Krok 5.** Zobaczysz duże białe pole tekstowe. Tutaj będziesz wklejać kod SQL.

---

### Wklejka nr 1 — Formularz kontaktowy

Wyczyść pole, wklej poniższy tekst i kliknij zielony przycisk **"Run"** (lub Ctrl+Enter):

```sql
-- Contact form messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Service role full access"
  ON contact_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

✅ Powinieneś zobaczyć "Success. No rows returned" — to znaczy, że zadziałało!

---

### Wklejka nr 2 — Blog

Wyczyść pole, wklej i kliknij **Run**:

```sql
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
```

✅ Znowu "Success" = OK!

---

### Wklejka nr 3 — Gamifikacja (streaki i odznaki)

Wyczyść pole, wklej i kliknij **Run**:

```sql
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, achievement_type)
);

CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user ON user_streaks(user_id);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on achievements"
  ON user_achievements FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Users can view own streak"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own streak"
  ON user_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
  ON user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on streaks"
  ON user_streaks FOR ALL TO service_role
  USING (true) WITH CHECK (true);
```

✅ "Success" = OK!

---

### Wklejka nr 4 — Push notyfikacje

Wyczyść pole, wklej i kliknij **Run**:

```sql
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT UNIQUE NOT NULL,
  keys_p256dh TEXT NOT NULL,
  keys_auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_push_subs_user ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subs_endpoint ON push_subscriptions(endpoint);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own push subscriptions"
  ON push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own push subscriptions"
  ON push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own push subscriptions"
  ON push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on push"
  ON push_subscriptions FOR ALL TO service_role
  USING (true) WITH CHECK (true);
```

✅ "Success" = OK! **Supabase gotowe!**

---

## CZĘŚĆ 2: Ustawienie zmiennych w Vercel

### Co to jest i po co?
Zmienne środowiskowe to "tajne hasła i ustawienia" aplikacji.
Nie trzymamy ich w kodzie (bo kod jest na GitHubie i ktoś mógłby je zobaczyć).
Zamiast tego wpisujemy je w panelu Vercel.

### Krok 1 — Hasło admina

**1.** Otwórz: https://vercel.com/dashboard

**2.** Kliknij swój projekt (cebulazysku lub bank-afiliacje)

**3.** U góry kliknij zakładkę **"Settings"**

**4.** W menu po lewej kliknij **"Environment Variables"**

**5.** Dodaj nową zmienną:
   - **Key (nazwa):** `ADMIN_PASSWORD`
   - **Value (wartość):** wymyśl silne hasło, np. `MojeTajneHaslo2026!`
   - Zaznacz wszystkie środowiska: ✅ Production, ✅ Preview, ✅ Development
   - Kliknij **"Save"**

To hasło będziesz wpisywać na stronie `/admin` żeby wejść do panelu admina.

---

### Krok 2 — Klucze VAPID (do push notyfikacji)

VAPID keys to specjalne klucze kryptograficzne potrzebne do wysyłania
powiadomień push. Musisz je wygenerować jednorazowo.

**1.** Otwórz terminal (w Windsurf na dole jest terminal, lub otwórz Terminal.app na Macu)

**2.** Wpisz tę komendę i naciśnij Enter:

```
npx web-push generate-vapid-keys
```

**3.** Zobaczysz coś takiego:

```
=======================================

Public Key:
BKxZ2kN3m... (długi ciąg znaków)

Private Key:
4h8Jf9kL2... (długi ciąg znaków)

=======================================
```

**4.** Wróć do Vercel → Settings → Environment Variables i dodaj DWA wpisy:

**Wpis 1:**
   - **Key:** `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - **Value:** wklej Public Key z terminala (ten pierwszy, dłuższy)
   - Zaznacz: ✅ Production, ✅ Preview, ✅ Development
   - Kliknij **Save**

**Wpis 2:**
   - **Key:** `VAPID_PRIVATE_KEY`
   - **Value:** wklej Private Key z terminala (ten drugi, krótszy)
   - Zaznacz: ✅ Production, ✅ Preview, ✅ Development
   - Kliknij **Save**

---

### Krok 3 — Redeploy

Po dodaniu zmiennych Vercel musi się przebudować:

**1.** Kliknij zakładkę **"Deployments"** (u góry)

**2.** Znajdź ostatni deployment i kliknij **"..."** (trzy kropki) po prawej

**3.** Kliknij **"Redeploy"**

**4.** Poczekaj 1-2 minuty aż się zbuduje (zielony ✅ = gotowe)

---

## Gotowe!

Po wykonaniu tych kroków:
- ✅ Formularz kontaktowy na `/kontakt` zapisuje wiadomości do bazy
- ✅ Blog pobiera posty z Supabase (i można nimi zarządzać z `/admin/blog`)
- ✅ System streaków i odznak działa na dashboardzie
- ✅ Push notyfikacje można wysyłać z `/admin/push`
- ✅ Panel admina dostępny pod `/admin` (po wpisaniu hasła)

### Jeśli coś nie działa:
1. Sprawdź czy wszystkie 4 wklejki SQL się wykonały (powinno być "Success")
2. Sprawdź czy zmienne w Vercel nie mają spacji na początku/końcu
3. Upewnij się, że zrobiłeś Redeploy po dodaniu zmiennych
