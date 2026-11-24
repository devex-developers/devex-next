import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";
import { loginSchema } from "@/lib/auth/validation";
import {
  createDeveloperProfile,
  getDeveloperProfile,
} from "@/lib/auth/profile";
import { jsonError } from "@/lib/auth/session";

/**
 * POST /api/auth/login
 *
 * FR-02: Authenticates a user with email & password and issues secure HttpOnly
 * session cookies via Neon Auth.
 * FR-37: Blocks sign-in for accounts deactivated by an administrator.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON request body.", 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed.", 400, {
      fields: parsed.error.flatten().fieldErrors,
    });
  }

  const { email, password, rememberMe } = parsed.data;

  try {
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      new URL(request.url).origin;

    const auth = getAuth();
    const { data, error } = await auth.signIn.email({
      email,
      password,
      rememberMe,
      callbackURL: `${origin}/dashboard`,
    });

    if (error || !data?.user) {
      return jsonError("Invalid email address or password.", 401);
    }

    let profile = await getDeveloperProfile(data.user.id);
    if (!profile) {
      profile = await createDeveloperProfile({
        userId: data.user.id,
        displayName: data.user.name || data.user.email.split("@")[0],
      });
    }

    if (!profile.isActive) {
      await auth.signOut().catch(() => {});
      return jsonError(
        "This account has been deactivated by an administrator.",
        403
      );
    }

    return NextResponse.json(
      {
        message: "Signed in successfully.",
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          emailVerified: Boolean(data.user.emailVerified),
        },
        profile,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[POST /api/auth/login] Unexpected error:", err);
    return jsonError("Authentication service is currently unavailable.", 500);
  }
}
