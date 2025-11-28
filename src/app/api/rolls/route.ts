import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getStore, type Roll } from "@/lib/store";

function generateResults(numDice: number, numSides: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < numDice; i++) {
    results.push(Math.floor(Math.random() * numSides) + 1);
  }
  return results;
}

async function hashResults(results: number[], salt: string): Promise<string> {
  const data = JSON.stringify({ results, salt });
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { numDice, numSides, label } = body;

    // Validate input
    if (!numDice || numDice < 1 || numDice > 20) {
      return NextResponse.json(
        { error: "numDice must be between 1 and 20" },
        { status: 400 }
      );
    }
    if (!numSides || ![4, 6, 8, 10, 12, 20, 100].includes(numSides)) {
      return NextResponse.json(
        { error: "Invalid die type" },
        { status: 400 }
      );
    }

    const id = nanoid(10);
    const results = generateResults(numDice, numSides);
    const salt = nanoid(32);
    const resultsHash = await hashResults(results, salt);

    const roll: Roll = {
      id,
      numDice,
      numSides,
      label: label || "",
      results,
      resultsHash,
      createdAt: new Date().toISOString(),
      revealedAt: null,
      isRevealed: false,
    };

    const store = await getStore();
    await store.set(`roll:${id}`, roll);

    return NextResponse.json({
      id,
      numDice,
      numSides,
      label: roll.label,
      resultsHash,
      createdAt: roll.createdAt,
      isRevealed: false,
    });
  } catch (error) {
    console.error("Error creating roll:", error);
    return NextResponse.json(
      { error: "Failed to create roll" },
      { status: 500 }
    );
  }
}
