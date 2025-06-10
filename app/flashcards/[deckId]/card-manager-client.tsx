"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFlashcards } from "@/hooks/use-flashcards";
import { Card, Deck } from "@/types/flashcards";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface CardManagerClientProps {
  deckId: string;
}

export default function CardManagerClient({ deckId }: CardManagerClientProps) {
  const router = useRouter();
  const {
    decks,
    cards,
    getCardsByDeckId,
    createCard,
    updateCard,
    deleteCard,
    isLoadingDecks,
    isLoadingCards,
  } = useFlashcards();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load deck and cards
  useEffect(() => {
    const loadDeckAndCards = async () => {
      // Find deck in the loaded decks
      const currentDeck = decks.find((d) => d.id === deckId);
      if (currentDeck) {
        setDeck(currentDeck);
      }

      // Load cards for this deck
      await getCardsByDeckId(deckId);
    };

    if (deckId && !isLoadingDecks) {
      loadDeckAndCards();
    }
  }, [deckId, decks, getCardsByDeckId, isLoadingDecks]);

  // Handle card creation
  const handleCreateCard = async () => {
    if (!frontText.trim() || !backText.trim()) return;

    try {
      setIsSubmitting(true);
      await createCard({
        deck_id: deckId,
        front_text: frontText.trim(),
        back_text: backText.trim(),
        difficulty_level: parseInt(difficultyLevel),
      });

      // Reset form and close dialog
      resetForm();
      setIsCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle card update
  const handleUpdateCard = async () => {
    if (!selectedCard || !frontText.trim() || !backText.trim()) return;

    try {
      setIsSubmitting(true);
      await updateCard(selectedCard.id, {
        front_text: frontText.trim(),
        back_text: backText.trim(),
        difficulty_level: parseInt(difficultyLevel),
      });

      setIsEditDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle card deletion
  const handleDeleteCard = async () => {
    if (!selectedCard) return;

    try {
      setIsSubmitting(true);
      await deleteCard(selectedCard.id);
      setIsDeleteDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog for a card
  const openEditDialog = (card: Card) => {
    setSelectedCard(card);
    setFrontText(card.front_text);
    setBackText(card.back_text);
    setDifficultyLevel(card.difficulty_level.toString());
    setIsEditDialogOpen(true);
  };

  // Open delete dialog for a card
  const openDeleteDialog = (card: Card) => {
    setSelectedCard(card);
    setIsDeleteDialogOpen(true);
  };

  // Reset form fields
  const resetForm = () => {
    setFrontText("");
    setBackText("");
    setDifficultyLevel("1");
  };

  // Go back to decks page
  const handleBack = () => {
    router.push("/flashcards");
  };

  // Display loading state
  if (isLoadingDecks || (isLoadingCards && cards.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Loading flashcards...</p>
      </div>
    );
  }

  // If deck not found
  if (!deck) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Deck not found</p>
        <Button onClick={handleBack}>Back to Decks</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Decks
          </Button>
          <h2 className="text-2xl font-bold">{deck.name}</h2>
          {deck.subject && <p className="text-gray-600">{deck.subject}</p>}
        </div>

        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Card
        </Button>
      </div>

      {cards.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No flashcards yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add your first flashcard to start studying!
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>Add Card</Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-1">Question</h3>
                <p className="text-gray-800 dark:text-gray-200">
                  {card.front_text}
                </p>
              </div>

              <div className="p-4">
                <h3 className="font-medium mb-1">Answer</h3>
                <p className="text-gray-800 dark:text-gray-200">
                  {card.back_text}
                </p>
              </div>

              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {card.difficulty_level === 1 && "Easy"}
                  {card.difficulty_level === 2 && "Medium"}
                  {card.difficulty_level === 3 && "Hard"}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(card)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => openDeleteDialog(card)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Card Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Flashcard</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="front-text">Question</Label>
              <Textarea
                id="front-text"
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                placeholder="Enter the question or front side of the card"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="back-text">Answer</Label>
              <Textarea
                id="back-text"
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                placeholder="Enter the answer or back side of the card"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={difficultyLevel}
                onValueChange={setDifficultyLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Easy</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsCreateDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCard}
              disabled={!frontText.trim() || !backText.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Add Card"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Flashcard</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-front-text">Question</Label>
              <Textarea
                id="edit-front-text"
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-back-text">Answer</Label>
              <Textarea
                id="edit-back-text"
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-difficulty">Difficulty</Label>
              <Select
                value={difficultyLevel}
                onValueChange={setDifficultyLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Easy</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCard}
              disabled={!frontText.trim() || !backText.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Card Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Flashcard</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete this flashcard? This action cannot
              be undone.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCard}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Card"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
