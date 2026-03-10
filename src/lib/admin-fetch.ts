/**
 * Wrapper around fetch that adds admin authorization header.
 * Reads ADMIN_PASSWORD from sessionStorage.
 */
export function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const password = sessionStorage.getItem("admin_password") || "";

  const headers = new Headers(init?.headers);
  headers.set("x-admin-password", password);

  return fetch(url, { ...init, headers });
}
