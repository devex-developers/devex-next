import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";
import { confirmPasswordResetSchema } from "@/lib/auth/validation";
import { jsonError } from "@/lib/auth/session";

/**
 * POST /api/auth/password-reset/confirm
 *
 * FR-02: Completes password reset using the one-time token issued by Neon Auth.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON request body.", 400);
  }

  const parsed = confirmPasswordResetSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed.", 400, {
      fields: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const auth = getAuth();
    const { error } = await auth.resetPassword({
      token: parsed.data.token,
      newPassword: parsed.data.newPassword,
    });

    if (error) {
      return jsonError(
        error.message || "Invalid or expired password reset token.",
        error.status && error.status >= 400 && error.status < 600
          ? error.status
          : 400
      );
    }

    return NextResponse.json(
      { message: "Password has been reset successfully. You may now sign in." },
      { status: 200 }
    );
  } catch (err) {
    console.error("[POST /api/auth/password-reset/confirm] Unexpected error:", err);
    return jsonError("Password reset service is currently unavailable.", 500);
  }
}
