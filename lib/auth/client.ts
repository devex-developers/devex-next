"use client";

import { createAuthClient } from "@neondatabase/auth/next";

/**
 * Client-side Neon Auth instance for React Client Components.
 * Proxies through `/api/auth/[...path]` using HttpOnly session cookies.
 */
export const authClient = createAuthClient();
