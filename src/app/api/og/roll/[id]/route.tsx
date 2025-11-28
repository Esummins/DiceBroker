import { ImageResponse } from "next/og";
import { getStore } from "@/lib/store";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Load Silkscreen font from public directory
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'silkscreen-bold.ttf');
  const fontData = fs.readFileSync(fontPath);

  const { id } = await params;
  console.log('[OG Image] Fetching roll:', id);
  const store = await getStore();
  const roll = await store.get(`roll:${id}`);
  console.log('[OG Image] Roll found:', !!roll, roll?.id);

  if (!roll) {
    console.log('[OG Image] Roll not found, returning 404 image');
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
          <div style={{ display: "flex", fontSize: 80 }}>❌</div>
          <div style={{ display: "flex", fontSize: 40, color: "#e0e7ff", marginTop: 20 }}>
            Roll not found
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const diceNotation = `${roll.numDice}d${roll.numSides}`;
  const showSum = roll.showSum ?? true;
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
            gap: "15px",
            color: "#93c5fd",
            marginBottom: 20,
          }}
        >
          {roll.isRevealed ? (
            // Target/Bullseye icon for revealed
            <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#dc2626" stroke-width="5"/>
              <circle cx="50" cy="50" r="32" fill="none" stroke="#ffffff" stroke-width="5"/>
              <circle cx="50" cy="50" r="19" fill="none" stroke="#dc2626" stroke-width="5"/>
              <circle cx="50" cy="50" r="8" fill="#dc2626"/>
            </svg>
          ) : (
            // Lock icon for sealed
            <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" y="45" width="50" height="45" rx="8" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/>
              <path d="M 35 45 L 35 30 Q 35 15 50 15 Q 65 15 65 30 L 65 45" fill="none" stroke="#93c5fd" stroke-width="8" stroke-linecap="round"/>
              <circle cx="50" cy="67" r="6" fill="#1e3a8a"/>
            </svg>
          )}
          <div style={{ display: "flex", fontSize: 48, fontWeight: "600" }}>
            {roll.isRevealed ? "Revealed" : "Sealed"}
          </div>
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
              display: "flex",
              fontSize: 80,
              fontWeight: "bold",
              color: "#e0e7ff",
              marginBottom: 10,
            }}
          >
            {diceNotation}
          </div>

          {roll.isRevealed && roll.results && showSum && total !== null && (
            <div
              style={{
                display: "flex",
                fontSize: 96,
                fontWeight: "bold",
                color: "#fb923c",
                marginTop: 10,
              }}
            >
              {total}
            </div>
          )}

          {roll.isRevealed && roll.results && !showSum && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: 10,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {roll.results.map((result: number, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "70px",
                    height: "70px",
                    backgroundColor: "#1e40af",
                    borderRadius: "12px",
                    border: "3px solid #2563eb",
                    fontSize: 36,
                    fontWeight: "bold",
                    color: "#e0e7ff",
                  }}
                >
                  {result}
                </div>
              ))}
            </div>
          )}

          {roll.label && (
            <div
              style={{
                display: "flex",
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
            gap: "10px",
            marginTop: 30,
            fontSize: 24,
            color: "#60a5fa",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="70" height="70" rx="12" fill="#e0e7ff" stroke="#2563eb" stroke-width="3"/>
            <circle cx="35" cy="35" r="6" fill="#1e3a8a"/>
            <circle cx="50" cy="50" r="6" fill="#1e3a8a"/>
            <circle cx="65" cy="35" r="6" fill="#1e3a8a"/>
            <circle cx="35" cy="65" r="6" fill="#1e3a8a"/>
            <circle cx="65" cy="65" r="6" fill="#1e3a8a"/>
          </svg>
          <div style={{ display: "flex", fontFamily: "Silkscreen" }}>DiceBroker</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Silkscreen',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
