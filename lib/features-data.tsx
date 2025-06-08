import React from "react";
import {
  FileText,
  BookOpen,
  Video,
  MessageCircle,
  BarChart3,
  Users,
  Trophy,
  GraduationCap,
  CreditCard,
  Calendar,
  Globe,
  Search,
  Wifi,
  Target,
} from "lucide-react";

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: "available" | "coming";
  color: string;
}

export const features: Feature[] = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Past Papers",
    description:
      "Organized by subject, grade, term, year, and medium; searchable and downloadable",
    status: "available",
    color: "blue",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Textbooks",
    description:
      "Full PDFs, summaries, or chapter-wise notes for comprehensive study",
    status: "available",
    color: "green",
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Video Lessons",
    description:
      "Curated from YouTube; filtered for local curriculum relevance",
    status: "available",
    color: "red",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "AI Chatbot",
    description:
      "AI-based bot for subject help, career guidance, and motivation",
    status: "available",
    color: "purple",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Progress Tracker",
    description: "Dashboard to track chapter progress and learning milestones",
    status: "coming",
    color: "orange",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Peer Tutoring",
    description: "Student-led Q&A or mentorship for collaborative learning",
    status: "coming",
    color: "teal",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Gamification",
    description:
      "Points and badges for activities like solving quizzes or daily login",
    status: "coming",
    color: "yellow",
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Teacher Portal",
    description: "Secure content upload and validation by certified teachers",
    status: "coming",
    color: "indigo",
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Flash Cards",
    description: "Create, edit, delete, and manage decks and flashcards",
    status: "available",
    color: "pink",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Calendar",
    description: "Keep organized and planned with calendars and notes",
    status: "available",
    color: "cyan",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multilingual Content",
    description: "All resources and UI in Sinhala, Tamil, and English",
    status: "available",
    color: "emerald",
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Smart Search",
    description: "Fast search with filters by subject, grade, year, and medium",
    status: "available",
    color: "slate",
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    title: "Offline Mode",
    description: "Access key content even without internet connection",
    status: "coming",
    color: "stone",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Personalized Recommendations",
    description: "Smart suggestions based on progress and learning patterns",
    status: "coming",
    color: "rose",
  },
];

export const getColorClasses = (color: string, status: string) => {
  const baseColors: Record<string, string> = {
    blue:
      status === "available"
        ? "bg-blue-500 text-white"
        : "bg-blue-100 text-blue-600",
    green:
      status === "available"
        ? "bg-green-500 text-white"
        : "bg-green-100 text-green-600",
    red:
      status === "available"
        ? "bg-red-500 text-white"
        : "bg-red-100 text-red-600",
    purple:
      status === "available"
        ? "bg-purple-500 text-white"
        : "bg-purple-100 text-purple-600",
    orange:
      status === "available"
        ? "bg-orange-500 text-white"
        : "bg-orange-100 text-orange-600",
    teal:
      status === "available"
        ? "bg-teal-500 text-white"
        : "bg-teal-100 text-teal-600",
    yellow:
      status === "available"
        ? "bg-yellow-500 text-white"
        : "bg-yellow-100 text-yellow-600",
    indigo:
      status === "available"
        ? "bg-indigo-500 text-white"
        : "bg-indigo-100 text-indigo-600",
    pink:
      status === "available"
        ? "bg-pink-500 text-white"
        : "bg-pink-100 text-pink-600",
    cyan:
      status === "available"
        ? "bg-cyan-500 text-white"
        : "bg-cyan-100 text-cyan-600",
    emerald:
      status === "available"
        ? "bg-emerald-500 text-white"
        : "bg-emerald-100 text-emerald-600",
    slate:
      status === "available"
        ? "bg-slate-500 text-white"
        : "bg-slate-100 text-slate-600",
    stone:
      status === "available"
        ? "bg-stone-500 text-white"
        : "bg-stone-100 text-stone-600",
    rose:
      status === "available"
        ? "bg-rose-500 text-white"
        : "bg-rose-100 text-rose-600",
  };
  return baseColors[color] || "bg-gray-500 text-white";
};
