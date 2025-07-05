import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Define XP values for different events
const XP_VALUES = {
  VIDEO_WATCHED: 5,
  FLASHCARD_COMPLETED: 10,
};

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { event } = await request.json();

    if (!event || !Object.keys(XP_VALUES).includes(event)) {
      return new NextResponse("Invalid event type", { status: 400 });
    }

    const xpToAward = XP_VALUES[event as keyof typeof XP_VALUES];

    // Get the Supabase user UUID from the Clerk user ID
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError) {
      console.error("Error fetching Supabase user:", userError);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
    if (!user) {
      // This case might happen if the webhook for user creation hasn't processed yet.
      // You might want to handle this more gracefully, e.g., by retrying.
      return new NextResponse("User not found in Supabase", { status: 404 });
    }

    const { error: rpcError } = await supabase.rpc("award_xp", {
      p_user_id: user.id, // Use the Supabase user ID (UUID)
      p_event_type: event,
      p_xp_to_award: xpToAward,
    });

    if (rpcError) {
      console.error("Supabase error awarding XP:", rpcError);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    console.log(
      `Awarding ${xpToAward} XP to user ${userId} for event ${event}`,
    );
    return NextResponse.json({ success: true, xpAwarded: xpToAward });
  } catch (error) {
    console.error("Error in award XP API:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
