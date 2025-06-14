import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";

interface AuthHook {
  user: UserResource | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Custom hook for accessing authentication state.
 * This hook centralizes authentication logic and provides a consistent interface.
 *
 * @returns {AuthHook} An object containing the user, userId, authentication status, and loading state.
 */
export const useAuth = (): AuthHook => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { userId } = useClerkAuth();

  return {
    user: user || null,
    userId: userId || null,
    isAuthenticated: !!isSignedIn,
    isLoading: !isLoaded,
  };
};
