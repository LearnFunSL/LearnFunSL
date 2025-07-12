import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  UserProfile,
  UpdateUserProfile,
  NewUserProfile,
} from "@/types/supabase";
import { log } from "next-axiom";

/**
 * Retrieves a user profile from the database.
 * @param clerkId The Clerk ID of the user.
 * @returns The user profile or null if not found.
 */
export const getUserProfile = async (
  clerkId: string,
): Promise<UserProfile | null> => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .maybeSingle(); // Use maybeSingle() to prevent errors when no user is found.

  if (error) {
    log.error("Error getting user profile", { error });
    throw new Error("Could not retrieve user profile.");
  }

  return data;
};

/**
 * Creates or updates a user profile in the database.
 * This function is atomic and safe for concurrent calls.
 * @param profileData The data for the user profile.
 * @returns The created or updated user profile.
 */
export const upsertUserProfile = async (
  profileData: NewUserProfile,
): Promise<UserProfile> => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .upsert(profileData, { onConflict: "clerk_id" })
    .select()
    .single(); // .single() is safe here because upsert guarantees a single row

  if (error) {
    log.error("Error upserting user profile", { error });
    throw new Error("Could not upsert user profile.");
  }

  return data;
};

/**
 * Updates an existing user profile in the database.
 * @param clerkId The Clerk ID of the user to update.
 * @param profileData The data to update.
 * @returns The updated user profile.
 */
export const updateUserProfile = async (
  clerkId: string,
  profileData: UpdateUserProfile,
): Promise<UserProfile | null> => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .update(profileData)
    .eq("clerk_id", clerkId)
    .select();

  if (error) {
    log.error("Error updating user profile", { error });
    throw new Error("Could not update user profile.");
  }

  // Return the first record, or null if no user was updated.
  return data?.[0] || null;
};

/**
 * Deletes a user profile from the database.
 * @param clerkId The Clerk ID of the user to delete.
 */
export const deleteUserProfile = async (clerkId: string): Promise<void> => {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("clerk_id", clerkId);

  if (error) {
    log.error("Error deleting user profile", { error });
    throw new Error("Could not delete user profile.");
  }
};
