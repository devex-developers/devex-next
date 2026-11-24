import { createNeonAuth, type NeonAuth } from "@neondatabase/auth/next/server";

let neonAuthInstance: NeonAuth | null = null;

/**
 * Returns the singleton Neon Auth server instance.
 *
 * Lazily initialized so `next build` does not fail when runtime secrets are not
 * present at build time, while strictly validating required env vars at runtime.
 */
export function getAuth(): NeonAuth {
  if (neonAuthInstance) {
    return neonAuthInstance;
  }

  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;

  if (!baseUrl) {
    throw new Error(
      "NEON_AUTH_BASE_URL is not configured. Add it to .env.local from your Neon Console Auth settings."
    );
  }

  if (!secret || secret.length < 32) {
    throw new Error(
      "NEON_AUTH_COOKIE_SECRET must be set and at least 32 characters long. Generate one with: openssl rand -base64 32"
    );
  }

  neonAuthInstance = createNeonAuth({
    baseUrl,
    cookies: {
      secret,
      // Cache signed session data for 5 minutes before re-validating upstream.
      sessionDataTtl: 300,
      // Lax protects against CSRF on cross-site state changes while allowing top-level redirects.
      sameSite: "lax",
    },
  });

  return neonAuthInstance;
}
