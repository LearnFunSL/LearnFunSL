"use client";

import { useEffect, useMemo, useState } from "react";
import { useFlashcardStore } from "@/store/flashcard-store";
import { createSupabaseBrowserClient as createClient } from "@/lib/supabase/client";
import { Deck, Card } from "@/types/flashcards";
import { Skeleton } from "@/components/ui/skeleton";
import { CardList } from "./card-list";
import { CardEditor } from "./card-editor";
import * as z from "zod";
import { useAuth } from "@clerk/nextjs";

const cardSchema = z.object({
  front_text: z.string().min(1, "Front text is required"),
  back_text: z.string().min(1, "Back text is required"),
});

interface FlashcardCreatorProps {
  deck: Deck;
}

export function FlashcardCreator({ deck }: FlashcardCreatorProps) {
  const {
    cards,
    setCards,
    addCard,
    updateCard,
    deleteCard,
    isLoading,
    setLoading,
    error,
    setError,
  } = useFlashcardStore();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const { getToken } = useAuth();

  const supabase = useMemo(() => createClient(getToken), [getToken]);

  useEffect(() => {
    // Set the current deck in the store
    useFlashcardStore.getState().setCurrentDeck(deck);

    async function fetchCards() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("cards")
          .select("*")
          .eq("deck_id", deck.id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        setCards(data as Card[]);
      } catch (err: any) {
        setError(err.message || "Failed to fetch cards.");
        console.error("Error fetching cards:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, [deck, setCards, setLoading, setError, supabase]);

  const handleSaveCard = async (values: z.infer<typeof cardSchema>) => {
    setLoading(true);
    try {
      if (selectedCard) {
        // Update existing card
        const { data, error } = await supabase
          .from("cards")
          .update(values)
          .eq("id", selectedCard.id)
          .select()
          .single();
        if (error) throw error;
        updateCard(data.id, data);
      } else {
        // Create new card
        const { data, error } = await supabase
          .from("cards")
          .insert({ ...values, deck_id: deck.id })
          .select()
          .single();
        if (error) throw error;
        addCard(data);
        setSelectedCard(data); // Select the new card
      }
    } catch (err: any) {
      setError(err.message || "Failed to save card.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!selectedCard) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("cards")
        .delete()
        .eq("id", selectedCard.id);
      if (error) throw error;
      deleteCard(selectedCard.id);
      setSelectedCard(null); // Deselect the card
    } catch (err: any) {
      setError(err.message || "Failed to delete card.");
    } finally {
      setLoading(false);
    }
  };

  const handleExtractCards = async (
    extractedCards: Array<{ front_text: string; back_text: string }>,
  ) => {
    setLoading(true);
    try {
      const newCards = extractedCards.map((card) => ({
        ...card,
        deck_id: deck.id,
      }));
      const { data, error } = await supabase
        .from("cards")
        .insert(newCards)
        .select();

      if (error) throw error;

      // Add all new cards to the store
      data.forEach((card: Card) => addCard(card));
    } catch (err: any) {
      setError(err.message || "Failed to save extracted cards.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading && cards.length === 0) {
    return <FlashcardCreator.Skeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h2 className="text-xl font-semibold mb-4">Cards ({cards.length})</h2>
        <CardList
          selectedCard={selectedCard}
          onSelectCard={setSelectedCard}
          onAddNewCard={() => setSelectedCard(null)} // Will create new card
        />
      </div>
      <div className="md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">
          {selectedCard ? "Edit Card" : "New Card"}
        </h2>
        <CardEditor
          selectedCard={selectedCard}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
          onExtract={handleExtractCards}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

FlashcardCreator.Skeleton = function FlashcardCreatorSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
};
