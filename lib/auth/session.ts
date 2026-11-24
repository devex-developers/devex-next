import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";
import {
  createDeveloperProfile,
  getDeveloperProfile,
  type DeveloperProfile,
} from "@/lib/auth/profile";
import type { UserRole } from "@/lib/auth/validation";

export interface AuthenticatedContext {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image?: string | null;
  };
  session: {
    id: string;
    expiresAt: Date | string;
  };
  profile: DeveloperProfile;
}

export function jsonError(
  message: string,
  status: number,
  details?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      error: message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

/**
 * Resolves the currently authenticated Neon Auth session and corresponding
 * DevEx developer profile.
 */
export async function getAuthenticatedUser(): Promise<
  | { ok: true; data: AuthenticatedContext }
  | { ok: false; status: 401 | 403; error: string }
> {
  const auth = getAuth();
  const { data: sessionData, error } = await auth.getSession();

  if (error || !sessionData?.user || !sessionData?.session) {
    return {
      ok: false,
      status: 401,
      error: "Authentication required. Please sign in.",
    };
  }

  let profile = await getDeveloperProfile(sessionData.user.id);
  if (!profile) {
    profile = await createDeveloperProfile({
      userId: sessionData.user.id,
      displayName: sessionData.user.name || sessionData.user.email.split("@")[0],
    });
  }

  if (!profile.isActive) {
    return {
      ok: false,
      status: 403,
      error: "This account has been deactivated by an administrator.",
    };
  }

  return {
    ok: true,
    data: {
      user: {
        id: sessionData.user.id,
        email: sessionData.user.email,
        name: sessionData.user.name,
        emailVerified: Boolean(sessionData.user.emailVerified),
        image: sessionData.user.image ?? null,
      },
      session: {
        id: sessionData.session.id,
        expiresAt: sessionData.session.expiresAt,
      },
      profile,
    },
  };
}

/**
 * Route-handler guard requiring an authenticated, active account.
 */
export async function requireAuth(): Promise<
  | { ok: true; data: AuthenticatedContext }
  | { ok: false; response: NextResponse }
> {
  const result = await getAuthenticatedUser();
  if (!result.ok) {
    return {
      ok: false,
      response: jsonError(result.error, result.status),
    };
  }
  return { ok: true, data: result.data };
}

/**
 * Route-handler guard enforcing FR-38 role-based access boundaries.
 * Example: `requireRole(["admin"])`, `requireRole(["learner"])`,
 * or `requireRole(["admin", "content_creator"])`.
 */
export async function requireRole(
  allowedRoles: readonly UserRole[]
): Promise<
  | { ok: true; data: AuthenticatedContext }
  | { ok: false; response: NextResponse }
> {
  const authResult = await requireAuth();
  if (!authResult.ok) {
    return authResult;
  }

  if (!allowedRoles.includes(authResult.data.profile.role)) {
    return {
      ok: false,
      response: jsonError(
        "Forbidden: your account role does not have access to this resource.",
        403
      ),
    };
  }

  return authResult;
}
