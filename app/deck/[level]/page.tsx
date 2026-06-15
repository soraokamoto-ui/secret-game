import { fetchCards } from "@/lib/sheets";
import DeckPageClient from "./DeckPageClient";

interface Props {
  params: Promise<{ level: string }>;
}

export default async function DeckPage({ params }: Props) {
  const { level } = await params;
  const levelNum = Number(level);

  if (![12, 24, 36].includes(levelNum)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "#8B7355" }}>無効なレベルです</p>
      </div>
    );
  }

  const allCards = await fetchCards();
  const cards = allCards.slice(0, levelNum);

  return <DeckPageClient cards={cards} level={levelNum} />;
}