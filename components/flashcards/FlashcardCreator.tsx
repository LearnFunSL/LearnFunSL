"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Bot, Loader2, CheckCircle } from "lucide-react";
import { useCreateDeck, useCreateFlashcard } from "@/hooks/queries";
import { Toaster, toast } from "sonner";

interface FlashcardInput {
  id: number;
  front: string;
  back: string;
  position: number;
}

export default function FlashcardCreator() {
  const [deckName, setDeckName] = useState("");
  const [subject, setSubject] = useState("");
  const [cards, setCards] = useState<FlashcardInput[]>([
    { id: 1, front: "", back: "", position: 1 },
  ]);
  const nextId = useRef(2);
  const router = useRouter();

  const createDeckMutation = useCreateDeck();
  const createFlashcardMutation = useCreateFlashcard();

  const handleCardChange = (
    id: number,
    side: "front" | "back",
    value: string,
  ) => {
    setCards(
      cards.map((card) => (card.id === id ? { ...card, [side]: value } : card)),
    );
  };

  const addCard = () => {
    setCards([
      ...cards,
      { id: nextId.current++, front: "", back: "", position: cards.length + 1 },
    ]);
  };

  const removeCard = (id: number) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const handleSubmit = async () => {
    if (!deckName.trim()) {
      toast.error("Deck name is required.");
      return;
    }
    if (cards.some((c) => !c.front.trim() || !c.back.trim())) {
      toast.error("All flashcards must have both front and back content.");
      return;
    }

    try {
      const newDeck = await createDeckMutation.mutateAsync({
        name: deckName,
        subject: subject || null,
        tags: [], // Add tag functionality later if needed
      });

      if (newDeck) {
        for (const card of cards) {
          await createFlashcardMutation.mutateAsync({
            deck_id: newDeck.id,
            front: card.front,
            back: card.back,
            position: card.position,
          });
        }
      }

      toast.success("Deck created successfully!");

      setTimeout(() => {
        router.push(`/flashcards`); // Redirect to the main decks page
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to create deck: ${errorMessage}`);
    }
  };

  const isCreating =
    createDeckMutation.isPending || createFlashcardMutation.isPending;

  const renderTextarea = (card: FlashcardInput, side: "front" | "back") => (
    <div className="relative">
      <textarea
        value={card[side]}
        onChange={(e) => handleCardChange(card.id, side, e.target.value)}
        placeholder={`Enter ${side} content...`}
        className="w-full h-40 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none transition"
        maxLength={500}
      />
      <span className="absolute bottom-2 right-2 text-xs text-gray-400">
        {card[side].length} / 500
      </span>
    </div>
  );

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Deck
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Create a new deck and add your flashcards.
            </p>
          </header>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Deck Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Deck Name (e.g., 'Chapter 1: The Cell')"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <input
                type="text"
                placeholder="Subject (Optional, e.g., 'Biology')"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-6">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-blue-500">
                    Card {index + 1}
                  </span>
                  {cards.length > 1 && (
                    <button
                      onClick={() => removeCard(card.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderTextarea(card, "front")}
                  {renderTextarea(card, "back")}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={addCard}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <Plus size={20} />
              Add another card
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCreating}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isCreating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Create Deck
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
