import { ImageResponse } from "next/og";
import { getStore } from "@/lib/store";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = await getStore();
  const roll = await store.get(`roll:${id}`);

  if (!roll) {
    // Return a "not found" image
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#172554",
          }}
        >
          <div style={{ fontSize: 80 }}>❌</div>
          <div style={{ fontSize: 40, color: "#e0e7ff", marginTop: 20 }}>
            Roll not found
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const diceNotation = `${roll.numDice}d${roll.numSides}`;
  const status = roll.isRevealed ? "🎯 Revealed" : "🔒 Sealed";
  const total = roll.isRevealed && roll.results
    ? roll.results.reduce((a: number, b: number) => a + b, 0)
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#172554",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #1e3a8a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e3a8a 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "60px",
        }}
      >
        {/* Status badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 48,
            color: "#93c5fd",
            marginBottom: 20,
          }}
        >
          {status}
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#1e3a8a",
            padding: "40px 60px",
            borderRadius: "20px",
            border: "3px solid #2563eb",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: "bold",
              color: "#e0e7ff",
              marginBottom: 10,
            }}
          >
            {diceNotation}
          </div>

          {roll.isRevealed && total !== null && (
            <div
              style={{
                fontSize: 96,
                fontWeight: "bold",
                color: "#fb923c",
                marginTop: 10,
              }}
            >
              = {total}
            </div>
          )}

          {roll.label && (
            <div
              style={{
                fontSize: 28,
                color: "#93c5fd",
                marginTop: 20,
                fontStyle: "italic",
                maxWidth: "900px",
                textAlign: "center",
              }}
            >
              "{roll.label}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 30,
            fontSize: 24,
            color: "#60a5fa",
          }}
        >
          🎲 DiceBroker
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
