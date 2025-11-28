import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  // Load Silkscreen font from public directory
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'silkscreen-bold.ttf');
  const fontData = fs.readFileSync(fontPath);

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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          {/* SVG Dice Icon */}
          <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="70" height="70" rx="12" fill="#e0e7ff" stroke="#2563eb" stroke-width="3"/>
            <circle cx="35" cy="35" r="6" fill="#1e3a8a"/>
            <circle cx="50" cy="50" r="6" fill="#1e3a8a"/>
            <circle cx="65" cy="35" r="6" fill="#1e3a8a"/>
            <circle cx="35" cy="65" r="6" fill="#1e3a8a"/>
            <circle cx="65" cy="65" r="6" fill="#1e3a8a"/>
          </svg>
          <div
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "#e0e7ff",
              letterSpacing: "-0.02em",
              fontFamily: "Silkscreen",
            }}
          >
            DiceBroker
          </div>
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 28,
            color: "#93c5fd",
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          Fair, verifiable random rolls for online transactions
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
