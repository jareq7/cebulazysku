# 20. Rozbudowa bloga (dynamiczny z Supabase)

[← Powrót do spisu treści](./README.md)

---

## 1. Wprowadzenie

### Problem
Blog był w pełni statyczny — posty hardcoded w `src/data/blog.ts`. Dodawanie nowych artykułów wymagało edycji kodu i redeployu.

### Cel
Przenieść blog do Supabase, umożliwić zarządzanie postami z admin panelu (CRUD), zachować fallback na statyczne dane.

---

## 2. Architektura

```
Supabase (blog_posts) ←→ src/lib/blog.ts ←→ /blog (ISR, 5 min)
                                           ←→ /blog/[slug] (ISR, 5 min)
                       ←→ /api/admin/blog  ←→ /admin/blog (CRUD)
```

### Fallback:
Jeśli Supabase zwraca pustą listę (np. tabela nie istnieje jeszcze), frontend automatycznie używa statycznych postów z `src/data/blog.ts`.

---

## 3. Tabela `blog_posts`

### SQL (Supabase Dashboard → SQL Editor):

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
  ON blog_posts FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Service role full access on blog"
  ON blog_posts FOR ALL TO service_role
  USING (true) WITH CHECK (true);
```

Plik migracji: `supabase/migrations/004_blog_posts.sql` (zawiera też seed istniejącego posta)

---

## 4. API

### Publiczne (lib):
| Funkcja | Opis |
|---------|------|
| `getPublishedPosts()` | Lista opublikowanych postów (anon key) |
| `getPostBySlug(slug)` | Pojedynczy post po slug (anon key) |

### Admin:
| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/api/admin/blog` | GET | Wszystkie posty (w tym szkice) |
| `/api/admin/blog` | POST | Utwórz nowy post |
| `/api/admin/blog` | PATCH | Aktualizuj post |
| `/api/admin/blog` | DELETE | Usuń post |

---

## 5. Frontend

### `/blog` (listing)
- Server component z `revalidate = 300` (ISR co 5 min)
- Pobiera z Supabase, fallback na statyczne dane
- SEO metadata

### `/blog/[slug]` (szczegóły)
- Server component z ISR
- JSON-LD (Article + BreadcrumbList)
- Markdown rendering (proste parsowanie: `##`, `###`, `- `, paragrafy)
- Fallback na statyczne dane

### `/admin/blog` (zarządzanie)
- Lista postów ze statusem (opublikowany/szkic)
- Edytor: tytuł, slug (auto-generowany), excerpt, treść (Markdown), autor, czas czytania, tagi
- Przyciski: publikuj/cofnij, edytuj, usuń
- Inline CRUD bez przeładowań

---

## 6. Decyzje techniczne

| Decyzja | Uzasadnienie |
|---------|-------------|
| ISR 5 min | Kompromis: świeże dane bez obciążania Supabase |
| Fallback na static data | Bezawaryjność: blog działa nawet bez tabeli |
| Anon key do odczytu | RLS policy wymusza `is_published = true` |
| Service role w admin API | Pełny dostęp do szkiców i edycji |
| Auto-slug z tytułu | UX: admin nie musi wymyślać slugów |
| `TEXT[]` na tagi | Natywne tablice PostgreSQL, proste w obsłudze |

---

## 7. Pliki źródłowe

```
src/lib/blog.ts                     # getPublishedPosts, getPostBySlug
src/data/blog.ts                    # Statyczny fallback (zachowany)
src/app/blog/page.tsx               # Listing (ISR + fallback)
src/app/blog/[slug]/page.tsx        # Szczegóły (ISR + fallback)
src/app/admin/blog/page.tsx         # Admin CRUD
src/app/api/admin/blog/route.ts     # GET/POST/PATCH/DELETE
supabase/migrations/004_blog_posts.sql
```

---

## 8. Status

✅ **Ukończone** — 7 marca 2026

- Frontend dynamiczny z ISR i fallbackiem
- Admin panel z pełnym CRUD
- Migracja SQL gotowa
- Build przechodzi bez błędów
- **Akcja wymagana**: uruchomić SQL z `004_blog_posts.sql` w Supabase Dashboard
