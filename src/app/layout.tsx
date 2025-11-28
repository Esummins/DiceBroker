import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dice Broker - Trusted Random Rolls",
  description: "Fair, verifiable random rolls for online transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
      </body>
    </html>
  );
}
