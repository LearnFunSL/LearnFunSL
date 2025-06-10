"use client";

import { Deck } from "@/types/flashcards";
import { motion } from "framer-motion";
import { Book, MoreVertical, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DeckCardProps {
  deck: Deck;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
};

export function DeckCard({ deck }: DeckCardProps) {
  return (
    <Link href={`/flashcards/${deck.id}`} passHref>
      <motion.div
        layout
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="relative flex flex-col justify-between p-4 rounded-lg bg-card border-l-4 h-36 cursor-pointer"
        style={{ borderLeftColor: deck.color }}
      >
        <div>
          <h3 className="font-bold text-lg truncate">{deck.name}</h3>
          {deck.subject && (
            <p className="text-sm text-muted-foreground truncate">
              {deck.subject}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Book className="w-4 h-4 mr-2" />
            <span>{deck.card_count ?? 0} cards</span>
          </div>
          <Link href={`/flashcards/study/${deck.id}`} passHref>
            <Button variant="ghost" size="sm">
              <Play className="mr-2 h-4 w-4" />
              Study
            </Button>
          </Link>
        </div>
        {/* Add options dropdown later */}
        <button
          onClick={(e) => {
            e.preventDefault();
            alert("Menu clicked!");
          }}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-accent"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </motion.div>
    </Link>
  );
}
