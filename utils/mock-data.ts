import { Deck, Flashcard } from "../types/flashcard.types";

const biologyFlashcards: Flashcard[] = [
  {
    id: "bio-1",
    front: "What is the powerhouse of the cell?",
    back: "The Mitochondria.",
    difficulty: "easy",
    lastReviewed: new Date("2023-10-28"),
    correctCount: 10,
    incorrectCount: 1,
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "bio-2",
    front: "What is photosynthesis?",
    back: "The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll pigment.",
    difficulty: "medium",
    lastReviewed: new Date("2023-10-27"),
    correctCount: 7,
    incorrectCount: 3,
    createdAt: new Date("2023-09-01"),
  },
];

const historyFlashcards: Flashcard[] = [
  {
    id: "hist-1",
    front: "In what year did the Titanic sink?",
    back: "1912",
    difficulty: "easy",
    lastReviewed: new Date("2023-10-25"),
    correctCount: 12,
    incorrectCount: 0,
    createdAt: new Date("2023-09-15"),
  },
  {
    id: "hist-2",
    front: "Who was the first President of the United States?",
    back: "George Washington",
    difficulty: "easy",
    lastReviewed: new Date("2023-10-25"),
    correctCount: 15,
    incorrectCount: 0,
    createdAt: new Date("2023-09-15"),
  },
];

export const mockDecks: Deck[] = [];
