"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import {
  useDeck,
  useUpdateDeck,
  useCreateFlashcard,
  useFlashcards,
  useUpdateFlashcard,
} from "@/hooks/queries";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface FlashcardInput {
  id: string | number;
  front: string;
  back: string;
  position: number;
  isNew?: boolean;
}

export default function DeckEditor({ deckId }: { deckId: string }) {
  const [deckName, setDeckName] = useState("");
  const [subject, setSubject] = useState("");
  const [cards, setCards] = useState<FlashcardInput[]>([]);
  const nextId = useRef(1);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch deck and flashcards data
  const { data: deck, isLoading: isDeckLoading } = useDeck(deckId);
  const { data: flashcards, isLoading: isFlashcardsLoading } =
    useFlashcards(deckId);

  const updateDeckMutation = useUpdateDeck();
  const createFlashcardMutation = useCreateFlashcard();
  const updateFlashcardMutation = useUpdateFlashcard();

  // Initialize form with deck data when loaded
  useEffect(() => {
    if (deck) {
      console.log("Deck data loaded:", deck);
      setDeckName(deck.name || "");
      setSubject(deck.subject || "");
    }
  }, [deck]);

  const addCard = useCallback(() => {
    const newCard = {
      id: `new-${nextId.current}`,
      front: "",
      back: "",
      position: nextId.current,
      isNew: true,
    };
    setCards((prevCards) => [...prevCards, newCard]);
    nextId.current += 1;
  }, []);

  // Initialize cards with flashcards data when loaded
  useEffect(() => {
    if (flashcards) {
      console.log(
        "Flashcards data loaded:",
        JSON.stringify(flashcards, null, 2),
      );
      const initialCards = flashcards.map((card) => ({
        id: card.id,
        front: card.front || "",
        back: card.back || "",
        position: card.position || 0,
      }));
      setCards(initialCards);
      console.log(
        "Initial cards state:",
        JSON.stringify(initialCards, null, 2),
      );

      if (flashcards.length > 0) {
        nextId.current =
          Math.max(...flashcards.map((card) => Number(card.position) || 0)) + 1;
      } else {
        addCard(); // Add an initial empty card if there are none
      }
    }
  }, [flashcards, addCard]);

  const handleCardChange = (
    id: string | number,
    side: "front" | "back",
    value: string,
  ) => {
    setCards((currentCards) => {
      const newCards = currentCards.map((card) =>
        card.id === id ? { ...card, [side]: value } : card,
      );
      console.log(`Card ${id} ${side} changed:`, value);
      console.log("Updated cards state:", JSON.stringify(newCards, null, 2));
      return newCards;
    });
  };

  const removeCard = (id: string | number) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const handleSubmit = async () => {
    if (!deckName.trim()) {
      toast({
        title: "Error",
        description: "Deck name is required.",
        variant: "destructive",
      });
      return;
    }

    if (cards.some((c) => !c.front.trim() || !c.back.trim())) {
      toast({
        title: "Error",
        description: "All flashcards must have both front and back content.",
        variant: "destructive",
      });
      return;
    }

    console.log("Submitting cards state:", JSON.stringify(cards, null, 2));

    try {
      console.log("Starting deck update process");

      // Update the deck
      const deckUpdate = {
        id: deckId,
        updates: {
          name: deckName,
          subject: subject || null,
        },
      };

      console.log("Updating deck with:", deckUpdate);

      const updatedDeck = await updateDeckMutation.mutateAsync(deckUpdate);
      console.log("Deck update response:", updatedDeck);

      // Add new flashcards
      const newCards = cards.filter((card) => card.isNew);
      console.log("Adding new flashcards:", newCards.length);

      for (const card of newCards) {
        const flashcardData = {
          deck_id: deckId,
          front: card.front,
          back: card.back,
          position: card.position,
        };
        console.log("Creating flashcard:", flashcardData);

        await createFlashcardMutation.mutateAsync(flashcardData);
      }

      // Update existing flashcards
      const existingCards = cards.filter(
        (card) => !card.isNew && typeof card.id === "string",
      );
      console.log("Updating existing flashcards:", existingCards.length);

      for (const card of existingCards) {
        if (typeof card.id === "string") {
          const flashcardUpdate = {
            id: card.id,
            updates: {
              front: card.front,
              back: card.back,
              position: card.position,
            },
          };
          console.log("Updating flashcard:", flashcardUpdate);

          await updateFlashcardMutation.mutateAsync(flashcardUpdate);
        }
      }

      toast({
        title: "Success",
        description: "Deck updated successfully!",
      });

      // Redirect back to decks page after a short delay
      setTimeout(() => {
        router.push("/flashcards");
      }, 1000);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to update deck: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const isUpdating =
    updateDeckMutation.isPending || createFlashcardMutation.isPending;
  const isLoading = isDeckLoading || isFlashcardsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Deck not found</h2>
            <p className="text-gray-500 dark:text-gray-400">
              The deck you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have permission to view it.
            </p>
            <Link
              href="/flashcards"
              className="mt-4 inline-flex items-center text-blue-500 hover:text-blue-700"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to decks
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center">
          <Link
            href="/flashcards"
            className="mr-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Deck
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Update your deck and flashcards.
            </p>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Deck Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Deck Name"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <input
              type="text"
              placeholder="Subject (Optional)"
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
            disabled={isUpdating}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isUpdating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
