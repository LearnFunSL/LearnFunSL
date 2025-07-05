import { useState } from "react";

// Define the valid event types
type XpEventType = "VIDEO_WATCHED" | "FLASHCARD_COMPLETED";

export const useXp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const awardXp = async (eventType: XpEventType) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/xp/award", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventType }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to award XP");
      }

      const result = await response.json();
      console.log("XP Awarded:", result);
      // Optionally, you can trigger a state update here to refresh user data
      // e.g., using SWR's mutate function or a context update.
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { awardXp, isLoading, error };
};
