import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// A global variable to hold the Supabase client instance.
let supabaseClient: SupabaseClient<Database> | null = null;

const getSupabaseClient = (authToken: string) => {
  // If the client doesn't exist or the token has changed, create a new one.
  // This is a simplified singleton pattern. For a more robust solution,
  // you might listen for auth events to update the client.
  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    });
  }

  return supabaseClient;
};

export const useSupabase = () => {
  const { getToken } = useAuth();

  return useMemo(
    () => ({
      getAuthenticatedClient: async () => {
        const supabaseToken = await getToken({ template: "supabase" });
        if (!supabaseToken) {
          throw new Error("Could not get Supabase token");
        }
        return getSupabaseClient(supabaseToken);
      },
    }),
    [getToken],
  );
};
