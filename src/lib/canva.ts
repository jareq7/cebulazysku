// @author Claude Code (claude-opus-4-6) | 2026-03-18
// Canva Connect API client — OAuth, Autofill, Export

const CANVA_CLIENT_ID = process.env.CANVA_CLIENT_ID || "";
const CANVA_CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET || "";
const CANVA_API_BASE = "https://api.canva.com/rest/v1";
const CANVA_AUTH_BASE = "https://www.canva.com/api/oauth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// --- Types ---

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface CanvaTemplate {
  id: string;
  title: string;
  thumbnail?: { url: string; width: number; height: number };
  created_at: number;
  updated_at: number;
}

export interface AutofillField {
  type: "text" | "image";
  text?: string;
  asset_id?: string;
}

interface AutofillJobResult {
  type: string;
  design: {
    id: string;
    title: string;
    url: string;
    thumbnail?: { url: string; width: number; height: number };
  };
}

interface ExportJobResult {
  type: string;
  urls: string[];
}

type JobStatus = "in_progress" | "success" | "failed";

interface Job<T> {
  id: string;
  status: JobStatus;
  result?: T;
  error?: { code: string; message: string };
}

// --- OAuth ---

const SCOPES = [
  "design:content:write",
  "design:content:read",
  "design:meta:read",
  "asset:write",
  "asset:read",
  "brandtemplate:meta:read",
  "brandtemplate:content:read",
  "profile:read",
].join(" ");

/**
 * Generate PKCE code_verifier and code_challenge (S256).
 */
export function generatePKCE(): {
  codeVerifier: string;
  codeChallenge: string;
} {
  const { randomBytes, createHash } = require("crypto") as typeof import("crypto");
  const codeVerifier = randomBytes(32)
    .toString("base64url")
    .replace(/[^a-zA-Z0-9\-._~]/g, "")
    .slice(0, 128);

  const codeChallenge = createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  return { codeVerifier, codeChallenge };
}

export function getAuthUrl(
  redirectUri: string,
  state: string,
  codeChallenge: string
): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CANVA_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: redirectUri,
    state,
    code_challenge_method: "s256",
    code_challenge: codeChallenge,
  });
  return `${CANVA_AUTH_BASE}/authorize?${params.toString()}`;
}

export async function exchangeCode(
  code: string,
  redirectUri: string,
  codeVerifier: string
): Promise<TokenResponse> {
  const basicAuth = Buffer.from(
    `${CANVA_CLIENT_ID}:${CANVA_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${CANVA_API_BASE}/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Canva token exchange failed: ${res.status} ${err}`);
  }

  return res.json();
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse> {
  const basicAuth = Buffer.from(
    `${CANVA_CLIENT_ID}:${CANVA_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${CANVA_API_BASE}/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Canva token refresh failed: ${res.status} ${err}`);
  }

  return res.json();
}

// --- Token Management (Supabase) ---

async function supabaseFetch(path: string, options?: RequestInit) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...options?.headers,
    },
  });
}

export async function saveTokens(tokens: TokenResponse): Promise<void> {
  const expiresAt = new Date(
    Date.now() + tokens.expires_in * 1000
  ).toISOString();

  // Upsert: delete all + insert (single row table)
  await supabaseFetch("canva_tokens?id=not.is.null", { method: "DELETE" });
  await supabaseFetch("canva_tokens", {
    method: "POST",
    body: JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
      scope: tokens.scope,
    }),
  });
}

export async function getValidToken(): Promise<string> {
  const res = await supabaseFetch("canva_tokens?limit=1&order=created_at.desc");
  const rows = await res.json();

  if (!rows || rows.length === 0) {
    throw new Error("Canva not connected. Please connect via /api/canva/connect");
  }

  const token = rows[0];
  const expiresAt = new Date(token.expires_at);
  const now = new Date();

  // Refresh if expires within 5 minutes
  if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    const refreshed = await refreshAccessToken(token.refresh_token);
    await saveTokens(refreshed);
    return refreshed.access_token;
  }

  return token.access_token;
}

export async function isConnected(): Promise<boolean> {
  try {
    const res = await supabaseFetch("canva_tokens?limit=1");
    const rows = await res.json();
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

// --- API Helpers ---

async function canvaFetch(path: string, options?: RequestInit) {
  const token = await getValidToken();
  const res = await fetch(`${CANVA_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Canva API error: ${res.status} ${err}`);
  }

  return res.json();
}

async function pollJob<T>(
  path: string,
  timeoutMs = 30000,
  intervalMs = 2000
): Promise<T> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const job: Job<T> = await canvaFetch(path);

    if (job.status === "success" && job.result) {
      return job.result;
    }

    if (job.status === "failed") {
      throw new Error(
        `Canva job failed: ${job.error?.code} — ${job.error?.message}`
      );
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error(`Canva job timed out after ${timeoutMs}ms`);
}

// --- Brand Templates ---

export async function listBrandTemplates(): Promise<CanvaTemplate[]> {
  const data = await canvaFetch(
    "/brand-templates?dataset=non_empty&limit=100"
  );
  return data.items || [];
}

// --- Autofill ---

export async function createAutofillJob(
  templateId: string,
  data: Record<string, AutofillField>,
  title?: string
): Promise<string> {
  const body: Record<string, unknown> = {
    brand_template_id: templateId,
    data,
  };
  if (title) body.title = title;

  const result = await canvaFetch("/autofills", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return result.job.id;
}

export async function pollAutofillJob(
  jobId: string,
  timeoutMs = 30000
): Promise<AutofillJobResult> {
  return pollJob<AutofillJobResult>(`/autofills/${jobId}`, timeoutMs);
}

// --- Export ---

export type ExportFormat =
  | { type: "png"; lossless?: boolean }
  | { type: "jpg"; quality: number }
  | { type: "pdf" };

export async function createExportJob(
  designId: string,
  format: ExportFormat
): Promise<string> {
  const result = await canvaFetch("/exports", {
    method: "POST",
    body: JSON.stringify({ design_id: designId, format }),
  });

  return result.job.id;
}

export async function pollExportJob(
  jobId: string,
  timeoutMs = 30000
): Promise<string[]> {
  const result = await pollJob<ExportJobResult>(`/exports/${jobId}`, timeoutMs);
  return result.urls;
}

// --- Download & Upload to Supabase Storage ---

export async function downloadAndUploadToSupabase(
  exportUrl: string,
  filename: string
): Promise<string> {
  // Download from Canva
  const imageRes = await fetch(exportUrl);
  if (!imageRes.ok) {
    throw new Error(`Failed to download from Canva: ${imageRes.status}`);
  }
  const imageBuffer = await imageRes.arrayBuffer();

  // Upload to Supabase Storage
  const uploadRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/blog-covers/${filename}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "image/png",
        "x-upsert": "true",
      },
      body: imageBuffer,
    }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`Supabase storage upload failed: ${uploadRes.status} ${err}`);
  }

  // Return public URL
  return `${SUPABASE_URL}/storage/v1/object/public/blog-covers/${filename}`;
}

// --- High-level: Generate Blog Cover ---

export async function generateBlogCover(
  templateId: string,
  postTitle: string,
  postCategory: string,
  postSlug: string
): Promise<string> {
  // 1. Autofill
  const autofillJobId = await createAutofillJob(
    templateId,
    {
      title: { type: "text", text: postTitle },
      category: { type: "text", text: postCategory },
    },
    `Blog Cover — ${postTitle}`
  );

  // 2. Poll autofill
  const autofillResult = await pollAutofillJob(autofillJobId);
  const designId = autofillResult.design.id;

  // 3. Export to PNG
  const exportJobId = await createExportJob(designId, { type: "png" });

  // 4. Poll export
  const urls = await pollExportJob(exportJobId);
  if (!urls || urls.length === 0) {
    throw new Error("Canva export returned no URLs");
  }

  // 5. Download & upload to Supabase
  const filename = `${postSlug}.png`;
  const publicUrl = await downloadAndUploadToSupabase(urls[0], filename);

  return publicUrl;
}
