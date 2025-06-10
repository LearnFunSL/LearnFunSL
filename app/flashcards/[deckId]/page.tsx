import CardManager from "./card-manager";

interface CardManagerPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function CardManagerPage({
  params,
}: CardManagerPageProps) {
  const { deckId } = await params;
  return <CardManager deckId={deckId} />;
}
