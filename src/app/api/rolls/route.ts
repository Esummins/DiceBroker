import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getStore, type Roll } from "@/lib/store";

function generateResults(
  numDice: number,
  numSides: number,
  withReplacement: boolean
): number[] {
  const results: number[] = [];

  if (withReplacement) {
    // Standard rolling - duplicates allowed
    for (let i = 0; i < numDice; i++) {
      results.push(Math.floor(Math.random() * numSides) + 1);
    }
  } else {
    // Without replacement - no duplicates
    // Note: numDice must be <= numSides for this to work
    if (numDice > numSides) {
      throw new Error(
        "Cannot roll without replacement when numDice > numSides"
      );
    }

    // Create array of all available numbers [1, 2, 3, ..., numSides]
    const available = Array.from({ length: numSides }, (_, i) => i + 1);

    for (let i = 0; i < numDice; i++) {
      // Pick random index from remaining numbers
      const randomIndex = Math.floor(Math.random() * available.length);
      // Add to results and remove from available pool
      results.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }
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
    const {
      numDice,
      numSides,
      label,
      showSum = true,
      withReplacement = true,
    } = body;

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

    // Validate without replacement constraint
    if (!withReplacement && numDice > numSides) {
      return NextResponse.json(
        {
          error:
            "Cannot roll without replacement when number of dice exceeds die sides",
        },
        { status: 400 }
      );
    }

    const id = nanoid(10);
    const results = generateResults(numDice, numSides, withReplacement);
    const salt = nanoid(32);
    const resultsHash = await hashResults(results, salt);

    const now = new Date();
    const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(now.getTime() + TWO_WEEKS_MS);

    const roll: Roll = {
      id,
      numDice,
      numSides,
      label: label || "",
      results,
      resultsHash,
      createdAt: now.toISOString(),
      revealedAt: null,
      isRevealed: false,
      showSum,
      withReplacement,
      expiresAt: expiresAt.toISOString(),
    };

    const store = await getStore();
    const TWO_WEEKS_SECONDS = 14 * 24 * 60 * 60;
    await store.set(`roll:${id}`, roll, TWO_WEEKS_SECONDS);

    return NextResponse.json({
      id,
      numDice,
      numSides,
      label: roll.label,
      resultsHash,
      createdAt: roll.createdAt,
      isRevealed: false,
      showSum,
      withReplacement,
      expiresAt: roll.expiresAt,
    });
  } catch (error) {
    console.error("Error creating roll:", error);
    return NextResponse.json(
      { error: "Failed to create roll" },
      { status: 500 }
    );
  }
}
