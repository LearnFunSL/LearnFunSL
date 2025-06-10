"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { useFlashcards } from "@/hooks/use-flashcards";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardManagerProps {
  deckId: string;
}

export default function CardManager({ deckId }: CardManagerProps) {
  const router = useRouter();
  const { decks, isLoadingDecks } = useFlashcards();
  const [exists, setExists] = useState<boolean | null>(null);

  // Check if the deck exists
  useEffect(() => {
    if (!isLoadingDecks) {
      const deckExists = decks.some((deck) => deck.id === deckId);
      setExists(deckExists);
    }
  }, [decks, isLoadingDecks, deckId]);

  // Loading state
  if (isLoadingDecks || exists === null) {
    return (
      <DashboardShell>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-3">Loading...</span>
        </div>
      </DashboardShell>
    );
  }

  // Deck not found
  if (exists === false) {
    return (
      <DashboardShell>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-red-500 text-xl mb-4">Deck not found</div>
          <Button onClick={() => router.push("/flashcards")}>
            Return to Decks
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        {/* The content for managing cards in a deck will go here. */}
        <p>Card management for deck {deckId} will be implemented here.</p>
      </div>
    </DashboardShell>
  );
}
