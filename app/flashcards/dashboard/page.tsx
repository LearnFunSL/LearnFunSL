import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProgressDashboard } from "@/components/flashcards/progress-dashboard";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    // Or redirect to login
    return notFound();
  }

  const supabase = await createClient();

  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Here you would also fetch recent decks, etc.

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Progress</h1>
      <ProgressDashboard userProgress={progress} />
    </div>
  );
}
