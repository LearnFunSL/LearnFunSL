import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { QuickOverviewClient } from "./quick-overview-client";

export async function QuickOverview() {
  const supabase = createSupabaseServerClient();
  const { userId } = await auth();

  let initialXp = 0;
  if (userId) {
    const { data, error } = await supabase
      .from("users")
      .select("xp_total")
      .eq("clerk_id", userId)
      .single();

    if (error) {
      console.error(
        "Error fetching initial user XP for overview:",
        error.message,
      );
    } else if (data) {
      initialXp = data.xp_total;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <QuickOverviewClient initialXp={initialXp} />
      </CardContent>
    </Card>
  );
}
