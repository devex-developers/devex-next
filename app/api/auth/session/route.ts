import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";

/**
 * GET /api/auth/session
 *
 * FR-02: Validates the caller's session cookie/token and returns the authenticated
 * user, session expiration metadata, and DevEx developer profile (including role).
 */
export async function GET() {
  const result = await requireAuth();
  if (!result.ok) {
    return result.response;
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: result.data.user,
      session: result.data.session,
      profile: result.data.profile,
    },
    { status: 200 }
  );
}
