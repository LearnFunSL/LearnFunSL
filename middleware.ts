import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define routes that should be protected
const isProtectedRoute = createRouteMatcher([
  "/api/chat/gemini(.*)", // Protect the chat API. Add other API routes needing protection.
  // Add any other specific pages that MUST be protected at middleware level, e.g., '/settings', '/dashboard'
]);

export default clerkMiddleware((auth, req) => {
  // Check if protected route
  if (isProtectedRoute(req)) {
    // Protect the route - redirects to sign-in if not authenticated
    auth.protect();
  }

  // For debugging only - not required for functionality
  const response = NextResponse.next();

  // Routes not matched by isProtectedRoute are implicitly public
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
