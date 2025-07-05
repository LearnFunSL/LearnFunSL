"use server";

import { currentUser } from "@clerk/nextjs/server";
import { getUserProfile } from "@/lib/supabase/userService";

export async function getCurrentUserXP() {
  try {
    const user = await currentUser();

    if (!user) {
      return { xp: 0 };
    }

    const userProfile = await getUserProfile(user.id);

    return { xp: userProfile?.xp_total ?? 0 };
  } catch (error) {
    console.error("Failed to fetch user XP:", error);
    return { xp: 0 };
  }
}
