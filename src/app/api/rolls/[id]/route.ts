import { NextRequest, NextResponse } from "next/server";
import { getStore, type Roll } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = await getStore();
  const roll = await store.get(`roll:${id}`);

  if (!roll) {
    return NextResponse.json({ error: "Roll not found" }, { status: 404 });
  }

  // Return different data based on reveal state
  if (roll.isRevealed) {
    return NextResponse.json({
      id: roll.id,
      numDice: roll.numDice,
      numSides: roll.numSides,
      label: roll.label,
      results: roll.results,
      resultsHash: roll.resultsHash,
      createdAt: roll.createdAt,
      revealedAt: roll.revealedAt,
      isRevealed: true,
      total: roll.results.reduce((a, b) => a + b, 0),
      showSum: roll.showSum ?? true,
      withReplacement: roll.withReplacement ?? true,
      expiresAt: roll.expiresAt,
    });
  } else {
    // Sealed - don't reveal results
    return NextResponse.json({
      id: roll.id,
      numDice: roll.numDice,
      numSides: roll.numSides,
      label: roll.label,
      resultsHash: roll.resultsHash,
      createdAt: roll.createdAt,
      isRevealed: false,
      showSum: roll.showSum ?? true,
      withReplacement: roll.withReplacement ?? true,
      expiresAt: roll.expiresAt,
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = await getStore();
  const roll = await store.get(`roll:${id}`);

  if (!roll) {
    return NextResponse.json({ error: "Roll not found" }, { status: 404 });
  }

  if (roll.isRevealed) {
    return NextResponse.json({ error: "Roll already revealed" }, { status: 400 });
  }

  // Reveal the roll
  const revealTime = new Date();
  roll.isRevealed = true;
  roll.revealedAt = revealTime.toISOString();

  // Update expiration to 1 week from reveal time
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  roll.expiresAt = new Date(revealTime.getTime() + ONE_WEEK_MS).toISOString();

  const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60;
  await store.set(`roll:${id}`, roll, ONE_WEEK_SECONDS);

  return NextResponse.json({
    id: roll.id,
    numDice: roll.numDice,
    numSides: roll.numSides,
    label: roll.label,
    results: roll.results,
    resultsHash: roll.resultsHash,
    createdAt: roll.createdAt,
    revealedAt: roll.revealedAt,
    isRevealed: true,
    total: roll.results.reduce((a, b) => a + b, 0),
    showSum: roll.showSum ?? true,
    withReplacement: roll.withReplacement ?? true,
    expiresAt: roll.expiresAt,
  });
}
