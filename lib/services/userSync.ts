import {
  upsertUserProfile,
  deleteUserProfile,
} from "@/lib/supabase/userService";
import { UserData, DeletedUserData } from "@/types/clerk";
import { log } from "next-axiom";

const MAX_RETRIES = 3;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates or updates a user profile based on webhook data.
 * This function is idempotent and handles both creation and updates.
 * @param data The user data from the webhook.
 * @param isUpdate Whether this is an update or a creation event.
 */
const syncUserUpsert = async (data: UserData, isUpdate: boolean) => {
  const primaryEmail = data.email_addresses.find(
    (email) => email.id === data.primary_email_address_id,
  )?.email_address;

  if (!primaryEmail) {
    log.error("User sync skipped: No primary email address found.", {
      clerkId: data.id,
    });
    throw new Error("User sync failed: No primary email address.");
  }

  const profileData = {
    clerk_id: data.id,
    email: primaryEmail,
    username: data.username,
    image_url: data.image_url,
    // Provide default values for fields required by NewUserProfile
    // These are only set on initial creation, upsert will ignore them on conflict
    ...(!isUpdate && {
      grade: null,
      preferred_language: "en",
      onboarding_completed: false,
      xp: 0,
      xp_total: 0,
    }),
  };

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      // The type assertion is safe because we are providing all the fields.
      await upsertUserProfile(profileData as any);
      log.info("User upserted successfully", { clerkId: data.id });
      return;
    } catch (error) {
      log.error("Failed to upsert user", { error, attempt: i + 1 });
      if (i < MAX_RETRIES - 1) {
        await delay(1000 * (i + 1)); // Exponential backoff
      }
    }
  }
  log.error("Failed to upsert user after all retries", { clerkId: data.id });
  throw new Error("User upsert failed after multiple retries.");
};

export const syncUserCreation = (data: UserData) => syncUserUpsert(data, false);
export const syncUserUpdate = (data: UserData) => syncUserUpsert(data, true);

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
