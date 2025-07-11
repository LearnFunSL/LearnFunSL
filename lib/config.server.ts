// Validate and export all environment variables.
// This ensures that your application has access to all necessary
// configuration at runtime and fails early if something is missing.

// Clerk
if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  );
}
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("Missing environment variable: CLERK_SECRET_KEY");
}

// Supabase
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY");
}
if (!process.env.SUPABASE_JWT_SECRET) {
  throw new Error("Missing environment variable: SUPABASE_JWT_SECRET");
}

export const config = {
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL:
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in",
  NEXT_PUBLIC_CLERK_SIGN_UP_URL:
    process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up",
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ?? "/",
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ?? "/",

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
} as const;
