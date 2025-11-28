import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: 120,
              lineHeight: 1,
            }}
          >
            🎲
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "#e0e7ff",
              letterSpacing: "-0.02em",
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
    }
  );
}
