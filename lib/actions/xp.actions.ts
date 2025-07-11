"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export type XpAction =
  | "DAILY_LOGIN"
  | "WATCH_VIDEO"
  | "DOWNLOAD_RESOURCE"
  | "COMPLETE_QUIZ"
  | "AI_HELP"
  | "STREAK_7_DAY"
  | "STREAK_30_DAY";

/**
 * Awards XP to the currently logged-in user by calling a Supabase RPC function.
 * This function is designed to be called from Server Actions or other server-side code.
 *
 * @param action The specific action for which XP is being awarded.
 * @returns An object indicating success or failure, with an optional error message.
 */
export async function awardXP(
  action: XpAction,
): Promise<{ success: boolean; error?: string }> {
  const { userId: clerkId } = await auth();
  const supabase = createSupabaseServerClient();

  if (!clerkId) {
    // User not authenticated. In production, log this to a monitoring service.
    return { success: false, error: "User not authenticated." };
  }

  try {
    // The Clerk userId (clerkId) is not a UUID, but the 'add_xp' function expects one for p_user_id.
    // We must first fetch the internal user record from Supabase using the Clerk ID
    // to get the correct UUID. This assumes a 'users' table that maps your internal UUIDs
    // to Clerk IDs in a 'clerk_id' column.
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id") // Select the internal UUID
      .eq("clerk_id", clerkId) // Find the user by their Clerk ID
      .single();

    if (userError || !user) {
      // Could not find user. In production, log this to a monitoring service.
      return { success: false, error: "User profile not found." };
    }

    const { error } = await supabase.rpc("add_xp", {
      p_user_id: user.id, // Pass the correct internal UUID
      p_action: action,
    });

    if (error) {
      // Supabase RPC error. In production, log this to a monitoring service.
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    // Unexpected error. In production, log this to a monitoring service.
    return { success: false, error: "An unexpected error occurred." };
  }
}
