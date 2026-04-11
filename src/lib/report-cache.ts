/**
 * In-memory report cache — fallback when Supabase is unavailable.
 * Reports are keyed by UUID and held for the lifetime of the server process.
 * On Vercel/production this is per-function-instance, so it works for the
 * immediate redirect flow even if it doesn't persist across cold starts.
 */

import { AIReport } from './openai';

interface CachedReport {
  report: AIReport;
  createdAt: number;
}

// Module-level singleton — survives across requests in the same process
const cache = new Map<string, CachedReport>();

const TTL_MS = 60 * 60 * 1000; // 1 hour

export function cacheReport(id: string, report: AIReport): void {
  cache.set(id, { report, createdAt: Date.now() });
}

export function getCachedReport(id: string): AIReport | null {
  const entry = cache.get(id);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_MS) {
    cache.delete(id);
    return null;
  }
  return entry.report;
}
