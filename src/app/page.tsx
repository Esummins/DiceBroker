"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [numDice, setNumDice] = useState(1);
  const [numSides, setNumSides] = useState(6);
  const [label, setLabel] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const res = await fetch("/api/rolls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numDice, numSides, label }),
      });

      const data = await res.json();
      if (data.id) {
        router.push(`/roll/${data.id}`);
      }
    } catch (error) {
      console.error("Failed to create roll:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">🎲 Dice Broker</h1>
        <p className="text-blue-300 text-lg">
          Fair, verifiable random rolls for online transactions.
          <br />
          Create a sealed roll, share the link, reveal together.
        </p>
      </div>

      <div className="bg-blue-900 rounded-xl p-8 shadow-xl border border-blue-800">
        <h2 className="text-xl font-semibold mb-6">Create a New Roll</h2>

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Number of Dice
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={numDice}
                onChange={(e) => setNumDice(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 bg-blue-800 border border-blue-700 rounded-lg text-blue-50 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Sides per Die
              </label>
              <select
                value={numSides}
                onChange={(e) => setNumSides(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-blue-800 border border-blue-700 rounded-lg text-blue-50 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                <option value={4}>d4</option>
                <option value={6}>d6</option>
                <option value={8}>d8</option>
                <option value={10}>d10</option>
                <option value={12}>d12</option>
                <option value={20}>d20</option>
                <option value={100}>d100</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Label (optional)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., 'Size roll for @buyer123's order'"
              className="w-full px-4 py-2 bg-blue-800 border border-blue-700 rounded-lg text-blue-50 placeholder-blue-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-3 px-4 bg-accent-600 hover:bg-accent-700 disabled:bg-accent-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors shadow-lg"
          >
            {isCreating ? "Creating..." : "Create Sealed Roll"}
          </button>
        </form>
      </div>

      <div className="mt-12 text-center text-blue-400 text-sm">
        <h3 className="font-semibold text-blue-300 mb-2">How it works</h3>
        <ol className="space-y-1">
          <li>1. Seller creates a sealed roll with their configuration</li>
          <li>2. Results are generated and cryptographically sealed</li>
          <li>3. Seller sends the link to the buyer</li>
          <li>4. Buyer verifies creation time and reveals the roll</li>
          <li>5. Both see the same verifiable result</li>
        </ol>
      </div>
    </main>
  );
}
