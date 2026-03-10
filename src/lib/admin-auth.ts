import { NextRequest, NextResponse } from "next/server";

/**
 * Verifies admin authorization on API routes.
 * Checks for ADMIN_PASSWORD in the Authorization header.
 *
 * Usage in any admin API route:
 *   const authError = verifyAdmin(request);
 *   if (authError) return authError;
 */
export function verifyAdmin(request: NextRequest): NextResponse | null {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");

  // Accept: Authorization: Bearer <ADMIN_PASSWORD>
  if (authHeader === `Bearer ${adminPassword}`) {
    return null; // authorized
  }

  // Accept: X-Admin-Password: <ADMIN_PASSWORD> (for simple frontend fetch)
  const xAdminPass = request.headers.get("x-admin-password");
  if (xAdminPass === adminPassword) {
    return null; // authorized
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
