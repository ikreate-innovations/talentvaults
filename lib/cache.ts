// lib/cache.ts
import { unstable_cache } from 'next/cache';

export const CACHE_TAGS = {
  OPPORTUNITIES: 'opportunities',
  JOBS: 'opportunities-jobs',
  SURVEYS: 'opportunities-surveys',
  TOOLS: 'digital-tools',
} as const;

// Webhook-only cache - NO time-based revalidation
export function createWebhookCache<T>(
  fn: () => Promise<T>,
  keyParts: string[],
  tags: string[]
) {
  return unstable_cache(
    fn,
    keyParts,
    {
      tags,
      revalidate: false, // CRITICAL: No time-based revalidation
    }
  );
}