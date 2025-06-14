// jest.setup.ts
// import 'whatwg-fetch'; // This was causing a conflict with NextRequest, removing it.

// A valid Base64-encoded string for testing. Corresponds to a 32-byte buffer.
const MOCK_WEBHOOK_SECRET_VALUE =
  "MfQWp8hB2uIsfPAAweH82e5rIafbVesJgG2T6dGvA7U=";

// Set up mock environment variables for the test suite
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_...";
process.env.CLERK_SECRET_KEY = "sk_test_...";
process.env.CLERK_WEBHOOK_SECRET = `whsec_${MOCK_WEBHOOK_SECRET_VALUE}`;

process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test_anon_key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test_service_role_key";
process.env.SUPABASE_JWT_SECRET = "test_jwt_secret";
