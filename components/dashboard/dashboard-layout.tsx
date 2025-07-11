"use client";

import { LearningProgress } from "./learning-progress";
import { StudyHistory } from "./study-history";
import { GamificationSummary } from "./gamification-summary";
import { DailyGoals } from "./daily-goals";
import { ProgressChart } from "./progress-chart";
import { UserProfileCard } from "./user-profile-card";

interface DashboardLayoutProps {
  leaderboard: React.ReactNode;
  quickOverview: React.ReactNode;
}

export function DashboardLayout({
  leaderboard,
  quickOverview,
}: DashboardLayoutProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>

      <ProgressChart />

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {quickOverview}
          <GamificationSummary />
          <StudyHistory />
          <UserProfileCard />
        </div>
        <div className="space-y-8">
          <LearningProgress />
          <DailyGoals />
          {leaderboard}
        </div>
      </div>
    </div>
  );
}
