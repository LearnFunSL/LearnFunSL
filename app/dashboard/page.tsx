import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/client";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Database } from "@/types/database.types";

export default async function DashboardPage() {
  const { userId } = await auth();

  let totalXp = 0;

  if (userId) {
    try {
      const supabase = await createAdminClient();

      const { data, error } = await supabase
        .from("users")
        .select("xp_total")
        .eq("clerk_id", userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user XP:", error.message);
      } else {
        totalXp = data?.xp_total ?? 0;
      }
    } catch (error) {
      console.error("Error creating authenticated Supabase client:", error);
    }
  }

  return (
    <div className="p-4 md:p-8">
      <DashboardLayout totalXp={totalXp} />
    </div>
  );
}
