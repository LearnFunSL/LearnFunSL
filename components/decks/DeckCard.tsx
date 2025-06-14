"use client";

import { useState, useMemo } from "react";
import { Database } from "@/types/database.types";
import {
  MoreVertical,
  BookOpen,
  Clock,
  Tag,
  BrainCircuit,
  Edit,
  Copy,
  Archive,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  useDeleteDeck,
  useDuplicateDeck,
  useArchiveDeck,
} from "@/hooks/queries";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Deck = Database["public"]["Tables"]["decks"]["Row"];

interface DeckCardProps {
  deck: Deck & {
    flashcards: { id: string }[] | null;
    study_sessions:
      | { created_at: string; correct_answers: number; cards_studied: number }[]
      | null;
  };
}

const colorVariants: { [key: string]: string } = {
  blue: "border-blue-500",
  green: "border-green-500",
  purple: "border-purple-500",
  orange: "border-orange-500",
  red: "border-red-500",
  teal: "border-teal-500",
};

const DeckCard: React.FC<DeckCardProps> = ({ deck }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const deleteDeckMutation = useDeleteDeck();
  const duplicateDeckMutation = useDuplicateDeck();
  const archiveDeckMutation = useArchiveDeck();

  const lastStudiedSession = useMemo(() => {
    if (!deck.study_sessions || deck.study_sessions.length === 0) {
      return null;
    }
    // Sort sessions by date to find the most recent
    return [...deck.study_sessions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0];
  }, [deck.study_sessions]);

  const lastStudied = lastStudiedSession
    ? new Date(lastStudiedSession.created_at)
    : null;

  const formattedLastStudied = lastStudied
    ? lastStudied.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Not studied yet";

  const daysSinceStudied = lastStudied
    ? Math.floor((Date.now() - lastStudied.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const cardCount = deck.flashcards?.length || 0;

  const progress = useMemo(() => {
    if (!deck.study_sessions || deck.study_sessions.length === 0) {
      return 0;
    }
    const totalCorrect = deck.study_sessions.reduce(
      (sum, session) => sum + (session.correct_answers || 0),
      0,
    );
    const totalStudied = deck.study_sessions.reduce(
      (sum, session) => sum + (session.cards_studied || 0),
      0,
    );

    if (totalStudied === 0) {
      return 0;
    }

    return Math.round((totalCorrect / totalStudied) * 100);
  }, [deck.study_sessions]);

  const handleDelete = async () => {
    try {
      await deleteDeckMutation.mutateAsync(deck.id);
      toast({
        title: "Deck deleted",
        description: `"${deck.name}" has been deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete deck. Please try again.",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
  };

  const handleDuplicate = async () => {
    try {
      await duplicateDeckMutation.mutateAsync(deck.id);
      toast({
        title: "Deck duplicated",
        description: `A copy of "${deck.name}" has been created.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate deck. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async () => {
    try {
      await archiveDeckMutation.mutateAsync(deck.id);
      toast({
        title: "Deck archived",
        description: `"${deck.name}" has been archived.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive deck. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out border-l-4 flex flex-col relative"
      style={{
        borderColor: deck.color ? colorVariants[deck.color] : "border-gray-500",
      }}
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate pr-2">
            {deck.name}
          </h3>
          <div className="relative">
            <button
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="Deck Options"
            >
              <MoreVertical size={20} />
            </button>

            {showDropdown && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 animate-fade-in-down"
                onBlur={() => setShowDropdown(false)}
              >
                <div className="py-1">
                  <Link
                    href={`/flashcards/${deck.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Deck
                  </Link>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      handleDuplicate();
                      setShowDropdown(false);
                    }}
                  >
                    <Copy size={16} className="mr-2" />
                    Duplicate
                  </button>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      handleArchive();
                      setShowDropdown(false);
                    }}
                  >
                    <Archive size={16} className="mr-2" />
                    Archive
                  </button>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      setIsDeleteDialogOpen(true);
                      setShowDropdown(false);
                    }}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {deck.subject}
        </p>

        <div className="flex items-center text-gray-500 dark:text-gray-400 mt-4 text-sm">
          <BookOpen size={16} className="mr-2" />
          <span>
            {cardCount} {cardCount === 1 ? "Card" : "Cards"}
          </span>
        </div>

        <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2 text-sm">
          <Clock size={16} className="mr-2" />
          <span>{formattedLastStudied}</span>
          {daysSinceStudied !== null && daysSinceStudied < 7 && (
            <span className="ml-2 px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs rounded-full">
              {daysSinceStudied === 0
                ? "Today"
                : daysSinceStudied === 1
                  ? "Yesterday"
                  : `${daysSinceStudied}d ago`}
            </span>
          )}
        </div>

        {deck.tags && deck.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {deck.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium flex items-center"
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex gap-2">
          <Link href={`/flashcards/${deck.id}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200">
              <Edit size={16} />
              Edit
            </button>
          </Link>
          <Link href={`/flashcards/study/${deck.id}`} className="flex-1">
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={cardCount === 0}
            >
              <BrainCircuit size={16} />
              Study
            </button>
          </Link>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this deck?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the &quot;{deck.name}&quot; deck and
              all {cardCount} cards within it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Deck
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeckCard;
