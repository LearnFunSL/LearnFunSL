import { Metadata } from "next";
import DashboardShell from "@/components/ui/dashboard-shell";
import FlashcardManagerClient from "./flashcard-manager-client";

export const metadata: Metadata = {
  title: "Flashcards | LearnFun SL",
  description:
    "Create and study flashcards to help you learn and remember key concepts.",
};

export default function FlashcardsPage() {
  return (
    <DashboardShell>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Flashcards</h2>
            <p className="text-muted-foreground">
              Create and manage your flashcard decks for studying.
            </p>
          </div>
        </div>

        <div>
          <FlashcardManagerClient />
        </div>
      </div>
    </DashboardShell>
  );
}
