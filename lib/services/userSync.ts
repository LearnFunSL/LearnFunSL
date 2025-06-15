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
  const primaryEmail = data.email_addresses.find(
    (email) => email.id === data.primary_email_address_id,
  )?.email_address;

  if (!primaryEmail) {
    log.error("User creation skipped: No primary email address found.", {
      clerkId: data.id,
    });
    // Depending on your business logic, you might want to throw an error
    // or simply return. If users CAN exist without emails, you might
    // create a profile with a null email. If not, this is a critical failure.
    throw new Error("User creation failed: No primary email address.");
  }

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await createUserProfile({
        clerk_id: data.id,
        email: primaryEmail,
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
  const primaryEmail = data.email_addresses.find(
    (email) => email.id === data.primary_email_address_id,
  )?.email_address;

  if (!primaryEmail) {
    log.warn("User update skipped: No primary email address found.", {
      clerkId: data.id,
    });
    // If email is a required field for you, handle this appropriately.
    // For an update, we might proceed without updating the email.
    return;
  }

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await updateUserProfile(data.id, {
        email: primaryEmail,
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
