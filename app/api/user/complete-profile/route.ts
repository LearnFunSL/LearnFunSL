import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { grade, language } = await req.json();

    if (!grade || !language) {
      return NextResponse.json(
        { error: "Grade and language are required" },
        { status: 400 },
      );
    }

    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        grade,
        language,
        onboarding_complete: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user metadata:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
