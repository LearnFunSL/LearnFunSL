import StudyView from "./StudyView";

interface StudyPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { deckId } = await params;
  return <StudyView deckId={deckId} />;
}
