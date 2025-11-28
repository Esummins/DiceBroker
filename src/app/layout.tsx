import type { Metadata } from "next";
import { Silkscreen } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  title: "Dice Broker - Trusted Random Rolls",
  description: "Fair, verifiable random rolls for online transactions",
  openGraph: {
    title: "Dice Broker - Trusted Random Rolls",
    description: "Fair, verifiable random rolls for online transactions",
    type: "website",
    images: [
      {
        url: `${baseUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: "DiceBroker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dice Broker - Trusted Random Rolls",
    description: "Fair, verifiable random rolls for online transactions",
    images: [`${baseUrl}/api/og`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={silkscreen.variable}>
      <body className="bg-blue-950 text-blue-50 min-h-screen antialiased">
        {children}
        <a
          href="https://tiptopjar.com/dicebroker"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 px-4 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 font-medium text-sm"
        >
          💝 Tip the developer
        </a>
        <Analytics />
      </body>
    </html>
  );
}
