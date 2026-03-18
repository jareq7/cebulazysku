# Tasks: Canva Connect API Integration — Blog Covers

## Relevant Files

- `supabase/migrations/022_canva_tokens_blog_covers.sql` — Migration: canva_tokens table + blog_posts.cover_image_url
- `src/lib/canva.ts` — Canva Connect API client (OAuth, Autofill, Export)
- `src/app/api/canva/connect/route.ts` — OAuth initiation endpoint
- `src/app/api/canva/callback/route.ts` — OAuth callback handler
- `src/app/api/admin/blog/generate-cover/route.ts` — Blog cover generation endpoint
- `src/app/admin/blog/page.tsx` — Admin blog page (add generate cover UI)
- `src/app/blog/page.tsx` — Blog listing (display cover images)
- `src/app/blog/[slug]/page.tsx` — Blog detail (hero cover image)
- `src/lib/blog.ts` — Blog queries (add cover_image_url to selects)
- `docs/41-canva-integration.md` — Documentation

## Notes

- Canva OAuth requires HTTPS on production. Dev uses localhost:3000.
- Brand Templates must be created manually by Jarek in Canva editor with autofill fields.
- Autofill and Export are async jobs — need polling with timeout.
- Supabase Storage bucket `blog-covers` needs to be created.
- Template IDs will be stored as env vars or in a config table.

---

## Tasks

### 0.0 Create feature branch
- [x] 0.1 Create branch `feature/canva-integration` from main

### 1.0 Supabase migration
- [ ] 1.1 Create migration `022_canva_tokens_blog_covers.sql`
- [ ] 1.2 Create table `canva_tokens` (id uuid PK, access_token text, refresh_token text, expires_at timestamptz, scope text, created_at timestamptz default now(), updated_at timestamptz default now())
- [ ] 1.3 Add column `cover_image_url` (text, nullable) to `blog_posts`
- [ ] 1.4 Create Supabase Storage bucket `blog-covers` (public access)
- [ ] 1.5 Run migration locally and verify

### 2.0 Canva API client (`src/lib/canva.ts`)
- [ ] 2.1 Create `src/lib/canva.ts` with env vars loading (CANVA_CLIENT_ID, CANVA_CLIENT_SECRET)
- [ ] 2.2 Implement `getAuthUrl(redirectUri: string): string` — builds OAuth authorization URL with scopes (design:content:write, design:content:read, design:meta:read, asset:write, asset:read, brandtemplate:meta:read, brandtemplate:content:read)
- [ ] 2.3 Implement `exchangeCode(code: string, redirectUri: string): Promise<TokenResponse>` — POST to Canva token endpoint, returns access_token + refresh_token + expires_in
- [ ] 2.4 Implement `refreshAccessToken(refreshToken: string): Promise<TokenResponse>` — refresh expired token
- [ ] 2.5 Implement `getValidToken(): Promise<string>` — reads token from Supabase `canva_tokens`, auto-refreshes if expired, returns access_token
- [ ] 2.6 Implement `listBrandTemplates(): Promise<Template[]>` — GET /v1/brand-templates?dataset=non_empty
- [ ] 2.7 Implement `createAutofillJob(templateId: string, data: Record<string, AutofillField>, title?: string): Promise<string>` — POST /v1/autofills, returns jobId
- [ ] 2.8 Implement `pollAutofillJob(jobId: string, timeoutMs?: number): Promise<AutofillResult>` — polls GET /v1/autofills/{jobId} every 2s until success/failed, default 30s timeout
- [ ] 2.9 Implement `createExportJob(designId: string, format: ExportFormat): Promise<string>` — POST /v1/exports, returns jobId
- [ ] 2.10 Implement `pollExportJob(jobId: string, timeoutMs?: number): Promise<ExportResult>` — polls GET /v1/exports/{jobId} every 2s until success/failed
- [ ] 2.11 Implement `downloadAndUploadToSupabase(exportUrl: string, filename: string): Promise<string>` — downloads PNG from Canva export URL, uploads to Supabase Storage `blog-covers` bucket, returns public URL
- [ ] 2.12 Add TypeScript types: TokenResponse, Template, AutofillField (text/image), AutofillResult, ExportFormat, ExportResult

### 3.0 OAuth endpoints
- [ ] 3.1 Create `/api/canva/connect/route.ts` — GET handler: generates auth URL with state param (CSRF protection), redirects to Canva OAuth consent page
- [ ] 3.2 Create `/api/canva/callback/route.ts` — GET handler: receives `code` + `state` params, validates state, exchanges code for tokens, saves to `canva_tokens` table, redirects to `/admin/blog?canva=connected`
- [ ] 3.3 Add admin auth check (x-admin-password or session) to both endpoints
- [ ] 3.4 Test OAuth flow locally (redirect URL: http://localhost:3000/api/canva/callback)

### 4.0 Blog cover generation endpoint
- [ ] 4.1 Create `/api/admin/blog/generate-cover/route.ts` — POST handler
- [ ] 4.2 Accept body: `{ postId: string, templateStyle: 'A' | 'B' }`
- [ ] 4.3 Fetch blog post from Supabase (title, tags)
- [ ] 4.4 Map templateStyle to brand_template_id (from env vars: CANVA_TEMPLATE_A, CANVA_TEMPLATE_B)
- [ ] 4.5 Call `createAutofillJob()` with data: `{ title: { type: 'text', text: post.title }, category: { type: 'text', text: post.tags[0] || 'Poradnik' } }`
- [ ] 4.6 Poll autofill job → get designId
- [ ] 4.7 Call `createExportJob()` with designId, format PNG
- [ ] 4.8 Poll export job → get export URL
- [ ] 4.9 Call `downloadAndUploadToSupabase()` → get public Supabase URL
- [ ] 4.10 Update `blog_posts.cover_image_url` with public URL
- [ ] 4.11 Return `{ success: true, coverUrl: string }` or error
- [ ] 4.12 Add admin auth middleware check
- [ ] 4.13 Add error handling: Canva not connected, template not found, autofill failed, export failed, timeout

### 5.0 Admin panel UI — generate cover
- [x] 5.1 In `/admin/blog/page.tsx` — add "Canva" status indicator (connected/not connected)
- [x] 5.2 Add "Connect Canva" button (links to `/api/canva/connect`) if not connected
- [x] 5.3 For each blog post card — add cover image thumbnail if `cover_image_url` exists
- [x] 5.4 Add "Generuj cover" button (or "Regeneruj" if cover exists) on each post card
- [x] 5.5 Add template style selector dropdown (Styl A: 3D Isometric / Styl B: Macro Photo) next to button
- [x] 5.6 On click: show loading spinner, call POST `/api/admin/blog/generate-cover`, on success show thumbnail preview
- [x] 5.7 Handle errors: show toast with error message
- [x] 5.8 Add aria-labels to new buttons (accessibility)

### 6.0 Frontend blog — display cover images
- [ ] 6.1 Update `src/lib/blog.ts` — add `cover_image_url` to all blog post SELECT queries
- [ ] 6.2 Update blog post TypeScript type to include `cover_image_url?: string`
- [ ] 6.3 Update `/blog/page.tsx` — display cover image on blog listing cards (16:9, above title, with alt text, loading="lazy")
- [ ] 6.4 Update `/blog/[slug]/page.tsx` — display hero cover image at top of article (full-width, with alt text)
- [ ] 6.5 Add fallback for posts without cover (subtle gradient placeholder or no image)
- [ ] 6.6 Add `og:image` meta tag pointing to `cover_image_url` in blog detail generateMetadata
- [ ] 6.7 Ensure images have proper `width`, `height`, `loading` attributes (Lighthouse compliance)

### 7.0 Documentation + deploy
- [x] 7.1 Create `docs/41-canva-integration.md` — OAuth flow, template setup, cover generation, architecture
- [x] 7.2 Update `docs/README.md` — add entry for doc 41
- [ ] 7.3 Add CANVA_CLIENT_ID, CANVA_CLIENT_SECRET to Vercel env vars (requires Vercel CLI or dashboard)
- [ ] 7.4 Set OAuth redirect URL in Canva Developer Portal: `https://cebulazysku.pl/api/canva/callback` (manual)
- [x] 7.5 Update `CLAUDE.md` — add Canva to stack, add env vars to list
- [ ] 7.6 Update `AI-TASKS.md` — mark as done
- [ ] 7.7 Build check, commit, push, verify deploy
