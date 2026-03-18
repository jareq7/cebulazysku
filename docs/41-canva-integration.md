# 41. Integracja Canva Connect API — Okładki bloga

> **Data:** 18 marca 2026
> **Autor:** Claude Code (claude-opus-4-6)
> **Branch:** `feature/canva-integration`

## Cel

Automatyczne generowanie okładek blogowych z Canva Brand Templates. Admin wybiera styl, klika "Generuj cover", system autofill → export → upload do Supabase Storage.

## Architektura

```
Admin Panel → POST /api/admin/blog/generate-cover
    → Canva Autofill API (POST /v1/autofills)
    → Poll until done
    → Canva Export API (POST /v1/exports, format: PNG)
    → Poll until done
    → Download PNG → Upload to Supabase Storage (blog-covers bucket)
    → Update blog_posts.cover_image_url
    → Return public URL
```

## OAuth Flow

1. Admin klika "Połącz Canva" w `/admin/blog`
2. GET `/api/canva/connect` → generuje state (CSRF), zapisuje w cookie, redirectuje do Canva
3. User autoryzuje w Canva → redirect do `/api/canva/callback`
4. Callback wymienia code na tokens, zapisuje do `canva_tokens` table
5. Redirect do `/admin/blog?canva=connected`

**Scopes:** `design:content:write design:content:read design:meta:read asset:write asset:read brandtemplate:meta:read brandtemplate:content:read`

## Pliki

| Plik | Opis |
|------|------|
| `src/lib/canva.ts` | Klient API: OAuth, Autofill, Export, token refresh, Storage upload |
| `src/app/api/canva/connect/route.ts` | OAuth initiation |
| `src/app/api/canva/callback/route.ts` | OAuth callback |
| `src/app/api/admin/blog/generate-cover/route.ts` | GET: Canva status, POST: generuj cover |
| `src/app/admin/blog/page.tsx` | UI: status Canva, thumbnail, przycisk generowania, selektor stylu |
| `src/app/blog/page.tsx` | Wyświetlanie okładek na liście bloga |
| `src/app/blog/[slug]/page.tsx` | Hero image + og:image w metadata |
| `supabase/migrations/022_canva_tokens_blog_covers.sql` | Tabela canva_tokens + kolumna cover_image_url |

## Env vars (Vercel)

| Zmienna | Opis |
|---------|------|
| `CANVA_CLIENT_ID` | Client ID z Canva Developer Portal |
| `CANVA_CLIENT_SECRET` | Client Secret |
| `CANVA_TEMPLATE_A` | Brand Template ID — styl A (3D Isometric) |
| `CANVA_TEMPLATE_B` | Brand Template ID — styl B (Macro Photo) |

## Setup

1. Dodaj CANVA_CLIENT_ID i CANVA_CLIENT_SECRET do Vercel env vars
2. W Canva Developer Portal ustaw redirect URL: `https://cebulazysku.pl/api/canva/callback`
3. Uruchom migrację 022 (canva_tokens + cover_image_url)
4. Utwórz bucket `blog-covers` w Supabase Storage (public)
5. Stwórz Brand Templates w Canva z polami autofill: `title` (text), `category` (text)
6. Zapisz Template IDs jako CANVA_TEMPLATE_A / CANVA_TEMPLATE_B w Vercel
7. W admin panelu kliknij "Połącz Canva" i autoryzuj

## Uwagi

- **Canva Enterprise vs Pro:** Autofill API + Brand Templates mogą wymagać planu Enterprise. Jeśli scopy zostaną odrzucone, trzeba pivotować na alternatywne podejście.
- **Token refresh:** Automatyczny — `getValidToken()` odświeża token jeśli wygasa za < 5 min.
- **Polling:** Autofill i Export to async joby — pollujemy co 2s z timeoutem 30s.
- **Storage:** Okładki trafiają do `blog-covers/{slug}-{timestamp}.png`.

## Baza danych

### canva_tokens
```sql
id uuid PK DEFAULT gen_random_uuid()
access_token text NOT NULL
refresh_token text NOT NULL
expires_at timestamptz NOT NULL
scope text
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

### blog_posts (nowa kolumna)
```sql
cover_image_url text  -- nullable, URL do okładki w Supabase Storage
```
