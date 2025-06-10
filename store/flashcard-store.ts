import { create } from "zustand";
import { Deck, Card } from "@/types/flashcards";

interface FlashcardStore {
  decks: Deck[];
  currentDeck: Deck | null;
  cards: Card[];
  isLoading: boolean;
  error: string | null;
  setDecks: (decks: Deck[]) => void;
  addDeck: (deck: Deck) => void;
  updateDeck: (id: string, updates: Partial<Deck>) => void;
  deleteDeck: (id: string) => void;
  setCurrentDeck: (deck: Deck | null) => void;
  setCards: (cards: Card[]) => void;
  addCard: (card: Card) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  batchUpdateCards: (
    updates: Array<{ id: string; data: Partial<Card> }>,
  ) => void;
}

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  decks: [],
  currentDeck: null,
  cards: [],
  isLoading: false,
  error: null,

  setDecks: (decks) => set({ decks }),

  addDeck: (deck) => set((state) => ({ decks: [...state.decks, deck] })),

  updateDeck: (id, updates) =>
    set((state) => ({
      decks: state.decks.map((deck) =>
        deck.id === id ? { ...deck, ...updates } : deck,
      ),
    })),

  deleteDeck: (id) =>
    set((state) => ({
      decks: state.decks.filter((deck) => deck.id !== id),
    })),

  setCurrentDeck: (deck) => set({ currentDeck: deck }),

  setCards: (cards) => set({ cards }),

  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),

  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, ...updates } : card,
      ),
    })),

  deleteCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  batchUpdateCards: (updates) =>
    set((state) => {
      const updatedCards = state.cards.map((card) => {
        const update = updates.find((u) => u.id === card.id);
        return update ? { ...card, ...update.data } : card;
      });
      return { cards: updatedCards };
    }),
}));
