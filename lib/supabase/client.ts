import { createBrowserClient } from "@supabase/ssr";
import { config } from "@/lib/utils/config";

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
