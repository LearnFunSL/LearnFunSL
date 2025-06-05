import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  GEMINI_API_KEY_1: z.string().min(1).optional(), // Optional if using single key or other rotation
  GEMINI_API_KEY_2: z.string().min(1).optional(), // Optional
  // GEMINI_API_KEY: z.string().min(1).optional(), // Alternative single key
  PINECONE_API_KEY: z.string().min(1),
  PINECONE_ENVIRONMENT: z.string().min(1),
  PINECONE_INDEX_NAME: z.string().min(1),
  GOOGLE_DRIVE_API_KEY: z.string().optional(),
  GOOGLE_DRIVE_FOLDER_ID: z.string().optional(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().min(1),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(), // Optional if not using PostHog
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(), // Optional
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g. middlewares)
 * So you have to destructure manually here.
 * @type {Record<keyof z.infer<typeof serverSchema> | keyof z.infer<typeof clientSchema>, string | undefined>}
 */
const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  GEMINI_API_KEY_1: process.env.GEMINI_API_KEY_1,
  GEMINI_API_KEY_2: process.env.GEMINI_API_KEY_2,
  // GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
  PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME,
  GOOGLE_DRIVE_API_KEY: process.env.GOOGLE_DRIVE_API_KEY,
  GOOGLE_DRIVE_FOLDER_ID: process.env.GOOGLE_DRIVE_FOLDER_ID,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
};

// Merge all schemas
const merged = serverSchema.merge(clientSchema);
type MergedInput = z.input<typeof merged>;
type MergedOutput = z.output<typeof merged>;
type MergedSafeParseReturn = z.SafeParseReturnType<MergedInput, MergedOutput>;

let env: MergedOutput;

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const parsed: MergedSafeParseReturn = merged.safeParse(processEnv);

  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    );
    throw new Error('Invalid environment variables');
  }

  env = parsed.data;
} else {
  // Fallback for Vercel build if SKIP_ENV_VALIDATION is set
  // This is not ideal, ensure Vercel has all env vars set
  env = processEnv as MergedOutput;
}


export { env };
