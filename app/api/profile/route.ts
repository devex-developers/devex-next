import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";
import { updateProfileSchema } from "@/lib/auth/validation";
import {
  isUsernameAvailable,
  updateDeveloperProfile,
} from "@/lib/auth/profile";
import { jsonError, requireAuth } from "@/lib/auth/session";

/**
 * GET /api/profile
 *
 * FR-03: Returns the authenticated user's developer profile.
 */
export async function GET() {
  const authResult = await requireAuth();
  if (!authResult.ok) {
    return authResult.response;
  }

  return NextResponse.json(
    {
      user: authResult.data.user,
      profile: authResult.data.profile,
    },
    { status: 200 }
  );
}

/**
 * PATCH /api/profile
 *
 * FR-03: Customizes and updates the authenticated user's developer profile.
 */
export async function PATCH(request: Request) {
  const authResult = await requireAuth();
  if (!authResult.ok) {
    return authResult.response;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON request body.", 400);
  }

  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed.", 400, {
      fields: parsed.error.flatten().fieldErrors,
    });
  }

  const updates = parsed.data;
  const userId = authResult.data.user.id;

  try {
    if (updates.username) {
      const available = await isUsernameAvailable(updates.username, userId);
      if (!available) {
        return jsonError("That username is already taken.", 409, {
          fields: { username: ["That username is already taken."] },
        });
      }
    }

    const updatedProfile = await updateDeveloperProfile(userId, updates);
    if (!updatedProfile) {
      return jsonError("Developer profile not found.", 404);
    }

    if (
      updates.displayName &&
      updates.displayName !== authResult.data.user.name
    ) {
      await getAuth()
        .updateUser({ name: updates.displayName })
        .catch((err) => {
          console.warn(
            "[PATCH /api/profile] Failed to sync displayName to Neon Auth:",
            err
          );
        });
    }

    return NextResponse.json(
      {
        message: "Developer profile updated successfully.",
        profile: updatedProfile,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[PATCH /api/profile] Unexpected error:", err);
    return jsonError("Unable to update developer profile.", 500);
  }
}
