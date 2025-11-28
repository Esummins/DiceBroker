import { Metadata } from "next";
import { getStore } from "@/lib/store";
import RollPageClient from "./RollPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const store = await getStore();
  const roll = await store.get(`roll:${id}`);

  if (!roll) {
    return {
      title: "Roll Not Found - DiceBroker",
      description: "This roll could not be found",
    };
  }

  const diceNotation = `${roll.numDice}d${roll.numSides}`;
  const status = roll.isRevealed ? "🎯 Revealed" : "🔒 Sealed";
  const total = roll.isRevealed && roll.results
    ? roll.results.reduce((a: number, b: number) => a + b, 0)
    : null;

  const title = roll.isRevealed && total !== null
    ? `${status} Roll: ${diceNotation} = ${total} - DiceBroker`
    : `${status} Roll: ${diceNotation} - DiceBroker`;

  let description = `${diceNotation} roll on DiceBroker`;
  if (roll.label) {
    description = `${roll.label} - ${description}`;
  }
  if (roll.isRevealed && total !== null) {
    description += ` - Result: ${total}`;
  } else {
    description += ` - Sealed and ready to reveal`;
  }

  const ogImageUrl = `/api/og/roll/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${status} Roll: ${diceNotation}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function RollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <RollPageClient params={params} />;
}
