import {
  createBrowserClient,
  createServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import { cookies } from "next/headers";
import { config } from "@/lib/config";
import { getAuth } from "@clerk/nextjs/server";

/**
 * Creates a Supabase client for use in client components.
 * This client is configured to use the public anonymous key and can be used for
 * both authenticated and unauthenticated requests.
 */
export const createClient = () =>
  createBrowserClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

/**
 * Creates a Supabase client for use in server components.
 * This client is configured to use the service role key for elevated privileges
 * and is intended for server-side operations only.
 */
export const createAdminClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    },
  );
};
