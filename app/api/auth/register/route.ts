import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";
import { registerSchema } from "@/lib/auth/validation";
import {
  createDeveloperProfile,
  isUsernameAvailable,
} from "@/lib/auth/profile";
import { jsonError } from "@/lib/auth/session";

/**
 * POST /api/auth/register
 *
 * FR-01: Registers a new Learner account using email, password, and basic details.
 * FR-02: Delegates credential hashing & signed HttpOnly session token issuance to Neon Auth.
 * FR-03: Initializes the user's software developer profile in Neon Postgres.
 * FR-38: Public registration always assigns the `learner` role.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON request body.", 400);
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed.", 400, {
      fields: parsed.error.flatten().fieldErrors,
    });
  }

  const input = parsed.data;

  try {
    if (input.username) {
      const available = await isUsernameAvailable(input.username);
      if (!available) {
        return jsonError("That username is already taken.", 409, {
          fields: { username: ["That username is already taken."] },
        });
      }
    }

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      new URL(request.url).origin;

    const auth = getAuth();
    const { data, error } = await auth.signUp.email({
      email: input.email,
      password: input.password,
      name: input.displayName,
      callbackURL: `${origin}/dashboard`,
    });

    if (error || !data?.user) {
      const status =
        error?.status && error.status >= 400 && error.status < 600
          ? error.status
          : 400;
      const isDuplicate =
        status === 422 ||
        status === 409 ||
        error?.code === "USER_ALREADY_EXISTS" ||
        error?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL";

      return jsonError(
        isDuplicate
          ? "An account with this email address already exists."
          : error?.message || "Unable to complete registration.",
        isDuplicate ? 409 : status
      );
    }

    let profile;
    try {
      profile = await createDeveloperProfile({
        userId: data.user.id,
        displayName: input.displayName,
        username: input.username,
        bio: input.bio,
        experienceLevel: input.experienceLevel,
        schoolOrOrganization: input.schoolOrOrganization,
        githubUrl: input.githubUrl,
        portfolioUrl: input.portfolioUrl,
        skills: input.skills,
      });
    } catch (profileError) {
      console.error("[POST /api/auth/register] Profile creation failed:", profileError);
      return jsonError(
        "Account was created, but developer profile initialization failed. Please sign in to complete your profile.",
        500
      );
    }

    return NextResponse.json(
      {
        message: "Account registered successfully.",
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          emailVerified: Boolean(data.user.emailVerified),
        },
        profile,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/auth/register] Unexpected error:", err);
    return jsonError("Registration service is currently unavailable.", 500);
  }
}
