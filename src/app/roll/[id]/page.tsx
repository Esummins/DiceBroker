"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface RollData {
  id: string;
  numDice: number;
  numSides: number;
  label: string;
  results?: number[];
  resultsHash: string;
  createdAt: string;
  revealedAt?: string;
  isRevealed: boolean;
  total?: number;
  showSum: boolean;
  withReplacement: boolean;
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

function timeSince(isoString: string) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(isoString).getTime()) / 1000
  );
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export default function RollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [roll, setRoll] = useState<RollData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchRoll();
  }, [id]);

  const fetchRoll = async () => {
    try {
      const res = await fetch(`/api/rolls/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("Roll not found");
        } else {
          setError("Failed to load roll");
        }
        return;
      }
      const data = await res.json();
      setRoll(data);
    } catch {
      setError("Failed to load roll");
    }
  };

  const handleReveal = async () => {
    setIsRevealing(true);
    try {
      const res = await fetch(`/api/rolls/${id}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setRoll(data);
      }
    } catch {
      setError("Failed to reveal roll");
    } finally {
      setIsRevealing(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-4">{error}</h1>
        <Link
          href="/"
          className="text-accent-400 hover:text-accent-300 underline"
        >
          Create a new roll
        </Link>
      </main>
    );
  }

  if (!roll) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-4xl animate-pulse">🎲</div>
        <p className="mt-4 text-blue-300">Loading roll...</p>
      </main>
    );
  }

  const diceNotation = `${roll.numDice}d${roll.numSides}`;

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <Link href="/" className="text-accent-400 hover:text-accent-300">
          ← Back to Dice Broker
        </Link>
      </div>

      <div className="bg-blue-900 rounded-xl p-8 shadow-xl border border-blue-800">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">
            {roll.isRevealed ? "🎯" : "🔒"}
          </div>
          <h1 className="text-2xl font-bold">
            {roll.isRevealed ? "Roll Revealed" : "Sealed Roll"}
          </h1>
          <p className="text-blue-300 mt-1">{diceNotation}</p>
          {roll.label && (
            <p className="text-blue-200 mt-2 italic">&ldquo;{roll.label}&rdquo;</p>
          )}
        </div>

        {/* Results section */}
        {roll.isRevealed && roll.results ? (
          <div className="bg-blue-950 rounded-lg p-6 mb-6 border border-blue-800">
            <div className="text-center">
              {roll.showSum && (
                <>
                  <div className="text-6xl font-bold text-accent-400 mb-2">
                    {roll.total}
                  </div>
                  <div className="text-blue-300 text-sm mb-4">Total</div>
                </>
              )}
              <div className="flex flex-wrap justify-center gap-2">
                {roll.results.map((result, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center text-xl font-bold border border-blue-700"
                  >
                    {result}
                  </div>
                ))}
              </div>
              {!roll.showSum && (
                <div className="text-blue-400 text-xs mt-3">
                  Individual results only
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-blue-950 rounded-lg p-6 mb-6 border border-blue-800">
            <div className="text-center">
              <div className="text-4xl mb-2">🎁</div>
              <p className="text-blue-300">
                Results are sealed until revealed
              </p>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-3 text-sm border-t border-blue-800 pt-6">
          <div className="flex justify-between">
            <span className="text-blue-300">Roll ID</span>
            <span className="font-mono text-blue-200">{roll.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Configuration</span>
            <span className="text-blue-200">{diceNotation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Roll Type</span>
            <span className="text-blue-200">
              {roll.withReplacement ? "With replacement" : "Without replacement (unique)"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Display Mode</span>
            <span className="text-blue-200">
              {roll.showSum ? "Sum + Individual" : "Individual only"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Created</span>
            <span className="text-blue-200" title={formatDate(roll.createdAt)}>
              {timeSince(roll.createdAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Created (exact)</span>
            <span className="text-blue-200 text-xs">
              {formatDate(roll.createdAt)}
            </span>
          </div>
          {roll.isRevealed && roll.revealedAt && (
            <div className="flex justify-between">
              <span className="text-blue-300">Revealed</span>
              <span className="text-blue-200">{formatDate(roll.revealedAt)}</span>
            </div>
          )}
          <div className="flex justify-between items-start">
            <span className="text-blue-300">Commitment Hash</span>
            <span className="font-mono text-xs text-blue-400 break-all max-w-[200px] text-right">
              {roll.resultsHash.substring(0, 16)}...
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          {!roll.isRevealed && (
            <button
              onClick={handleReveal}
              disabled={isRevealing}
              className="w-full py-3 px-4 bg-accent-600 hover:bg-accent-700 disabled:bg-accent-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors shadow-lg"
            >
              {isRevealing ? "Revealing..." : "🎲 Reveal Roll"}
            </button>
          )}
          <button
            onClick={copyLink}
            className="w-full py-3 px-4 bg-blue-800 hover:bg-blue-700 rounded-lg font-semibold transition-colors border border-blue-700"
          >
            {copied ? "✓ Copied!" : "📋 Copy Link"}
          </button>
        </div>

        {/* Trust notes */}
        {!roll.isRevealed ? (
          <div className="mt-6 p-4 bg-accent-900/30 border border-accent-800 rounded-lg text-sm text-accent-200">
            <strong>🔐 Buyer tip:</strong> Check the creation timestamp above.
            If this roll was created before your order, the seller may have
            pre-rolled multiple times. Only trust rolls created after your
            transaction was agreed upon.
          </div>
        ) : (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-200">
            <strong>⚠️ Warning:</strong> This roll has already been revealed.
            If you received this link already revealed, DO NOT complete the
            transaction. The seller may have generated multiple rolls and sent
            you the most favorable one. Only accept rolls that YOU reveal
            yourself.
          </div>
        )}
      </div>
    </main>
  );
}
