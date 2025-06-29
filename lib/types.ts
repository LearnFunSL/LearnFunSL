// This file can be expanded with more specific types as we integrate with Supabase.

export interface SubjectProgress {
  subject: string;
  progress: number;
  color?: string; // Optional color for UI elements
}

export interface StudyHistoryItem {
  type: "video" | "paper" | "flashcard";
  title: string;
  timestamp: string; // ISO 8601 date string
}

export interface Badge {
  name: string;
  description: string;
  iconUrl?: string;
}

export interface UserDashboardData {
  dailyStreak: number;
  xpPoints: number;
  level: number;
  nextRecommendedContent: string;
  learningProgress: SubjectProgress[];
  studyHistory: StudyHistoryItem[];
  unlockedBadges: Badge[];
}
