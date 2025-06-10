"use client";

import React, { useEffect } from "react";
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider";
import { supabaseLogger as logger } from "@/lib/utils/logger";

interface SupabaseErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A component that provides error handling for Supabase authentication issues.
 * Detects authentication errors and provides retry functionality.
 */
export default function SupabaseErrorBoundary({
  children,
  fallback,
}: SupabaseErrorBoundaryProps) {
  const { error, status, retry } = useSupabaseAuth();

  useEffect(() => {
    if (error) {
      logger.warn("Supabase authentication error detected", {
        context: { error },
      });
    }
  }, [error]);

  // Render the fallback UI if there's an error
  if (error && fallback) {
    return (
      <div className="supabase-error-container">
        {fallback}
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => retry()}
            disabled={status === "LOADING"}
          >
            {status === "LOADING" ? "Reconnecting..." : "Retry Connection"}
          </button>
        </div>
      </div>
    );
  }

  // If there's no error or no fallback provided, render the children
  return <>{children}</>;
}

/**
 * Default fallback component to show when Supabase authentication fails
 */
export function DefaultSupabaseErrorFallback() {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4">
      <div className="text-red-500 text-xl mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900">
        Database Connection Error
      </h3>
      <p className="text-gray-600 text-center">
        We&apos;re having trouble connecting to our database. This might be due
        to a temporary authentication issue. Please try again or contact support
        if the issue persists.
      </p>
    </div>
  );
}
