"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Resource } from "@/types/resources";

export async function getResources() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.from("resources").select("*");

  if (error) {
    console.error("Error fetching resources:", error);
    return { data: null, error };
  }

  return { data: data as Resource[], error: null };
}
