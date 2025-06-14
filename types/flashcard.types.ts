import { type Database } from "./database.types";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewed: Date | null;
  correctCount: number;
  incorrectCount: number;
  createdAt: Date;
}

export interface Deck {
  id: string;
  name: string;
  subject: string;
  grade?: string;
  color: string;
  tags: string[];
  cards: Flashcard[];
  createdAt: Date;
  lastStudied: Date | null;
}

export interface StudySession {
  deckId: string;
  currentCardIndex: number;
  correctAnswers: number;
  incorrectAnswers: number;
  startTime: Date;
  isActive: boolean;
}

export type DeckWithFlashcards =
  Database["public"]["Tables"]["decks"]["Row"] & {
    flashcards: Database["public"]["Tables"]["flashcards"]["Row"][];
  };
