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
  expiresAt: string;
}

// Use global to ensure the Map is shared across all routes in development
const globalForStore = globalThis as unknown as {
  localStore: Map<string, Roll> | undefined;
};

// Shared in-memory store for local dev - use global to ensure singleton
const localStore = globalForStore.localStore ?? new Map<string, Roll>();
if (!globalForStore.localStore) {
  globalForStore.localStore = localStore;
}

export async function getStore() {
  // Check if we're in Vercel with KV configured
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { kv } = await import("@vercel/kv");
    return {
      get: async (key: string) => kv.get<Roll>(key),
      set: async (key: string, value: Roll, ttlSeconds?: number) => {
        if (ttlSeconds) {
          return kv.set(key, value, { ex: ttlSeconds });
        }
        return kv.set(key, value);
      },
    };
  }
  // Local development fallback - shared across all routes
  return {
    get: async (key: string) => localStore.get(key) || null,
    set: async (key: string, value: Roll, ttlSeconds?: number) => {
      localStore.set(key, value);
      // Note: TTL not enforced in local dev
    },
  };
}
