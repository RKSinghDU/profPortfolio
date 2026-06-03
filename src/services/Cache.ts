export interface CacheReadOptions {
  ignoreExpiry?: boolean;
}

export class LocalStorageCache<T> {
  private readonly ttlMs: number;

  constructor(ttlMs: number) {
    this.ttlMs = ttlMs;
  }

  get(key: string, options: CacheReadOptions = {}): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { data, timestamp } = JSON.parse(raw) as { data: T; timestamp: number };
      if (!options.ignoreExpiry && Date.now() - timestamp > this.ttlMs) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  set(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
      console.warn('Failed to write cache entry:', key);
    }
  }
}
