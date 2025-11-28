// Shared store for local development
// In production with Vercel KV, this won't be used

export interface Roll {
  id: string;
  numDice: number;
  numSides: number;
  label: string;
  results: number[];
  resultsHash: string;
  createdAt: string;
  revealedAt: string | null;
  isRevealed: boolean;
  showSum: boolean;
  withReplacement: boolean;
}

// Shared in-memory store for local dev
const localStore = new Map<string, Roll>();

export async function getStore() {
  // Check if we're in Vercel with KV configured
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { kv } = await import("@vercel/kv");
    return {
      get: async (key: string) => kv.get<Roll>(key),
      set: async (key: string, value: Roll) => kv.set(key, value),
    };
  }
  // Local development fallback - shared across all routes
  return {
    get: async (key: string) => localStore.get(key) || null,
    set: async (key: string, value: Roll) => {
      localStore.set(key, value);
    },
  };
}
