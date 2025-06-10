"use client";

import { useState } from "react";
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider";
import { useAuth } from "@clerk/nextjs";

// Start with a basic component without UI library components
export default function AuthDebug() {
  const { supabaseClient, status, error, retry, session } = useSupabaseAuth();
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const [authStatus, setAuthStatus] = useState<Record<string, any> | null>(
    null,
  );
  const [isChecking, setIsChecking] = useState(false);
  const [tokenResult, setTokenResult] = useState<any>(null);

  // Function to check auth status
  const checkAuth = async () => {
    setIsChecking(true);
    try {
      if (!supabaseClient) {
        setAuthStatus({ error: "Supabase client not available" });
        return;
      }

      const { data: sessionData, error: sessionError } =
        await supabaseClient.auth.getSession();
      const {
        data: { user: supabaseUser },
      } = await supabaseClient.auth.getUser();

      setAuthStatus({
        clerkIsLoaded: isLoaded,
        clerkIsSignedIn: isSignedIn,
        clerkUserId: userId,
        supabaseSession: sessionData,
        supabaseUser: supabaseUser,
        supabaseSessionError: sessionError?.message,
        providerSession: session,
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Function to manually test token fetch
  const testTokenFetch = async () => {
    setIsChecking(true);
    try {
      const token = await getToken({ template: "supabase" });
      setTokenResult({
        ok: !!token,
        token,
      });
    } catch (error: any) {
      setTokenResult({
        error: error.message,
        stack: error.stack,
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Using plain HTML elements instead of UI components
  return (
    <div className="p-4 mb-6 border rounded-lg bg-white dark:bg-gray-800">
      <div className="mb-3">
        <h3 className="text-lg font-medium">Authentication Status</h3>
        <div className="space-x-2 mt-2">
          <button
            onClick={checkAuth}
            disabled={isChecking}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {isChecking ? "Checking..." : "Check Status"}
          </button>
          <button
            onClick={testTokenFetch}
            disabled={isChecking || !isSignedIn}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Test Token
          </button>
          {error && (
            <button
              onClick={retry}
              disabled={isChecking}
              className="px-3 py-1 text-sm bg-amber-500 text-white rounded disabled:opacity-50"
            >
              Retry Auth
            </button>
          )}
        </div>
      </div>

      <div className="text-sm">
        <div>
          <span className="font-medium">Clerk Status:</span>{" "}
          {isLoaded ? "Loaded" : "Loading"}
        </div>
        <div>
          <span className="font-medium">User Logged In:</span>{" "}
          {isSignedIn ? `Yes (${userId})` : "No"}
        </div>
        <div>
          <span className="font-medium">Supabase Provider Status:</span>{" "}
          {status}
        </div>
        {error && (
          <div className="text-red-500">
            <span className="font-medium">Error:</span> {error.message}
          </div>
        )}
      </div>

      {authStatus && (
        <div className="mt-3">
          <h4 className="text-sm font-medium">Auth Status:</h4>
          <div className="p-2 mt-1 bg-gray-100 dark:bg-gray-700 rounded overflow-auto max-h-48 text-xs">
            <pre>{JSON.stringify(authStatus, null, 2)}</pre>
          </div>
        </div>
      )}

      {tokenResult && (
        <div className="mt-3">
          <h4 className="text-sm font-medium">Token Result:</h4>
          <div className="p-2 mt-1 bg-gray-100 dark:bg-gray-700 rounded overflow-auto max-h-48 text-xs">
            <pre>{JSON.stringify(tokenResult, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
