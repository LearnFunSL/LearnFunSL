"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useDeck } from "@/hooks/queries";
import StudyMode from "@/components/flashcards/StudyMode";
import { Loader2 } from "lucide-react";

export default function StudyPage() {
  const params = useParams();
  const { deckId } = params as { deckId: string };

  const { data: deck, isLoading, isError } = useDeck(deckId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold">Loading Deck...</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4 text-red-500">
          Error loading deck
        </h2>
        <p className="text-gray-600 mb-8">
          Could not fetch the deck data. Please try again.
        </p>
        <Link href="/flashcards" className="text-blue-500 hover:underline">
          Return to decks
        </Link>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Deck not found</h2>
        <Link href="/flashcards" className="text-blue-500 hover:underline">
          Return to decks
        </Link>
      </div>
    );
  }

  if (!deck.flashcards || deck.flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">This deck has no cards</h2>
        <p className="text-gray-600 mb-8">
          Add some cards before you can study this deck.
        </p>
        <Link href="/flashcards" className="text-blue-500 hover:underline">
          Return to decks
        </Link>
      </div>
    );
  }

  // The 'deck' object from useDeck now includes flashcards
  return <StudyMode deck={deck} />;
}
