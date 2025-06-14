# Clerk to Supabase User Sync

This webhook endpoint syncs user data between Clerk and your Supabase database.

## Setup Instructions

1. **Create a Clerk webhook**:

   - Go to the [Clerk Dashboard](https://dashboard.clerk.dev/)
   - Navigate to your application > Webhooks
   - Click "Add Endpoint"
   - Enter your webhook URL: `https://your-domain.com/api/clerk/webhook`
   - Select the following events:
     - `user.created`
     - `user.deleted`
   - Save the endpoint and copy the signing secret

2. **Add environment variables**:
   Add these to your `.env.local` file:

   ```
   CLERK_WEBHOOK_SECRET=your_webhook_signing_secret
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Deploy your application**:
   Make sure your application is deployed with these environment variables.

## How it works

### User Creation

When a new user signs up through Clerk, the webhook will:

1. Receive the user creation event
2. Verify the webhook signature
3. Extract user data (email, name, etc.)
4. Insert the user into your Supabase users table

### User Deletion

When a user is deleted from Clerk, the webhook will:

1. Receive the user deletion event
2. Find the user in your Supabase database by their Clerk ID
3. Delete all user-related data in this order:
   - Flashcards
   - Decks
   - Study sessions
   - User record
4. This ensures all user data is properly cleaned up

## Testing

To test locally:

1. Use a tool like [ngrok](https://ngrok.com/) to expose your local server
2. Set up a temporary webhook in the Clerk dashboard pointing to your ngrok URL
3. Create a test user and verify it appears in your Supabase users table
4. Delete the test user and verify all their data is removed from the database
