"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider";
import { useClerk } from "@clerk/nextjs";
import { logger } from "@/lib/utils/logger";

/**
 * AuthRecovery provides a user-facing way to resolve authentication state issues
 * by clearing local storage and retrying the sign-in process.
 */
export default function AuthRecovery() {
  const { retry, signOut } = useSupabaseAuth();
  const { user } = useClerk();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Clears all authentication-related browser storage.
   */
  const clearAuthStorage = async () => {
    logger.info("Clearing browser storage for auth recovery.");
    try {
      // Get all keys from localStorage
      const keys = Object.keys(localStorage);
      // Find keys related to Supabase or Clerk
      const authKeys = keys.filter(
        (key) =>
          key.startsWith("sb-") ||
          key.includes("supabase") ||
          key.includes("clerk"),
      );

      authKeys.forEach((key) => {
        localStorage.removeItem(key);
        logger.debug(`Removed from localStorage: ${key}`);
      });

      // Clear all cookies by setting their expiry to the past
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });

      logger.info("Authentication storage cleared.");
    } catch (error) {
      logger.error("Error clearing authentication storage.", error);
    }
  };

  /**
   * Handles a full sign-out and state reset.
   */
  const handleFullReset = async () => {
    if (
      window.confirm(
        "This will sign you out and clear local authentication data. Are you sure?",
      )
    ) {
      setIsProcessing(true);
      try {
        await clearAuthStorage();
        // Use the signOut from our context which handles both Clerk and Supabase
        await signOut();
        // A page reload can help ensure a clean state
        window.location.reload();
      } catch (error) {
        logger.error("Full reset failed.", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  /**
   * Retries the Supabase sign-in process.
   */
  const handleRetry = async () => {
    setIsProcessing(true);
    logger.info("Manually retrying Supabase authentication.");
    try {
      await retry();
    } catch (error) {
      logger.error("Retry attempt failed.", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    // Don't show this component if the user isn't even logged into Clerk.
    return null;
  }

  return (
    <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-900 rounded-lg">
      <h3 className="font-medium text-orange-700 dark:text-orange-300">
        Authentication Recovery
      </h3>
      <p className="text-sm text-orange-600 dark:text-orange-400">
        If you&apos;ve forgotten your password or need to regain access to your
        account, please follow the steps below.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetry}
          disabled={isProcessing}
        >
          {isProcessing ? "Retrying..." : "Retry Connection"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleFullReset}
          disabled={isProcessing}
        >
          {isProcessing ? "Resetting..." : "Full Reset & Sign Out"}
        </Button>
      </div>
    </div>
  );
}
