import type { NextRequest } from "next/server";
import { getAuth } from "@/lib/auth/server";

/**
 * Next.js 16 Proxy (`proxy.ts`) for Neon Auth session verification & refresh.
 *
 * Protects authenticated application sections and redirects unauthenticated
 * requests to `/auth/sign-in`. Fine-grained RBAC checks (FR-38) are enforced
 * server-side inside Route Handlers and Server Components via `requireRole()`.
 */
export async function proxy(request: NextRequest) {
  const middleware = getAuth().middleware({
    loginUrl: "/auth/sign-in",
  });
  return middleware(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/simulations/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/content/:path*",
  ],
};
