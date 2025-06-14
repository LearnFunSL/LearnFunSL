import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDatabaseService } from "@/services/database.service";
import { Database } from "@/types/database.types";
import { useUser as useClerkUser } from "@clerk/nextjs";

type DeckInsert = Database["public"]["Tables"]["decks"]["Insert"];
type DeckUpdate = Database["public"]["Tables"]["decks"]["Update"];
type FlashcardInsert = Database["public"]["Tables"]["flashcards"]["Insert"];
type FlashcardUpdate = Database["public"]["Tables"]["flashcards"]["Update"];
type StudySessionInsert =
  Database["public"]["Tables"]["study_sessions"]["Insert"];

export function useDecks() {
  const { getDecks } = useDatabaseService();
  const { user } = useClerkUser();

  return useQuery({
    queryKey: ["decks", user?.id],
    queryFn: getDecks,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user,
  });
}

export function useCreateDeck() {
  const { createDeck } = useDatabaseService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deckData: Omit<DeckInsert, "user_id">) => createDeck(deckData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useUpdateDeck() {
  const { updateDeck } = useDatabaseService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: DeckUpdate }) => {
      console.log("useUpdateDeck mutation called with:", { id, updates });
      return updateDeck(id, updates);
    },
    onSuccess: (data) => {
      console.log("useUpdateDeck mutation succeeded:", data);
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["deck", data.id] });
    },
    onError: (error) => {
      console.error("useUpdateDeck mutation failed:", error);
    },
  });
}

export function useDeleteDeck() {
  const { deleteDeck } = useDatabaseService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deckId: string) => deleteDeck(deckId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useDuplicateDeck() {
  const { duplicateDeck } = useDatabaseService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deckId: string) => duplicateDeck(deckId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useArchiveDeck() {
  const { updateDeck } = useDatabaseService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deckId: string) => updateDeck(deckId, { is_archived: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useFlashcards(deckId: string) {
  const { getFlashcardsByDeck } = useDatabaseService();
  const { user } = useClerkUser();

  return useQuery({
    queryKey: ["flashcards", deckId],
    queryFn: () => getFlashcardsByDeck(deckId),
    enabled: !!deckId && !!user,
  });
}

export function useCreateFlashcard() {
  const { createFlashcard } = useDatabaseService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flashcardData: Omit<FlashcardInsert, "user_id">) =>
      createFlashcard(flashcardData),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ["flashcards", data.deck_id],
        });
        queryClient.invalidateQueries({ queryKey: ["decks"] });
      }
    },
  });
}

export function useUpdateFlashcard() {
  const { updateFlashcard } = useDatabaseService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: FlashcardUpdate }) => {
      console.log("useUpdateFlashcard mutation called with:", { id, updates });
      return updateFlashcard(id, updates);
    },
    onSuccess: (data) => {
      console.log("useUpdateFlashcard mutation succeeded:", data);
      queryClient.invalidateQueries({ queryKey: ["flashcards", data.deck_id] });
    },
    onError: (error) => {
      console.error("useUpdateFlashcard mutation failed:", error);
    },
  });
}

export function useStudyStats() {
  const { getStudyStats } = useDatabaseService();
  const { user } = useClerkUser();

  return useQuery({
    queryKey: ["studyStats"],
    queryFn: async () => {
      try {
        const data = await getStudyStats();
        // Ensure all fields are present even if backend doesn't provide them
        return {
          cardsStudiedToday: data.cardsStudiedToday || 0,
          accuracy: data.accuracy || 0,
          totalAnswers: data.totalAnswers || 0,
          currentStreak: data.currentStreak || 0,
          bestStreak: data.bestStreak || 0,
        };
      } catch (error) {
        console.error("Error fetching study stats:", error);
        // Return default values if there's an error
        return {
          cardsStudiedToday: 0,
          accuracy: 0,
          totalAnswers: 0,
          currentStreak: 0,
          bestStreak: 0,
        };
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateStudySession() {
  const { createStudySession } = useDatabaseService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionData: Omit<StudySessionInsert, "user_id">) => {
      return createStudySession(sessionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyStats"] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useResources() {
  const { getResources } = useDatabaseService();
  const { user } = useClerkUser();

  return useQuery({
    queryKey: ["resources"],
    queryFn: getResources,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user,
  });
}

export function useVideoLessons() {
  const { getVideoLessons } = useDatabaseService();
  const { user } = useClerkUser();

  return useQuery({
    queryKey: ["video-lessons"],
    queryFn: getVideoLessons,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user,
  });
}

export function useDeck(deckId: string) {
  const { getDeckById } = useDatabaseService();
  const { user } = useClerkUser();

  return useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => getDeckById(deckId),
    enabled: !!deckId && !!user,
  });
}

export function useDbUser() {
  const { getOrCreateUser } = useDatabaseService();
  const { user } = useClerkUser();

  return useQuery({
    queryKey: ["user", user?.id],
    queryFn: getOrCreateUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user,
  });
}
