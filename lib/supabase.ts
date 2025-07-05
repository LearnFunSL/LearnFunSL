import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This function creates a new Supabase client with the provided auth token.
// Creating a new client for each request ensures the token is always fresh.
const getSupabaseClient = (authToken: string) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  });
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
