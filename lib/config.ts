import "dotenv/config";

// Define a type for the expected environment variables.
// This can be expanded with more variables as your application grows.
interface EnvConfig {
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string;
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: string;

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_JWT_SECRET: string;
}

// Function to get and validate an environment variable.
function getEnvVar(key: keyof EnvConfig, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

// Validate and export all environment variables.
// This ensures that your application has access to all necessary
// configuration at runtime and fails early if something is missing.
export const config: EnvConfig = {
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: getEnvVar(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  ),
  CLERK_SECRET_KEY: getEnvVar(
    "CLERK_SECRET_KEY",
    "dummy-clerk-secret-for-build",
  ),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: getEnvVar(
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
    "/sign-in",
  ),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: getEnvVar(
    "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
    "/sign-up",
  ),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: getEnvVar(
    "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL",
    "/",
  ),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: getEnvVar(
    "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL",
    "/",
  ),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: getEnvVar(
    "SUPABASE_SERVICE_ROLE_KEY",
    "dummy-supabase-service-role-for-build",
  ),
  SUPABASE_JWT_SECRET: getEnvVar(
    "SUPABASE_JWT_SECRET",
    "dummy-supabase-jwt-secret-for-build",
  ),
};
