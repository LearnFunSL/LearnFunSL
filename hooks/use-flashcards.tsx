"use client";

import { useState, useEffect, useCallback } from "react";
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider";
import { Card, Deck } from "@/types/flashcards";
import { toast } from "sonner";

interface UseFlashcardsReturn {
  // Decks
  decks: Deck[];
  isLoadingDecks: boolean;
  createDeck: (
    deck: Omit<Deck, "id" | "user_id" | "created_at" | "updated_at">,
  ) => Promise<Deck | null>;
  updateDeck: (id: string, deck: Partial<Deck>) => Promise<Deck | null>;
  deleteDeck: (id: string) => Promise<boolean>;

  // Cards
  cards: Card[];
  isLoadingCards: boolean;
  createCard: (
    card: Omit<Card, "id" | "created_at" | "times_studied" | "times_correct">,
  ) => Promise<Card | null>;
  updateCard: (id: string, card: Partial<Card>) => Promise<Card | null>;
  deleteCard: (id: string) => Promise<boolean>;
  getCardsByDeckId: (deckId: string) => Promise<Card[]>;

  // Study session
  updateCardProgress: (id: string, isCorrect: boolean) => Promise<boolean>;

  // Error handling
  error: Error | null;
}

export function useFlashcards(): UseFlashcardsReturn {
  const {
    supabaseClient: supabase,
    status,
    userId,
    isInitialized,
  } = useSupabaseAuth();
  const isLoadingAuth = status !== "AUTHENTICATED";
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoadingDecks, setIsLoadingDecks] = useState(true);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Load decks with retry logic
  const loadDecks = useCallback(async () => {
    if (!supabase || isLoadingAuth) {
      console.log("Skipping loadDecks: client not ready", {
        supabase: !!supabase,
        isLoadingAuth,
      });
      return;
    }

    try {
      setIsLoadingDecks(true);
      console.log("Loading decks for user:", userId);

      // Fetch all decks
      const { data: decksData, error: decksError } = await supabase
        .from("decks")
        .select("*")
        .order("updated_at", { ascending: false });

      if (decksError) {
        console.error("Error fetching decks:", decksError);
        throw new Error(decksError.message);
      }

      console.log("Decks loaded:", decksData?.length || 0);

      // If no decks, return empty array
      if (!decksData || decksData.length === 0) {
        setDecks([]);
        setIsLoadingDecks(false);
        return;
      }

      // Alternative A: Try to use the stored function if it exists
      try {
        const { data: cardCounts, error: countError } = await supabase.rpc(
          "get_card_counts_by_deck",
        );

        if (!countError && cardCounts) {
          // Create a map of deck_id to count
          const countMap = cardCounts.reduce(
            (
              acc: Record<string, number>,
              item: { deck_id: string; count: number },
            ) => {
              acc[item.deck_id] = item.count;
              return acc;
            },
            {},
          );

          // Add card count to each deck
          const transformedDecks = decksData.map((deck) => ({
            ...deck,
            card_count: countMap[deck.id] || 0,
          }));

          setDecks(transformedDecks);
          return;
        }
      } catch (rpcError) {
        // Silently fail and try alternative B
        console.warn("RPC function not available, using alternative method");
      }

      // Alternative B: Count cards for each deck individually
      const transformedDecks = await Promise.all(
        decksData.map(async (deck) => {
          try {
            const { count, error } = await supabase
              .from("cards")
              .select("*", { count: "exact", head: true })
              .eq("deck_id", deck.id);

            return {
              ...deck,
              card_count: error ? 0 : count || 0,
            };
          } catch (err) {
            // If count fails for a deck, default to 0
            return { ...deck, card_count: 0 };
          }
        }),
      );

      setDecks(transformedDecks);
    } catch (err) {
      console.error("Error in loadDecks:", err);
      setError(err instanceof Error ? err : new Error("Failed to load decks"));
      toast.error("Failed to load flashcard decks");

      // Implement retry logic with backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(
          `Retrying loadDecks in ${delay}ms (attempt ${retryCount + 1})`,
        );

        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          loadDecks();
        }, delay);
      } else {
        // Max retries reached, try to load decks without counts as fallback
        console.log("Max retries reached, trying fallback loading");
        try {
          const { data } = await supabase
            .from("decks")
            .select("*")
            .order("updated_at", { ascending: false });

          if (data) {
            setDecks(data.map((deck) => ({ ...deck, card_count: 0 })));
          }
        } catch (fallbackError) {
          console.error("Even fallback loading failed:", fallbackError);
        }
      }
    } finally {
      setIsLoadingDecks(false);
    }
  }, [supabase, isLoadingAuth, userId, retryCount]);

  // Reset retry count when auth state changes
  useEffect(() => {
    setRetryCount(0);
  }, [status]);

  // Load decks on initial mount and when auth state changes
  useEffect(() => {
    if (status === "AUTHENTICATED" && isInitialized) {
      loadDecks();
    }
  }, [status, isInitialized, loadDecks]);

  // Create new deck
  const createDeck = async (
    deck: Omit<Deck, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<Deck | null> => {
    if (!supabase || !userId) return null;

    try {
      const deckToInsert = { ...deck, user_id: userId };
      const { data, error: supabaseError } = await supabase
        .from("decks")
        .insert(deckToInsert)
        .select("*")
        .single();

      if (supabaseError) throw new Error(supabaseError.message);

      // Add the new deck to state
      setDecks((prev) => [{ ...data, card_count: 0 }, ...prev]);
      toast.success("Deck created successfully");
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create deck"));
      toast.error("Failed to create deck");
      return null;
    }
  };

  // Update deck
  const updateDeck = async (
    id: string,
    deck: Partial<Deck>,
  ): Promise<Deck | null> => {
    if (!supabase) return null;

    try {
      const { data, error: supabaseError } = await supabase
        .from("decks")
        .update(deck)
        .eq("id", id)
        .select("*")
        .single();

      if (supabaseError) throw new Error(supabaseError.message);

      // Update deck in state
      setDecks((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...data } : d)),
      );
      toast.success("Deck updated");
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update deck"));
      toast.error("Failed to update deck");
      return null;
    }
  };

  // Delete deck
  const deleteDeck = async (id: string): Promise<boolean> => {
    if (!supabase) return false;

    try {
      const { error: supabaseError } = await supabase
        .from("decks")
        .delete()
        .eq("id", id);

      if (supabaseError) throw new Error(supabaseError.message);

      // Remove deck from state
      setDecks((prev) => prev.filter((d) => d.id !== id));
      toast.success("Deck deleted");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete deck"));
      toast.error("Failed to delete deck");
      return false;
    }
  };

  // Load cards by deck ID
  const getCardsByDeckId = async (deckId: string): Promise<Card[]> => {
    if (!supabase) return [];

    try {
      setIsLoadingCards(true);
      const { data, error: supabaseError } = await supabase
        .from("cards")
        .select("*")
        .eq("deck_id", deckId)
        .order("created_at", { ascending: true });

      if (supabaseError) throw new Error(supabaseError.message);

      setCards(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load cards"));
      toast.error("Failed to load flashcards");
      return [];
    } finally {
      setIsLoadingCards(false);
    }
  };

  // Create new card
  const createCard = async (
    card: Omit<Card, "id" | "created_at" | "times_studied" | "times_correct">,
  ): Promise<Card | null> => {
    if (!supabase) return null;

    try {
      const cardWithDefaults = {
        ...card,
        difficulty_level: card.difficulty_level || 1,
        times_studied: 0,
        times_correct: 0,
      };

      const { data, error: supabaseError } = await supabase
        .from("cards")
        .insert(cardWithDefaults)
        .select("*")
        .single();

      if (supabaseError) throw new Error(supabaseError.message);

      // Add new card to state
      setCards((prev) => [...prev, data]);

      // Update card count in the deck
      setDecks((prev) =>
        prev.map((d) =>
          d.id === card.deck_id
            ? { ...d, card_count: (d.card_count || 0) + 1 }
            : d,
        ),
      );

      toast.success("Card created");
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create card"));
      toast.error("Failed to create flashcard");
      return null;
    }
  };

  // Update card
  const updateCard = async (
    id: string,
    card: Partial<Card>,
  ): Promise<Card | null> => {
    if (!supabase) return null;

    try {
      const { data, error: supabaseError } = await supabase
        .from("cards")
        .update(card)
        .eq("id", id)
        .select("*")
        .single();

      if (supabaseError) throw new Error(supabaseError.message);

      // Update card in state
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c)),
      );
      toast.success("Card updated");
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update card"));
      toast.error("Failed to update flashcard");
      return null;
    }
  };

  // Delete card
  const deleteCard = async (id: string): Promise<boolean> => {
    if (!supabase) return false;

    try {
      // First get the card to know which deck it belongs to
      const cardToDelete = cards.find((c) => c.id === id);
      if (!cardToDelete) throw new Error("Card not found");

      const { error: supabaseError } = await supabase
        .from("cards")
        .delete()
        .eq("id", id);

      if (supabaseError) throw new Error(supabaseError.message);

      // Remove card from state
      setCards((prev) => prev.filter((c) => c.id !== id));

      // Update card count in the deck
      setDecks((prev) =>
        prev.map((d) =>
          d.id === cardToDelete.deck_id
            ? { ...d, card_count: Math.max(0, (d.card_count || 0) - 1) }
            : d,
        ),
      );

      toast.success("Card deleted");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete card"));
      toast.error("Failed to delete flashcard");
      return false;
    }
  };

  // Update card progress during study session
  const updateCardProgress = async (
    id: string,
    isCorrect: boolean,
  ): Promise<boolean> => {
    if (!supabase) return false;

    try {
      const card = cards.find((c) => c.id === id);
      if (!card) throw new Error("Card not found");

      const updates = {
        times_studied: card.times_studied + 1,
        times_correct: isCorrect ? card.times_correct + 1 : card.times_correct,
        last_studied_at: new Date().toISOString(),
      };

      const { error: supabaseError } = await supabase
        .from("cards")
        .update(updates)
        .eq("id", id);

      if (supabaseError) throw new Error(supabaseError.message);

      // Update card in state
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      );

      // Also update last_studied_at on the deck
      const deckId = card.deck_id;
      await supabase
        .from("decks")
        .update({ last_studied_at: new Date().toISOString() })
        .eq("id", deckId);

      // Update deck in state
      setDecks((prev) =>
        prev.map((d) =>
          d.id === deckId
            ? { ...d, last_studied_at: new Date().toISOString() }
            : d,
        ),
      );

      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to update study progress"),
      );
      return false;
    }
  };

  return {
    decks,
    isLoadingDecks,
    createDeck,
    updateDeck,
    deleteDeck,
    cards,
    isLoadingCards,
    createCard,
    updateCard,
    deleteCard,
    getCardsByDeckId,
    updateCardProgress,
    error,
  };
}
