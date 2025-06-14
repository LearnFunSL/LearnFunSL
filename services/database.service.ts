import { useSupabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { Database } from "@/types/database.types";

type Deck = Database["public"]["Tables"]["decks"]["Row"];
type DeckInsert = Database["public"]["Tables"]["decks"]["Insert"];
type DeckUpdate = Database["public"]["Tables"]["decks"]["Update"];

type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"];
type FlashcardInsert = Database["public"]["Tables"]["flashcards"]["Insert"];
type FlashcardUpdate = Database["public"]["Tables"]["flashcards"]["Update"];

type StudySessionInsert =
  Database["public"]["Tables"]["study_sessions"]["Insert"];

export function useDatabaseService() {
  const { getAuthenticatedClient } = useSupabase();
  const { user } = useUser();

  // Deck operations
  const createDeck = async (deckData: Omit<DeckInsert, "user_id">) => {
    if (!user) throw new Error("User not authenticated");

    const supabase = await getAuthenticatedClient();
    const { data, error } = await supabase
      .from("decks")
      .insert({
        ...deckData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getDecks = async () => {
    if (!user) return [];

    const supabase = await getAuthenticatedClient();
    const { data: decks, error } = await supabase
      .from("decks")
      .select(
        "*, flashcards!left(id, correct_count, incorrect_count), study_sessions(*)",
      )
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return decks;
  };

  const getDeckById = async (id: string) => {
    if (!user) return null;

    const supabase = await getAuthenticatedClient();
    const { data: deckData, error: deckError } = await supabase
      .from("decks")
      .select(`*`)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (deckError) {
      if (deckError.code === "PGRST116") {
        return null;
      }
      throw deckError;
    }

    if (!deckData) {
      return null;
    }

    const { data: flashcardsData, error: flashcardsError } = await supabase
      .from("flashcards")
      .select("id, front, back")
      .eq("deck_id", id);

    if (flashcardsError) {
      // It's probably better to return the deck and log the error
      console.error("Error fetching flashcards for deck:", flashcardsError);
      return { ...deckData, flashcards: [] };
    }

    return { ...deckData, flashcards: flashcardsData || [] };
  };

  const updateDeck = async (id: string, updates: DeckUpdate) => {
    if (!user) throw new Error("User not authenticated");

    const supabase = await getAuthenticatedClient();

    console.log("Updating deck:", id, updates);

    const { data, error } = await supabase
      .from("decks")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating deck:", error);
      throw error;
    }

    console.log("Deck updated successfully:", data);
    return data;
  };

  const deleteDeck = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    const supabase = await getAuthenticatedClient();

    // First delete all flashcards in the deck
    await supabase
      .from("flashcards")
      .delete()
      .eq("deck_id", id)
      .eq("user_id", user.id);

    // Then delete the deck itself
    const { error } = await supabase
      .from("decks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  };

  const duplicateDeck = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    const supabase = await getAuthenticatedClient();

    // 1. Get the original deck
    const { data: originalDeck, error: deckError } = await supabase
      .from("decks")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (deckError) throw deckError;
    if (!originalDeck) throw new Error("Deck not found");

    // 2. Create a new deck as a copy
    const { data: newDeck, error: newDeckError } = await supabase
      .from("decks")
      .insert({
        user_id: user.id,
        name: `${originalDeck.name} (Copy)`,
        description: originalDeck.description,
        subject: originalDeck.subject,
        grade: originalDeck.grade,
        color: originalDeck.color,
        tags: originalDeck.tags,
      })
      .select()
      .single();

    if (newDeckError) throw newDeckError;
    if (!newDeck) throw new Error("Failed to create deck copy");

    // 3. Get all flashcards from the original deck
    const { data: originalFlashcards, error: flashcardsError } = await supabase
      .from("flashcards")
      .select("*")
      .eq("deck_id", id)
      .eq("user_id", user.id);

    if (flashcardsError) throw flashcardsError;

    // 4. Create copies of all flashcards in the new deck
    if (originalFlashcards && originalFlashcards.length > 0) {
      const newFlashcards = originalFlashcards.map((card) => ({
        deck_id: newDeck.id,
        user_id: user.id,
        front: card.front,
        back: card.back,
        difficulty: card.difficulty,
        position: card.position,
      }));

      const { error: insertError } = await supabase
        .from("flashcards")
        .insert(newFlashcards);

      if (insertError) throw insertError;
    }

    return newDeck;
  };

  // Flashcard operations
  const createFlashcard = async (
    flashcardData: Omit<FlashcardInsert, "user_id">,
  ) => {
    if (!user) throw new Error("User not authenticated");

    const supabase = await getAuthenticatedClient();
    const { data, error } = await supabase
      .from("flashcards")
      .insert({
        ...flashcardData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getFlashcardsByDeck = async (deckId: string) => {
    if (!user) return [];

    const supabase = await getAuthenticatedClient();
    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("deck_id", deckId)
      .eq("user_id", user.id)
      .order("position", { ascending: true });

    if (error) throw error;
    return data;
  };

  const updateFlashcard = async (id: string, updates: FlashcardUpdate) => {
    if (!user) throw new Error("User not authenticated");

    const supabase = await getAuthenticatedClient();
    const { data, error } = await supabase
      .from("flashcards")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteFlashcard = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    const supabase = await getAuthenticatedClient();
    const { error } = await supabase
      .from("flashcards")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  };

  // Study session operations
  const createStudySession = async (
    sessionData: Omit<StudySessionInsert, "user_id">,
  ) => {
    if (!user) throw new Error("User not authenticated");

    const supabase = await getAuthenticatedClient();
    const { data, error } = await supabase
      .from("study_sessions")
      .insert({
        ...sessionData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getStudyStats = async () => {
    if (!user)
      return {
        cardsStudiedToday: 0,
        accuracy: 0,
        totalAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
      };

    const supabase = await getAuthenticatedClient();

    // Get today's study data
    const today = new Date().toISOString().split("T")[0];
    const { data: todaySessions, error: todayError } = await supabase
      .from("study_sessions")
      .select("cards_studied, correct_answers")
      .eq("user_id", user.id)
      .gte("completed_at", `${today}T00:00:00`);

    if (todayError) throw todayError;

    const cardsStudiedToday =
      todaySessions?.reduce((sum, session) => sum + session.cards_studied, 0) ||
      0;
    const correctAnswers =
      todaySessions?.reduce(
        (sum, session) => sum + session.correct_answers,
        0,
      ) || 0;
    const totalAnswers = cardsStudiedToday;
    const accuracy =
      totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

    // Calculate study streak
    let currentStreak = 0;
    let bestStreak = 0;

    // Get distinct study days from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: studyDays, error: studyDaysError } = await supabase
      .from("study_sessions")
      .select("completed_at")
      .eq("user_id", user.id)
      .gte("completed_at", thirtyDaysAgo.toISOString())
      .order("completed_at", { ascending: false });

    if (studyDaysError) throw studyDaysError;

    // Convert to date strings (YYYY-MM-DD) and get unique days
    const uniqueDays = [
      ...new Set(
        studyDays?.map(
          (session) =>
            new Date(session.completed_at).toISOString().split("T")[0],
        ) || [],
      ),
    ];

    if (uniqueDays.length > 0) {
      // Sort from most recent to oldest
      uniqueDays.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      // Calculate current streak
      currentStreak = 1; // Start with today if there's a session
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      for (let i = 0; i < uniqueDays.length - 1; i++) {
        const currentDay = new Date(uniqueDays[i]);
        const nextDay = new Date(uniqueDays[i + 1]);

        // Check if days are consecutive
        const diffDays = Math.floor(
          (currentDay.getTime() - nextDay.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calculate best streak by checking all periods
      let tempStreak = 1;
      bestStreak = 1;

      for (let i = 0; i < uniqueDays.length - 1; i++) {
        const currentDay = new Date(uniqueDays[i]);
        const nextDay = new Date(uniqueDays[i + 1]);

        const diffDays = Math.floor(
          (currentDay.getTime() - nextDay.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 1) {
          tempStreak++;
          bestStreak = Math.max(bestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
    }

    return {
      cardsStudiedToday,
      accuracy,
      totalAnswers,
      currentStreak,
      bestStreak,
    };
  };

  // Resources
  const getResources = async () => {
    const supabase = await getAuthenticatedClient();
    const { data, error } = await supabase.from("resources").select("*");
    if (error) throw new Error(error.message);
    return data;
  };

  // Video Lessons
  const getVideoLessons = async () => {
    const supabase = await getAuthenticatedClient();
    const { data, error } = await supabase.from("video_lessons").select("*");
    if (error) throw new Error(error.message);
    return data;
  };

  // User
  const getOrCreateUser = async () => {
    const supabase = await getAuthenticatedClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) throw new Error("User not authenticated");

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", authUser.id)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          clerk_id: authUser.id,
          email: authUser.email || "",
          name: `${authUser.user_metadata.first_name || ""} ${authUser.user_metadata.last_name || ""}`.trim(),
        })
        .select()
        .single();

      if (createError) throw createError;
      return newUser;
    }

    return user;
  };

  return {
    createDeck,
    getDecks,
    getDeckById,
    updateDeck,
    deleteDeck,
    duplicateDeck,
    createFlashcard,
    getFlashcardsByDeck,
    updateFlashcard,
    deleteFlashcard,
    createStudySession,
    getStudyStats,
    getResources,
    getVideoLessons,
    getOrCreateUser,
  };
}
