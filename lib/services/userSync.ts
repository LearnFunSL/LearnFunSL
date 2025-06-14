import {
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "@/lib/supabase/userService";
import { UserData, DeletedUserData } from "@/types/clerk";
import { log } from "next-axiom";

const MAX_RETRIES = 3;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a user with retry logic.
 * @param data The user data from the webhook.
 */
export const syncUserCreation = async (data: UserData) => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await createUserProfile({
        clerk_id: data.id,
        email: data.email_addresses[0]?.email_address,
        username: data.username,
        image_url: data.image_url,
        grade: null,
        preferred_language: "en",
        onboarding_completed: false,
      });
      log.info("User created successfully", { clerkId: data.id });
      return;
    } catch (error) {
      log.error("Failed to create user", { error, attempt: i + 1 });
      if (i < MAX_RETRIES - 1) {
        await delay(1000 * (i + 1)); // Exponential backoff
      }
    }
  }
  log.error("Failed to create user after all retries", { clerkId: data.id });
  throw new Error("User creation failed after multiple retries.");
};

/**
 * Updates a user with retry logic.
 * @param data The user data from the webhook.
 */
export const syncUserUpdate = async (data: UserData) => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await updateUserProfile(data.id, {
        email: data.email_addresses[0]?.email_address,
        username: data.username,
        image_url: data.image_url,
      });
      log.info("User updated successfully", { clerkId: data.id });
      return;
    } catch (error) {
      log.error("Failed to update user", { error, attempt: i + 1 });
      if (i < MAX_RETRIES - 1) {
        await delay(1000 * (i + 1));
      }
    }
  }
  log.error("Failed to update user after all retries", { clerkId: data.id });
  throw new Error("User update failed after multiple retries.");
};

/**
 * Deletes a user with retry logic.
 * @param data The user data from the webhook.
 */
export const syncUserDeletion = async (data: DeletedUserData) => {
  if (!data.id) {
    log.warn("Attempted to delete user with no ID.");
    return;
  }
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await deleteUserProfile(data.id);
      log.info("User deleted successfully", { clerkId: data.id });
      return;
    } catch (error) {
      log.error("Failed to delete user", { error, attempt: i + 1 });
      if (i < MAX_RETRIES - 1) {
        await delay(1000 * (i + 1));
      }
    }
  }
  log.error("Failed to delete user after all retries", { clerkId: data.id });
  throw new Error("User deletion failed after multiple retries.");
};
