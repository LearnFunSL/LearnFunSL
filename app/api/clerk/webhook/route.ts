import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase admin client (uses service role for direct DB access)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function POST(req: Request) {
  // Get the webhook signature from the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, return 400
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the webhook body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify the webhook signature
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
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

  // Handle the webhook event
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      created_at,
      last_sign_in_at,
      public_metadata,
    } = evt.data;

    // Extract the primary email
    const primaryEmail =
      email_addresses && email_addresses.length > 0
        ? email_addresses[0].email_address
        : null;

    // Combine first and last name for the name field
    const fullName = [first_name, last_name].filter(Boolean).join(" ") || null;

    // Extract custom attributes from public metadata
    const gradeString = (public_metadata?.grade as string) || null;
    const preferred_language = (public_metadata?.language as string) || null;

    let grade: number | null = null;
    if (gradeString) {
      const parsedGrade = parseInt(gradeString, 10);
      if (!isNaN(parsedGrade)) {
        grade = parsedGrade;
      }
    }

    try {
      // Upsert the user in the Supabase users table
      const { error } = await supabaseAdmin.from("users").upsert(
        {
          clerk_id: id,
          email: primaryEmail,
          name: fullName,
          grade: grade,
          preferred_language: preferred_language,
          created_at: created_at
            ? new Date(created_at).toISOString()
            : new Date().toISOString(),
          last_active: last_sign_in_at
            ? new Date(last_sign_in_at).toISOString()
            : new Date().toISOString(),
        },
        { onConflict: "clerk_id" },
      );

      if (error) {
        console.error("Error upserting user in Supabase:", error);
        return NextResponse.json(
          { error: "Failed to create/update user in database" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "User created/updated in Supabase",
      });
    } catch (error) {
      console.error("Error processing user creation/update:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  } else if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // First, find the user in Supabase to get their ID
      const { data: userData, error: userError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("clerk_id", id)
        .single();

      if (userError || !userData) {
        console.error("Error finding user in Supabase:", userError);
        return NextResponse.json(
          { error: "User not found in database" },
          { status: 404 },
        );
      }

      const userId = userData.id;

      // Delete all user's flashcards
      const { error: flashcardsError } = await supabaseAdmin
        .from("flashcards")
        .delete()
        .eq("user_id", userId);

      if (flashcardsError) {
        console.error("Error deleting user flashcards:", flashcardsError);
        // Continue with user deletion even if flashcard deletion fails
      }

      // Delete all user's decks
      const { error: decksError } = await supabaseAdmin
        .from("decks")
        .delete()
        .eq("user_id", userId);

      if (decksError) {
        console.error("Error deleting user decks:", decksError);
        // Continue with user deletion even if deck deletion fails
      }

      // Delete all user's study sessions
      const { error: sessionsError } = await supabaseAdmin
        .from("study_sessions")
        .delete()
        .eq("user_id", userId);

      if (sessionsError) {
        console.error("Error deleting user study sessions:", sessionsError);
        // Continue with user deletion even if session deletion fails
      }

      // Finally, delete the user
      const { error: deleteError } = await supabaseAdmin
        .from("users")
        .delete()
        .eq("id", userId);

      if (deleteError) {
        console.error("Error deleting user from Supabase:", deleteError);
        return NextResponse.json(
          { error: "Failed to delete user from database" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "User and all associated data deleted from Supabase",
      });
    } catch (error) {
      console.error("Error processing user deletion:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }

  // Return a 200 response for other event types
  return NextResponse.json({ success: true, message: "Webhook received" });
}
