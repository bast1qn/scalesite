interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const apiCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5000; // 5 seconds cache

export const getCached = <T>(key: string): T | null => {
  const cached = apiCache.get(key) as CacheEntry<T> | undefined;
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

export const setCached = <T>(key: string, data: T): void => {
  apiCache.set(key, { data, timestamp: Date.now() });
};

export const clearCache = (): void => {
  apiCache.clear();
};

export const invalidateCache = (pattern: string): void => {
  const keys = Array.from(apiCache.keys());
  keys.forEach(key => {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  });
};
