"use client";

import { useState, useEffect, useMemo } from "react";
import DeckCard from "./DeckCard";
import {
  Search,
  ChevronDown,
  Plus,
  Tag,
  BookOpen,
  BarChart,
  Loader2,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";
import { useDecks, useStudyStats } from "@/hooks/queries";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DeckManager() {
  const { data: decks, isLoading, isError } = useDecks();
  const { data: studyStats, isLoading: isStatsLoading } = useStudyStats();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("recently-studied");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Extract all unique tags and subjects from decks
  const { uniqueTags, uniqueSubjects } = useMemo(() => {
    if (!decks) return { uniqueTags: [], uniqueSubjects: [] };

    const tags = new Set<string>();
    const subjects = new Set<string>();

    decks.forEach((deck) => {
      if (deck.tags) {
        deck.tags.forEach((tag) => tags.add(tag));
      }
      if (deck.subject) {
        subjects.add(deck.subject);
      }
    });

    return {
      uniqueTags: Array.from(tags),
      uniqueSubjects: Array.from(subjects),
    };
  }, [decks]);

  // Filter decks by search term, tags, and subject
  const filteredDecks = useMemo(() => {
    if (!decks) return [];

    return decks
      .filter(
        (deck) =>
          // Filter by search term
          ((deck.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (deck.subject || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (deck.tags &&
              deck.tags.some((tag) =>
                (tag || "").toLowerCase().includes(searchTerm.toLowerCase()),
              ))) &&
          // Filter by selected tag
          (!selectedTag || (deck.tags && deck.tags.includes(selectedTag))) &&
          // Filter by selected subject
          (!selectedSubject || deck.subject === selectedSubject),
      )
      .sort((a, b) => {
        switch (sortOrder) {
          case "alphabetical":
            return a.name.localeCompare(b.name);
          case "recently-studied":
            const dateA = a.last_studied_at
              ? new Date(a.last_studied_at).getTime()
              : 0;
            const dateB = b.last_studied_at
              ? new Date(b.last_studied_at).getTime()
              : 0;
            return dateB - dateA;
          case "recently-created":
            const createdA = a.created_at
              ? new Date(a.created_at).getTime()
              : 0;
            const createdB = b.created_at
              ? new Date(b.created_at).getTime()
              : 0;
            return createdB - createdA;
          case "most-cards":
            const cardsA = a.flashcards?.length || 0;
            const cardsB = b.flashcards?.length || 0;
            return cardsB - cardsA;
          default:
            return 0;
        }
      });
  }, [decks, searchTerm, sortOrder, selectedTag, selectedSubject]);

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag(null);
    setSelectedSubject(null);
  };

  // Check if any filters are active
  const hasFilters = searchTerm || selectedTag || selectedSubject;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Stats Panel */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <BarChart className="mr-2 h-5 w-5" /> Study Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Cards Studied Today
            </p>
            <p className="text-2xl font-bold mt-1">
              {isStatsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                studyStats?.cardsStudiedToday || 0
              )}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
            <p className="text-sm text-green-600 dark:text-green-400">
              Accuracy Rate
            </p>
            <p className="text-2xl font-bold mt-1">
              {isStatsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `${studyStats?.accuracy || 0}%`
              )}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3">
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Total Decks
            </p>
            <p className="text-2xl font-bold mt-1">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                decks?.length || 0
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Header with Title and Create Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          My Flashcard Decks
        </h1>
        <Link href="/flashcards/create">
          <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
            <Plus size={20} /> New Deck
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search decks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Subject Filter */}
          <div className="w-full md:w-64">
            <Select
              value={selectedSubject || "all"}
              onValueChange={(value) =>
                setSelectedSubject(value === "all" ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {uniqueSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="w-full md:w-64">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recently-studied">
                  Recently Studied
                </SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="recently-created">
                  Recently Created
                </SelectItem>
                <SelectItem value="most-cards">Most Cards</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button (when filters are active) */}
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X size={16} className="mr-2" /> Clear Filters
            </Button>
          )}
        </div>

        {/* Tag Filter */}
        {uniqueTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Tag size={14} className="mr-1" /> Tags:
            </span>
            {uniqueTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md h-64 animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-10 bg-red-50 dark:bg-red-900/30 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-lg">
            Failed to load decks. Please try again.
          </p>
          <Button
            variant="outline"
            className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* No Decks State */}
      {!isLoading &&
        !isError &&
        filteredDecks &&
        filteredDecks.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {hasFilters ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                  No decks found with the current filters
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm
                    ? `No results for "${searchTerm}"`
                    : "Try adjusting your filters to see more decks"}
                </p>
                <Button variant="secondary" onClick={clearFilters}>
                  <Filter size={16} className="mr-2" /> Clear All Filters
                </Button>
              </>
            ) : (
              <>
                <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                  Create your first flashcard deck
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start your learning journey by creating a deck of flashcards
                </p>
                <Link href="/flashcards/create">
                  <Button className="bg-green-500 hover:bg-green-600">
                    <Plus size={16} className="mr-2" /> Create Your First Deck
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}

      {/* Deck Grid */}
      {!isLoading && !isError && filteredDecks && filteredDecks.length > 0 && (
        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredDecks.map((deck) => (
              <motion.div
                layout
                key={deck.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <DeckCard deck={deck} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
