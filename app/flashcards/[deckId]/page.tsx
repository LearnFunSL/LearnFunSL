import DeckEditor from "@/components/flashcards/DeckEditor";

export default function EditDeckPage({
  params,
}: {
  params: { deckId: string };
}) {
  return <DeckEditor deckId={params.deckId} />;
}
