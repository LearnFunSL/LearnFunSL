"use server";

import { currentUser, User } from "@clerk/nextjs/server";

/**
 * Retrieves the current user from the server-side.
 * This function is designed to be used in Server Components and server-side logic.
 *
 * @returns {Promise<User | null>} A promise that resolves to the user object or null if not authenticated.
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await currentUser();
    return user;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};
