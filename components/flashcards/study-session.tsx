"use client";

import { useState, useEffect } from "react";
import { useFlashcards } from "@/hooks/use-flashcards";
import type { Card, Deck } from "@/types/flashcards";
import Flashcard from "./flashcard";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle,
} from "lucide-react";

interface StudySessionProps {
  deck: Deck;
  onClose: () => void;
}

export default function StudySession({ deck, onClose }: StudySessionProps) {
  const { getCardsByDeckId, updateCardProgress, isLoadingCards } =
    useFlashcards();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load cards for this deck
  useEffect(() => {
    const loadCards = async () => {
      try {
        setIsLoading(true);
        const deckCards = await getCardsByDeckId(deck.id);
        setCards(deckCards);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load flashcards");
      }
    };

    loadCards();
  }, [deck.id, getCardsByDeckId]);

  // Handle marking current card as correct
  const handleCorrect = async () => {
    if (currentIndex >= cards.length) return;

    await updateCardProgress(cards[currentIndex].id, true);
    setCorrectCount((prev) => prev + 1);

    // Move to next card or complete session
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Handle marking current card as incorrect
  const handleIncorrect = async () => {
    if (currentIndex >= cards.length) return;

    await updateCardProgress(cards[currentIndex].id, false);

    // Move to next card or complete session
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Navigate to previous card
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Navigate to next card
  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Restart the study session
  const handleRestart = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsCompleted(false);
  };

  // Loading state
  if (isLoading || isLoadingCards) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading flashcards...</p>
      </div>
    );
  }

  // Empty state - no cards in the deck
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-amber-500 text-5xl mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-16 h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2">No flashcards found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This deck doesn&apos;t have any flashcards yet. Add some cards to
          start studying!
        </p>
        <Button onClick={onClose}>Back to Decks</Button>
      </div>
    );
  }

  // Completed state
  if (isCompleted) {
    const accuracy =
      cards.length > 0 ? Math.round((correctCount / cards.length) * 100) : 0;

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-green-500 text-5xl mb-4">
          <CheckCircle className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-2xl font-medium mb-2">Session Complete!</h3>
        <p className="text-gray-600 mb-2">
          You completed {cards.length} flashcards with {accuracy}% accuracy.
        </p>

        <div className="w-full max-w-md mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Accuracy</span>
            <span>{accuracy}%</span>
          </div>
          <Progress value={accuracy} className="h-2" />
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={handleRestart}
            variant="outline"
            className="flex items-center"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Study Again
          </Button>
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    );
  }

  // Active study session
  const currentCard = cards[currentIndex];
  const progress =
    cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Studying: {deck.name}</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <Flashcard
          card={currentCard}
          isActive={true}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="flex items-center"
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
