import { getAuth } from "@/lib/auth/server";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

/**
 * Catch-all Neon Auth proxy route handler.
 * Proxies Better Auth client requests (OAuth, token refresh, verification, etc.)
 * to Neon Auth while managing signed HttpOnly session cookies.
 */
export async function GET(request: Request, context: RouteContext) {
  return getAuth().handler().GET(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return getAuth().handler().POST(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return getAuth().handler().PUT(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return getAuth().handler().DELETE(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return getAuth().handler().PATCH(request, context);
}
