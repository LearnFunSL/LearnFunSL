import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response("Missing webhook secret", { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
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

  try {
    switch (type) {
      case "user.created":
        // Generate a UUID for the new user
        const supabaseId = uuidv4();
        await (
          await clerkClient()
        ).users.updateUser(data.id, {
          publicMetadata: {
            ...data.public_metadata,
            supabase_id: supabaseId,
          },
        });
        console.log(
          `User created: ${data.id} - Generated Supabase UUID: ${supabaseId}`,
        );
        return NextResponse.json({
          success: true,
          message: "User UUID generated and saved.",
        });

      case "user.updated":
        // Check if user already has supabase_id, if not, create one
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(data.id);

        if (!user.publicMetadata.supabase_id) {
          const newSupabaseId = uuidv4();
          await clerk.users.updateUser(data.id, {
            publicMetadata: {
              ...user.publicMetadata,
              supabase_id: newSupabaseId,
            },
          });
          console.log(
            `User updated: ${data.id} - Generated missing Supabase UUID: ${newSupabaseId}`,
          );
        }
        return NextResponse.json({
          success: true,
          message: "User updated, UUID verified.",
        });

      default:
        console.log(`Unhandled webhook event type: ${type}`);
        return NextResponse.json({
          message: "Webhook received but not handled.",
        });
    }
  } catch (error) {
    console.error(`Error processing ${type} webhook:`, error);
    return new Response(
      `Error processing webhook: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 },
    );
  }
}
