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
    // In a production app, you'd want to log this to a dedicated service
    return { xp: 0 };
  }
}
