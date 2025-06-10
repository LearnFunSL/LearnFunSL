import { createBrowserClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";
import { supabaseLogger as logger } from "@/lib/utils/logger";
import { AuthError } from "@/types/supabase";

type GetToken = (options: { template: string }) => Promise<string | null>;

// Generate a deterministic UUID based on a Clerk user ID
// This ensures we always get the same UUID for a given user ID
const generateDeterministicUuid = (clerkId: string) => {
  if (!clerkId) return null;

  // Use a simple hash function to generate a predictable seed
  let hash = 0;
  for (let i = 0; i < clerkId.length; i++) {
    hash = (hash << 5) - hash + clerkId.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  // Use the hash to generate a seeded UUID
  const seed = Math.abs(hash);
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (seed + Math.random() * 16) % 16 | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  return uuid;
};

/**
 * Creates a Supabase client for browser-side usage.
 * This function is configured to work with a custom JWT from Clerk.
 *
 * @param getToken - An async function from Clerk's `useAuth` hook to fetch the token.
 * @returns A Supabase client instance.
 * @throws {AuthError} if environment variables are missing or client creation fails.
 */
export function createSupabaseBrowserClient(
  getToken: GetToken,
): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    logger.error("Missing Supabase environment variables for client");
    throw new AuthError(
      "CLIENT_CREATION_FAILED",
      "Supabase URL and Anon Key are required.",
    );
  }

  logger.debug("Creating Supabase browser client with dynamic token.");

  try {
    const client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: async (url, options = {}) => {
          const headers = new Headers(options.headers);

          try {
            const token = await getToken({ template: "supabase" });

            if (token) {
              headers.set("Authorization", `Bearer ${token}`);
              logger.debug("Added Clerk JWT token to Supabase request");
            } else {
              logger.warn("No token returned from Clerk, using anon key");
            }
          } catch (tokenErr) {
            logger.error("Failed to get Clerk token", tokenErr);
          }

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    });

    logger.debug("Supabase browser client created.");
    return client;
  } catch (error) {
    logger.error("Failed to create Supabase browser client", error);
    throw new AuthError(
      "CLIENT_CREATION_FAILED",
      "Could not create Supabase client.",
      error,
    );
  }
}
