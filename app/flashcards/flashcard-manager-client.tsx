"use client";

import { useState } from "react";
import DeckManager from "@/components/flashcards/deck-manager";
import StudySession from "@/components/flashcards/study-session";
import { Deck } from "@/types/flashcards";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AuthDebug from "@/components/debug-auth";
import { useUser } from "@clerk/nextjs";

export default function FlashcardManagerClient() {
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const { isSignedIn, user } = useUser();

  // Handle deck selection for studying
  const handleDeckSelect = (deck: Deck) => {
    setSelectedDeck(deck);
  };

  // Return to deck list
  const handleCloseDeck = () => {
    setSelectedDeck(null);
  };

  // Show auth debug in development environment
  const showDebug = process.env.NODE_ENV === "development";

  // Show study session if a deck is selected, otherwise show deck manager
  if (selectedDeck) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={handleCloseDeck}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Decks
          </Button>
        </div>

        <div className="flex-grow">
          <StudySession deck={selectedDeck} onClose={handleCloseDeck} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {showDebug && <AuthDebug />}

      {!isSignedIn && (
        <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
          <p className="font-medium">You need to sign in</p>
          <p className="text-sm">
            Please sign in to create and manage flashcard decks.
          </p>
        </div>
      )}

      <DeckManager onSelectDeck={handleDeckSelect} />
    </div>
  );
}
