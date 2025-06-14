"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client"; // Assuming a client-side supabase client creator exists

// Define the types for the props
interface Deck {
  id: string;
  name: string;
  // Add other deck properties as needed
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  // Add other flashcard properties as needed
}

interface StudySessionProps {
  deck: Deck;
  onClose: () => void;
}

export default function StudySession({ deck, onClose }: StudySessionProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchFlashcards = async () => {
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("deck_id", deck.id);

      if (error) {
        console.error("Error fetching flashcards:", error);
      } else {
        setFlashcards(data || []);
      }
    };

    fetchFlashcards();
  }, [deck.id, supabase]);

  if (flashcards.length === 0) {
    return <div>Loading flashcards...</div>;
  }

  const currentCard = flashcards[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        className="relative w-full max-w-lg h-64 bg-white rounded-lg shadow-lg cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`absolute w-full h-full backface-hidden transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of the card */}
          <div className="absolute w-full h-full flex items-center justify-center p-4">
            <p className="text-xl">{currentCard.front}</p>
          </div>

          {/* Back of the card */}
          <div className="absolute w-full h-full flex items-center justify-center p-4 bg-gray-100 rotate-y-180">
            <p className="text-xl">{currentCard.back}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleNextCard}
          className="px-4 py-2 mr-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Next Card
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close Session
        </button>
      </div>
    </div>
  );
}
