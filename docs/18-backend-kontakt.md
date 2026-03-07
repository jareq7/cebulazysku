# 18. Backend formularza kontaktowego

[← Powrót do spisu treści](./README.md)

---

## 1. Wprowadzenie

### Problem
Formularz kontaktowy na `/kontakt` był wyłącznie frontend-owy — `setSent(true)` bez żadnego API call. Użytkownik myślał, że wysłał wiadomość, a nic się nie działo.

### Cel
Stworzyć działający backend, który zapisuje wiadomości kontaktowe w Supabase z walidacją, rate limitingiem i ochroną przed botami.

---

## 2. Architektura

```
[Formularz /kontakt] → POST /api/contact → Supabase (contact_messages)
```

### Zabezpieczenia:
- **Walidacja server-side** — sprawdzanie wymaganych pól, długości, formatu email
- **Rate limiting** — max 1 wiadomość na minutę per IP (in-memory)
- **Honeypot** — ukryte pole `website` — jeśli wypełnione (bot), zwraca fake success
- **RLS** — tabela z `INSERT` policy dla `anon`, read/update/delete tylko `service_role`

---

## 3. Tabela `contact_messages`

### SQL (do uruchomienia w Supabase Dashboard → SQL Editor):

```sql
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
  ON contact_messages FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Service role full access"
  ON contact_messages FOR ALL TO service_role
  USING (true) WITH CHECK (true);
```

Plik migracji: `supabase/migrations/003_contact_messages.sql`

---

## 4. API Route — `/api/contact`

**Plik:** `src/app/api/contact/route.ts`

| Element | Opis |
|---------|------|
| Metoda | `POST` |
| Body | `{ name, email, message }` (JSON) |
| Walidacja | name ≤100, email z @, message 10-5000 znaków |
| Rate limit | 1 req/min per IP (in-memory Map) |
| Honeypot | Pole `website` — jeśli wypełnione → fake 200 |
| Response OK | `{ success: true }` |
| Response Error | `{ error: "..." }` + odpowiedni status code |

### Kody odpowiedzi:
- `200` — sukces (lub honeypot trap)
- `400` — błąd walidacji
- `429` — rate limit
- `500` — błąd Supabase / serwera

---

## 5. Frontend — `/kontakt`

**Plik:** `src/app/kontakt/page.tsx`

Zmiany:
- Dodano `loading` i `error` state
- `handleSubmit` robi `fetch("/api/contact", { method: "POST" })`
- Wyświetla error w czerwonym bannerze
- Przycisk disabled + spinner podczas wysyłania
- Honeypot: ukryte pole `<input name="website" className="hidden">`

---

## 6. Decyzje techniczne

| Decyzja | Uzasadnienie |
|---------|-------------|
| Supabase z ANON key (nie service role) | RLS policy pozwala na INSERT przez anon — bezpieczniejsze |
| In-memory rate limit | Wystarczający dla Vercel serverless; resetuje się przy cold start, ale to OK |
| Honeypot zamiast reCAPTCHA | Zero zewnętrznych zależności, nie wymaga kluczy API, nie obciąża UX |
| Pole `is_read` | Przygotowane pod przyszły admin panel — oznaczanie przeczytanych |

---

## 7. Troubleshooting

### Problem: Tabela `contact_messages` nie istnieje w Supabase
Nie można tworzyć tabel przez REST API bez RPC function. Supabase CLI wymagał osobnej instalacji.

**Rozwiązanie:** Przygotowano SQL do ręcznego uruchomienia w Supabase Dashboard → SQL Editor. Plik migracji zapisany w `supabase/migrations/003_contact_messages.sql` dla dokumentacji.

---

## 8. Status

✅ **Kod ukończony** — 7 marca 2026

- API route `/api/contact` — gotowe
- Frontend z loading/error states — gotowe  
- Migracja SQL — gotowa
- Build przechodzi bez błędów
- **Akcja wymagana od usera**: uruchomić SQL w Supabase Dashboard → SQL Editor
