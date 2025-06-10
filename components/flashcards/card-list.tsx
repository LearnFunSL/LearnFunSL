"use client";

import { Card } from "@/types/flashcards";
import { useFlashcardStore } from "@/store/flashcard-store";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardListProps {
  selectedCard: Card | null;
  onSelectCard: (card: Card | null) => void;
  onAddNewCard: () => void;
}

export function CardList({
  selectedCard,
  onSelectCard,
  onAddNewCard,
}: CardListProps) {
  const cards = useFlashcardStore((state) => state.cards);

  return (
    <div className="flex flex-col h-full">
      <Button onClick={onAddNewCard} className="mb-4">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Card
      </Button>
      <div className="flex-grow overflow-y-auto pr-2">
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectCard(card)}
              className={cn(
                "p-3 mb-2 rounded-md cursor-pointer border-l-4 transition-colors",
                selectedCard?.id === card.id
                  ? "bg-primary/10 border-primary"
                  : "bg-card hover:bg-accent",
              )}
            >
              <p className="font-semibold truncate">{card.front_text}</p>
              <p className="text-sm text-muted-foreground truncate">
                {card.back_text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
