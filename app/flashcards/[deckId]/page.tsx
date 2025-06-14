import DeckEditor from "@/components/flashcards/DeckEditor";

type EditDeckPageProps = {
  params: Promise<{ deckId: string }>;
};

export default async function EditDeckPage({ params }: EditDeckPageProps) {
  const { deckId } = await params;
  return <DeckEditor deckId={deckId} />;
}
