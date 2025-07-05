import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server"; // Changed from auth to getAuth

// This route is the redirect_uri for OAuth providers.
// Clerk's middleware is expected to intercept requests to this path,
// handle the OAuth callback (e.g., exchange authorization code for tokens),
// set the appropriate session cookies, and then redirect the user.
// The final redirection destination is typically governed by 'redirectUrlComplete'
// passed to 'authenticateWithRedirect', or 'afterSignInUrl'/'afterSignUpUrl'
// configured in Clerk settings or environment variables.

export async function GET(request: NextRequest) {
  const { userId, sessionClaims } = getAuth(request); // Use getAuth(request)

  // This log will appear in your server console (e.g., Vercel logs or local dev terminal)
  if (userId) {
    console.log(
      `SSO Callback: User ID [${userId}] found via getAuth. Session claims:`,
      sessionClaims,
    );
  } else {
    console.warn(
      "SSO Callback: No userId found via getAuth(). This is unexpected if OAuth was successful with the provider.",
    );
  }

  const redirectUrlComplete = new URL("/", request.url);
  return NextResponse.redirect(redirectUrlComplete);
}
