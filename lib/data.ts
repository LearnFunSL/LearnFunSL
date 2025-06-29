// Mock data for dashboard development. This will be replaced by API calls to Supabase.
import type { UserDashboardData } from "./types";

export const mockDashboardData: UserDashboardData = {
  dailyStreak: 5,
  xpPoints: 1250,
  level: 12,
  nextRecommendedContent: "Introduction to Algebra",
  learningProgress: [
    { subject: "Mathematics", progress: 75, color: "bg-blue-500" },
    { subject: "Science", progress: 60, color: "bg-green-500" },
    { subject: "History", progress: 45, color: "bg-yellow-500" },
  ],
  studyHistory: [
    {
      type: "video",
      title: "Calculus Fundamentals",
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      type: "paper",
      title: "2021 Physics Paper",
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      type: "video",
      title: "Sri Lankan History: Part 1",
      timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ],
  unlockedBadges: [
    {
      name: "Perfect Week",
      description: "Completed lessons every day for a week.",
    },
    { name: "Math Whiz", description: "Mastered 10 math topics." },
    {
      name: "Quick Learner",
      description: "Finished a course in under 3 days.",
    },
  ],
};
