"use client";

import { useXp } from "@/hooks/use-xp";
import { Button } from "@/components/ui/button"; // Assuming you use Shadcn UI

export const XpAwardExample = () => {
  const { awardXp, isLoading, error } = useXp();

  const handleWatchVideo = () => {
    awardXp("VIDEO_WATCHED");
  };

  const handleCompleteFlashcards = () => {
    // In your real component, you'd check for the 80% score here
    awardXp("FLASHCARD_COMPLETED");
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="font-bold">XP System Demo</h3>
      <div className="flex gap-4">
        <Button onClick={handleWatchVideo} disabled={isLoading}>
          {isLoading ? "Processing..." : "Watch Video (+5 XP)"}
        </Button>
        <Button onClick={handleCompleteFlashcards} disabled={isLoading}>
          {isLoading ? "Processing..." : "Complete Flashcards (+10 XP)"}
        </Button>
      </div>
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
};
