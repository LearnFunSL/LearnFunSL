import { Webhook } from "svix";
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

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  throw new Error(
    "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
  );
}

async function handler(req: NextRequest) {
  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    log.error("Missing svix headers");
    return new NextResponse("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET!);

  let evt: ClerkWebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    const error = err as Error;
    log.error("Error verifying webhook", { error: error.message });
    return new NextResponse(`Error occurred: ${error.message}`, {
      status: 400,
    });
  }

  const eventType = evt.type as EventType;

  try {
    switch (eventType) {
      case "user.created":
        await syncUserCreation(evt.data as UserData);
        break;
      case "user.updated":
        await syncUserUpdate(evt.data as UserData);
        break;
      case "user.deleted":
        await syncUserDeletion(evt.data as DeletedUserData);
        break;
      default:
        log.warn("Unhandled event type", { eventType });
    }
    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    const err = error as Error;
    log.error("Error processing webhook", { eventType, error: err.message });
    return new NextResponse(`Error occurred: ${err.message}`, { status: 500 });
  }
}

export { handler as POST };
