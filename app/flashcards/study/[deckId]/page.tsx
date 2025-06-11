import { createClient } from "../../../lib/supabase/server";
import { notFound } from "next/navigation";
import StudySession from "../../../components/flashcards/study-session";

interface StudyPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const supabase = await createClient();
  const { deckId } = await params;

  const { data: deck } = await supabase
    .from("decks")
    .select("*")
    .eq("id", deckId)
    .single();

  if (!deck) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">{deck.name} - Study Session</h1>
      <StudySession deck={deck} onClose={notFound} />
    </div>
  );
}
