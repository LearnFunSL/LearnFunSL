"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "@clerk/nextjs";
import type {
  SupabaseClient,
  Session,
  AuthChangeEvent,
} from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  SupabaseAuthContextValue,
  SupabaseAuthStatus,
  AuthError,
} from "@/types/supabase";

const SupabaseAuthContext = createContext<SupabaseAuthContextValue | undefined>(
  undefined,
);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getToken, userId, isLoaded, isSignedIn } = useAuth();
  const [supabaseClient] = useState(() =>
    createSupabaseBrowserClient(getToken),
  );
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SupabaseAuthStatus>("LOADING");
  const [error, setError] = useState<AuthError | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // This function will sync the Clerk session to Supabase
  const syncClerkSession = useCallback(async () => {
    if (isLoaded && isSignedIn) {
      try {
        const token = await getToken({ template: "supabase" });
        if (!token) {
          throw new Error("Failed to get Supabase token from Clerk.");
        }

        const { error: sessionError } = await supabaseClient.auth.setSession({
          access_token: token,
          refresh_token: token, // Clerk tokens are short-lived, this is fine
        });

        if (sessionError) {
          throw sessionError;
        }
      } catch (e: any) {
        console.error("Error syncing Clerk session with Supabase:", e);
        setStatus("ERROR");
        setError(new AuthError("SESSION_SYNC_FAILED", e.message, e));
      }
    } else if (isLoaded && !isSignedIn) {
      // If user is signed out of Clerk, ensure they are signed out of Supabase
      await supabaseClient.auth.signOut();
    }
  }, [isLoaded, isSignedIn, getToken, supabaseClient]);

  // Effect to handle Supabase's internal auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        if (session) {
          setStatus("AUTHENTICATED");
        } else {
          setStatus("ANONYMOUS");
        }
        setIsInitialized(true);
      },
    );

    // Initial sync when the component mounts
    syncClerkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseClient, syncClerkSession]);

  const contextValue: SupabaseAuthContextValue = {
    supabaseClient,
    session,
    status,
    error,
    userId,
    clerkUserId: userId,
    isInitialized,
    signIn: async () => {}, // Handled by Clerk
    signOut: async () => {
      await supabaseClient.auth.signOut();
    },
    retry: syncClerkSession,
  };

  return (
    <SupabaseAuthContext.Provider value={contextValue}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = (): SupabaseAuthContextValue => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error(
      "useSupabaseAuth must be used within a SupabaseAuthProvider",
    );
  }
  return context;
};
