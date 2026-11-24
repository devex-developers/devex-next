import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sqlClient: NeonQueryFunction<false, false> | null = null;

/**
 * Returns a lazily-initialized Neon serverless SQL client.
 * Prefers the pooled connection string (`DATABASE_URL_POOLED`) for serverless
 * route handlers, falling back to `DATABASE_URL`.
 */
export function getSql(): NeonQueryFunction<false, false> {
  if (sqlClient) {
    return sqlClient;
  }

  const connectionString =
    process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "Database connection string is not configured. Set DATABASE_URL_POOLED or DATABASE_URL in your environment."
    );
  }

  sqlClient = neon(connectionString);
  return sqlClient;
}
