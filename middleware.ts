import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that should be protected
const isProtectedRoute = createRouteMatcher([
  '/api/chat/gemini(.*)', // Protect the chat API. Add other API routes needing protection.
  // Add any other specific pages that MUST be protected at middleware level, e.g., '/settings', '/dashboard'
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth.protect(); // Call protect directly on the auth object for protected routes
  }
  // Routes not matched by isProtectedRoute (like '/ai-help', '/') are implicitly public here.
  // Clerk's own /sign-in, /sign-up routes are handled automatically.
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
