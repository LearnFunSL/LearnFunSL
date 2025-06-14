"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { type DeckWithFlashcards } from "@/types/flashcard.types";
import { useUpdateFlashcard, useCreateStudySession } from "@/hooks/queries";
import { CheckCircle, XCircle, RotateCcw, X } from "lucide-react";

interface StudyModeProps {
  deck: DeckWithFlashcards;
}

const StudyMode: React.FC<StudyModeProps> = ({ deck }) => {
  const [cards] = useState(() =>
    [...deck.flashcards].sort(() => Math.random() - 0.5),
  );
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const { toast } = useToast();
  const updateFlashcard = useUpdateFlashcard();
  const createStudySession = useCreateStudySession();

  useEffect(() => {
    if (completed) return;
    const timer = setInterval(
      () => setElapsed(Math.floor((Date.now() - startTime) / 1000)),
      1000,
    );
    return () => clearInterval(timer);
  }, [completed, startTime]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (completed) return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      // Add keyboard shortcuts for correct/incorrect
      if (flipped) {
        if (e.key === "1" || e.key === "ArrowLeft") {
          e.preventDefault();
          handleIncorrect();
        }
        if (e.key === "2" || e.key === "ArrowRight") {
          e.preventDefault();
          handleCorrect();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [completed, flipped, current]);

  const handleCorrect = () => {
    setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
    nextCard();
  };

  const handleIncorrect = () => {
    setStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    nextCard();
  };

  const nextCard = () => {
    if (current + 1 >= cards.length) {
      setCompleted(true);
      // Save study session
      createStudySession.mutate({
        deck_id: deck.id,
        cards_studied: cards.length,
        correct_answers: stats.correct + (current === cards.length - 1 ? 1 : 0),
        incorrect_answers: stats.incorrect,
        duration_minutes: Math.ceil(elapsed / 60),
      });
    } else {
      setCurrent((prev) => prev + 1);
      setFlipped(false);
    }
  };

  const resetSession = () => {
    setCompleted(false);
    setCurrent(0);
    setStats({ correct: 0, incorrect: 0 });
    setElapsed(0);
    setFlipped(false);
  };

  if (!cards.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">This deck has no cards</h2>
        <Link href="/flashcards">
          <Button>Return to Decks</Button>
        </Link>
      </div>
    );
  }

  const card = cards[current];
  const progress = Math.round(
    ((stats.correct + stats.incorrect) / cards.length) * 100,
  );

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
            Session Complete!
          </h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
              <span>Time spent:</span>
              <span className="font-medium">{formatTime(elapsed)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
              <span>Cards studied:</span>
              <span className="font-medium">
                {stats.correct + stats.incorrect}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
              <span className="flex items-center">Correct:</span>
              <span className="font-medium text-green-600">
                {stats.correct}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
              <span className="flex items-center">Incorrect:</span>
              <span className="font-medium text-red-600">
                {stats.incorrect}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Accuracy:</span>
              <span className="font-medium">
                {stats.correct + stats.incorrect > 0
                  ? Math.round(
                      (stats.correct / (stats.correct + stats.incorrect)) * 100,
                    )
                  : 0}
                %
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/flashcards" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Decks
              </Button>
            </Link>
            <Button className="flex-1" onClick={resetSession}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Study Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6">
      {/* Header */}
      <header className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold truncate">{deck.name}</h1>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-lg font-mono text-gray-600 dark:text-gray-400">
              {current + 1} / {cards.length}
            </div>
            <Link href="/flashcards" aria-label="Exit study session">
              <Button variant="ghost" size="icon">
                <X className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="w-full max-w-2xl">
          {/* Card */}
          <div
            className="w-full h-[300px] [perspective:1000px] cursor-pointer"
            onClick={() => setFlipped(!flipped)}
          >
            <div
              key={card.id}
              className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                flipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* Front Face */}
              <div className="absolute w-full h-full [backface-visibility:hidden] transform-gpu will-change-transform rounded-xl shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Question
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {card.front}
                  </p>
                  <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    Click or press Space to reveal answer
                  </div>
                </div>
              </div>

              {/* Back Face */}
              <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] transform-gpu will-change-transform rounded-xl shadow-lg bg-white dark:bg-gray-800 border-2 border-transparent flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Answer
                  </div>
                  <p className="text-xl text-gray-900 dark:text-white">
                    {card.back}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {flipped && (
            <div className="flex gap-4 justify-center mt-8">
              <Button
                variant="destructive"
                size="lg"
                onClick={handleIncorrect}
                className="flex-1 max-w-xs"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Incorrect (1)
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handleCorrect}
                className="flex-1 max-w-xs bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Correct (2)
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer Stats */}
      <footer className="w-full max-w-4xl mx-auto">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
            <p className="font-bold text-lg">{formatTime(elapsed)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Correct</p>
            <p className="font-bold text-lg text-green-600">{stats.correct}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Incorrect
            </p>
            <p className="font-bold text-lg text-red-600">{stats.incorrect}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Remaining
            </p>
            <p className="font-bold text-lg">{cards.length - current - 1}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudyMode;
