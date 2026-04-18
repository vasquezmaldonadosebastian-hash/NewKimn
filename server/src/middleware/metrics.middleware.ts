import type { RequestHandler } from "express";

type BucketKey = string;
type MetricBucket = {
  count: number;
  totalMs: number;
  maxMs: number;
};

const buckets = new Map<BucketKey, MetricBucket>();

function getKey(method: string, path: string) {
  return `${method.toUpperCase()} ${path}`;
}

export function metricsMiddleware(): RequestHandler {
  return (req, res, next) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
      // Best effort "endpoint" label.
      const path =
        (req.route?.path as string | undefined) ??
        req.path ??
        req.originalUrl?.split("?")[0] ??
        "unknown";
      const key = getKey(req.method, path);

      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;

      const prev = buckets.get(key) ?? { count: 0, totalMs: 0, maxMs: 0 };
      buckets.set(key, {
        count: prev.count + 1,
        totalMs: prev.totalMs + durationMs,
        maxMs: Math.max(prev.maxMs, durationMs),
      });
    });

    next();
  };
}

export function getMetricsSnapshot() {
  const out: Array<{ endpoint: string; count: number; avgMs: number; maxMs: number }> = [];
  for (const [endpoint, b] of buckets.entries()) {
    out.push({
      endpoint,
      count: b.count,
      avgMs: b.count > 0 ? b.totalMs / b.count : 0,
      maxMs: b.maxMs,
    });
  }
  out.sort((a, b) => b.avgMs - a.avgMs);
  return out;
}

