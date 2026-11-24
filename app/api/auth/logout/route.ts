import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";
import { jsonError } from "@/lib/auth/session";

/**
 * POST /api/auth/logout
 *
 * FR-02: Revokes the active Neon Auth session and clears signed session cookies.
 */
export async function POST() {
  try {
    const auth = getAuth();
    const { error } = await auth.signOut();

    if (error) {
      return jsonError(error.message || "Failed to sign out.", 400);
    }

    return NextResponse.json(
      { success: true, message: "Signed out successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("[POST /api/auth/logout] Unexpected error:", err);
    return jsonError("Unable to complete logout.", 500);
  }
}
