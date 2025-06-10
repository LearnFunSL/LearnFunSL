"use client";

import { useState } from "react";
import { useFlashcards } from "@/hooks/use-flashcards";
import { Deck } from "@/types/flashcards";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Pencil, Trash2, BookOpen, Plus, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface DeckManagerProps {
  onSelectDeck?: (deck: Deck) => void;
}

export default function DeckManager({ onSelectDeck }: DeckManagerProps) {
  const { decks, createDeck, updateDeck, deleteDeck, isLoadingDecks } =
    useFlashcards();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [deckName, setDeckName] = useState("");
  const [deckSubject, setDeckSubject] = useState("");
  const [deckColor, setDeckColor] = useState("#3B82F6"); // Default blue
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Handle deck creation
  const handleCreateDeck = async () => {
    if (!deckName.trim()) return;

    try {
      setIsSubmitting(true);
      await createDeck({
        name: deckName.trim(),
        subject: deckSubject.trim() || undefined,
        color: deckColor,
      });

      // Reset form and close dialog
      setDeckName("");
      setDeckSubject("");
      setDeckColor("#3B82F6");
      setIsCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deck update
  const handleUpdateDeck = async () => {
    if (!selectedDeck || !deckName.trim()) return;

    try {
      setIsSubmitting(true);
      await updateDeck(selectedDeck.id, {
        name: deckName.trim(),
        subject: deckSubject.trim() || undefined,
        color: deckColor,
      });

      setIsEditDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deck deletion
  const handleDeleteDeck = async () => {
    if (!selectedDeck) return;

    try {
      setIsSubmitting(true);
      await deleteDeck(selectedDeck.id);
      setIsDeleteDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog for a deck
  const openEditDialog = (deck: Deck) => {
    setSelectedDeck(deck);
    setDeckName(deck.name);
    setDeckSubject(deck.subject || "");
    setDeckColor(deck.color);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog for a deck
  const openDeleteDialog = (deck: Deck) => {
    setSelectedDeck(deck);
    setIsDeleteDialogOpen(true);
  };

  // Study selected deck
  const handleStudyDeck = (deck: Deck) => {
    if (onSelectDeck) {
      onSelectDeck(deck);
    }
  };

  // Display loading state
  if (isLoadingDecks) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Loading flashcard decks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">My Flashcard Decks</h2>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Create Deck
        </Button>
      </div>

      {decks.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No flashcard decks yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first flashcard deck to start studying!
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Create Deck
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <Card key={deck.id} className="shadow-sm">
              <CardHeader
                className="pb-2"
                style={{ borderTop: `4px solid ${deck.color}` }}
              >
                <CardTitle>{deck.name}</CardTitle>
                <CardDescription>
                  {deck.subject || "No subject"}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="flex justify-between text-sm">
                  <span>{deck.card_count} cards</span>
                  <span>
                    {deck.last_studied_at
                      ? `Studied ${formatDistanceToNow(new Date(deck.last_studied_at))} ago`
                      : "Never studied"}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(deck)}
                  >
                    <Pencil size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => openDeleteDialog(deck)}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/flashcards/${deck.id}`)}
                  >
                    <Pencil size={14} className="mr-1" />
                    Manage Cards
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStudyDeck(deck)}
                    disabled={deck.card_count === 0}
                  >
                    <BookOpen size={14} className="mr-1" />
                    Study
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Deck Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Flashcard Deck</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Deck Name</Label>
              <Input
                id="name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="Enter deck name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input
                id="subject"
                value={deckSubject}
                onChange={(e) => setDeckSubject(e.target.value)}
                placeholder="E.g. Biology, History, Math"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="color"
                  type="color"
                  value={deckColor}
                  onChange={(e) => setDeckColor(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <span className="text-gray-600 text-sm">
                  Choose a color for your deck
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDeck}
              disabled={!deckName.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Deck"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Deck Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Flashcard Deck</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Deck Name</Label>
              <Input
                id="edit-name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-subject">Subject (Optional)</Label>
              <Input
                id="edit-subject"
                value={deckSubject}
                onChange={(e) => setDeckSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-color"
                  type="color"
                  value={deckColor}
                  onChange={(e) => setDeckColor(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <span className="text-gray-600 text-sm">
                  Choose a color for your deck
                </span>
              </div>
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
              onClick={handleUpdateDeck}
              disabled={!deckName.trim() || isSubmitting}
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

      {/* Delete Deck Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the deck &quot;{selectedDeck?.name}
              &quot; and all its cards. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteDeck}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Deck"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
