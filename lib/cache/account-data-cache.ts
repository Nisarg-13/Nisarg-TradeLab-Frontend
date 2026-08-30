type CacheEntry<T> = {
  data: T;
  fetchedAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

export function stableCacheKey(parts: Record<string, unknown>): string {
  const keys = Object.keys(parts).sort();
  const normalized: Record<string, unknown> = {};

  for (const key of keys) {
    normalized[key] = parts[key];
  }

  return JSON.stringify(normalized);
}

export function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key);

  return entry?.data as T | undefined;
}

export function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, fetchedAt: Date.now() });
}
