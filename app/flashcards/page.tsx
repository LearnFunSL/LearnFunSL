"use client";

import DeckManager from "@/components/decks/DeckManager";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogIn, Loader } from "lucide-react";

export default function FlashcardsPage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Loader className="h-12 w-12 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <LogIn size={48} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          Sign in to view your decks
        </h2>
        <p className="text-gray-500 mb-6">
          You need to be signed in to create, manage, and study your flashcard
          decks.
        </p>
        <SignInButton mode="modal">
          <Button>
            <LogIn size={16} className="mr-2" />
            Sign In
          </Button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="h-full">
      <DeckManager />
    </div>
  );
}
