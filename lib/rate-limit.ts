import type { NextRequest } from "next/server";

/**
 * Limiteur de débit simple en mémoire (fenêtre fixe), pour brider les abus sur
 * les routes publiques (/api/checkout, /api/orders).
 *
 * ⚠️ En mémoire = par instance uniquement. Pour un déploiement multi-instance
 * (serverless/edge), remplacer par un store partagé (Upstash Redis, Vercel KV).
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter: number; // secondes avant réinitialisation
}

export function rateLimit(key: string, limit = 10, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  // Purge opportuniste pour borner la mémoire.
  if (buckets.size > 5000) sweep(now);
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true, remaining: limit - entry.count, retryAfter: 0 };
}

/** Extrait une IP cliente exploitable comme clé de limitation. */
export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Purge les fenêtres expirées pour éviter une croissance illimitée de la Map. */
function sweep(now: number) {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}
