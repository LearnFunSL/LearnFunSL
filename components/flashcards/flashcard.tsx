"use client";

import { useState } from "react";
import { Card } from "@/types/flashcards";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  card: Card;
  isActive?: boolean;
  onCorrect?: () => void;
  onIncorrect?: () => void;
}

export default function Flashcard({
  card,
  isActive = true,
  onCorrect,
  onIncorrect,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleFlip = () => {
    if (!isActive || isAnswered) return;
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    if (!isActive || !isFlipped || isAnswered) return;

    setIsAnswered(true);
    if (correct) {
      onCorrect?.();
    } else {
      onIncorrect?.();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000 h-72">
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer select-none",
          isFlipped ? "rotate-y-180" : "",
        )}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-center",
            isFlipped && "pointer-events-none",
          )}
        >
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Question</h3>
            <div className="text-xl">{card.front_text}</div>
          </div>

          <div className="absolute bottom-2 left-2 text-xs text-gray-400">
            Tap to flip
          </div>

          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {card.difficulty_level === 1 && "Easy"}
            {card.difficulty_level === 2 && "Medium"}
            {card.difficulty_level === 3 && "Hard"}
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between rotate-y-180",
            !isFlipped && "pointer-events-none",
          )}
        >
          <div className="text-center flex-1 flex flex-col justify-center">
            <h3 className="text-lg font-medium mb-2">Answer</h3>
            <div className="text-xl">{card.back_text}</div>
          </div>

          {!isAnswered && isActive && (
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring"
              >
                Incorrect
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(true);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring"
              >
                Correct
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
