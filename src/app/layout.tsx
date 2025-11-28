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
      </body>
    </html>
  );
}
