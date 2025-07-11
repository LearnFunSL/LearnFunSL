import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { QuickOverview } from "@/components/dashboard/quick-overview";
import { Database } from "@/types/database.types";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <DashboardLayout
        leaderboard={<Leaderboard />}
        quickOverview={<QuickOverview />}
      />
    </div>
  );
}
