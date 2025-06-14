import StudyView from "./StudyView";

interface StudyPageProps {
  params: {
    deckId: string;
  };
}

export default function StudyPage({ params }: StudyPageProps) {
  return <StudyView deckId={params.deckId} />;
}
