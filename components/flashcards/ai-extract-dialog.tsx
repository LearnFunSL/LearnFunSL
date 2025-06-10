"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import { Loader2 } from "lucide-react";

interface AiExtractDialogProps {
  children: React.ReactNode;
  onExtract: (cards: Array<{ front_text: string; back_text: string }>) => void;
}

export function AiExtractDialog({ children, onExtract }: AiExtractDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/flashcards/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract cards.");
      }

      onExtract(data);
      setIsOpen(false);
      setText("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Extract Flashcards with AI</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Paste your notes, article, or any text below. The AI will
            automatically create question and answer pairs for you.
          </p>
          <Textarea
            placeholder="Paste your content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-64 resize-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleExtract}
            disabled={isLoading || text.trim().length < 10}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Extracting..." : "Extract Flashcards"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
