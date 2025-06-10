import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Missing webhook secret", { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  const { type, data } = evt;

  switch (type) {
    case "user.created":
      // Generate a UUID for the new user
      try {
        const supabaseId = uuidv4();
        await (
          await clerkClient()
        ).users.updateUser(data.id, {
          publicMetadata: {
            ...data.public_metadata,
            supabase_id: supabaseId,
            // If this is an admin user, add the role too
            // role: data.email_addresses[0]?.email_address === 'admin@example.com' ? 'admin' : 'user',
          },
        });
        return NextResponse.json({ message: "User UUID generated and saved." });
      } catch (error) {
        console.error("Error setting user UUID:", error);
        return new Response("Error setting user UUID", { status: 500 });
      }

    default:
      return NextResponse.json({
        message: "Webhook received but not handled.",
      });
  }
}
