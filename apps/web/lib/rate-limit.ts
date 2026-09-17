/**
 * Fixed-window rate limiter keyed by an opaque string (an IP, an email hash).
 * In-memory now; the interface is shaped for a Valkey `INCR` + `EXPIRE` implementation that the
 * gateway will provide. Callers never see the store.
 */
export interface RateLimiter {
  /** Returns whether the call is allowed and how many attempts remain in the window. */
  consume(key: string): Promise<{ allowed: boolean; remaining: number; resetInSeconds: number }>;
}

export interface RateLimitOptions {
  /** Max hits per window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export function createInMemoryRateLimiter({ limit, windowSeconds }: RateLimitOptions): RateLimiter {
  const buckets = new Map<string, Bucket>();
  const windowMs = windowSeconds * 1000;

  function sweep(now: number): void {
    if (buckets.size < 5000) return;
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  return {
    consume(key) {
      const now = Date.now();
      sweep(now);
      const existing = buckets.get(key);
      const bucket =
        existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + windowMs };
      bucket.count += 1;
      buckets.set(key, bucket);
      const remaining = Math.max(0, limit - bucket.count);
      return Promise.resolve({
        allowed: bucket.count <= limit,
        remaining,
        resetInSeconds: Math.ceil((bucket.resetAt - now) / 1000),
      });
    },
  };
}

// ASSUMPTION (QUESTIONS.md Q-11): 5 demo requests per IP per 10 minutes.
export const demoRateLimiter: RateLimiter = createInMemoryRateLimiter({
  limit: 5,
  windowSeconds: 600,
});
export const contactRateLimiter: RateLimiter = createInMemoryRateLimiter({
  limit: 5,
  windowSeconds: 600,
});
export const questionnaireRateLimiter: RateLimiter = createInMemoryRateLimiter({
  limit: 3,
  windowSeconds: 600,
});
export const assistantChatLimiter: RateLimiter = createInMemoryRateLimiter({
  limit: 30,
  windowSeconds: 600,
});
export const assistantMediaLimiter: RateLimiter = createInMemoryRateLimiter({
  limit: 20,
  windowSeconds: 600,
});

/** First hop of X-Forwarded-For, else X-Real-IP, else "unknown". */
export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  if (first) return first;
  const real = headers.get('x-real-ip')?.trim();
  return real !== undefined && real !== '' ? real : 'unknown';
}
