import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
} from "@/lib/services/userSync";
import {
  ClerkWebhookEvent,
  EventType,
  UserData,
  DeletedUserData,
} from "@/types/clerk";
import { log } from "next-axiom";

// Ensure the webhook secret is set in the environment variables.
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  // This will cause the build to fail if the secret is not set, which is good.
  throw new Error(
    "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
  );
}

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    log.error("Error occurred -- no svix headers");
    return new NextResponse("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body.
  // Note: It's crucial to read the raw body as a string for signature verification.
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET!);

  // Type-guard to ensure the event is a WebhookEvent
  type WebhookEvent = ClerkWebhookEvent;

  let evt: WebhookEvent;
  try {
    // Verify the payload with the headers
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    // If the verification fails, log the error and return a 400.
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    log.error("Error verifying webhook", { error: errorMessage });
    return new NextResponse(`Error occurred: ${errorMessage}`, {
      status: 400,
    });
  }

  // The event is verified, now we can process it.
  // We cast the event to our custom type for better type-safety.
  const clerkEvent = evt as ClerkWebhookEvent;
  const eventType = clerkEvent.type as EventType;

  // Log the sanitized event payload for debugging.
  log.info("Received and verified Clerk webhook", {
    eventType: eventType,
    clerkId: clerkEvent.data.id,
  });

  try {
    // Route the event to the appropriate handler
    switch (eventType) {
      case "user.created":
        await syncUserCreation(clerkEvent.data as UserData);
        break;
      case "user.updated":
        await syncUserUpdate(clerkEvent.data as UserData);
        break;
      case "user.deleted":
        await syncUserDeletion(clerkEvent.data as DeletedUserData);
        break;
      default:
        // Log unhandled events for future consideration
        log.warn("Unhandled event type", { eventType });
    }
    return new NextResponse("Webhook processed successfully", { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    log.error("Error processing webhook", {
      eventType,
      error: errorMessage,
    });
    return new NextResponse(`Error occurred: ${errorMessage}`, { status: 500 });
  }
}
