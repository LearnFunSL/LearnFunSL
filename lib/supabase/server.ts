import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { config } from "@/lib/config.server";

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
