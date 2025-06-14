import { createAdminClient } from "@/lib/supabase/client";
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
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();

  if (error && error.code !== "PGRST116") {
    // Ignore 'not found' errors
    log.error("Error getting user profile", { error });
    throw new Error("Could not retrieve user profile.");
  }

  return data;
};

/**
 * Creates a new user profile in the database.
 * @param profileData The data for the new user profile.
 * @returns The newly created user profile.
 */
export const createUserProfile = async (
  profileData: NewUserProfile,
): Promise<UserProfile> => {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("users")
    .insert(profileData)
    .select()
    .single();

  if (error) {
    log.error("Error creating user profile", { error });
    throw new Error("Could not create user profile.");
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
): Promise<UserProfile> => {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("users")
    .update(profileData)
    .eq("clerk_id", clerkId)
    .select()
    .single();

  if (error) {
    log.error("Error updating user profile", { error });
    throw new Error("Could not update user profile.");
  }

  return data;
};

/**
 * Deletes a user profile from the database.
 * @param clerkId The Clerk ID of the user to delete.
 */
export const deleteUserProfile = async (clerkId: string): Promise<void> => {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("clerk_id", clerkId);

  if (error) {
    log.error("Error deleting user profile", { error });
    throw new Error("Could not delete user profile.");
  }
};
