import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";
import { requestPasswordResetSchema } from "@/lib/auth/validation";
import { jsonError } from "@/lib/auth/session";

/**
 * POST /api/auth/password-reset/request
 *
 * FR-02: Initiates a password reset flow via Neon Auth.
 * Always returns a generic 200 response for valid payloads to prevent email enumeration.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON request body.", 400);
  }

  const parsed = requestPasswordResetSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed.", 400, {
      fields: parsed.error.flatten().fieldErrors,
    });
  }

  const { email, redirectTo } = parsed.data;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resolvedRedirect = redirectTo ?? `${appUrl}/auth/reset-password`;

  try {
    const auth = getAuth();
    await auth.requestPasswordReset({
      email,
      redirectTo: resolvedRedirect,
    });

    return NextResponse.json(
      {
        message:
          "If an account exists for that email address, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[POST /api/auth/password-reset/request] Unexpected error:", err);
    return jsonError("Password reset service is currently unavailable.", 500);
  }
}
